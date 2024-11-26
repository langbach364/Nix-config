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
exports.GoImportsRegrouper = void 0;
const groups = __importStar(require("./groups"));
// Group import to two or more groups. Groups are stdlib + third party + passed in constructor.
class GoImportsRegrouper {
    importGroups;
    constructor(g) {
        this.importGroups = GoImportsRegrouper.buildImportGroups(g);
    }
    static buildImportGroups(g) {
        const importGroups = (() => {
            if (g) {
                const importGr = new Array();
                const hasDefaultGroup = !!g.find(gg => gg.priority() === (new groups.Default()).priority());
                if (!hasDefaultGroup) {
                    g.push(new groups.Default());
                }
                for (let i = 0; i < g.length; i++) {
                    const og = { g: g[i], id: Number(i) };
                    importGr.push(og);
                }
                return importGr;
            }
            else {
                return new Array({ g: new groups.Std(), id: 0 }, { g: new groups.Default(), id: 1 }, { g: new groups.Blank(), id: 2 }, { g: new groups.Dot(), id: 3 });
            }
        })();
        importGroups.sort((l, r) => (r.g.priority() - l.g.priority()));
        return importGroups;
    }
    group(lines) {
        const regrouped = new Array(this.importGroups.length)
            .fill([]).map(() => new Array());
        for (const line of lines) {
            const trimLine = line.trim();
            if (trimLine.length === 0) {
                continue;
            }
            for (const g of this.importGroups) {
                if (g.g.match(trimLine)) {
                    regrouped[g.id].push(line);
                    break;
                }
            }
        }
        return regrouped;
    }
}
exports.GoImportsRegrouper = GoImportsRegrouper;
//# sourceMappingURL=importRegrouper.js.map