"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_plugins_1 = require("@expo/config-plugins");
var fs_1 = require("fs");
var path_1 = require("path");
var androidFolderPath = ['app', 'src', 'main', 'res', 'drawable'];
var withDrawableAssets = function (expoConfig, files) {
    return (0, config_plugins_1.withDangerousMod)(expoConfig, [
        'android',
        function (modConfig) {
            if (modConfig.modRequest.platform === 'android') {
                var androidDwarablePath_1 = path_1.join.apply(void 0, __spreadArray([modConfig.modRequest.platformProjectRoot], androidFolderPath, false));
                if (!Array.isArray(files)) {
                    files = [files];
                }
                files.forEach(function (file) {
                    var isFile = (0, fs_1.lstatSync)(file).isFile();
                    if (isFile) {
                        (0, fs_1.copyFileSync)(file, (0, path_1.join)(androidDwarablePath_1, (0, path_1.basename)(file)));
                    }
                    else {
                        copyFolderRecursiveSync(file, androidDwarablePath_1);
                    }
                });
            }
            return modConfig;
        },
    ]);
};
function copyFolderRecursiveSync(source, target) {
    return __awaiter(this, void 0, void 0, function () {
        var files, _i, files_1, file, sourcePath, targetPath;
        return __generator(this, function (_a) {
            if (!(0, fs_1.existsSync)(target))
                (0, fs_1.mkdirSync)(target);
            files = (0, fs_1.readdirSync)(source);
            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                file = files_1[_i];
                sourcePath = (0, path_1.join)(source, file);
                targetPath = (0, path_1.join)(target, file);
                if ((0, fs_1.lstatSync)(sourcePath).isDirectory()) {
                    copyFolderRecursiveSync(sourcePath, targetPath);
                }
                else {
                    (0, fs_1.copyFileSync)(sourcePath, targetPath);
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.default = withDrawableAssets;
