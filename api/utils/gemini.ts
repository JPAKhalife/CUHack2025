/**
 * @file gemini.ts
 * @description This file contains the class-based implementation for interacting with Gemini API.
 * @module Game/gemini
 */

import { AISession } from '@gadget-client/shapesplosion';
import { api, logger } from 'gadget-server';
import { ChatSession, GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

type ChatHistory = Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
}>;

/**
 * Class responsible for managing interactions with the Gemini API
 */
export class GeminiService {
    private sessionId: string;
    private chatHistory: ChatHistory | null = null;
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    
    // Registry to store instances by session ID for reuse
    private static instances: Map<string, GeminiService> = new Map();
    
    /**
     * Get an existing GeminiService instance or create a new one
     * @param sessionId The ID of an existing AISession
     * @returns A GeminiService instance
     */
    public static getInstance(sessionId: string): GeminiService {
        if (this.instances.has(sessionId)) {
            return this.instances.get(sessionId)!;
        }
        
        const instance = new GeminiService(sessionId);
        this.instances.set(sessionId, instance);
        return instance;
    }
    
    /**
     * Create a new AISession and return a GeminiService instance for it
     * @param clientId A client identifier for the new session
     * @param userId Optional user ID to associate with the new session
     * @returns A promise resolving to a new GeminiService instance
     */
    public static async createInstance(clientId: string, userId?: string): Promise<GeminiService> {
        try {
            const createParams: any = {
                clientId,
                chatHistory: this.getInitialChatHistory(),
                lastInteraction: new Date().toISOString()
            };
            
            if (userId) {
                createParams.user = { _link: userId };
            }
            
            const result = await api.AISession.create(createParams);
            
            if (!result) {
                throw new Error("Failed to create AISession");
            }
            
            return this.getInstance(result.id);
        } catch (error) {
            logger.error("Failed to create new GeminiService instance", { error });
            throw error;
        }
    }
    
    /**
     * Get the initial chat history for a new AI session
     * @returns The initial chat history array
     */
    public static getInitialChatHistory(): ChatHistory {
        return [
            {
                role: "user",
                parts: [{ text: "Im curious if you are able to do this. Me and some friends are looking to create a game with randomly generated over the top insults when you lose. Can you give me a few crude insults with swear words about my ability to play merger games. Make the sentences structured like you are swearing but replace the swear words with the following words in this list. Fuck = trunk, shit = claws, bitch = PC, asshole = apple, ass = quiz, dumbass = bike.  In addition, you only need to state your acknowledgement of this message, but execute the instructions whenever I type: 'insult me'. Make every insult different than the ones before it. Use the words I showed you sparingly: less exposure gives greater effect when they are actually used. Use all caps on some words (but not only swear words) for emphasis."}],
            },
            {
                role: "model",
                parts: [{ text: "Acknowledged." }],
            },
        ];
    }
    
