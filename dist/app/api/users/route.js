var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { extractPrismaErrorMessage } from "@/utils/helpers";
var prisma = new PrismaClient();
export function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, name_1, user, users, e_1, _a, userMessage, technicalMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    searchParams = new URL(req.url).searchParams;
                    name_1 = searchParams.get("name");
                    if (!name_1) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { name: name_1 },
                            include: {
                                Student: {
                                    include: {
                                        attempts: true,
                                    },
                                },
                            },
                        })];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        return [2 /*return*/, NextResponse.json({ error: "User not found" }, { status: 404 })];
                    }
                    return [2 /*return*/, NextResponse.json(user, { status: 200 })];
                case 2: return [4 /*yield*/, prisma.user.findMany({
                        orderBy: { createdAt: "desc" },
                    })];
                case 3:
                    users = _b.sent();
                    return [2 /*return*/, NextResponse.json(users, { status: 200 })];
                case 4:
                    e_1 = _b.sent();
                    console.error("Prisma Error:", e_1);
                    _a = extractPrismaErrorMessage(e_1), userMessage = _a.userMessage, technicalMessage = _a.technicalMessage;
                    return [2 /*return*/, NextResponse.json({
                            error: userMessage,
                            details: technicalMessage,
                        }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, name, email, password, role, active, startDate, endDate, userExit, pwd, _b, user_1, hashedPassword, user, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, req.json()];
                case 1:
                    _a = _c.sent(), id = _a.id, name = _a.name, email = _a.email, password = _a.password, role = _a.role, active = _a.active, startDate = _a.startDate, endDate = _a.endDate;
                    if (!name || !password || !role) {
                        return [2 /*return*/, NextResponse.json({ error: "Missing fields" }, { status: 400 })];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 11, , 12]);
                    if (!id) return [3 /*break*/, 8];
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { id: id },
                        })];
                case 3:
                    userExit = _c.sent();
                    if (!userExit) return [3 /*break*/, 8];
                    if (!(userExit.password !== password)) return [3 /*break*/, 5];
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = userExit.password;
                    _c.label = 6;
                case 6:
                    pwd = _b;
                    return [4 /*yield*/, prisma.user.update({
                            where: { id: id },
                            data: __assign({ name: name, email: email, password: pwd, role: role, active: active }, (role === "STUDENT"
                                ? {
                                    Student: {
                                        create: {
                                            startDate: startDate,
                                            endDate: endDate,
                                        },
                                    },
                                }
                                : {})),
                        })];
                case 7:
                    user_1 = _c.sent();
                    return [2 /*return*/, NextResponse.json(user_1, { status: 200 })];
                case 8: return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 9:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: __assign({ name: name, email: email, password: hashedPassword, role: role }, (role === "STUDENT"
                                ? {
                                    Student: {
                                        create: {
                                            startDate: startDate,
                                            endDate: endDate,
                                        },
                                    },
                                }
                                : {})),
                        })];
                case 10:
                    user = _c.sent();
                    return [2 /*return*/, NextResponse.json(user, { status: 201 })];
                case 11:
                    err_1 = _c.sent();
                    console.log(err_1);
                    return [2 /*return*/, NextResponse.json({ error: "User already exists" }, { status: 400 })];
                case 12: return [2 /*return*/];
            }
        });
    });
}
export function DELETE(req) {
    return __awaiter(this, void 0, void 0, function () {
        var id, userExit, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, req.json()];
                case 1:
                    id = (_a.sent()).id;
                    if (!id) {
                        return [2 /*return*/, NextResponse.json({ error: "Missing fields" }, { status: 400 })];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    if (!id) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.user.delete({
                            where: { id: id },
                        })];
                case 3:
                    userExit = _a.sent();
                    return [2 /*return*/, NextResponse.json({}, { status: 201 })];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [2 /*return*/, NextResponse.json({ error: "User already exists" }, { status: 400 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
