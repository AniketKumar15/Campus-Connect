import CampusInsight from "../models/CampusInsight.js";
import Notification from "../models/Notification.js";
import { uploadOnImageKit, deleteOnImageKit, replaceOnImageKit } from "../utils/Imagekit.js";


// ===============================
// CREATE INSIGHT
// ===============================
export const createInsight = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Cover image is required"
            });
        }

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const uploaded = await uploadOnImageKit(req.file);

        if (!uploaded) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }

        const insight = await CampusInsight.create({
            title: title.trim(),
            content,
            author: req.user.id,
            coverImage: uploaded.url,
            isApproved: false // require admin approval
        });

        res.status(201).json({
            success: true,
            message: "Insight created successfully",
            insight
        });

    } catch (error) {
        console.error("Create Insight Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// GET ALL APPROVED INSIGHTS (Public)
// ===============================
export const getAllInsights = async (req, res) => {
    try {
        const insights = await CampusInsight.find({ isApproved: true })
            .populate("author", "name role profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            insights
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// GET ALL INSIGHTS (ADMIN)
// ===============================
export const getAllInsightsAdmin = async (req, res) => {
    try {
        const insights = await CampusInsight.find()
            .populate("author", "name role profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            insights
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getInsightsByAuthor = async (req, res) => {
    try {
        const insights = await CampusInsight.find({ author: req.user.id })
            .populate("author", "name role profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            insights
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ===============================
// GET SINGLE INSIGHT
// ===============================
export const getInsightById = async (req, res) => {
    try {
        const insight = await CampusInsight.findById(req.params.id)
            .populate("author", "name role profileImage");

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: "Insight not found"
            });
        }

        res.status(200).json({
            success: true,
            insight
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// UPDATE INSIGHT
// ===============================
export const updateInsight = async (req, res) => {
    try {
        const { title, content } = req.body;

        let insight = await CampusInsight.findById(req.params.id);

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: "Insight not found"
            });
        }

        // Authorization
        if (insight.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        const updatedData = {};

        if (title) updatedData.title = title;
        if (content) updatedData.content = content;

        // Replace image
        if (req.file) {
            const replaced = await replaceOnImageKit(req.file, insight.coverImage);

            if (!replaced) {
                return res.status(500).json({
                    success: false,
                    message: "Image replace failed"
                });
            }

            updatedData.coverImage = replaced.url;
        }

        // Re-approval required after edit
        updatedData.isApproved = false;

        insight = await CampusInsight.findByIdAndUpdate(
            req.params.id,
            { $set: updatedData },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Insight updated",
            insight
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// DELETE INSIGHT
// ===============================
export const deleteInsight = async (req, res) => {
    try {
        const insight = await CampusInsight.findById(req.params.id);

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: "Insight not found"
            });
        }

        // Authorization
        if (
            insight.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        await deleteOnImageKit(insight.coverImage);
        await insight.deleteOne();

        res.status(200).json({
            success: true,
            message: "Insight deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// LIKE / UNLIKE INSIGHT
// ===============================
export const toggleLikeInsight = async (req, res) => {
    try {
        const insight = await CampusInsight.findById(req.params.id);

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: "Insight not found"
            });
        }

        const userId = req.user.id;

        const alreadyLiked = insight.likes.includes(userId);

        if (alreadyLiked) {
            insight.likes.pull(userId);
        } else {
            insight.likes.push(userId);
        }

        await insight.save();

        res.status(200).json({
            success: true,
            message: alreadyLiked ? "Unliked" : "Liked",
            likesCount: insight.likes.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// APPROVE / REJECT INSIGHT (ADMIN)
// ===============================
export const approveInsight = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access only"
            });
        }

        const { isApproved } = req.body;

        const insight = await CampusInsight.findById(req.params.id);

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: "Insight not found"
            });
        }

        insight.isApproved = isApproved;
        await insight.save();

        await Notification.create({
            user: insight.author,
            type: isApproved ? "insight_approved" : "insight_rejected",
            message: `Your insight "${insight.title}" has been ${isApproved ? "approved" : "rejected"}`
        });

        res.status(200).json({
            success: true,
            message: `Insight ${isApproved ? "approved" : "rejected"} successfully`,
            insight
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};