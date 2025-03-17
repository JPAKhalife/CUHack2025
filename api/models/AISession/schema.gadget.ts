import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "AISession" model, go to https://shapesplosion.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "Z6qisO4uhHjH",
  comment:
    "This model represents a user's game session, storing information such as score, highest level reached, and game data.",
  fields: {
    chatHistory: { type: "json", storageKey: "YcWWt6y03fZ_" },
    clientId: { type: "string", storageKey: "bsseGE5GPgkM" },
    expiresAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "j6SamxcE1PuK",
    },
    lastInteraction: {
      type: "dateTime",
      includeTime: true,
      storageKey: "IcxV2ekwZVBC",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "GbIg7OM8BvAi",
    },
  },
};
