"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesProvider = void 0;
const vscode_1 = require("vscode");
const models_1 = require("../models");
/**
 * The FilesProvider class
 *
 * @class
 * @classdesc The class that represents the files provider.
 * @export
 * @public
 * @implements {TreeDataProvider<NodeModel>}
 * @property {EventEmitter<NodeModel | undefined | null | void>} _onDidChangeTreeData - The onDidChangeTreeData event emitter
 * @property {Event<NodeModel | undefined | null | void>} onDidChangeTreeData - The onDidChangeTreeData event
 * @property {filesController} controller - The files controller
 * @example
 * const provider = new FilesProvider();
 *
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
class FilesProvider {
    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------
    /**
     * Constructor for the FilesProvider class
     *
     * @constructor
     * @public
     * @memberof FilesProvider
     */
    constructor(controller) {
        this.controller = controller;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    // -----------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------
    // Public methods
    /**
     * Returns the tree item for the supplied element.
     *
     * @function getTreeItem
     * @param {NodeModel} element - The element
     * @public
     * @memberof FilesProvider
     * @example
     * const treeItem = provider.getTreeItem(element);
     *
     * @returns {TreeItem | Thenable<TreeItem>} - The tree item
     *
     * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
     */
    // biome-ignore lint/correctness/noUndeclaredVariables: we dont control vscode's api
    getTreeItem(element) {
        return element;
    }
    /**
     * Returns the children for the supplied element.
     *
     * @function getChildren
     * @param {NodeModel} [element] - The element
     * @public
     * @memberof FilesProvider
     * @example
     * const children = provider.getChildren(element);
     *
     * @returns {ProviderResult<NodeModel[]>} - The children
     *
     * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
     */
    getChildren(element) {
        if (element) {
            return element.children;
        }
        return this.getListFiles();
    }
    /**
     * Refreshes the tree data.
     *
     * @function refresh
     * @public
     * @memberof FeedbackProvider
     * @example
     * provider.refresh();
     *
     * @returns {void} - No return value
     */
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    // Private methods
    /**
     * Gets the list of files.
     *
     * @function getListFiles
     * @private
     * @memberof FilesProvider
     * @example
     * const files = provider.getListFiles();
     *
     * @returns {Promise<NodeModel[] | undefined>} - The list of files
     */
    async getListFiles() {
        const files = await this.controller.getFiles();
        if (!files) {
            return;
        }
        const nodes = [];
        const fileTypes = this.controller.config.include;
        for (const fileType of fileTypes) {
            const children = files.filter((file) => file.label.toString().includes(`.${fileType}`));
            if (children.length !== 0) {
                const node = new models_1.NodeModel(`${fileType}: ${children.length}`, new vscode_1.ThemeIcon('folder-opened'), undefined, undefined, fileType, children);
                nodes.push(node);
            }
        }
        if (nodes.length === 0) {
            return;
        }
        return nodes;
    }
}
exports.FilesProvider = FilesProvider;
//# sourceMappingURL=files.providers.js.map