import { ActionOptions } from "gadget-server";

// Define a simple initial chat history
const DEFAULT_CHAT_HISTORY = [
  {
    role: "system",
    content: "I am a helpful AI assistant for Shapesplosion. How can I help you today?"
  }
];

export const run: ActionRun = async ({ params, logger, api, session }) => {
  // Validate clientId parameter
  if (!params.clientId) {
    logger.warn("Missing clientId parameter");
    throw new Error("clientId is required");
  }

  const clientId = params.clientId;
  const userId = session?.get("user");
  
  logger.info({
    msg: "Initializing AI session",
    userId: userId || "unauthenticated",
    clientId
  });
  
  // Try to find an existing AI session by clientId
  let aiSession = null;
  
  try {
    const filter = {
      clientId: { equals: clientId }
    };
    
    // If user is logged in, also filter by userId for better security
    if (userId) {
      filter.userId = { equals: userId };
    }
    
    const existingSession = await api.AISession.findFirst({
      filter,
      select: {
        id: true,
        chatHistory: true,
        lastInteraction: true
      }
    });
    
    if (existingSession) {
      logger.info({
        msg: "Found existing AI session",
        sessionId: existingSession.id
      });
      aiSession = existingSession;
    }
  } catch (error) {
    // Log the error but continue to create a new session
    logger.warn({
      msg: "Error finding existing AI session",
      error: error.message,
      clientId
    });
  }
  
  // If no existing session found or an error occurred, create a new one
  if (!aiSession) {
    logger.info({
      msg: "Creating new AI session",
      clientId
    });
    
    try {
      const createParams = {
        chatHistory: JSON.stringify(DEFAULT_CHAT_HISTORY),
        lastInteraction: new Date(),
        clientId: clientId
      };
      
      // Only link to user if one is available
      if (userId) {
        createParams.user = { _link: userId };
      }
      
      aiSession = await api.AISession.create(createParams, {
        select: {
          id: true,
          chatHistory: true
        }
      });
      
      logger.info({
        msg: "Created new AI session",
        sessionId: aiSession.id
      });
    } catch (error) {
      logger.error({
        msg: "Failed to create AI session",
        error: error.message,
        clientId
      });
      throw new Error(`Failed to create AI session: ${error.message}`);
    }
  }
  
  // We should always have an aiSession by this point, but let's be defensive
  if (!aiSession) {
    throw new Error("Failed to initialize AI session");
  }
  
  // Ensure we have proper session data or provide defaults
  const sessionId = aiSession.id;
  let aiHistory = aiSession.chatHistory;
  
  // If stored chat history is a string, parse it
  if (typeof aiHistory === 'string' && aiHistory) {
    try {
      aiHistory = JSON.parse(aiHistory);
    } catch (error) {
      logger.warn({
        msg: "Failed to parse chat history, using default",
        sessionId
      });
      aiHistory = DEFAULT_CHAT_HISTORY;
    }
  }
  
  // If there's still no chat history, use default
  if (!aiHistory) {
    aiHistory = DEFAULT_CHAT_HISTORY;
  }
  
  return {
    success: true,
    sessionId,
    aiHistory
  };
};

export const params = {
  clientId: { type: "string" }
};

export const options: ActionOptions = {
  returnType: true
};