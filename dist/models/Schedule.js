"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const scheduleSchema = new mongoose_1.default.Schema({
    binId: { type: String, required: true },
    location: {
        lat: Number,
        lon: Number,
        address: String
    },
    personnelId: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});
exports.default = mongoose_1.default.model('Schedule', scheduleSchema);
