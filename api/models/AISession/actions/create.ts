import { applyParams, save, ActionOptions, assert } from "gadget-server";
import { generateModel } from "../../"


export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  
  // Validate clientId - it's required for session tracking
  assert(record.clientId, "ClientId is required for AI sessions");
  
  // Set expiration date to 24 hours from now
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);
  record.expiresAt = expirationDate;
  
  // Initialize empty chat history if none was provided
  if (!record.chatHistory) {
    record.chatHistory = [];
  }
  
  // Set last interaction time to now
  record.lastInteraction = new Date();

  // Log that a new user session has been created
  logger.info("New AISession created", { sessionId: record.id, clientId: record.clientId });
  
  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};