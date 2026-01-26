import express from "express";
import { body } from "express-validator";
import { signup, login, getUserDetails } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/signup",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email required"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 6 characters")
    ],
    signup
);

router.post("/login", login);
router.get("/me", protect, getUserDetails);

export default router;
