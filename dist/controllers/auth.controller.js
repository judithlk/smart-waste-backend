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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your_secret_key"; // Replace with env var in production
// 👇 Add this: Promise<Response> as return type
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const existing = yield Admin_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Admin already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newAdmin = new Admin_1.default({
            username,
            email,
            password: hashedPassword,
            role,
        });
        yield newAdmin.save();
        return res.status(201).json({ message: "Admin registered successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Registration failed", error: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield Admin_1.default.findOne({ email }).exec();
        if (!admin || !admin.password) {
            return res
                .status(404)
                .json({ message: "Admin not found or password missing" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role,
                email: admin.email,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Login failed", error: err });
    }
});
exports.login = login;
