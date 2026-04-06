import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiBook, FiHash, FiBriefcase, FiLayers, FiUsers } from "react-icons/fi";
import { toast } from "../../Toaster/toast";
import AuthContext from "../../contexts/AuthContext/AuthContext";

const inputStyles =
    "w-full bg-slate-200 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] rounded-xl outline-none border border-transparent focus:border-blue-400 p-3 pl-11 text-slate-700 font-medium transition-all";

const labelStyles = "block text-sm font-bold text-slate-600 mb-2 ml-1";

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: "",
        profileImage: "",
        rollNo: "",
        course: "",
        section: "",
        department: "",
        designation: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                rollNo: user.rollNo || "",
                course: user.course || "",
                section: user.section || "",
                department: user.department || "",
                designation: user.designation || "",
            });
            setPreview(user.profileImage || "https://ik.imagekit.io/aniketmedia/campusconnect/images/avatar1");
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const _file = e.target.files[0];
        if (_file) {
            setFile(_file);
            setPreview(URL.createObjectURL(_file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        if (formData.name) formDataObj.append("name", formData.name);
        if (file) formDataObj.append("file", file);

        if (user?.role === "student") {
            if (formData.rollNo) formDataObj.append("rollNo", formData.rollNo);
            if (formData.course) formDataObj.append("course", formData.course);
            if (formData.section) formDataObj.append("section", formData.section);
        } else if (user?.role === "faculty") {
            if (formData.department) formDataObj.append("department", formData.department);
            if (formData.designation) formDataObj.append("designation", formData.designation);
        }

        await updateProfile(formDataObj);
        setLoading(false);
    };

    if (!user) return <div className="p-8 text-slate-600">Loading...</div>;

    return (
        <div className="relative min-h-[calc(100vh-6rem)] bg-[#eef2f6] p-6 lg:p-12 overflow-hidden z-0">
            {/* Ambient Backgrounds */}
            <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-[80px] pointer-events-none" />

            <div className="relative mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-slate-200 border-t border-l border-white/80 p-8 md:p-12 shadow-[15px_25px_40px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_rgba(0,0,0,0.05),inset_4px_4px_15px_rgba(255,255,255,0.7)]"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm">
                            Your Profile
                        </h1>
                        <p className="mt-2 text-slate-600 font-medium">
                            Manage your personal and academic details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center mb-8 bg-slate-100 rounded-2xl p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-300/50">
                            <div className="h-24 w-24 rounded-full overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.15)] border-4 border-slate-200 flex-shrink-0">
                                <img
                                    src={preview || "https://ik.imagekit.io/aniketmedia/campusconnect/images/avatar1"}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1 w-full relative flex flex-col justify-center">
                                <label className={labelStyles}>Profile Image</label>
                                <label
                                    htmlFor="profileImageInput"
                                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-b from-slate-200 to-slate-300 text-slate-700 font-bold shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.7)] border-b-[3px] border-slate-400 hover:text-slate-900 active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer rounded-xl max-w-xs"
                                >
                                    <FiUser className="text-xl" />
                                    <span>Upload New Photo</span>
                                </label>
                                <input
                                    id="profileImageInput"
                                    type="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {file && (
                                    <p className="text-xs text-blue-700 font-bold mt-2 px-1 break-all">
                                        📎 {file.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* General Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-700 border-b-2 border-slate-300 pb-2 inline-block">
                                    General Information
                                </h3>

                                <div>
                                    <label className={labelStyles}>Full Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputStyles}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyles}>Email Address (Read-only)</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className={`${inputStyles} opacity-60 cursor-not-allowed`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyles}>Role</label>
                                    <div className="relative">
                                        <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            disabled
                                            className={`${inputStyles} opacity-60 cursor-not-allowed font-bold text-blue-600`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Specific Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-700 border-b-2 border-slate-300 pb-2 inline-block">
                                    Academic Information
                                </h3>

                                {user.role === "student" && (
                                    <>
                                        <div>
                                            <label className={labelStyles}>Roll Number</label>
                                            <div className="relative">
                                                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="rollNo"
                                                    value={formData.rollNo}
                                                    onChange={handleChange}
                                                    className={inputStyles}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Course / Major</label>
                                            <div className="relative">
                                                <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="course"
                                                    value={formData.course}
                                                    onChange={handleChange}
                                                    className={inputStyles}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Section</label>
                                            <div className="relative">
                                                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="section"
                                                    value={formData.section}
                                                    onChange={handleChange}
                                                    className={inputStyles}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {user.role === "faculty" && (
                                    <>
                                        <div>
                                            <label className={labelStyles}>Department</label>
                                            <div className="relative">
                                                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    className={inputStyles}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Designation</label>
                                            <div className="relative">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="designation"
                                                    value={formData.designation}
                                                    onChange={handleChange}
                                                    className={inputStyles}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {user.role === "admin" && (
                                    <p className="p-4 bg-slate-300/30 rounded-xl text-slate-600 font-medium shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] border border-slate-300/40 mt-1">
                                        You are an administrator. You do not have secondary demographic fields.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end pb-4">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                disabled={loading}
                                type="submit"
                                className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-10 py-3.5 text-white font-bold shadow-[0_8px_15px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
