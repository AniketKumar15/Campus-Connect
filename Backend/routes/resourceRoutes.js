import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
    uploadResource,
    getAllResource,
    getUserResource,
    editResource,
    deleteResource,
    statusUpdateResource,
    getAllResourceAdmin
} from "../controllers/resourceController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllResource);

// AUTHENTICATED
router.post("/", protect, upload.single("file"), uploadResource);
router.get("/me", protect, getUserResource);
router.patch("/:id", protect, upload.single("file"), editResource);
router.delete("/:id", protect, deleteResource);

// ADMIN
router.patch(
    "/:id/status",
    protect,
    authorizeRoles("admin"),
    statusUpdateResource
);
router.get("/all-resources", protect, authorizeRoles("admin"), getAllResourceAdmin);

export default router;
