import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { toast } from "../../Toaster/toast";

const AuthState = (props) => {
    const hostUrl = import.meta.env.VITE_URL;

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    /* =========================
       LOAD USER (ON REFRESH)
    ========================== */
    const loadUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${hostUrl}/api/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
            } else {
                logout();
            }
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       LOGIN
    ========================== */
    const login = async (email, password) => {
        try {
            const res = await fetch(`${hostUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Login failed");
                return false;
            }

            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);

            toast.success("Login successful");
            return true;
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        }
    };

    /* =========================
       SIGNUP
    ========================== */
    const signup = async (name, email, password) => {
        try {
            const res = await fetch(`${hostUrl}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Signup failed");
                return false;
            }

            toast.success("Registration successful. Please login.");
            return true;
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        }
    };

    /* =========================
       LOGOUT
    ========================== */
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.success("Logged out successful");
    };

    /* =========================
       INIT
    ========================== */
    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;
