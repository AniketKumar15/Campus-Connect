import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

import AuthContext from "../../contexts/AuthContext/AuthContext";
import AdminUserContext from "../../contexts/AdminUserContext/AdminUserContext";

/* ================= MODAL ================= */
const Modal = ({ title, onClose, children }) => (
    <motion.div
        className="fixed overflow-auto inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full mt-[10vh] mb-[10vh] max-w-lg rounded-3xl bg-slate-200 border-t border-l border-white shadow-[15px_25px_40px_rgba(0,0,0,0.15),inset_-4px_-4px_10px_rgba(0,0,0,0.05),inset_4px_4px_15px_rgba(255,255,255,0.7)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <h2 className="text-xl font-bold text-slate-800 drop-shadow-sm">{title}</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.1)] active:shadow-inner transition-all cursor-pointer"
                >
                    <FiX size={20} />
                </button>
            </div>
            <div className="p-8">{children}</div>
        </motion.div>
    </motion.div>
);

const AllUsers = () => {
    const { token } = useContext(AuthContext);

    const {
        users,
        loading,
        fetchUsers,
        addUser,
        editUser,
        deleteUser
    } = useContext(AdminUserContext);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "",
        user: null
    });

    const [formData, setFormData] = useState({
        email: "",
        role: "student"
    });

    /* ================= FETCH ================= */
    useEffect(() => {
        if (token) fetchUsers(token);
    }, [token]);

    /* ================= MODAL ================= */
    const handleOpenModal = (type, user = null) => {
        setModalConfig({ isOpen: true, type, user });

        if (user) {
            setFormData({
                email: user.email,
                role: user.role
            });
        } else {
            setFormData({ email: "", role: "student" });
        }
    };

    const handleCloseModal = () => {
        setModalConfig({ isOpen: false, type: "", user: null });
        setFormData({ email: "", role: "student" });
    };

    /* ================= SAVE ================= */
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (modalConfig.type === "add") {
                await addUser(token, formData);
            } else if (modalConfig.type === "edit") {
                await editUser(token, modalConfig.user.id, {
                    ...formData,
                    type: modalConfig.user.type
                });
            }

            fetchUsers(token);
            handleCloseModal();
        } catch (error) {
            alert(error.message || "Operation failed.");
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async () => {
        try {
            await deleteUser(
                token,
                modalConfig.user.id,
                modalConfig.user.type
            );

            fetchUsers(token);
            handleCloseModal();
        } catch (error) {
            alert(error.message || "Delete failed.");
        }
    };

    return (
        <div className="pb-16 pt-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm">
                            User Management
                        </h1>
                        <p className="mt-2 text-slate-600 font-medium">
                            Manage students, faculty, and academic roles efficiently.
                        </p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenModal("add")}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-3 text-white font-bold shadow-[0_8px_15px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                    >
                        <FiPlus size={20} /> Add User
                    </motion.button>
                </div>

                {/* Tactile Table Card Wrapper */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] p-6 overflow-hidden"
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-slate-600 font-medium animate-pulse text-lg">Loading users...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b-2 border-slate-300">
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Name</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Email</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Role</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Status</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-8 font-medium text-slate-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b border-slate-300/50 hover:bg-slate-300/30 transition-colors">
                                                <td className="p-4 font-medium text-slate-800">{user.name == "Pending..." ? "Not Registered" : user.name}</td>
                                                <td className="p-4 text-slate-600">{user.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                        user.role === 'faculty' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                            'bg-slate-100 text-slate-700 border border-slate-200'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${(user.status && user.status.toLowerCase() === 'active') || user.status == "Registered" ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
                                                        }`}>
                                                        {user.status || 'Active'}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleOpenModal("edit", user)}
                                                            className="p-2.5 rounded-xl bg-slate-100 text-blue-600 shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-slate-300 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer hover:bg-white"
                                                            title="Edit User"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </motion.button>

                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleOpenModal("delete", user)}
                                                            className="p-2.5 rounded-xl bg-slate-100 text-red-600 shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-red-200 active:border-b-0 active:translate-y-0.5 transition-all hover:bg-red-50 cursor-pointer"
                                                            title="Delete User"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ================= MODALS ================= */}
            <AnimatePresence>
                {/* ADD / EDIT */}
                {modalConfig.isOpen &&
                    (modalConfig.type === "add" || modalConfig.type === "edit") && (
                        <Modal
                            title={modalConfig.type === "add" ? "Add New User" : "Edit User"}
                            onClose={handleCloseModal}
                        >
                            <form onSubmit={handleSave} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter user email..."
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-slate-100 border text-slate-800 border-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-slate-100 border text-slate-800 border-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full mt-4 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-4 text-white text-lg font-bold shadow-[0_8px_15px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                                >
                                    {modalConfig.type === "add" ? "Create User" : "Save Changes"}
                                </motion.button>
                            </form>
                        </Modal>
                    )}

                {/* DELETE */}
                {modalConfig.isOpen && modalConfig.type === "delete" && (
                    <Modal title="Delete User" onClose={handleCloseModal}>
                        <p className="text-slate-600 font-medium text-lg text-center mb-8">
                            Are you sure you want to delete account <br />
                            <span className="font-bold text-slate-800 tracking-wide bg-slate-100 px-3 py-1 rounded inline-block mt-2 shadow-inner border border-slate-300">{modalConfig.user?.email}</span> ?<br />
                            <span className="text-sm text-red-500 mt-3 inline-block">This action cannot be undone.</span>
                        </p>

                        <div className="flex gap-4">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCloseModal}
                                className="flex-1 rounded-xl bg-gradient-to-b from-slate-100 to-slate-300 px-6 py-3 text-slate-700 font-bold shadow-[0_5px_10px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-4 border-slate-400 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDelete}
                                className="flex-1 rounded-xl bg-gradient-to-b from-red-500 to-red-700 px-6 py-3 text-white font-bold shadow-[0_8px_15px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer hover:from-red-600 hover:to-red-800"
                            >
                                Confirm Delete
                            </motion.button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllUsers;