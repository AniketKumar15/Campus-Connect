import { useContext, useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "../../../components/RichTextEditor";
import CampusInsightContext from "../../../contexts/CampusInsightContext/CampusInsightContext";
import { toast } from "../../../Toaster/toast";

const EditCampusInsight = () => {
    const { getInsightById, updateInsight } = useContext(CampusInsightContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchInsight = async () => {
            const data = await getInsightById(id);
            if (data) {
                setTitle(data.title);
                setContent(data.content);
                setPreview(data.coverImage);
            } else {
                toast.error("Failed to load insight");
                navigate("/dashboard/my-insights");
            }
            setLoading(false);
        };
        fetchInsight();
        // eslint-disable-next-line
    }, [id]);

    const handleFileChange = (e) => {
        const _file = e.target.files[0];
        if (_file) {
            setFile(_file);
            setPreview(URL.createObjectURL(_file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            return toast.error("Title and content are required");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (file) {
            formData.append("file", file);
        }

        setSubmitting(true);
        const result = await updateInsight(id, formData, token);
        setSubmitting(false);

        if (result) {
            navigate("/dashboard/my-insights");
        }
    };

    const inputBase =
        "w-full rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-bold transition-all";

    if (loading) {
        return <div className="p-8 text-slate-600 font-bold">Loading insight data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 font-sans">
            <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm mb-8">
                Edit Campus Insight
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-slate-200/80 shadow-[inset_3px_5px_10px_rgba(0,0,0,0.15),0_2px_0_rgba(255,255,255,0.8)] border border-slate-400 p-8 rounded-3xl"
            >
                {/* Title */}
                <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">
                        Insight Title
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Eg. Reality of College Placements"
                        className={`${inputBase} text-xl`}
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">
                        Cover Image
                    </label>

                    {preview && (
                        <div className="mb-4">
                            <img 
                                src={preview} 
                                alt="Cover preview" 
                                className="w-full h-48 object-cover rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.15)] border-2 border-slate-300"
                            />
                        </div>
                    )}

                    <label
                        htmlFor="fileInput"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 font-bold shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.9)] border-b-[3px] border-slate-300 hover:text-slate-900 active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer rounded-xl w-full"
                    >
                        <FaImage className="text-xl" />
                        <span>{file ? "Change Selected Image" : "Upload New Cover Image"}</span>
                    </label>

                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {file && (
                        <p className="text-xs text-blue-700 font-bold mt-2 px-1 break-all">
                            📎 {file.name}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1 mb-1.5">
                        Content
                    </label>

                    <div className="rounded-xl overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] border border-t-slate-400 border-l-slate-400 border-b-white border-r-white bg-slate-100">
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-between items-center pt-6 border-t-2 border-slate-300/50">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/my-insights")}
                        className="px-6 py-2.5 rounded-xl bg-slate-300 text-slate-700 font-bold shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.6)] border-b-[3px] border-slate-400 hover:bg-slate-400 hover:text-white active:border-b-0 active:translate-y-[2px] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-extrabold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px] transition-all disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCampusInsight;
