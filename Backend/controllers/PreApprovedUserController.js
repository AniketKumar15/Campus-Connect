import PreApprovedUser from "../models/PreApprovedUser.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";

// Add initial batch / dummy pre-approved users
export const addPreApprovedUsers = async (req, res) => {
    try {
        const users = [
            { email: "rahul123@gmail.com", role: "student" },
            { email: "ankit456@gmail.com", role: "student", },
            { email: "sneha789@gmail.com", role: "student" },
            { email: "rohitfaculty@gmail.com", role: "faculty", },
            { email: "priyateacher@gmail.com", role: "faculty" },
            { email: "admincollege@gmail.com", role: "admin" }
        ];

        const insertedUsers = await PreApprovedUser.insertMany(users, { ordered: false });
        res.status(201).json({ success: true, message: "Pre-approved users added successfully", data: insertedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET all users (Registered & Pending)
export const getAllUsersAndPreApproved = async (req, res) => {
    try {
        // 1. Fetch Registered Users
        const registeredUsers = await User.find({}).select("-password").lean();
        
        // 2. Fetch Pending Users (Unregistered ones)
        const pendingUsers = await PreApprovedUser.find({ isRegistered: false }).lean();

        // 3. Format unified array
        const unifiedUsers = [
            ...registeredUsers.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                status: "Registered",
                createdAt: u.createdAt,
                type: "registered"
            })),
            ...pendingUsers.map(u => ({
                id: u._id,
                name: "Pending...",
                email: u.email,
                role: u.role,
                status: "Pending",
                createdAt: u.createdAt,
                type: "pending"
            }))
        ];

        // Sort by creation date
        unifiedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ success: true, data: unifiedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST add a single pre-approved user
export const createPreApprovedUser = async (req, res) => {
    try {
        const { email, role } = req.body;
        
        if (!email || !role) {
            return res.status(400).json({ success: false, message: "Email and role are required." });
        }

        // Check if exists in PreApproved
        const existingPre = await PreApprovedUser.findOne({ email: email.toLowerCase() });
        if (existingPre) {
            return res.status(400).json({ success: false, message: "User already exists in pre-approved list." });
        }

        // Check if exists in Users
        const existingReg = await User.findOne({ email: email.toLowerCase() });
        if (existingReg) {
            return res.status(400).json({ success: false, message: "User is already registered." });
        }

        const newUser = await PreApprovedUser.create({ email, role });
        
        res.status(201).json({ success: true, data: {
            id: newUser._id,
            name: "Pending...",
            email: newUser.email,
            role: newUser.role,
            status: "Pending",
            createdAt: newUser.createdAt,
            type: "pending"
        }});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT update user role or email
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role, type } = req.body;

        if (type === "registered") {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ success: false, message: "User not found." });
            
            if (email) user.email = email.toLowerCase();
            if (role) user.role = role;
            
            await user.save();
            
            // Also optionally update PreApproved user entry if it exists
            const preAppr = await PreApprovedUser.findOne({ email: user.email });
            if (preAppr) {
                if (role) preAppr.role = role;
                await preAppr.save();
            }

        } else if (type === "pending") {
            const preAppr = await PreApprovedUser.findById(id);
            if (!preAppr) return res.status(404).json({ success: false, message: "User not found." });
            
            if (email) preAppr.email = email.toLowerCase();
            if (role) preAppr.role = role;
            
            await preAppr.save();
        } else {
            return res.status(400).json({ success: false, message: "Invalid user type." });
        }

        res.status(200).json({ success: true, message: "User updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        if (type === "registered") {
            const user = await User.findById(id);
            if(!user) return res.status(404).json({ success: false, message: "User not found." });

            // Delete specific role document
            if (user.role === "student") await Student.findOneAndDelete({ user: id });
            if (user.role === "faculty") await Faculty.findOneAndDelete({ user: id });
            if (user.role === "admin") await Admin.findOneAndDelete({ user: id });

            // Delete Pre-approved instance if it still exists
            await PreApprovedUser.findOneAndDelete({ email: user.email });
            
            // Delete actual user
            await User.findByIdAndDelete(id);

        } else if (type === "pending") {
            const preAppr = await PreApprovedUser.findByIdAndDelete(id);
            if(!preAppr) return res.status(404).json({ success: false, message: "User not found." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid user type." });
        }

        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
