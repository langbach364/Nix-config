"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const vscode_1 = require("vscode");
const configs_1 = require("../configs");
/**
 * The FeedbackController class.
 *
 * @class
 * @classdesc The class that represents the feedback controller.
 * @export
 * @public
 * @example
 * const controller = new FeedbackController();
 */
class FeedbackController {
    // -----------------------------------------------------------------
    // Methods
    // -----------------------------------------------------------------
    // Public methods
    /**
     * The reportIssues method.
     *
     * @function reportIssues
     * @public
     * @memberof FeedbackController
     *
     * @returns {void} - No return value
     */
    reportIssues() {
        vscode_1.env.openExternal(vscode_1.Uri.parse(configs_1.EXTENSION_BUGS_URL));
    }
    /**
     * The rateUs method.
     *
     * @function rateUs
     * @public
     * @memberof FeedbackController
     *
     * @returns {void} - No return value
     */
    rateUs() {
        vscode_1.env.openExternal(vscode_1.Uri.parse(`${configs_1.EXTENSION_MARKETPLACE_URL}&ssr=false#review-details`));
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map