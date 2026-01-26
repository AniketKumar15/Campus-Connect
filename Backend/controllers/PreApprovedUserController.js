import PreApprovedUser from "../models/PreApprovedUser.js";

export const addPreApprovedUsers = async (req, res) => {
    try {
        const users = [
            {
                email: "rahul123@gmail.com",
                role: "student"
            },
            {
                email: "ankit456@gmail.com",
                role: "student",
            },
            {
                email: "sneha789@gmail.com",
                role: "student"
            },
            {
                email: "rohitfaculty@gmail.com",
                role: "faculty",
            },
            {
                email: "priyateacher@gmail.com",
                role: "faculty"
            },
            {
                email: "admincollege@gmail.com",
                role: "admin"
            }
        ];

        const insertedUsers = await PreApprovedUser.insertMany(users, {
            ordered: false
        });

        res.status(201).json({
            success: true,
            message: "Pre-approved users added successfully",
            data: insertedUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
