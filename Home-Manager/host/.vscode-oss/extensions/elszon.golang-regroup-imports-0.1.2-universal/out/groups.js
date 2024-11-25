"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = exports.Std = exports.Prefix = exports.Blank = exports.Dot = void 0;
const MAX_PRIORITY = 2000;
class Dot {
    priority() {
        return MAX_PRIORITY;
    }
    match(s) {
        return s.startsWith('. ');
    }
}
exports.Dot = Dot;
class Blank {
    priority() {
        return MAX_PRIORITY - 1;
    }
    match(s) {
        return s.startsWith('_ ');
    }
}
exports.Blank = Blank;
class Prefix {
    prefix;
    constructor(prefix) {
        this.prefix = prefix;
    }
    priority() {
        return MAX_PRIORITY / 2 + this.prefix.length;
    }
    match(s) {
        const i = s.indexOf('"');
        const idx = i < 0 ? 0 : i + 1;
        const subs = s.slice(idx);
        return subs.startsWith(this.prefix);
    }
}
exports.Prefix = Prefix;
class Std {
    priority() {
        return MAX_PRIORITY / 2;
    }
    match(s) {
        return !s.includes('.');
    }
}
exports.Std = Std;
class Default {
    priority() {
        return 0;
    }
    match(s) {
        return true;
    }
}
exports.Default = Default;
//# sourceMappingURL=groups.js.map