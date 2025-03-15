"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/shapesplosion
var shapesplosion_1 = require("@gadget-client/shapesplosion");
exports.api = new shapesplosion_1.Client({ environment: window.gadgetConfig.environment });
//# sourceMappingURL=api.js.map