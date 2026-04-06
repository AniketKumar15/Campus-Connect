import express from "express";
import { 
    addPreApprovedUsers, 
    getAllUsersAndPreApproved, 
    createPreApprovedUser, 
    updateUser, 
    deleteUser 
} from "../controllers/PreApprovedUserController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Bulk script (Unprotected/Legacy)
router.post("/add-preapproved-users", addPreApprovedUsers);

// Admin CRUD Routes
router.get("/all", protect, authorizeRoles("admin"), getAllUsersAndPreApproved);
router.post("/add", protect, authorizeRoles("admin"), createPreApprovedUser);
router.put("/update/:id", protect, authorizeRoles("admin"), updateUser);
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
