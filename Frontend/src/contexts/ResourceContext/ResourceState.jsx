import { useState, useEffect } from "react";
import ResourceContext from "./ResourceContext.jsx";
import { toast } from "../../Toaster/toast";

const ResourceState = ({ children }) => {
    const hostUrl = import.meta.env.VITE_URL;

    const [resources, setResources] = useState(null);
    const [loading, setLoading] = useState(true);

    // -------------------- GET ALL RESOURCES --------------------
    const getAllResource = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/resources`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong");

            setResources(data.resources);
        } catch (error) {
            setResources(null);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------- GET ALL RESOURCES (ADMIN) --------------------
    const getAllResourcesAdmin = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/resources/all-resources`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setResources(data.resources);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    // -------------------- GET USER RESOURCES --------------------
    const getUserResource = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/resources/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong");

            return data.resources;
        } catch (error) {
            toast.error(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // -------------------- UPLOAD RESOURCE --------------------
    const uploadResource = async (formData, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/resources`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // formData must include file and fields
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Upload failed");

            toast.success("Resource uploaded successfully");
            getAllResource(); // refresh list
            return data.resource;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- EDIT RESOURCE --------------------
    const editResource = async (id, formData, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/resources/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Update failed");

            toast.success("Resource updated successfully");
            getAllResource();
            return data.resource;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- DELETE RESOURCE --------------------
    const deleteResource = async (id, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/resources/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Delete failed");

            toast.success("Resource deleted successfully");
            getAllResource();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -------------------- UPDATE RESOURCE STATUS --------------------
    const updateResourceStatus = async (id, statusData, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/resources/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(statusData), // { status: "approved" or "rejected", rejectionReason? }
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Status update failed");

            toast.success(`Resource ${statusData.status} successfully`);
            return data.resource;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- AUTO FETCH ON MOUNT --------------------
    useEffect(() => {
        getAllResource();
    }, []);

    return (
        <ResourceContext.Provider
            value={{
                resources,
                setResources,
                loading,
                getAllResource,
                getAllResourcesAdmin,
                getUserResource,
                uploadResource,
                editResource,
                deleteResource,
                updateResourceStatus,
            }}
        >
            {children}
        </ResourceContext.Provider>
    );
};

export default ResourceState;
