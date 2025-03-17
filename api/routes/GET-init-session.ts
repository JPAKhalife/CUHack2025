import { createIdUniversal } from "../utils/createid";
import type { RouteHandler } from "gadget-server";

/**
 * Route to initialize a new AI session
 * Creates a random client ID and calls the initializeAISession action
 * Returns the session ID in the response
 */
const route: RouteHandler<{
  Reply: { sessionId: string; clientId: string } | { error: string }
}> = async ({ request, reply, api, logger, applicationSession }) => {
  try {
    // Generate a random client ID
    const clientId = createIdUniversal();
    
    logger.info({ clientId }, "Initializing new AI session");
    
    // Call the global action to initialize the AI session
    const result = await api.initializeAISession({
      clientId
    });
    
    // The action returns { success, sessionId, aiHistory }
    if (!result || !result.sessionId) {
      logger.error({ result }, "Session ID not found in result");
      return await reply.code(500).send({ 
        error: "Failed to initialize AI session" 
      });
    }
    
    // Return the session ID and client ID
    return await reply.send({
      sessionId: result.sessionId,
      clientId
    });
    
  } catch (error) {
    logger.error({ error }, "Error initializing AI session");
    return await reply.code(500).send({ 
      error: "Error initializing AI session" 
    });
  }
};

export default route;