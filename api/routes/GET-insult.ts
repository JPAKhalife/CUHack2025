import { generateInsult } from "../utils/gemini";
import { FastifyRequest, FastifyReply } from "fastify";
import { FastifyLoggerInstance } from "fastify/types/logger";
import { API } from "../types/api";

/**
 * Backend route that generates an insult using the Gemini API
 * Requires a sessionId query parameter to retrieve the AI session
 * 
 * @returns {Promise<void>} The HTTP response is handled within the function
 */
export default async function route({ 
  request, 
  reply, 
  logger, 
  api 
}: { 
  request: FastifyRequest; 
  reply: FastifyReply; 
  logger: FastifyLoggerInstance;
  api: API;
}): Promise<void> {
  try {
    // Extract the sessionId from query parameters
    const { sessionId } = request.query as { sessionId?: string };
    
    // Validate that sessionId is provided
    if (!sessionId) {
      logger.warn("Missing sessionId query parameter");
      return reply
        .code(400)
        .header("Content-Type", "application/json")
        .send({ 
          success: false,
          error: "Bad Request", 
          message: "sessionId query parameter is required" 
        });
    }
    
    logger.info({ sessionId }, "Looking up AI session");
    
    // Try to find the AISession by ID
    let aiSession;
    try {
      aiSession = await api.AISession.findOne(sessionId, {
        select: { id: true, chatHistory: true, userId: true, lastInteraction: true }
      });
      
      if (!aiSession) {
        throw new Error("Session not found");
      }

      // Validate and debug the chatHistory structure
      logger.debug({ 
        sessionId, 
        chatHistoryExists: !!aiSession.chatHistory,
        chatHistoryType: aiSession.chatHistory ? typeof aiSession.chatHistory : 'undefined'
      }, "Chat history debug info");

      // Check if chat history exists and is properly formatted
      let needsUpdate = false;
      
      // Initialize default chat history if it doesn't exist or isn't an array
      if (!aiSession.chatHistory || !Array.isArray(aiSession.chatHistory)) {
        logger.info({ sessionId }, "Chat history missing or invalid, creating new chat history");
        aiSession.chatHistory = [];
        needsUpdate = true;
      }
      
      // Make sure there's at least one message with user role
      if (aiSession.chatHistory.length === 0 || 
          !aiSession.chatHistory.some(msg => msg?.role === 'user')) {
        logger.info({ sessionId }, "Chat history doesn't have a user message, adding initial message");
        aiSession.chatHistory.unshift({
          role: "user",
          content: "I want you to insult me creatively."
        });
        needsUpdate = true;
      }

      // If any fixes were needed, update the AISession
      if (needsUpdate) {
        logger.info({ sessionId, chatHistory: aiSession.chatHistory }, "Updating AI session with fixed chat history");
        await api.AISession.update(sessionId, {
          chatHistory: aiSession.chatHistory,
          lastInteraction: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.warn({ sessionId, error }, "AI session not found or could not be validated");
      return reply
        .code(404)
        .header("Content-Type", "application/json")
        .send({ 
          success: false,
          error: "Not Found", 
          message: "AI session not found or invalid" 
        });
    }
    
    logger.info({ sessionId }, "Generating insult using Gemini API");
    
    // Call the Gemini API to generate an insult with the AI session context
    const insultText = await generateInsult(sessionId);
    
    if (!insultText) {
      throw new Error("Failed to generate insult content");
    }
    
    // Set content-type header and send the response as plain text
    return reply
      .code(200)
      .header("Content-Type", "text/plain")
      .send(insultText);
  } catch (error) {
    logger.error({ error }, "Error generating insult");
    
    // Determine if this is a known error type or generic error
    const statusCode = error.name === "GeminiAPIError" ? 503 : 500;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Handle errors appropriately with consistent response format
    return reply
      .code(statusCode)
      .header("Content-Type", "application/json")
      .send({ 
        success: false,
        error: "Failed to generate insult", 
        message: errorMessage
      });
  }
}