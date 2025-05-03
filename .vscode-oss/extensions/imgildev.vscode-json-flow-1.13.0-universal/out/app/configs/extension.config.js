"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionConfig = void 0;
const constants_config_1 = require("./constants.config");
/**
 * The Config class.
 *
 * @class
 * @classdesc The class that represents the configuration of the extension.
 * @export
 * @public
 * @property {WorkspaceConfiguration} config - The workspace configuration
 * @property {boolean} enable - Whether the extension is enabled or not
 * @property {string[]} include - The files to include
 * @property {string[]} exclude - The files to exclude
 * @property {boolean} showPath - Whether to show the path or not
 * @property {boolean} showValues - Whether to show the values or not
 * @property {number} nodeWidth - The node width
 * @property {number} nodeHeight - The node height
 * @property {string} nodeBorderColor - The node border color
 * @property {string} nodeColor - The node color
 * @property {string} edgeColor - The edge color
 * @property {'TB' | 'LR'} layoutDirection - The layout direction
 * @property {string} imageFolder - The image folder
 * @example
 * const config = new Config(workspace.getConfiguration());
 * console.log(config.include);
 * console.log(config.exclude);
 */
class ExtensionConfig {
    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------
    /**
     * Constructor for the Config class.
     *
     * @constructor
     * @param {WorkspaceConfiguration} config - The workspace configuration
     * @public
     * @memberof Config
     */
    constructor(config) {
        this.config = config;
        this.enable = config.get('enable', true);
        this.include = config.get('files.include', constants_config_1.INCLUDE);
        this.exclude = config.get('files.exclude', constants_config_1.EXCLUDE);
        this.showPath = config.get('files.showPath', constants_config_1.SHOW_PATH);
        this.showValues = config.get('graph.showValues', constants_config_1.SHOW_VALUES);
        this.nodeWidth = config.get('graph.nodeWidth', constants_config_1.NODE_WIDTH);
        this.nodeHeight = config.get('graph.nodeHeight', constants_config_1.NODE_HEIGHT);
        this.nodeBorderColor = config.get('graph.nodeBorderColor', constants_config_1.NODE_BORDER_COLOR);
        this.nodeColor = config.get('graph.nodeColor', constants_config_1.NODE_COLOR);
        this.edgeColor = config.get('graph.edgeColor', constants_config_1.EDGE_COLOR);
        this.layoutDirection = config.get('graph.layoutDirection', constants_config_1.LAYOUT_DIRECTION);
        this.imageFolder = config.get('image.folder', constants_config_1.IMAGE_FOLDER);
    }
    // -----------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------
    // Public methods
    /**
     * The update method.
     *
     * @function update
     * @param {WorkspaceConfiguration} config - The workspace configuration
     * @public
     * @memberof Config
     * @example
     * const config = new Config(workspace.getConfiguration());
     * config.update(workspace.getConfiguration());
     */
    update(config) {
        this.enable = config.get('enable', this.enable);
        this.include = config.get('files.include', this.include);
        this.exclude = config.get('files.exclude', this.exclude);
        this.showPath = config.get('files.showPath', this.showPath);
        this.showValues = config.get('graph.showValues', this.showValues);
        this.nodeWidth = config.get('graph.nodeWidth', this.nodeWidth);
        this.nodeHeight = config.get('graph.nodeHeight', this.nodeHeight);
        this.nodeBorderColor = config.get('graph.nodeBorderColor', this.nodeBorderColor);
        this.nodeColor = config.get('graph.nodeColor', this.nodeColor);
        this.edgeColor = config.get('graph.edgeColor', this.edgeColor);
        this.layoutDirection = config.get('graph.layoutDirection', this.layoutDirection);
        this.imageFolder = config.get('image.folder', this.imageFolder);
    }
}
exports.ExtensionConfig = ExtensionConfig;
//# sourceMappingURL=extension.config.js.map