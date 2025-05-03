"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSONContent = exports.isFileTypeSupported = void 0;
const dotenv = __importStar(require("dotenv"));
const fast_xml_parser_1 = require("fast-xml-parser");
const hcl_parser_1 = __importDefault(require("hcl-parser"));
const ini = __importStar(require("ini"));
const json5_1 = __importDefault(require("json5"));
const toml = __importStar(require("toml"));
const vscode_1 = require("vscode");
const yaml = __importStar(require("yaml"));
/**
 * Type guard to verify if a value is a valid FileType.
 *
 * @param value - The value to check.
 * @returns {value is FileType} - True if the value is a valid FileType, false otherwise.
 */
const isFileTypeSupported = (value) => {
    const validFileTypes = [
        'csv',
        'dockercompose',
        'env',
        'hcl',
        'ini',
        'json',
        'json5',
        'jsonc',
        'properties',
        'toml',
        'tsv',
        'xml',
        'yaml',
        'yml',
    ];
    return validFileTypes.includes(value);
};
exports.isFileTypeSupported = isFileTypeSupported;
/**
 * The parseJSONContent function.
 *
 * @function parseJSONContent
 * @param {string} content - The content to parse
 * @param {FileType} type - The type of content
 * @returns {object | null} - The parsed content
 */
const parseJSONContent = (content, type) => {
    try {
        switch (type) {
            case 'json':
            case 'jsonc':
            case 'json5':
                return json5_1.default.parse(content);
            case 'dockercompose':
            case 'yaml':
            case 'yml':
                return yaml.parse(content);
            case 'toml':
                return toml.parse(content);
            case 'ini':
            case 'properties':
                return ini.parse(content);
            case 'env':
                return dotenv.parse(content);
            case 'xml': {
                const parser = new fast_xml_parser_1.XMLParser();
                return parser.parse(content);
            }
            case 'hcl':
                return hcl_parser_1.default.parse(content);
            case 'csv': {
                const rows = content.trim().split('\n');
                const headers = rows[0].split(',').map((row) => row.replace('\r', ''));
                return rows.slice(1).map((row) => {
                    const values = row.split(',');
                    return headers.reduce((acc, header, index) => {
                        acc[header] = values[index];
                        return acc;
                    }, {});
                });
            }
            case 'tsv': {
                const rows = content
                    .trim()
                    .split('\n')
                    .map((row) => row.replace('\r', ''));
                const headers = rows[0].split('\t');
                return rows.slice(1).map((row) => {
                    const values = row.split('\t');
                    return headers.reduce((acc, header, index) => {
                        acc[header] = values[index];
                        return acc;
                    }, {});
                });
            }
            default: {
                const message = vscode_1.l10n.t('Invalid file type!');
                vscode_1.window.showErrorMessage(message);
                return null;
            }
        }
    }
    catch (error) {
        const message = vscode_1.l10n.t('Error parsing {0}: {1}', [
            type.toUpperCase(),
            error.message,
        ]);
        vscode_1.window.showErrorMessage(message);
        return null;
    }
};
exports.parseJSONContent = parseJSONContent;
//# sourceMappingURL=json.helper.js.map