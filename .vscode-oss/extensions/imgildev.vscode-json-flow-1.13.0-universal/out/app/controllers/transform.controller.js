"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformController = void 0;
const quicktype_core_1 = require("quicktype-core");
const vscode_1 = require("vscode");
const helpers_1 = require("../helpers");
const models_1 = require("../models");
/**
 * The TransformController class.
 *
 * @class
 * @classdesc The class that represents the example controller.
 * @export
 * @public
 * @example
 * const controller = new TransformController();
 */
class TransformController {
    // -----------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------
    // Public methods
    /**
     * The convertToJson method.
     *
     * @function convertToJson
     * @param {NodeModel | Uri} node - The node model
     * @public
     * @memberof FilesController
     * @example
     * controller.convertToJson('file:///path/to/file');
     *
     * @returns {void} - The promise
     */
    convertToJson(node) {
        if (node) {
            // Get the resource URI
            const resourceUri = node instanceof models_1.NodeModel ? node.resourceUri : node;
            // Check if the resource URI is valid
            if (!resourceUri) {
                const message = vscode_1.l10n.t('Operation cancelled!');
                vscode_1.window.showErrorMessage(message);
                return;
            }
            // Open the text document
            vscode_1.workspace.openTextDocument(resourceUri).then(async (document) => {
                // Get the language ID and file name
                const { languageId, fileName } = document;
                // Determine the file type, defaulting to 'json' if unsupported
                let fileType = languageId;
                if (!(0, helpers_1.isFileTypeSupported)(fileType)) {
                    const fileExtension = fileName.split('.').pop();
                    fileType = fileExtension;
                }
                // Parse JSON content
                const jsonContent = (0, helpers_1.parseJSONContent)(document.getText(), fileType);
                // Check if the content is null
                if (jsonContent === null) {
                    return;
                }
                // Open the JSON document
                const jsonDocument = await vscode_1.workspace.openTextDocument({
                    language: 'json',
                    content: JSON.stringify(jsonContent, null, 2),
                });
                // Show the JSON document
                vscode_1.window.showTextDocument(jsonDocument);
            });
        }
    }
    /**
     * The convertPartialToJson method.
     *
     * @function convertPartialToJson
     * @public
     * @memberof FilesController
     * @example
     * controller.convertPartialToJson();
     *
     * @returns {void} - The promise
     */
    async convertPartialToJson() {
        // Get the active text editor
        const editor = vscode_1.window.activeTextEditor;
        // Check if there is an active editor
        if (!editor) {
            const message = vscode_1.l10n.t('No active editor!');
            vscode_1.window.showErrorMessage(message);
            return;
        }
        // Check if there is a selection
        const selection = editor.selection;
        if (selection.isEmpty) {
            const message = vscode_1.l10n.t('No selection!');
            vscode_1.window.showErrorMessage(message);
            return;
        }
        // Get the selection range
        const selectionRange = new vscode_1.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
        // Get the language ID and file name
        const { languageId, fileName } = editor.document;
        let fileType = languageId;
        let text = editor.document.getText(selectionRange);
        if ([
            'javascript',
            'javascriptreact',
            'typescript',
            'typescriptreact',
        ].includes(fileType)) {
            fileType = 'jsonc';
            text = text
                .replace(/'([^']+)'/g, '"$1"')
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
                .replace(/,*\s*\n*\]/g, ']')
                .replace(/{\s*\n*/g, '{')
                .replace(/,*\s*\n*};*/g, '}');
        }
        if (!(0, helpers_1.isFileTypeSupported)(fileType)) {
            const fileExtension = fileName.split('.').pop();
            fileType = (0, helpers_1.isFileTypeSupported)(fileExtension) ? fileExtension : 'jsonc';
        }
        // Parse JSON content
        const jsonContent = (0, helpers_1.parseJSONContent)(text, fileType);
        // Check if the JSON content is null
        if (jsonContent === null) {
            return;
        }
        // Open the JSON document
        const jsonDocument = await vscode_1.workspace.openTextDocument({
            language: 'json',
            content: JSON.stringify(jsonContent, null, 2),
        });
        // Show the JSON document
        vscode_1.window.showTextDocument(jsonDocument);
    }
    /**
     * The convertToType method.
     *
     * @function convertToType
     * @param {NodeModel | Uri} node - The node model
     * @param {string} targetLanguage - The target language
     * @public
     * @memberof FilesController
     * @example
     * controller.convertToType('file:///path/to/file', 'typescript');
     *
     * @returns {void} - The promise
     */
    async convertToType(node, targetLanguage) {
        if (node) {
            // Get the resource URI
            const resourceUri = node instanceof models_1.NodeModel ? node.resourceUri : node;
            // Check if the resource URI is valid
            if (!resourceUri) {
                const message = vscode_1.l10n.t('Operation cancelled!');
                vscode_1.window.showErrorMessage(message);
                return;
            }
            // Open the text document
            vscode_1.workspace.openTextDocument(resourceUri).then(async (document) => {
                // Get the language ID and file name
                const { languageId, fileName } = document;
                // Determine the file type, defaulting to 'json' if unsupported
                let fileType = languageId;
                if (!(0, helpers_1.isFileTypeSupported)(fileType)) {
                    const fileExtension = fileName.split('.').pop();
                    fileType = fileExtension;
                }
                // Parse JSON content
                const jsonContent = (0, helpers_1.parseJSONContent)(document.getText(), fileType);
                // Check if the content is null
                if (jsonContent === null) {
                    return;
                }
                // Get the name of the type or structure generated
                const typeName = await vscode_1.window.showInputBox({
                    prompt: vscode_1.l10n.t('Enter the name of the type or structure generated'),
                    placeHolder: vscode_1.l10n.t('Enter the name of the type or structure, e.g., User, Post, etc.'),
                    value: undefined,
                    validateInput: (value) => {
                        if (!value) {
                            return vscode_1.l10n.t('The name of the type or structure is required!');
                        }
                        return;
                    },
                });
                if (!typeName) {
                    const message = vscode_1.l10n.t('Operation cancelled!');
                    vscode_1.window.showErrorMessage(message);
                    return;
                }
                // Create an instance of JSONInput
                const jsonInput = (0, quicktype_core_1.jsonInputForTargetLanguage)(targetLanguage);
                // Add the JSON content to the JSONInput instance
                await jsonInput.addSource({
                    name: typeName,
                    samples: [JSON.stringify(jsonContent)],
                });
                // Create an instance of InputData
                const inputData = new quicktype_core_1.InputData();
                inputData.addInput(jsonInput);
                // Generate the target language
                const { lines } = await (0, quicktype_core_1.quicktype)({
                    inputData,
                    lang: targetLanguage,
                });
                // Open the JSON document
                const jsonDocument = await vscode_1.workspace.openTextDocument({
                    language: this.mapLanguageId(targetLanguage),
                    content: lines.join('\n'),
                });
                // Show the JSON document
                vscode_1.window.showTextDocument(jsonDocument);
            });
        }
    }
    /**
     * The convertPartialToType method.
     *
     * @function convertPartialToType
     * @param {string} targetLanguage - The target language
     * @public
     * @memberof FilesController
     * @example
     * controller.convertPartialToType('typescript');
     *
     * @returns {void} - The promise
     */
    async convertPartialToType(targetLanguage) {
        // Get the active text editor
        const editor = vscode_1.window.activeTextEditor;
        // Check if there is an active editor
        if (!editor) {
            const message = vscode_1.l10n.t('No active editor!');
            vscode_1.window.showErrorMessage(message);
            return;
        }
        // Check if there is a selection
        const selection = editor.selection;
        if (selection.isEmpty) {
            const message = vscode_1.l10n.t('No selection!');
            vscode_1.window.showErrorMessage(message);
            return;
        }
        // Get the selection range
        const selectionRange = new vscode_1.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
        // Get the language ID and file name
        const { languageId, fileName } = editor.document;
        let fileType = languageId;
        let text = editor.document.getText(selectionRange);
        if ([
            'javascript',
            'javascriptreact',
            'typescript',
            'typescriptreact',
        ].includes(fileType)) {
            fileType = 'jsonc';
            text = text
                .replace(/'([^']+)'/g, '"$1"')
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
                .replace(/,*\s*\n*\]/g, ']')
                .replace(/{\s*\n*/g, '{')
                .replace(/,*\s*\n*};*/g, '}');
        }
        if (!(0, helpers_1.isFileTypeSupported)(fileType)) {
            const fileExtension = fileName.split('.').pop();
            fileType = (0, helpers_1.isFileTypeSupported)(fileExtension) ? fileExtension : 'jsonc';
        }
        // Parse JSON content
        const jsonContent = (0, helpers_1.parseJSONContent)(text, fileType);
        // Check if the JSON content is null
        if (jsonContent === null) {
            return;
        }
        // Get the name of the type or structure generated
        const typeName = await vscode_1.window.showInputBox({
            prompt: vscode_1.l10n.t('Enter the name of the type or structure generated'),
            placeHolder: vscode_1.l10n.t('Enter the name of the type or structure, e.g., User, Post, etc.'),
            value: undefined,
            validateInput: (value) => {
                if (!value) {
                    return vscode_1.l10n.t('The name of the type or structure is required!');
                }
                return;
            },
        });
        if (!typeName) {
            const message = vscode_1.l10n.t('Operation cancelled!');
            vscode_1.window.showErrorMessage(message);
            return;
        }
        // Create an instance of JSONInput
        const jsonInput = (0, quicktype_core_1.jsonInputForTargetLanguage)(targetLanguage);
        // Add the JSON content to the JSONInput instance
        await jsonInput.addSource({
            name: typeName,
            samples: [JSON.stringify(jsonContent)],
        });
        // Create an instance of InputData
        const inputData = new quicktype_core_1.InputData();
        inputData.addInput(jsonInput);
        // Generate the target language
        const { lines } = await (0, quicktype_core_1.quicktype)({
            inputData,
            lang: targetLanguage,
        });
        // Open the JSON document
        const jsonDocument = await vscode_1.workspace.openTextDocument({
            language: this.mapLanguageId(targetLanguage),
            content: lines.join('\n'),
        });
        // Show the JSON document
        vscode_1.window.showTextDocument(jsonDocument);
    }
    // Private methods
    /**
     * The mapLanguageId method.
     *
     * @function mapLanguageId
     * @param {string} targetLanguage - The target language
     * @private
     * @memberof TransformController
     * @example
     * const languageId = mapLanguageId('typescript');
     *
     * @returns {string} - The language ID
     */
    mapLanguageId(targetLanguage) {
        switch (targetLanguage) {
            case 'ruby':
                return 'ruby';
            case 'javascript':
                return 'javascript';
            case 'flow':
                return 'javascript';
            case 'rust':
                return 'rust';
            case 'kotlin':
                return 'kotlin';
            case 'dart':
                return 'dart';
            case 'python':
                return 'python';
            case 'csharp':
                return 'csharp';
            case 'go':
                return 'go';
            case 'cpp':
                return 'cpp';
            case 'java':
                return 'java';
            case 'scala':
                return 'scala';
            case 'typescript':
                return 'typescript';
            case 'swift':
                return 'swift';
            case 'objective-c':
                return 'objective-c';
            case 'elm':
                return 'elm';
            case 'json-schema':
                return 'json';
            case 'pike':
                return 'pike';
            case 'prop-types':
                return 'javascript';
            case 'haskell':
                return 'haskell';
            case 'php':
                return 'php';
            default:
                return 'plaintext';
        }
    }
}
exports.TransformController = TransformController;
//# sourceMappingURL=transform.controller.js.map