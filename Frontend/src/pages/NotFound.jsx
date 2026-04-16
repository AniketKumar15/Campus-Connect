import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">

            <div className="max-w-xl w-full text-center">

                {/* Card */}
                <div className="bg-white rounded-2xl p-10 shadow-lg border border-slate-200">

                    {/* Icon / Illustration */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-xl bg-indigo-100 flex items-center justify-center shadow-inner">
                            <span className="text-3xl">🎓</span>
                        </div>
                    </div>

                    {/* 404 */}
                    <h1 className="text-5xl font-bold text-slate-800 mb-2">
                        404
                    </h1>

                    {/* Message */}
                    <p className="text-slate-600 mb-6">
                        The page you’re looking for doesn’t exist or may have been moved within Campus Connect.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">

                        <Link
                            to="/"
                            className="
                px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium
                shadow-md hover:bg-indigo-700 transition
              "
                        >
                            Go to Dashboard
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="
                px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium
                hover:bg-slate-200 transition
              "
                        >
                            Go Back
                        </button>

                    </div>
                </div>

                {/* Footer hint */}
                <p className="text-xs text-slate-400 mt-6">
                    Campus Connect • Unified Academic Platform
                </p>

            </div>
        </div>
    );
};

export default NotFound;