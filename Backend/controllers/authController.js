import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/User.js";
import PreApprovedUser from "../models/PreApprovedUser.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";

/**
 * SIGNUP
 */
export const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // 1. Check pre-approval
        const preApproved = await PreApprovedUser.findOne({ email });
        if (!preApproved) {
            return res.status(403).json({
                message: "You are not pre-approved to register"
            });
        }

        if (preApproved.isRegistered) {
            return res.status(400).json({
                message: "User already registered"
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use"
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: preApproved.role,
            profileImage:
                "https://ik.imagekit.io/aniketmedia/campusconnect/images/avatar1"
        });

        // 5. Create role-specific document
        if (user.role === "student") {
            await Student.create({
                user: user._id,
                rollNo: `ROLL-${Date.now()}`, // temporary, update later
                course: "Not Assigned"
            });
        }

        if (user.role === "faculty") {
            await Faculty.create({
                user: user._id,
                department: "Not Assigned"
            });
        }

        if (user.role === "admin") {
            await Admin.create({
                user: user._id
            });
        }

        // 6. Mark pre-approved user as registered
        preApproved.isRegistered = true;
        await preApproved.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                course: user?.course,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Details
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let roleData = null;
        if (user.role === "student") {
            roleData = await Student.findOne({ user: userId });
        } else if (user.role === "faculty") {
            roleData = await Faculty.findOne({ user: userId });
        } else if (user.role === "admin") {
            roleData = await Admin.findOne({ user: userId });
        }

        const mergedUser = {
            ...user.toObject(),
            ...((roleData && roleData.toObject) ? roleData.toObject() : roleData)
        };

        if (mergedUser.user) delete mergedUser.user;

        res.status(200).json({
            success: true,
            user: mergedUser
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}