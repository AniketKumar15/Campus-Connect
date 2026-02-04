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
    FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ResourceContext from "../../contexts/ResourceContext/ResourceContext";
import AuthContext from "../../contexts/AuthContext/AuthContext";

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
        pdf: "text-red-400",
        ppt: "text-orange-400",
        image: "text-green-400",
        file: "text-slate-400"
    };

    const Icon = IconMap[type];
    return <Icon className={`text-xl ${ColorMap[type]}`} />;
};

const StatusBadge = ({ status }) => {
    const map = {
        pending: "bg-yellow-500/10 text-yellow-400",
        approved: "bg-green-500/10 text-green-400",
        rejected: "bg-red-500/10 text-red-400"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>
            {status}
        </span>
    );
};

/* ================= MODAL ================= */
const Modal = ({ title, onClose, children }) => (
    <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-white/10
        shadow-2xl"
        >
            <div className="flex items-center justify-between px-6 py-4
        border-b border-slate-200 dark:border-white/10">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                    ✕
                </button>
            </div>

            <div className="px-6 py-5">{children}</div>
        </motion.div>
    </motion.div>
);
const FileUpload = ({ file, onChange }) => (
    <label className="cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl
      border border-dashed border-slate-300 dark:border-white/20
      bg-slate-100 dark:bg-white/5
      px-4 py-6 text-center
      hover:bg-slate-200 dark:hover:bg-white/10 transition">
            <div className="text-cyan-500 dark:text-cyan-400 text-2xl">📄</div>

            {!file ? (
                <>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                        Drag & drop your file here
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        PDF, PPT, Image or Document
                    </p>
                </>
            ) : (
                <>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
    "w-full rounded-lg px-3 py-2 text-sm outline-none " +
    "bg-slate-100 dark:bg-slate-800 " +
    "border border-slate-300 dark:border-white/10 " +
    "text-slate-800 dark:text-white " +
    "focus:ring-2 focus:ring-cyan-500";

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {label}
        </label>
        {children}
    </div>
);


const ResourceForm = ({ form, onChange, onSubmit, onClose }) => (
    <form onSubmit={onSubmit} className="space-y-5">
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

        <div className="grid grid-cols-2 gap-4">
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
        <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 dark:border-white/10">
            <button type="button" onClick={onClose}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Cancel
            </button>
            <button type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium">
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
        <div className="px-8 pt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Resources</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your uploaded study material</p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md"
                >
                    <FiPlus /> Upload Resource
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl divide-y divide-white/10">
                {resources.map((r) => (
                    <div key={r._id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5">
                        <div className="flex items-center gap-4">
                            <FileIcon type={getFileType(r.fileUrl)} />
                            <div>
                                <p className="text-slate-800 dark:text-white font-medium">{r.title}</p>
                                <p className="text-xs text-slate-800 dark:text-white">
                                    {r.course} • Sem {r.semester} • {r.category}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <StatusBadge status={r.status} />
                            <a href={r.fileUrl} target="_blank" className="text-cyan-400">View</a>
                            <a href={r.fileUrl} download className="text-indigo-400 flex items-center gap-1">
                                <FiDownload /> Download
                            </a>
                            <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-cyan-400">
                                <FiEdit />
                            </button>
                            <button
                                onClick={() => deleteResource(r._id, token).then(load)}
                                className="text-slate-400 hover:text-red-400"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
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
