"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    frameworkVersion: function() {
        return frameworkVersion;
    },
    modelListIndex: function() {
        return modelListIndex;
    },
    modelsMap: function() {
        return modelsMap;
    }
});
/**
 * Internal variable to indicate the framework version this package is built with.
 * @internal
 */ const frameworkVersion = "^1.3.0";
/**
 * Internal variable to store model blobs with GraphQL typename as the key, and use them in the action code functions.
 * @internal
 */ const modelsMap = {
    "Session": {
        "key": "Rw_HBNRe2UfG",
        "name": "Session",
        "apiIdentifier": "session",
        "namespace": [],
        "fields": {
            "Rw_HBNRe2UfG-system-id": {
                "fieldType": "ID",
                "key": "Rw_HBNRe2UfG-system-id",
                "name": "ID",
                "apiIdentifier": "id",
                "configuration": {
                    "type": "IDConfig",
                    "key": "MsCYL0zS48s-",
                    "createdDate": "2025-03-15T19:01:36.073Z"
                },
                "internalWritable": true
            },
            "Rw_HBNRe2UfG-system-createdAt": {
                "fieldType": "DateTime",
                "key": "Rw_HBNRe2UfG-system-createdAt",
                "name": "Created At",
                "apiIdentifier": "createdAt",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "Z5Nqzivw-M6u",
                    "createdDate": "2025-03-15T19:01:36.075Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            },
            "Rw_HBNRe2UfG-system-updatedAt": {
                "fieldType": "DateTime",
                "key": "Rw_HBNRe2UfG-system-updatedAt",
                "name": "Updated At",
                "apiIdentifier": "updatedAt",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "j3KQhfzml3B0",
                    "createdDate": "2025-03-15T19:01:36.075Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            },
            "9KJb-dGLixsL": {
                "fieldType": "BelongsTo",
                "key": "9KJb-dGLixsL",
                "name": "User",
                "apiIdentifier": "user",
                "configuration": {
                    "type": "BelongsToConfig",
                    "key": "7TZLQCLDSTyd",
                    "createdDate": "2025-03-15T19:01:36.353Z",
                    "relatedModelKey": "eCTkCxfzbFih",
                    "relatedModelApiIdentifier": null
                },
                "internalWritable": true
            }
        },
        "graphqlTypeName": "Session",
        "stateChart": {
            "type": "StateChart",
            "key": "LF3zFPdvSwfv",
            "createdDate": 1742065296075,
            "actions": {},
            "transitions": {},
            "stateInActionCode": false,
            "childStates": []
        }
    },
    "User": {
        "key": "eCTkCxfzbFih",
        "name": "User",
        "apiIdentifier": "user",
        "namespace": [],
        "fields": {
            "eCTkCxfzbFih-system-id": {
                "fieldType": "ID",
                "key": "eCTkCxfzbFih-system-id",
                "name": "ID",
                "apiIdentifier": "id",
                "configuration": {
                    "type": "IDConfig",
                    "key": "83KqdxvHOYI-",
                    "createdDate": "2025-03-15T19:01:36.111Z"
                },
                "internalWritable": true
            },
            "eCTkCxfzbFih-system-createdAt": {
                "fieldType": "DateTime",
                "key": "eCTkCxfzbFih-system-createdAt",
                "name": "Created At",
                "apiIdentifier": "createdAt",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "UqXlqOEyibDJ",
                    "createdDate": "2025-03-15T19:01:36.112Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            },
            "eCTkCxfzbFih-system-updatedAt": {
                "fieldType": "DateTime",
                "key": "eCTkCxfzbFih-system-updatedAt",
                "name": "Updated At",
                "apiIdentifier": "updatedAt",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "txiRpsgBz40E",
                    "createdDate": "2025-03-15T19:01:36.112Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            },
            "ZWn04w-0pkun": {
                "fieldType": "String",
                "key": "ZWn04w-0pkun",
                "name": "Field A",
                "apiIdentifier": "firstName",
                "configuration": {
                    "type": "StringConfig",
                    "key": "YzxC9QEnO3aV",
                    "createdDate": "2025-03-15T19:01:36.146Z",
                    "default": null
                },
                "internalWritable": true
            },
            "jf3FO3KE4Ekj": {
                "fieldType": "String",
                "key": "jf3FO3KE4Ekj",
                "name": "Field B",
                "apiIdentifier": "lastName",
                "configuration": {
                    "type": "StringConfig",
                    "key": "WUbjMoyn_sOT",
                    "createdDate": "2025-03-15T19:01:36.150Z",
                    "default": null
                },
                "internalWritable": true
            },
            "epXpVi4ydwPE": {
                "fieldType": "Email",
                "key": "epXpVi4ydwPE",
                "name": "Field C",
                "apiIdentifier": "email",
                "configuration": {
                    "type": "EmailConfig",
                    "key": "qYPRv6HW5UId",
                    "createdDate": "2025-03-15T19:01:36.153Z",
                    "default": null
                },
                "internalWritable": true
            },
            "J5DXRknSj_GG": {
                "fieldType": "Boolean",
                "key": "J5DXRknSj_GG",
                "name": "Field D",
                "apiIdentifier": "emailVerified",
                "configuration": {
                    "type": "BooleanConfig",
                    "key": "nwgG_o9GZMSn",
                    "createdDate": "2025-03-15T19:01:36.158Z",
                    "default": false
                },
                "internalWritable": true
            },
            "Qfhs_eAxwvtK": {
                "fieldType": "URL",
                "key": "Qfhs_eAxwvtK",
                "name": "Field E",
                "apiIdentifier": "googleImageUrl",
                "configuration": {
                    "type": "URLConfig",
                    "key": "1-Zc6aas171L",
                    "createdDate": "2025-03-15T19:01:36.160Z",
                    "default": null
                },
                "internalWritable": true
            },
            "NBrrYjoTJlIL": {
                "fieldType": "String",
                "key": "NBrrYjoTJlIL",
                "name": "Field F",
                "apiIdentifier": "googleProfileId",
                "configuration": {
                    "type": "StringConfig",
                    "key": "NnhLM8BVNht4",
                    "createdDate": "2025-03-15T19:01:36.162Z",
                    "default": null
                },
                "internalWritable": true
            },
            "HXkT-lQ8w8K1": {
                "fieldType": "RoleAssignments",
                "key": "HXkT-lQ8w8K1",
                "name": "Field G",
                "apiIdentifier": "roles",
                "configuration": {
                    "type": "RoleAssignmentsConfig",
                    "key": "oONhjPE8ENH6",
                    "createdDate": "2025-03-15T19:01:36.164Z",
                    "default": [
                        "unauthenticated"
                    ]
                },
                "internalWritable": true
            },
            "XMRO2XKTFsvp": {
                "fieldType": "DateTime",
                "key": "XMRO2XKTFsvp",
                "name": "Field H",
                "apiIdentifier": "lastSignedIn",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "e6tPCmesb0Ww",
                    "createdDate": "2025-03-15T19:01:36.167Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            },
            "MISyN7Pmxens": {
                "fieldType": "Password",
                "key": "MISyN7Pmxens",
                "name": "Field I",
                "apiIdentifier": "password",
                "configuration": {
                    "type": "PasswordConfig",
                    "key": "_bD4ODme0lQI",
                    "createdDate": "2025-03-15T19:01:36.169Z"
                },
                "internalWritable": true
            },
            "kjqPM5TpkK_y": {
                "fieldType": "String",
                "key": "kjqPM5TpkK_y",
                "name": "Field J",
                "apiIdentifier": "emailVerificationToken",
                "configuration": {
                    "type": "StringConfig",
                    "key": "viHU0tL8bXcW",
                    "createdDate": "2025-03-15T19:01:36.172Z",
                    "default": null
                },
                "internalWritable": true
            },
            "Gs4yZW0bRE1n": {
                "fieldType": "DateTime",
                "key": "Gs4yZW0bRE1n",
                "name": "Field K",
                "apiIdentifier": "emailVerificationTokenExpiration",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "K2iFiePmRmuB",
                    "createdDate": "2025-03-15T19:01:36.174Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            },
            "2YlLordB1rLK": {
                "fieldType": "String",
                "key": "2YlLordB1rLK",
                "name": "Field L",
                "apiIdentifier": "resetPasswordToken",
                "configuration": {
                    "type": "StringConfig",
                    "key": "SSyP7-c9Gs1k",
                    "createdDate": "2025-03-15T19:01:36.179Z",
                    "default": null
                },
                "internalWritable": true
            },
            "G6I9FhanvXWI": {
                "fieldType": "DateTime",
                "key": "G6I9FhanvXWI",
                "name": "Field M",
                "apiIdentifier": "resetPasswordTokenExpiration",
                "configuration": {
                    "type": "DateTimeConfig",
                    "key": "5w4_5_lT-PYt",
                    "createdDate": "2025-03-15T19:01:36.181Z",
                    "includeTime": true,
                    "default": null
                },
                "internalWritable": true
            }
        },
        "graphqlTypeName": "User",
        "stateChart": {
            "type": "StateChart",
            "key": "_dS3RRz8ozKo",
            "createdDate": 1742065296113,
            "actions": {},
            "transitions": {},
            "stateInActionCode": false,
            "childStates": []
        }
    }
};
/**
 * Internal variable to map model apiIdentifier to GraphQL typename in modelsMap.
 * @internal
 */ const modelListIndex = {
    "api:session": "Session",
    "api:user": "User"
};
