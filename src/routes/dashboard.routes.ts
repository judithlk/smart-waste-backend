import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller";
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';


const router = express.Router();

router.get("/summary", authenticateJWT, authorizeRoles('admin', 'superadmin'), getDashboardSummary);

export default router;
