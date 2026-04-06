import { useState, useEffect } from "react";
import AssignmentContext from "./AssignmentContext";
import { toast } from "../../Toaster/toast";

const AssignmentState = ({ children }) => {
    const hostUrl = import.meta.env.VITE_URL;

    const [assignments, setAssignments] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create Assigment By the Faculty
    const createAssignment = async (formData, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/assignments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // title, description, subject, etc + file
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to create assignment");

            toast.success("Assignment created successfully");
            getAssignmentsByTeacher(token);
            return data.assignment;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Get Assignments only for specifice student
    const getAssignmentsForStudent = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/assignments/student`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch assignments");

            setAssignments(data);
        } catch (error) {
            toast.error(error.message);
            setAssignments(null);
        } finally {
            setLoading(false);
        }
    };

    // Get specific Teacher Assigemnt
    const getAssignmentsByTeacher = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/assignments/faculty`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch assignments");

            setAssignments(data);
        } catch (error) {
            toast.error(error.message);
            setAssignments(null);
        } finally {
            setLoading(false);
        }
    };

    const getAllAssignmentsAdmin = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/assignments/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch all assignments");
            }
            setAssignments(data.assignments);

        } catch (error) {
            toast.error(error.message);
            setAssignments(null);
        } finally {
            setLoading(false);
        }
    };

    // Get one particuler assigement
    const getAssignmentById = async (id, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/assignments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch assignment");

            return data; // { assignment, isDeadlinePassed }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Delete Assigemnt
    const deleteAssignment = async (id, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/assignments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");

            toast.success("Assignment deleted successfully");
            setAssignments((prev) => prev?.filter((a) => a._id !== id));
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <AssignmentContext.Provider
            value={{
                assignments,
                setAssignments,
                loading,
                createAssignment,
                getAssignmentsForStudent,
                getAssignmentsByTeacher,
                getAssignmentById,
                deleteAssignment,
                getAllAssignmentsAdmin,
            }}
        >
            {children}
        </AssignmentContext.Provider>
    );
};

export default AssignmentState;
