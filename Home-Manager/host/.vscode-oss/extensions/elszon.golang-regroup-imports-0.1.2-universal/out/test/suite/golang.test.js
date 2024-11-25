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
const golang = __importStar(require("../../golang"));
suite('Golang Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    test('Returns null for file without imports', () => {
        const documentText = `
        package main

        func main() {}
        `;
        const range = golang.findImports(documentText);
        assert.equal(range, null);
    });
    test('Returns null if no multiline imports in file', () => {
        const documentText = `
        package main

        import "fmt"

        func main() {
          fmt.Println("Hello!")
        }
        `;
        const range = golang.findImports(documentText);
        assert.equal(range, null);
    });
    test('Returns proper range on import statements in file', () => {
        const documentText = `
        package main

        import (
          "fmt"
          "strings"
          "github.com/blackdahila/package"
        )

        func main() {
          fmt.Println("Hello!")
          package.FindAllIds(strings.Split("1, 2, 3, 4", ","))
        }
        `;
        const range = golang.findImports(documentText);
        assert.notEqual(range, null);
        assert.equal(range?.start.line, 4);
        assert.equal(range?.end.line, 6);
    });
    test('Returns proper range on import statements in file regarding empty lines', () => {
        const documentText = `
        package main

        import (
          "fmt"

          "strings"

          "github.com/blackdahila/package"
        )

         func main() {
           fmt.Println("Hello!")
           package.FindAllIds(strings.Split("1, 2, 3, 4", ","))
         }
         `;
        const range = golang.findImports(documentText);
        assert.notEqual(range, null);
        assert.equal(range?.start.line, 4);
        assert.equal(range?.end.line, 8);
    });
    test('Returns proper range on import statements in file with receptive entries', () => {
        const documentText = `
        package main

        import (
          "fmt"
          "github.com/blackdahila/package"
          "github.com/blackdahila/package"

          "strings"

          "github.com/blackdahila/package"
        )

         func main() {
           fmt.Println("Hello!")
           package.FindAllIds(strings.Split("1, 2, 3, 4", ","))
         }
         `;
        const range = golang.findImports(documentText);
        assert.notEqual(range, null);
        assert.equal(range?.start.line, 4);
        assert.equal(range?.end.line, 10);
    });
    test('Returns null when no workspace directory', () => {
        const goMod = golang.findProjectModule("some_long_file_name", Array());
        assert.equal(goMod, null);
    });
    test('Returns null when filepath dosent match any workspace directory', () => {
        const goMod = golang.findProjectModule("some_long_file_name", Array("some", "workspace"));
        assert.equal(goMod, null);
    });
    test('Returns ordered imports', () => {
        const groups = Array(Array(), Array(), Array("first"), Array(), Array(), Array("second", "third"), Array(), Array());
        const get = golang.createImportSection(groups);
        const want = 'first\n\nsecond\nthird';
        assert.equal(get, want);
    });
});
//# sourceMappingURL=golang.test.js.map