import { useContext, useState } from "react";
import { FaImage } from "react-icons/fa";
import RichTextEditor from "../../components/RichTextEditor";
import AssignmentContext from "../../contexts/AssignmentContext/AssignmentContext";
import { toast } from "../../Toaster/toast";

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

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto px-6 py-8"
        >
            <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">Create Assignment</h1>

            <div className="space-y-6">
                {/* Title */}
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Assignment title"
                    className="w-full text-xl bg-transparent border-b border-black dark:border-white/20 text-black dark:text-white focus:outline-none focus:border-indigo-500 pb-2 "
                />

                {/* Subject + Course */}
                <div className="grid md:grid-cols-2 gap-6">
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        className="input-clean"
                    />

                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="input-clean"
                    >
                        <option value="">Course</option>
                        <option>BCA</option>
                        <option>MCA</option>
                        <option>BBA</option>
                        <option>MBA</option>
                    </select>
                </div>

                {/* Semester + Deadline */}
                <div className="grid md:grid-cols-3 gap-6">
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="input-clean"
                    >
                        <option value="">Semester</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                    </select>

                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="input-clean"
                    />
                    {/* File Upload */}
                    <div className="flex flex-col items-start gap-1">
                        <label
                            htmlFor="fileInput"
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors w-full"
                        >
                            <FaImage size={20} />
                            <span>Attach File (Optional)</span>
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
                            <p className="text-sm text-slate-500 mt-1">
                                Selected: <span className="font-medium">{file.name}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <p className="mb-2 text-sm text-slate-400">
                        Description (optional if file is uploaded)
                    </p>
                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
                    >
                        {loading ? "Publishing..." : "Publish Assignment"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CreateAssignment;
