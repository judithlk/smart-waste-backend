"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const personnelSchema = new mongoose_1.default.Schema({
    personnelId: { type: String, unique: true },
    name: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    location: String
});
exports.default = mongoose_1.default.model('Personnel', personnelSchema);
