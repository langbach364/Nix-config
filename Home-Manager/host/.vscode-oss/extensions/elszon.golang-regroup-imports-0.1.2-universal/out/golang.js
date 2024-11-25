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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupImports = void 0;
exports.findImports = findImports;
exports.findProjectModule = findProjectModule;
exports.orgModule = orgModule;
exports.createImportSection = createImportSection;
const vscode = __importStar(require("vscode"));
const regroup = __importStar(require("./importRegrouper"));
const groups = __importStar(require("./groups"));
const fs = __importStar(require("fs"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
class GroupImports {
    outputChannel;
    context;
    orgPrefix;
    logLevel;
    constructor(context, outputChannel = vscode.window.createOutputChannel('Go Regroup imports'), enabled = vscode.workspace.getConfiguration('regroupImports').get('onSave'), orgPrefix = vscode.workspace.getConfiguration('regroupImports').get('organization'), logLevel = vscode.workspace.getConfiguration('regroupImports').get('logLevel')) {
        this.context = context;
        this.outputChannel = outputChannel;
        this.orgPrefix = orgPrefix !== undefined ? orgPrefix : "";
        this.isEnabled = enabled !== undefined ? enabled : false;
        this.logLevel = logLevel !== undefined ? LogLevel[logLevel] : LogLevel.INFO;
        this.outputChannel.appendLine("LogLevel: " + this.logLevel.toString());
    }
    get isEnabled() {
        return this.context.globalState.get('isEnabled', false);
    }
    set isEnabled(value) {
        this.context.globalState.update('isEnabled', value);
        this.message(LogLevel.INFO);
    }
    tryRun(doc) {
        try {
            this.run(doc);
        }
        catch (e) {
            this.message(LogLevel.ERROR, "run error: " + e.toString());
        }
    }
    run(doc) {
        if (doc.languageId !== 'go') {
            this.message(LogLevel.DEBUG, "skip: " + doc.fileName);
            return;
        }
        if (!this.isEnabled) {
            return;
        }
        this.message(LogLevel.INFO, "start: " + doc.fileName);
        const edit = new vscode.WorkspaceEdit();
        const importRange = findImports(doc.getText());
        if (!importRange) {
            this.message(LogLevel.INFO, "done (no imports to reorder): " + doc.fileName);
            return;
        }
        const goModule = findProjectModule(doc.fileName, workspaceFolders());
        if (!goModule) {
            this.message(LogLevel.INFO, "go module not found for file: " + doc.fileName);
            return;
        }
        this.message(LogLevel.DEBUG, "go module: " + goModule);
        const regrouper = this.buildRegrouper(goModule, this.orgPrefix);
        const imports = doc.getText(importRange);
        this.message(LogLevel.DEBUG, "to replace:\n" + imports);
        const replacement = regrouper.group(imports.split('\n'));
        const reorderedImports = createImportSection(replacement);
        this.message(LogLevel.DEBUG, "replace by:\n" + reorderedImports);
        if (imports !== reorderedImports) {
            edit.replace(doc.uri, importRange, reorderedImports);
            vscode.workspace.applyEdit(edit).then(doc.save);
        }
        this.message(LogLevel.INFO, "done: " + doc.fileName);
    }
    buildRegrouper(goModule, orgPrefix) {
        if (orgPrefix.trim().length !== 0) {
            this.message(LogLevel.DEBUG, "buildRegrouper: with org prefix: " + orgPrefix + " and mod: " + goModule);
            return new regroup.GoImportsRegrouper(new Array(new groups.Std(), new groups.Default(), new groups.Prefix(orgPrefix), new groups.Prefix(goModule), new groups.Blank(), new groups.Dot()));
        }
        const org = orgModule(goModule);
        if (org) {
            this.message(LogLevel.DEBUG, "buildRegrouper: with org: " + org + " and mod: " + goModule);
            return new regroup.GoImportsRegrouper(new Array(new groups.Std(), new groups.Default(), new groups.Prefix(org), new groups.Prefix(goModule), new groups.Blank(), new groups.Dot()));
        }
        this.message(LogLevel.DEBUG, "buildRegrouper: default with org: " + goModule);
        return new regroup.GoImportsRegrouper(new Array(new groups.Std(), new groups.Default(), new groups.Prefix(goModule), new groups.Blank(), new groups.Dot()));
    }
    message(ll, m) {
        if (ll <= this.logLevel) {
            m = m || `on save: ${this.isEnabled ? 'enabled' : 'disabled'}`;
            this.outputChannel.appendLine(m);
        }
    }
}
exports.GroupImports = GroupImports;
function workspaceFolders() {
    if (vscode.workspace.workspaceFolders === undefined ||
        vscode.workspace.workspaceFolders.length === 0) {
        return Array(0);
    }
    return vscode.workspace.workspaceFolders.map((f) => f.uri.path);
}
function findImports(doc) {
    let start = 0;
    const lines = doc.split('\n');
    for (var line of lines) {
        start++;
        if (line.includes('import (')) {
            break;
        }
    }
    if (start >= lines.length) {
        return null;
    }
    let end = start;
    for (var line of lines.slice(start + 1)) {
        if (line.includes(')')) {
            break;
        }
        end++;
    }
    if (end >= lines.length) {
        return null;
    }
    return new vscode.Range(start, 0, end, Number.MAX_VALUE);
}
function findProjectModule(filepath, workspaceFolders) {
    const moduleRegex = /module (.*?)\n/;
    if (workspaceFolders.length === 0) {
        return undefined;
    }
    const workspaces = workspaceFolders.filter((e) => filepath.startsWith(e));
    for (const w of workspaces) {
        const gomodFilepath = w + '/go.mod';
        if (!fs.existsSync(gomodFilepath)) {
            continue;
        }
        const gomod = fs.readFileSync(gomodFilepath, 'utf-8');
        const module = moduleRegex.exec(gomod);
        if (module !== null &&
            module.length >= 1) {
            return module[1];
        }
    }
}
function orgModule(projectMod) {
    const publicGitServices = ['gitlab.com', 'github.com', 'bitbucket.org', 'sourceforge.net'];
    const publicProvider = publicGitServices.some((e) => projectMod.includes(e));
    if (!publicProvider) {
        const first = projectMod.indexOf('/');
        if (first !== -1) {
            return projectMod.substring(0, first);
        }
    }
    const first = projectMod.indexOf('/');
    if (first === -1) {
        return null;
    }
    const second = projectMod.indexOf('/', first + 1);
    if (second === -1) {
        return null;
    }
    return projectMod.substring(0, second);
}
function createImportSection(g) {
    let first = true;
    let out = "";
    for (let r of g.slice()) {
        if (r.length === 0) {
            continue;
        }
        if (!first) {
            out += '\n\n';
        }
        out += r.join('\n');
        first = false;
    }
    return out;
}
//# sourceMappingURL=golang.js.map