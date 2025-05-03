"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_FOLDER = exports.LAYOUT_DIRECTION = exports.EDGE_COLOR = exports.NODE_COLOR = exports.NODE_BORDER_COLOR = exports.NODE_HEIGHT = exports.NODE_WIDTH = exports.SHOW_VALUES = exports.SHOW_PATH = exports.EXCLUDE = exports.INCLUDE = exports.EXTENSION_BUGS_URL = exports.EXTENSION_MARKETPLACE_URL = exports.EXTENSION_REPOSITORY_URL = exports.USER_PUBLISHER = exports.EXTENSION_NAME = exports.EXTENSION_ID = void 0;
/**
 * EXTENSION_ID: The unique identifier of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_ID);
 *
 * @returns {string} - The unique identifier of the extension
 */
exports.EXTENSION_ID = 'jsonFlow';
/**
 * EXTENSION_NAME: The name of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_NAME);
 *
 * @returns {string} - The name of the extension
 */
exports.EXTENSION_NAME = 'JSON Flow';
/**
 * USER_PUBLISHER: The publisher of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(USER_PUBLISHER);
 *
 * @returns {string} - The publisher of the extension
 */
exports.USER_PUBLISHER = 'imgildev';
/**
 * EXTENSION_REPOSITORY_URL: The repository URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_REPOSITORY_URL);
 *
 * @returns {string} - The repository URL of the extension
 */
exports.EXTENSION_REPOSITORY_URL = 'https://github.com/ManuelGil/vscode-json-flow';
/**
 * EXTENSION_MARKETPLACE_URL: The marketplace URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_MARKETPLACE_URL);
 *
 * @returns {string} - The marketplace URL of the extension
 */
exports.EXTENSION_MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-json-flow';
/**
 * EXTENSION_BUGS_URL: The bugs URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_BUGS_URL);
 *
 * @returns {string} - The bugs URL of the extension
 */
exports.EXTENSION_BUGS_URL = 'https://github.com/ManuelGil/vscode-json-flow/issues';
/**
 * INCLUDE: The files to include.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(INCLUDE);
 *
 * @returns {string[]} - The files to include
 */
exports.INCLUDE = [
    'json',
    'jsonc',
    'json5',
    'cfg',
    'csv',
    'env',
    'hcl',
    'ini',
    'properties',
    'toml',
    'tsv',
    'xml',
    'yaml',
    'yml',
];
/**
 * EXCLUDE: The files to exclude.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXCLUDE);
 *
 * @returns {string[]} - The files to exclude
 */
exports.EXCLUDE = [
    '**/node_modules/**',
    '**/dist/**',
    '**/out/**',
    '**/build/**',
    '**/vendor/**',
];
/**
 * SHOW_PATH: Whether to show the path or not.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(SHOW_PATH);
 *
 * @returns {boolean} - Whether to show the path or not
 */
exports.SHOW_PATH = true;
/**
 * SHOW_VALUES: Whether to show the values or not.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(SHOW_VALUES);
 *
 * @returns {boolean} - Whether to show the values or not
 */
exports.SHOW_VALUES = true;
/**
 * NODE_WIDTH: The node width.
 * @type {number}
 * @public
 * @memberof Constants
 * @example
 * console.log(NODE_WIDTH);
 *
 * @returns {number} - The node width
 */
exports.NODE_WIDTH = 200;
/**
 * NODE_HEIGHT: The node height.
 * @type {number}
 * @public
 * @memberof Constants
 * @example
 * console.log(NODE_HEIGHT);
 *
 * @returns {number} - The node height
 */
exports.NODE_HEIGHT = 50;
/**
 * NODE_BORDER_COLOR: The node border color.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(NODE_BORDER_COLOR);
 *
 * @returns {string} - The node border color
 */
exports.NODE_BORDER_COLOR = 'white';
/**
 * NODE_COLOR: The node color.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(NODE_COLOR);
 *
 * @returns {string} - The node color
 */
exports.NODE_COLOR = 'white';
/**
 * EDGE_COLOR: The edge color.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EDGE_COLOR);
 *
 * @returns {string} - The edge color
 */
exports.EDGE_COLOR = 'white';
/**
 * LAYOUT_DIRECTION: The layout direction.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(LAYOUT_DIRECTION);
 *
 * @returns {string} - The layout direction
 */
exports.LAYOUT_DIRECTION = 'TB';
/**
 * IMAGE_FOLDER: The image folder.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(IMAGE_FOLDER);
 *
 * @returns {string} - The image folder
 */
exports.IMAGE_FOLDER = 'json-flow/images';
//# sourceMappingURL=constants.config.js.map