"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historySchema = new mongoose_1.default.Schema({
    binId: { type: String, required: true },
    location: {
        lat: Number,
        lon: Number,
        address: String
    },
    personnelId: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ['completed', 'cancelled'], required: true }
});
exports.default = mongoose_1.default.model('History', historySchema);
