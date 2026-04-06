import { useState } from "react";
import SubmissionContext from "./SubmissionContext";
import { toast } from "../../Toaster/toast";

const SubmissionState = (props) => {
    const hostUrl = import.meta.env.VITE_URL;
    const token = localStorage.getItem("token");

    const [submissions, setSubmissions] = useState([]);
    const [mySubmission, setMySubmission] = useState(null);
    const [loading, setLoading] = useState(false);

    /* =========================
       SUBMIT ASSIGNMENT
    ========================== */
    const submitAssignment = async (assignmentId, file) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("assignmentId", assignmentId);
            formData.append("file", file);

            const res = await fetch(`${hostUrl}/api/submissions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Submission failed");
                return false;
            }

            toast.success("Assignment submitted");
            setMySubmission(data.submission);
            return true;
        } catch (error) {
            toast.error("Submission error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       GET MY SUBMISSION
    ========================== */
    const fetchMySubmission = async () => {
        setLoading(true);

        try {
            const res = await fetch(
                `${hostUrl}/api/submissions/my-submission`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMySubmission(data);
            } else {
                setMySubmission(null);
            }
        } catch {
            toast.error("Failed to load submission");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       GET SUBMISSIONS BY ASSIGNMENT
    ========================== */
    const fetchSubmissionsByAssignment = async (assignmentId) => {
        setLoading(true);

        try {
            const res = await fetch(
                `${hostUrl}/api/submissions/assignment/${assignmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok) {
                setSubmissions(data);
            } else {
                toast.error(data.message);
            }
            console.log(data);
        } catch {
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       REVIEW SUBMISSION
    ========================== */
    const reviewSubmission = async (submissionId, feedback) => {
        setLoading(true);

        try {
            const res = await fetch(
                `${hostUrl}/api/submissions/review/${submissionId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ feedback }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return false;
            }

            toast.success("Submission reviewed");
            return true;
        } catch {
            toast.error("Review failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       ADMIN: GET ALL SUBMISSIONS
    ========================== */
    const fetchAllSubmissions = async (page = 1) => {
        setLoading(true);

        try {
            const res = await fetch(
                `${hostUrl}/api/submissions?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok) {
                setSubmissions(data.submissions);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };



    return (
        <SubmissionContext.Provider
            value={{
                submissions,
                mySubmission,
                loading,
                submitAssignment,
                fetchMySubmission,
                fetchSubmissionsByAssignment,
                reviewSubmission,
                fetchAllSubmissions,
            }}
        >
            {props.children}
        </SubmissionContext.Provider>
    );
};

export default SubmissionState;
