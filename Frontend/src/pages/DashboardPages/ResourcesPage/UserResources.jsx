import { useContext, useEffect, useState } from "react";
import {
    FiDownload,
    FiFileText,
    FiImage,
    FiFile,
    FiBarChart2,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiX,
    FiUploadCloud
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ResourceContext from "../../../contexts/ResourceContext/ResourceContext";
import AuthContext from "../../../contexts/AuthContext/AuthContext";

/* ================= CONSTANTS ================= */
const EMPTY_FORM = {
    title: "",
    description: "",
    course: "",
    semester: "",
    category: "",
    file: null
};

/* ================= HELPERS ================= */
const getFileType = (url) => {
    if (!url) return "file";
    if (url.endsWith(".pdf")) return "pdf";
    if (url.match(/\.(ppt|pptx)$/)) return "ppt";
    if (url.match(/\.(jpg|jpeg|png)$/)) return "image";
    return "file";
};

const FileIcon = ({ type }) => {
    const IconMap = {
        pdf: FiFileText,
        ppt: FiBarChart2,
        image: FiImage,
        file: FiFile
    };
    const ColorMap = {
        pdf: "text-red-500",
        ppt: "text-orange-500",
        image: "text-green-500",
        file: "text-slate-500"
    };

    const MapBg = {
        pdf: "bg-red-100 border-red-300",
        ppt: "bg-orange-100 border-orange-300",
        image: "bg-green-100 border-green-300",
        file: "bg-slate-200 border-slate-300"
    };

    const Icon = IconMap[type];
    return (
        <div className={`p-2 rounded-xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_3px_5px_rgba(0,0,0,0.1)] border ${MapBg[type]}`}>
            <Icon className={`text-2xl ${ColorMap[type]}`} />
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        pending: "bg-yellow-200 text-yellow-800 border-yellow-300",
        approved: "bg-green-200 text-green-800 border-green-300",
        rejected: "bg-red-200 text-red-800 border-red-300"
    };
    return (
        <span className={`px-2.5 py-1 rounded shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.1)] border text-[10px] uppercase font-extrabold tracking-wide ${map[status]}`}>
            {status}
        </span>
    );
};

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
            className="w-full max-w-xl mt-45 rounded-3xl bg-slate-200 border-t border-l border-white shadow-[10px_15px_30px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.8)] overflow-hidden font-sans"
        >
            <div className="flex items-center justify-between px-8 py-5 border-b-[3px] border-slate-300/50 bg-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <h2 className="text-xl font-extrabold text-slate-800 drop-shadow-sm">
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-slate-600 hover:text-slate-800 hover:bg-slate-300 transition-all font-bold"
                >
                    <FiX />
                </button>
            </div>

            <div className="px-8 py-6">{children}</div>
        </motion.div>
    </motion.div>
);

const FileUpload = ({ file, onChange }) => (
    <label className="cursor-pointer block">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-400 bg-slate-100 px-4 py-8 text-center hover:bg-slate-200 transition-colors shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),0_1px_1px_rgba(255,255,255,0.8)]">
            <div className="p-4 bg-slate-200 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),2px_3px_6px_rgba(0,0,0,0.1)]">
                <FiUploadCloud className="text-blue-500 text-3xl" />
            </div>

            {!file ? (
                <>
                    <p className="text-sm font-extrabold text-slate-700">
                        Drop your file here or click to browse
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                        PDF, PPT, Image or Document (max 10MB)
                    </p>
                </>
            ) : (
                <>
                    <p className="text-sm font-extrabold text-blue-700">
                        {file.name}
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </>
            )}
        </div>

        <input type="file" name="file" className="hidden" onChange={onChange} />
    </label>
);

/* ================= FORM ================= */
const inputBase =
    "w-full rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-bold transition-all";

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">
            {label}
        </label>
        {children}
    </div>
);

const ResourceForm = ({ form, onChange, onSubmit, onClose }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <Field label="Title">
            <input
                name="title"
                value={form.title}
                onChange={onChange}
                className={inputBase}
                placeholder="Eg. Operating System Notes"
                required
            />
        </Field>

        <Field label="Description">
            <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                className={inputBase}
                placeholder="Short description about the resource"
            />
        </Field>

        <div className="grid grid-cols-2 gap-5">
            <Field label="Course">
                <select
                    name="course"
                    value={form.course}
                    onChange={onChange}
                    className={inputBase}
                    required
                >
                    <option value="">Select course</option>
                    <option>BCA</option>
                    <option>MCA</option>
                    <option>BBA</option>
                    <option>MBA</option>
                </select>
            </Field>

            <Field label="Semester">
                <select
                    name="semester"
                    value={form.semester}
                    onChange={onChange}
                    className={inputBase}
                    required
                >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </Field>
        </div>

        <Field label="Category">
            <select
                name="category"
                value={form.category}
                onChange={onChange}
                className={inputBase}
                required
            >
                <option value="">Select category</option>
                <option>notes</option>
                <option>pyq</option>
                <option>reference</option>
            </select>
        </Field>

        {/* FILE UPLOAD */}
        <Field label="Upload File">
            <FileUpload file={form.file} onChange={onChange} />
        </Field>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 pt-4 border-t-2 border-slate-300">
            <button type="button" onClick={onClose}
                className="px-5 py-3 rounded-xl bg-slate-300 shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.7)] border-b-[3px] border-slate-400 text-slate-700 font-extrabold active:border-b-0 active:translate-y-[3px] transition-all"
            >
                Cancel
            </button>
            <button type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-extrabold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px] transition-all"
            >
                Save Resource
            </button>
        </div>
    </form>
);

