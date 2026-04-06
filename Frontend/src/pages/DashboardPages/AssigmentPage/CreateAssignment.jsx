import { useContext, useState } from "react";
import { FaImage } from "react-icons/fa";
import RichTextEditor from "../../../components/RichTextEditor";
import AssignmentContext from "../../../contexts/AssignmentContext/AssignmentContext";
import { toast } from "../../../Toaster/toast";

const CreateAssignment = () => {
    const { createAssignment } = useContext(AssignmentContext);

    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !subject || !course || !semester || !deadline) {
            return toast.error("Please fill all required fields");
        }

        if (!description && !file) {
            return toast.error("Provide description or upload a file");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subject", subject);
        formData.append("course", course);
        formData.append("semester", semester);
        formData.append("deadline", deadline);

        if (description) formData.append("description", description);
        if (file) formData.append("file", file);

        setLoading(true);
        const result = await createAssignment(formData, token);
        setLoading(false);

        if (result) {
            setTitle("");
            setSubject("");
            setCourse("");
            setSemester("");
            setDeadline("");
            setDescription("");
            setFile(null);
        }
    };

    const inputBase = "w-full rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-bold transition-all";

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 font-sans">
            <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm mb-8">
                Create Assignment
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-slate-200/80 shadow-[inset_3px_5px_10px_rgba(0,0,0,0.15),0_2px_0_rgba(255,255,255,0.8)] border border-slate-400 p-8 rounded-3xl"
            >
                {/* Title */}
                <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Assignment Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Eg. Database Systems Project"
                        className={`${inputBase} text-xl`}
                    />
                </div>

                {/* Subject + Course */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Subject</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Eg. DBMS"
                            className={inputBase}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Course</label>
                        <select
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className={inputBase}
                        >
                            <option value="">Select Course</option>
                            <option>BCA</option>
                            <option>MCA</option>
                            <option>BBA</option>
                            <option>MBA</option>
                        </select>
                    </div>
                </div>

                {/* Semester + Deadline */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Semester</label>
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className={inputBase}
                        >
                            <option value="">Select</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={inputBase}
                        />
                    </div>
                    
                    {/* File Upload */}
                    <div className="flex flex-col items-start justify-end">
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Attachment (Optional)</label>
                        <label
                            htmlFor="fileInput"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 font-bold shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.9)] border-b-[3px] border-slate-300 hover:text-slate-900 active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer rounded-xl w-full"
                        >
                            <FaImage className="text-xl" />
                            <span>Upload File</span>
                        </label>

                        <input
                            id="fileInput"
                            name="fileInput"
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />

                        {/* File name preview */}
                        {file && (
                            <p className="text-xs text-blue-700 font-bold mt-2 px-1 break-all">
                                📎 {file.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                     <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">Instructions & Description</label>
                    <div className="rounded-xl overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] border border-t-slate-400 border-l-slate-400 border-b-white border-r-white bg-slate-100">
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-6 border-t-2 border-slate-300/50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-extrabold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Publishing..." : "Publish Assignment"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignment;
