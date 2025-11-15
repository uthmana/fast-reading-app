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
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
var prisma = new PrismaClient();
export var authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            authorize: function (credentials) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function () {
                    var name, password, user, isValid, error_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                name = credentials.name, password = credentials.password;
                                if (!name || !password)
                                    return [2 /*return*/, null];
                                _c.label = 1;
                            case 1:
                                _c.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, prisma.user.findUnique({
                                        where: { name: credentials.name },
                                        include: {
                                            Student: true,
                                        },
                                    })];
                            case 2:
                                user = _c.sent();
                                if (!user)
                                    return [2 /*return*/, null];
                                return [4 /*yield*/, bcrypt.compare(credentials.password, user.password)];
                            case 3:
                                isValid = _c.sent();
                                if (!isValid)
                                    return [2 /*return*/, null];
                                return [2 /*return*/, {
                                        id: user.id,
                                        email: user.email,
                                        role: user.role,
                                        name: (_a = user.name) !== null && _a !== void 0 ? _a : "",
                                        student: (_b = user.Student) !== null && _b !== void 0 ? _b : null,
                                    }];
                            case 4:
                                error_1 = _c.sent();
                                console.error(error_1);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            },
        }),
    ],
    pages: {
        signIn: "/login",
        signOut: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: function (_a) {
            var _b;
            var token = _a.token, user = _a.user;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_c) {
                    if (user) {
                        token.role = user.role;
                        token.email = user.email;
                        token.name = user.name;
                        token.id = user.id;
                        token.student = (_b = user.student) !== null && _b !== void 0 ? _b : null;
                    }
                    return [2 /*return*/, token];
                });
            });
        },
        session: function (_a) {
            var _b;
            var session = _a.session, token = _a.token;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_c) {
                    if (session.user) {
                        session.user.role = token.role;
                        session.user.email = token.email;
                        session.user.name = token.name;
                        session.user.id = token.id;
                        session.user.student = (_b = token.student) !== null && _b !== void 0 ? _b : null;
                    }
                    return [2 /*return*/, session];
                });
            });
        },
        redirect: function (_a) {
            var url = _a.url, baseUrl = _a.baseUrl;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (url.startsWith("/"))
                        return [2 /*return*/, "".concat(baseUrl).concat(url)];
                    if (new URL(url).origin === baseUrl)
                        return [2 /*return*/, url];
                    return [2 /*return*/, baseUrl];
                });
            });
        },
    },
};
