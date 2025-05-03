"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = exports.escapeRegExp = exports.escapeUrl = exports.escapeJs = exports.escapeHtml = exports.stripHtmlTags = exports.sanitizeFilename = void 0;
/**
 * Provides protection against directory traversal.
 *
 * @param {string} filename - The filename to sanitize
 * @example
 * sanitizeFilename('foo.bar');
 *
 * @returns {string} - The sanitized filename
 */
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};
exports.sanitizeFilename = sanitizeFilename;
/**
 * Strips HTML tags from a string.
 *
 * @param {string} html - The HTML to strip
 * @example
 * stripHtmlTags('<p>foo</p>');
 *
 * @returns {string} - The stripped HTML
 */
const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
};
exports.stripHtmlTags = stripHtmlTags;
/**
 * Escapes a string for use in HTML.
 * @param {string} str - The string to escape
 * @example
 * escapeHtml('<p>foo</p>');
 *
 * @returns {string} - The escaped string
 */
const escapeHtml = (str) => {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
exports.escapeHtml = escapeHtml;
/**
 * Escapes a string for use in JavaScript.
 * @param {string} str - The string to escape
 * @example
 * escapeJs('foo "bar"');
 *
 * @returns {string} - The escaped string
 */
const escapeJs = (str) => {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
};
exports.escapeJs = escapeJs;
/**
 * Escapes a string for use in a URL.
 *
 * @param {string} str - The string to escape
 * @example
 * escapeUrl('foo bar');
 *
 * @returns {string} - The escaped string
 */
const escapeUrl = (str) => {
    return encodeURIComponent(str);
};
exports.escapeUrl = escapeUrl;
/**
 * Escapes a string for use in a regular expression.
 *
 * @param {string} str - The string to escape
 * @example
 * escapeRegExp('foo.bar');
 *
 * @returns {string} - The escaped string
 */
const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
exports.escapeRegExp = escapeRegExp;
/**
 * Returns a random nonce.
 *
 * @example
 * const nonce = getNonce();
 *
 * @returns {string} - The nonce
 */
const getNonce = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.getNonce = getNonce;
//# sourceMappingURL=security.helper.js.map