import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://shapesplosion.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "eCTkCxfzbFih",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "epXpVi4ydwPE",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "kjqPM5TpkK_y",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "Gs4yZW0bRE1n",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "J5DXRknSj_GG",
    },
    firstName: { type: "string", storageKey: "ZWn04w-0pkun" },
    googleImageUrl: { type: "url", storageKey: "Qfhs_eAxwvtK" },
    googleProfileId: { type: "string", storageKey: "NBrrYjoTJlIL" },
    lastName: { type: "string", storageKey: "jf3FO3KE4Ekj" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "XMRO2XKTFsvp",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "MISyN7Pmxens",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "2YlLordB1rLK",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "G6I9FhanvXWI",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "HXkT-lQ8w8K1",
    },
  },
};
