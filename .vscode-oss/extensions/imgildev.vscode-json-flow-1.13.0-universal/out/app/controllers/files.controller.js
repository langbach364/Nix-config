"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const vscode_1 = require("vscode");
const configs_1 = require("../configs");
const helpers_1 = require("../helpers");
const models_1 = require("../models");
/**
 * The FilesController class.
 *
 * @class
 * @classdesc The class that represents the list files controller.
 * @export
 * @public
 * @property {ExtensionConfig} config - The configuration object
 * @example
 * const controller = new FilesController(config);
 */
class FilesController {
    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------
    /**
     * Constructor for the FilesController class
     *
     * @constructor
     * @param {ExtensionConfig} config - The configuration object
     * @public
     * @memberof FilesController
     */
    constructor(config) {
        this.config = config;
    }
    // -----------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------
    // Public methods
    /**
     * The getFiles method.
     *
     * @function getFiles
     * @public
     * @async
     * @memberof FilesController
     * @example
     * controller.getFiles();
     *
     * @returns {Promise<NodeModel[] | void>} - The list of files
     */
    async getFiles() {
        // Get the files in the folder
        let folders = [];
        let files = [];
        if (!vscode_1.workspace.workspaceFolders) {
            const message = vscode_1.l10n.t('Operation cancelled!');
            vscode_1.window.showErrorMessage(message);
            return;
        }
        folders = vscode_1.workspace.workspaceFolders.map((folder) => folder.uri.fsPath);
        const { include, exclude } = this.config;
        const includedFilePatterns = `**/*.{${include.join(',')}}`;
        const excludedFilePatterns = Array.isArray(exclude) ? exclude : [exclude];
        for (const folder of folders) {
            const result = await this.findFiles(folder, [includedFilePatterns], excludedFilePatterns);
            files.push(...result);
        }
        if (files.length !== 0) {
            const nodes = [];
            files.sort((a, b) => a.path.localeCompare(b.path));
            for (const file of files) {
                const document = await vscode_1.workspace.openTextDocument(file);
                const path = vscode_1.workspace.asRelativePath(document.fileName);
                let filename = path.split('/').pop();
                if (filename && this.config.showPath) {
                    const folder = path.split('/').slice(0, -1).join('/');
                    filename += folder ? ` (${folder})` : ' (root)';
                }
                nodes.push(new models_1.NodeModel(filename ?? 'Untitled', new vscode_1.ThemeIcon('file'), {
                    command: `${configs_1.EXTENSION_ID}.json.showPreview`,
                    title: 'Open Preview',
                    arguments: [document.uri],
                }, document.uri, document.fileName));
            }
            return nodes;
        }
        return;
    }
    /**
     * The openFile method.
     *
     * @function openFile
     * @param {NodeModel} node - The node model
     * @public
     * @memberof FilesController
     * @example
     * controller.openFile('file:///path/to/file');
     *
     * @returns {Promise<void>} - The promise
     */
    openFile(node) {
        if (node.resourceUri) {
            vscode_1.workspace.openTextDocument(node.resourceUri).then((filename) => {
                vscode_1.window.showTextDocument(filename);
            });
        }
    }
    /**
     * The copyContent method.
     *
     * @function copyContent
     * @param {NodeModel} node - The node model
     * @public
     * @memberof FilesController
     * @example
     * controller.copyContent('file:///path/to/file');
     *
     * @returns {void} - The promise
     */
    copyContent(node) {
        if (node.resourceUri) {
            vscode_1.workspace.openTextDocument(node.resourceUri).then((document) => {
                const message = vscode_1.l10n.t('Content copied to clipboard');
                vscode_1.env.clipboard.writeText(document.getText());
                vscode_1.window.showInformationMessage(message);
            });
        }
    }
    /**
     * The copyContentAsJson method.
     *
     * @function copyContentAsJson
     * @param {NodeModel | Uri} node - The node model
     * @public
     * @memberof FilesController
     * @example
     * controller.copyContentAsJson('file:///path/to/file');
     *
     * @returns {void} - The promise
     */
    copyContentAsJson(node) {
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
                // Copy the JSON content to the clipboard
                vscode_1.env.clipboard.writeText(JSON.stringify(jsonContent, null, 2));
                // Show the message
                const message = vscode_1.l10n.t('Content copied as JSON to clipboard');
                vscode_1.window.showInformationMessage(message);
            });
        }
    }
    /**
     * The copyContentPartialAsJson method.
     *
     * @function copyContentPartialAsJson
     * @public
     * @memberof FilesController
     * @example
     * controller.copyContentPartialAsJson();
     *
     * @returns {void} - The promise
     */
    copyContentPartialAsJson() {
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
        // Copy the JSON content to the clipboard
        vscode_1.env.clipboard.writeText(JSON.stringify(jsonContent, null, 2));
        // Show the message
        const message = vscode_1.l10n.t('Content copied as JSON to clipboard');
        vscode_1.window.showInformationMessage(message);
    }
    /**
     * The getFileProperties method.
     *
     * @function getFileProperties
     * @param {NodeModel} node - The node model
     * @public
     * @memberof FilesController
     * @example
     * controller.getFileProperties('file:///path/to/file');
     *
     * @returns {void} - The promise
     */
    getFileProperties(node) {
        if (node.resourceUri) {
            vscode_1.workspace.openTextDocument(node.resourceUri).then(async (document) => {
                const { fileName, languageId, lineCount, version } = document;
                // Show the message
                const message = vscode_1.l10n.t('File Name: {0}\nLanguage: {1}\nLines: {2}\nVersion: {3}', [fileName, languageId, lineCount, version]);
                await vscode_1.window.showInformationMessage(message, { modal: true });
            });
        }
    }
    // Private methods
    /**
     * The findFiles method.
     *
     * @function findFiles
     * @param {string} baseDir - The base directory
     * @param {string[]} include - The include pattern
     * @param {string[]} exclude - The exclude pattern
     * @private
     * @async
     * @memberof FilesController
     * @example
     * controller.findFiles('baseDir', ['include'], ['exclude']);
     *
     * @returns {Promise<Uri[]>} - The promise with the files
     */
    async findFiles(baseDir, include, // Include patterns
    exclude, // Exclude patterns
    allowRecursion = true) {
        // Configure fast-glob options
        const options = {
            cwd: baseDir, // Set base directory for searching
            absolute: true, // Ensure paths are absolute
            onlyFiles: true, // Match only files, not directories
            dot: true, // Include files and directories starting with a dot
            deep: allowRecursion ? undefined : 1, // Toggle recursion
            ignore: exclude, // Exclude patterns
        };
        try {
            // Use fast-glob to find matching files
            const filePaths = await (0, fast_glob_1.default)(include, options);
            // Convert file paths to VS Code Uri objects
            return filePaths.sort().map((filePath) => vscode_1.Uri.file(filePath));
        }
        catch (error) {
            const message = vscode_1.l10n.t('Error while finding files: {0}', [error]);
            vscode_1.window.showErrorMessage(message);
            return [];
        }
    }
}
exports.FilesController = FilesController;
//# sourceMappingURL=files.controller.js.map