import React, { useContext, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import SubmissionContext from "../contexts/SubmissionContext/SubmissionContext";

const SubmissionModal = ({ onClose, assignmentId }) => {
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    const { submitAssignment, loading } = useContext(SubmissionContext);

    /* =========================
       HANDLE FILE
    ========================== */
    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (selected) {
            setFile(selected);
            setFileName(selected.name);
        }
    };

    /* =========================
       SUBMIT
    ========================== */
    const handleSubmit = async () => {
        if (!file) return;

        const success = await submitAssignment(assignmentId, file);

        if (success) {
            onClose();
        }
    };

    return (
        /* Overlay */
        <div
            className="fixed inset-0 bg-slate-800/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="relative w-full max-w-lg p-8 rounded-3xl bg-slate-200 border-t border-l border-white shadow-[12px_16px_25px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] text-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 bg-red-100 text-red-600 rounded-full p-2 border border-red-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.1)] hover:bg-red-200 active:translate-y-[1px] transition-all"
                >
                    <IoMdClose size={20} />
                </button>

                {/* Header */}
                <h2 className="text-3xl font-extrabold mb-1 drop-shadow-sm">
                    Submit Assignment
                </h2>

                <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
                    Upload your assignment file before deadline
                </p>

                {/* Upload Box */}
                <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center justify-center border-[3px] border-dashed border-slate-400 rounded-2xl p-10 cursor-pointer hover:border-blue-500 bg-slate-100/50 hover:bg-blue-50 transition-all font-bold shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] text-center"
                >
                    <FaCloudUploadAlt className="text-5xl text-blue-500 mb-4 drop-shadow-sm" />

                    <span className="font-extrabold text-slate-700 text-lg">
                        Click to upload or drag file
                    </span>

                    <span className="text-xs text-slate-500 uppercase tracking-widest mt-2">
                        PDF, DOCX, ZIP etc.
                    </span>

                    {fileName && (
                        <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.1)] border border-blue-200">
                            Selected: <span className="font-extrabold">{fileName}</span>
                        </div>
                    )}
                </label>

                <input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-extrabold text-slate-600 bg-slate-200 border-t border-l border-white border-b-slate-400 border-r-slate-400 shadow-[4px_6px_10px_rgba(0,0,0,0.1),inset_1px_1px_2px_rgba(255,255,255,0.8)] hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className={`px-8 py-2.5 rounded-xl font-extrabold tracking-wide transition-all ${
                            !file || loading
                                ? "bg-slate-300 text-slate-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)] border border-slate-400 cursor-not-allowed"
                                : "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px]"
                        }`}
                    >
                        {loading ? "Submitting..." : "Submit File"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;