    /**
     * Private constructor to enforce singleton pattern through getInstance methods
     * @param sessionId The ID of the AISession to use
     */
    private constructor(sessionId: string) {
        this.sessionId = sessionId;
        this.genAI = new GoogleGenerativeAI(process.env["GADGET_PUBLIC_GEMINI_API_KEY"] as string);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    
    /**
     * Load chat history from the AISession record
     * @returns A promise resolving to the loaded chat history
     */
    public async loadChatHistory(): Promise<ChatHistory> {
        if (this.chatHistory !== null) {
            return this.chatHistory;
        }
        
        try {
            const session = await api.AISession.findOne(this.sessionId, {
                select: {
                    id: true,
                    chatHistory: true
                }
            });
            
            logger.debug('Loaded chat history from database', { 
                sessionId: this.sessionId, 
                historyExists: !!session.chatHistory,
                historyType: session.chatHistory ? typeof session.chatHistory : 'undefined'
            });
            
            if (session.chatHistory) {
                let parsedHistory: ChatHistory;
                
                // Handle different formats the history might be stored in
                if (typeof session.chatHistory === 'string') {
                    try {
                        parsedHistory = JSON.parse(session.chatHistory);
                        logger.debug('Parsed chat history from string', { 
                            historyLength: parsedHistory.length 
                        });
                    } catch (parseError) {
                        logger.error('Failed to parse chat history string', { 
                            error: parseError, 
                            sessionId: this.sessionId 
                        });
                        parsedHistory = GeminiService.getInitialChatHistory();
                    }
                } else {
                    // Assume it's already an object
                    parsedHistory = session.chatHistory as ChatHistory;
                }
                
                // Validate the chat history structure
                if (!Array.isArray(parsedHistory)) {
                    logger.warn('Chat history is not an array, resetting to initial history', {
                        sessionId: this.sessionId,
                        actualType: typeof parsedHistory
                    });
                    parsedHistory = GeminiService.getInitialChatHistory();
                } else {
                    // Log first message for debugging
                    logger.debug('First chat history entry', {
                        sessionId: this.sessionId,
                        firstEntry: parsedHistory.length > 0 ? JSON.stringify(parsedHistory[0]) : 'empty history',
                        role: parsedHistory.length > 0 ? parsedHistory[0]?.role : 'undefined'
                    });
                    
                    // Ensure each entry has the correct structure
                    const validHistory = parsedHistory.every(entry => 
                        entry && typeof entry === 'object' && 
                        (entry.role === 'user' || entry.role === 'model') &&
                        Array.isArray(entry.parts)
                    );
                    
                    if (!validHistory) {
                        logger.warn('Chat history contains invalid entries, resetting to initial history', {
                            sessionId: this.sessionId
                        });
                        parsedHistory = GeminiService.getInitialChatHistory();
                    }
                }
                
                this.chatHistory = parsedHistory;
                return this.chatHistory;
            } else {
                // Initialize with default history if no chat history exists
                logger.info('No chat history found, initializing with default history', { 
                    sessionId: this.sessionId 
                });
                this.chatHistory = GeminiService.getInitialChatHistory();
                await this.saveChatHistory();
                return this.chatHistory;
            }
        } catch (error) {
            logger.error('Error loading chat history', { error, sessionId: this.sessionId });
            this.chatHistory = GeminiService.getInitialChatHistory();
            return this.chatHistory;
        }
    }
    
    /**
     * Save the current chat history to the AISession record
     */
    public async saveChatHistory(): Promise<void> {
        if (!this.chatHistory) {
            logger.warn('Attempted to save null chat history', { sessionId: this.sessionId });
            return;
        }
        
        try {
            // Log the structure of what we're saving to help debug issues
            logger.debug('Saving chat history', { 
                sessionId: this.sessionId, 
                historyLength: this.chatHistory.length,
                firstEntryRole: this.chatHistory.length > 0 ? this.chatHistory[0]?.role : 'undefined',
                lastEntryRole: this.chatHistory.length > 0 ? this.chatHistory[this.chatHistory.length - 1]?.role : 'undefined'
            });
            
            await api.AISession.update(this.sessionId, {
                chatHistory: this.chatHistory,
                lastInteraction: new Date().toISOString()
            });
            
            logger.debug('Successfully saved chat history', { sessionId: this.sessionId });
        } catch (error) {
            logger.error('Error saving chat history', { error, sessionId: this.sessionId });
        }
    }
    
    /**
     * Set the chat history for the service
     * @param history The chat history to set
     */
    public setChatHistory(history: ChatHistory): void {
        this.chatHistory = history;
    }

    /**
     * Generate an insult using the Gemini API
     * @returns A promise resolving to a generated insult string
     */
    public async generateInsult(): Promise<string> {
        const history = await this.loadChatHistory();
        logger.debug('Starting insult generation with chat history', { 
            sessionId: this.sessionId,
            historyLength: history.length,
            firstMessageRole: history.length > 0 ? history[0]?.role : 'undefined'
        });
        
        const chat = this.model.startChat({ history });
        
        try {
            logger.debug('Sending message to Gemini API', { 
                sessionId: this.sessionId, 
                message: "insult me." 
            });
            const result = await chat.sendMessage("insult me.");
            const insultText = result.response.text();
            
            // Log the raw response from Gemini before translation
            logger.info({
                sessionId: this.sessionId,
                rawGeminiResponse: insultText,
                responseLength: insultText.length
            }, "Raw Gemini response received");
            
            logger.debug('Received response from Gemini API', { 
                sessionId: this.sessionId,
                responseLength: insultText.length,
                responsePreview: insultText.substring(0, 50)
            });
            
            // Update chat history with this interaction
            this.chatHistory!.push({role: "user", parts: [{text: "insult me."}]});
            this.chatHistory!.push({role: "model", parts: [{text: insultText}]});
            await this.saveChatHistory();
            
            return this.translateInsult(insultText);
        } catch (error) {
            logger.error('Error generating insult', { error, sessionId: this.sessionId });
            return "You are such a bozo that I couldn't think of an insult for you. And I'm a generative AI. Imagine that.";
        }
    }
    
    /**
     * Translate the censored insult back to the original words while preserving capitalization
     * @param insultText The censored insult text from Gemini
     * @returns The translated insult with original words and preserved capitalization
     */
    private translateInsult(insultText: string): string {
        let result = insultText;

        // Helper function to preserve capitalization patterns:
        // - ALL CAPS: "TRUNK" → "FUCK"
        // - First letter capitalized: "Trunk" → "Fuck"
        // - lowercase: "trunk" → "fuck"
        const preserveCapitalization = (replacement: string, match: string): string => {
            if (match === match.toUpperCase()) {
                // ALL CAPS
                return replacement.toUpperCase();
            } else if (match.charAt(0) === match.charAt(0).toUpperCase()) {
                // First letter capitalized
                return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
            } else {
                // lowercase
                return replacement.toLowerCase();
            }
        };

        // Use regex with case-insensitive flag (i) and callbacks to preserve original capitalization
        result = result.replace(/trunk/gi, match => preserveCapitalization('fuck', match));
        result = result.replace(/claws/gi, match => preserveCapitalization('shit', match));
        result = result.replace(/PC/gi, match => preserveCapitalization('bitch', match));
        result = result.replace(/apple/gi, match => preserveCapitalization('asshole', match));
        result = result.replace(/quiz/gi, match => preserveCapitalization('ass', match));
        result = result.replace(/capacitor/gi, match => preserveCapitalization('retard', match));
        result = result.replace(/bike/gi, match => preserveCapitalization('dumbass', match));
        
        return result;
    }
    
    /**
     * Get the session ID associated with this service
     * @returns The AISession ID
     */
    public getSessionId(): string {
        return this.sessionId;
    }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use GeminiService class instead
 */
export async function generateInsult(sessionIdOrRecord: string | AISession): Promise<string> {
    const sessionId = typeof sessionIdOrRecord === 'string' ? sessionIdOrRecord : sessionIdOrRecord.id;
    const service = GeminiService.getInstance(sessionId);
    return await service.generateInsult();
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use GeminiService class instead
 */
export function initializeModel(): ChatHistory {
    return GeminiService.getInitialChatHistory();
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use GeminiService class instead
 */
export async function loadChatHistory(sessionId: string): Promise<ChatHistory> {
    const service = GeminiService.getInstance(sessionId);
    const history = await service.loadChatHistory();
    logger.debug('Legacy loadChatHistory function called', { 
        sessionId: sessionId,
        historyLoaded: !!history,
        historyLength: history ? history.length : 0
    });
    return history;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use GeminiService class instead
 */
export async function saveChatHistory(sessionId: string, history: ChatHistory): Promise<void> {
    const service = GeminiService.getInstance(sessionId);
    service.setChatHistory(history);
    await service.saveChatHistory();
}