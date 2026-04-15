import express from "express";
import { addUserRole, loginUser } from "../controllers/auth-controller";
import { isAuth } from "../middlewares/isAuth";

const router = express.Router();

router.post("/login", loginUser);
router.put("/add-role", isAuth, addUserRole);
export default router;