/* ================= MAIN ================= */
export default function UserResources() {
    const { getUserResource, deleteResource, uploadResource, editResource } =
        useContext(ResourceContext);
    const { token } = useContext(AuthContext);

    const [resources, setResources] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        course: "",
        semester: "",
        category: "",
        file: null
    });

    useEffect(() => {
        load();
    }, []);


    const load = async () => {
        const res = await getUserResource(token);
        setResources(res || []);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
    };

    const openEdit = (r) => {
        setEditing(r);
        setForm({
            title: r.title,
            description: r.description,
            course: r.course,
            semester: r.semester,
            category: r.category,
            file: null
        });
        setShowEdit(true);
    };

    const submitAdd = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        if (await uploadResource(fd, token)) {
            setShowAdd(false);
            load();
        }
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        if (await editResource(editing._id, fd, token)) {
            setShowEdit(false);
            load();
        }
    };

    const openAddModal = () => {
        setForm(EMPTY_FORM); // RESET
        setShowAdd(true);
    };

    return (
        <div className="px-6 md:px-10 pt-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm">Your Resources</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1">Manage all your uploaded study material efficiently</p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-extrabold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px] transition-all shrink-0"
                >
                    <FiPlus className="text-lg" /> Upload
                </button>
            </div>

            <div className="bg-slate-200 shadow-[inset_3px_5px_10px_rgba(0,0,0,0.15),0_2px_0_rgba(255,255,255,0.8)] border border-slate-400 overflow-hidden rounded-2xl divide-y-2 divide-slate-300">
                {resources.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 font-extrabold">No resources found. Upload one to get started!</div>
                ) : (
                    resources.map((r) => (
                        <div key={r._id} className="flex flex-col lg:flex-row lg:items-center justify-between px-6 py-5 bg-slate-100 hover:bg-slate-200 transition-colors">
                            <div className="flex gap-5 items-center mb-4 lg:mb-0">
                                <FileIcon type={getFileType(r.fileUrl)} />
                                <div>
                                    <h3 className="text-slate-800 font-extrabold drop-shadow-sm text-lg leading-tight">{r.title}</h3>
                                    <div className="flex flex-wrap gap-2 text-[11px] font-extrabold text-slate-600 mt-2 uppercase font-mono tracking-tight">
                                        <span className="px-2 py-0.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] border border-white/40">{r.course}</span>
                                        <span className="px-2 py-0.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] border border-white/40">Sem {r.semester}</span>
                                        <span className="px-2 py-0.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] border border-white/40">{r.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-bold">
                                <StatusBadge status={r.status} />

                                <a href={r.fileUrl} target="_blank" className="p-2 rounded-lg bg-blue-100 text-blue-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),0_2px_3px_rgba(0,0,0,0.1)] border border-blue-300 hover:bg-blue-200 active:translate-y-[2px] transition-all">
                                    View
                                </a>
                                <a href={r.fileUrl} download className="p-2 rounded-lg bg-green-100 text-green-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),0_2px_3px_rgba(0,0,0,0.1)] border border-green-300 hover:bg-green-200 active:translate-y-[2px] transition-all">
                                    <FiDownload />
                                </a>
                                <button onClick={() => openEdit(r)} className="p-2 rounded-lg bg-yellow-100 text-yellow-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),0_2px_3px_rgba(0,0,0,0.1)] border border-yellow-300 hover:bg-yellow-200 active:translate-y-[2px] transition-all">
                                    <FiEdit />
                                </button>
                                <button
                                    onClick={() => deleteResource(r._id, token).then(load)}
                                    className="p-2 rounded-lg bg-red-100 text-red-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),0_2px_3px_rgba(0,0,0,0.1)] border border-red-300 hover:bg-red-200 active:translate-y-[2px] transition-all"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showAdd && (
                    <Modal title="Upload Resource" onClose={() => setShowAdd(false)}>
                        <ResourceForm
                            form={form}
                            onChange={handleChange}
                            onSubmit={submitAdd}
                            onClose={() => setShowAdd(false)}
                        />
                    </Modal>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showEdit && (
                    <Modal title="Edit Resource" onClose={() => setShowEdit(false)}>
                        <ResourceForm
                            form={form}
                            onChange={handleChange}
                            onSubmit={submitEdit}
                            onClose={() => setShowEdit(false)}
                        />
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
