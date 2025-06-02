"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // make sure path is correct
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
// Correct way: use router under a path
app.use('/api/auth', auth_routes_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/smartbin')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
