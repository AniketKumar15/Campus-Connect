import express from "express";
import { addPreApprovedUsers } from "../controllers/PreApprovedUserController.js";

const router = express.Router();

router.post("/add-preapproved-users", addPreApprovedUsers);

export default router;
