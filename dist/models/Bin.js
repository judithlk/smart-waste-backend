"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const binSchema = new mongoose_1.default.Schema({
    binId: { type: String, required: true, unique: true },
    location: {
        lat: Number,
        lon: Number,
        address: String
    },
    placementDate: { type: Date, default: Date.now },
    lastEmptiedAt: { type: Date },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    fillLevel: {
        type: String,
        enum: ['empty', '25%', '50%', '75%', 'full'],
        default: 'empty'
    }
});
exports.default = mongoose_1.default.model('Bin', binSchema);
