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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
const regroup = __importStar(require("../../importRegrouper"));
const groups = __importStar(require("../../groups"));
suite('Regroup Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    test('Default group ordering', () => {
        const get = regroup.GoImportsRegrouper.buildImportGroups();
        assert.equal(get.length, 4);
        assert.equal(get[0].g.priority(), (new groups.Dot()).priority());
        assert.equal(get[1].g.priority(), (new groups.Blank()).priority());
        assert.equal(get[2].g.priority(), (new groups.Std()).priority());
        assert.equal(get[3].g.priority(), (new groups.Default()).priority());
    });
    test('Custom group ordering', () => {
        const get = regroup.GoImportsRegrouper.buildImportGroups(new Array(new groups.Std(), new groups.Prefix("first"), new groups.Prefix("second")));
        assert.equal(get.length, 4);
        assert.equal(get[0].g.priority(), (new groups.Prefix("second")).priority());
        assert.equal(get[1].g.priority(), (new groups.Prefix("first")).priority());
        assert.equal(get[2].g.priority(), (new groups.Std()).priority());
        assert.equal(get[3].g.priority(), (new groups.Default()).priority());
    });
    test('Return default grouped imports', () => {
        const imports = [
            '"github.com/elszon/group-imports/internal/sort"',
            '"github.com/stretchr/testify/assert"',
            '"testing"',
        ];
        const r = new regroup.GoImportsRegrouper();
        const regrouped = r.group(imports);
        assert.deepEqual(regrouped[0], [
            '"testing"',
        ], "std should be equal");
        assert.deepEqual(regrouped[1], [
            '"github.com/elszon/group-imports/internal/sort"',
            '"github.com/stretchr/testify/assert"',
        ], "default should be equal");
    });
    test('Return project grouped imports', () => {
        const imports = [
            '"github.com/elszon/group-imports/internal/sort"',
            '"github.com/stretchr/testify/assert"',
            '"testing"',
        ];
        const r = new regroup.GoImportsRegrouper(new Array(new groups.Std(), new groups.Default(), new groups.Prefix("github.com/elszon/group-imports")));
        const regrouped = r.group(imports);
        assert.deepEqual(regrouped[0], [
            '"testing"',
        ], "std should be equal");
        assert.deepEqual(regrouped[1], [
            '"github.com/stretchr/testify/assert"',
        ], "default should be equal");
        assert.deepEqual(regrouped[2], [
            '"github.com/elszon/group-imports/internal/sort"',
        ], "project should be equal");
    });
    test('Return grouped mixed imports', () => {
        const imports = [
            '"github.com/blackdahila/package"',
            '"github.com/package/package"',
            '"math"',
            '"fmt"',
            'err "errors"',
            '"database/sql"',
            '"github.com/jmoiron/sqlx"',
            'test "github.com/blackdahila/testing"',
            '. "github.com/blackdahila/testing"',
            '_ "github.com/jmoiron/sqlx"',
        ];
        const r = new regroup.GoImportsRegrouper();
        const regrouped = r.group(imports);
        assert.deepEqual(regrouped[0], [
            '"math"',
            '"fmt"',
            'err "errors"',
            '"database/sql"',
        ], "std should be equal");
        assert.deepEqual(regrouped[1], [
            '"github.com/blackdahila/package"',
            '"github.com/package/package"',
            '"github.com/jmoiron/sqlx"',
            'test "github.com/blackdahila/testing"',
        ], "default should be equal");
        assert.deepEqual(regrouped[2], [
            '_ "github.com/jmoiron/sqlx"',
        ], "blank should be equal");
        assert.deepEqual(regrouped[3], [
            '. "github.com/blackdahila/testing"',
        ], "dot should be equal");
    });
    test('Return grouped mixed imports - no domain prefix', () => {
        const imports = [
            '"github.com/blackdahila/package"',
            '"github.com/package/package"',
            '"math"',
            '"fmt"',
            'err "errors"',
            '"database/sql"',
            '"github.com/jmoiron/sqlx"',
            '"elszon/jmoiron/sqlx"',
            'test "github.com/blackdahila/testing"',
            'test2 "elszon/blackdahila/testing"',
            '. "github.com/blackdahila/testing"',
            '. "elszon/blackdahila/testing"',
            '_ "github.com/jmoiron/sqlx"',
            '_ "elszon/jmoiron/sqlx"',
        ];
        const r = new regroup.GoImportsRegrouper(new Array(new groups.Std(), new groups.Default(), new groups.Prefix("elszon"), new groups.Blank(), new groups.Dot()));
        const regrouped = r.group(imports);
        assert.deepEqual(regrouped[0], [
            '"math"',
            '"fmt"',
            'err "errors"',
            '"database/sql"',
        ], "std should be equal");
        assert.deepEqual(regrouped[1], [
            '"github.com/blackdahila/package"',
            '"github.com/package/package"',
            '"github.com/jmoiron/sqlx"',
            'test "github.com/blackdahila/testing"',
        ], "default should be equal");
        assert.deepEqual(regrouped[2], [
            '"elszon/jmoiron/sqlx"',
            'test2 "elszon/blackdahila/testing"',
        ], "blank should be equal");
        assert.deepEqual(regrouped[3], [
            '_ "github.com/jmoiron/sqlx"',
            '_ "elszon/jmoiron/sqlx"',
        ], "blank should be equal");
        assert.deepEqual(regrouped[4], [
            '. "github.com/blackdahila/testing"',
            '. "elszon/blackdahila/testing"',
        ], "dot should be equal");
    });
});
//# sourceMappingURL=importRegrouper.test.js.map