"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonController = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const helpers_1 = require("../helpers");
const providers_1 = require("../providers");
/**
 * The JsonController class.
 *
 * @class
 * @classdesc The class that represents the JSON controller.
 * @export
 * @public
 * @property {ExtensionContext} context - The extension context
 * @example
 * const controller = new JsonController(context);
 */
class JsonController {
    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------
    /**
     * Constructor for the JsonController class
     *
     * @constructor
     * @param {ExtensionContext} context - The extension context
     * @public
     * @memberof JsonController
     */
    constructor(context, config) {
        this.context = context;
        this.config = config;
        // Private properties
        /**
         * The preview delay constant.
         * @type {number}
         * @private
         * @memberof JsonController
         * @example
         * private _processingDelay: number = 1000;
         */
        this._processingDelay = 1000; // Delay constant for preview initialization
        // Set the webview configuration
        JsonController.webviewConfiguration = {
            nodeWidth: config.nodeWidth,
            nodeHeight: config.nodeHeight,
            nodeBorderColor: config.nodeBorderColor,
            nodeColor: config.nodeColor,
            edgeColor: config.edgeColor,
            layoutDirection: config.layoutDirection,
        };
        // Set the image folder
        JsonController.imageFolder = config.imageFolder;
    }
    // -----------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------
    // Public methods
    /**
     * The showPreview method.
     *
     * @function showPreview
     * @param {Uri} uri - The URI of the file
     * @public
     * @memberof JsonController
     * @example
     * controller.showPreview(uri);
     *
     * @returns {void}
     */
    showPreview(uri) {
        // Open the text document
        vscode_1.workspace.openTextDocument(uri.fsPath).then((document) => {
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
            // Check if the JSON content is null
            if (jsonContent === null) {
                return;
            }
            // Derive the file name for the preview panel title
            const displayName = fileName.split(/[\\/]/).pop() || 'JSON Flow';
            // Initialize the webview panel
            const panel = providers_1.JSONProvider.createPanel(this.context.extensionUri);
            panel.title = displayName;
            const data = (0, helpers_1.generateTree)(jsonContent, this.config.showValues);
            const layoutDirection = this.config.layoutDirection;
            // Post the message to the webview with a delay
            setTimeout(() => {
                panel.webview.postMessage({
                    type: 'setJson',
                    layoutDirection,
                    data,
                });
            }, this._processingDelay);
        });
    }
    /**
     * The showPartialPreview method.
     *
     * @function showPartialPreview
     * @public
     * @memberof JsonController
     * @example
     * controller.showPartialPreview();
     *
     * @returns {void}
     */
    showPartialPreview() {
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
            fileType = 'json';
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
        // Derive the file name for the preview panel title
        const displayName = fileName.split(/[\\/]/).pop() || 'JSON Flow';
        // Initialize the webview panel
        const panel = providers_1.JSONProvider.createPanel(this.context.extensionUri);
        panel.title = displayName;
        const data = (0, helpers_1.generateTree)(jsonContent, this.config.showValues);
        const layoutDirection = this.config.layoutDirection;
        // Post the message to the webview with a delay
        setTimeout(() => {
            panel.webview.postMessage({
                type: 'setJson',
                layoutDirection,
                data,
            });
        }, this._processingDelay);
    }
    /**
     * The saveImage method.
     *
     * @function saveImage
     * @param {string} dataUrl - The data URL
     * @public
     * @memberof JsonController
     * @example
     * controller.saveImage(dataUrl);
     *
     * @returns {Promise<void>}
     */
    static async saveImage(data) {
        const base64Data = data.replace(/^data:image\/png;base64,/, ''); // Remove metadata
        const buffer = Buffer.from(base64Data, 'base64'); // Convert base64 to binary
        // Generate a random filename with the date and time as a prefix and the .png extension
        // The filename won't be have a special characters or spaces to avoid issues
        const fileName = `json-flow-${new Date().toISOString().replace(/[^0-9]/g, '')}.png`;
        // Define the file path
        let filePath;
        // Get the workspace folders
        const workspaceFolders = vscode_1.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode_1.window.showErrorMessage(vscode_1.l10n.t('No workspace folder available to save the image!'));
            return;
        }
        // Optionally, prompt the user to select a workspace folder if multiple are available
        if (workspaceFolders.length === 1) {
            filePath = (0, path_1.join)(workspaceFolders[0].uri.fsPath, this.imageFolder, fileName);
        }
        else {
            // await window.showWorkspaceFolderPick({placeHolder});
            const folder = await vscode_1.window.showWorkspaceFolderPick({
                placeHolder: vscode_1.l10n.t('Select a workspace folder to save the image'),
            });
            if (!folder) {
                const message = vscode_1.l10n.t('Operation cancelled!');
                vscode_1.window.showErrorMessage(message);
                return;
            }
            // Save the file in the selected workspace folder
            filePath = (0, path_1.join)(folder.uri.fsPath, this.imageFolder, fileName);
        }
        // Create the directory if it doesn't exist
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(filePath))) {
            await (0, fs_1.mkdirSync)((0, path_1.dirname)(filePath), { recursive: true });
        }
        // Write the file to the disk
        (0, fs_1.writeFileSync)(filePath, buffer);
        // Show a message to the user
        vscode_1.window.showInformationMessage(vscode_1.l10n.t('Image saved to: {0}', filePath));
    }
}
exports.JsonController = JsonController;
//# sourceMappingURL=json.controller.js.map