import React, { useState } from "react";
import AdminUserContext from "./AdminUserContext";

const API_URL = import.meta.env.VITE_URL; // Ensure URL is correct based on environment

const AdminUserState = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch users (GET)
    const fetchUsers = async (token) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/preapproved/all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    // Add single pre-approved user (POST)
    const addUser = async (token, formData) => {
        const res = await fetch(`${API_URL}/api/preapproved/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || "Operation failed.");
        }
        return data;
    };

    // Update user (PUT)
    const editUser = async (token, id, formData) => {
        const res = await fetch(`${API_URL}/api/preapproved/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || "Operation failed.");
        }
        return data;
    };

    // Delete user (DELETE)
    const deleteUser = async (token, id, type) => {
        const res = await fetch(`${API_URL}/api/preapproved/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ type })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || "Operation failed.");
        }
        return data;
    };

    return (
        <AdminUserContext.Provider
            value={{ users, loading, fetchUsers, addUser, editUser, deleteUser }}
        >
            {props.children}
        </AdminUserContext.Provider>
    );
};

export default AdminUserState;
