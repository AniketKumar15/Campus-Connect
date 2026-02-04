import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentContext from "../../contexts/AssignmentContext/AssignmentContext";

const TeacherAllAssignment = () => {
    const {
        assignments,
        loading,
        getAssignmentsByTeacher,
    } = useContext(AssignmentContext);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        getAssignmentsByTeacher(token);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64
        text-slate-500 dark:text-slate-400">
                Loading assignments...
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center mt-10
        text-slate-500 dark:text-slate-400">
                You haven’t created any assignments yet
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold mb-6
        text-slate-800 dark:text-white">
                My Assignments
            </h1>

            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <div
                        key={assignment._id}
                        onClick={() =>
                            navigate(`/assignments/${assignment._id}`)
                        }
                        className="
              cursor-pointer
              p-5 rounded-xl
              transition
              border border-slate-200 dark:border-white/10
              bg-white dark:bg-white/5
              hover:bg-slate-100 dark:hover:bg-white/10
            "
                    >
                        <h2 className="text-lg font-semibold
              text-slate-800 dark:text-white">
                            {assignment.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm
              text-slate-500 dark:text-slate-400">
                            <span>📘 {assignment.subject}</span>
                            <span>🎓 {assignment.course}</span>
                            <span>
                                📅 Due: {assignment.deadline?.slice(0, 10)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherAllAssignment;
