import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiX, FiClock } from "react-icons/fi";
import CampusInsightContext from "../contexts/CampusInsightContext/CampusInsightContext";
import AuthContext from "../contexts/AuthContext/AuthContext";
import { toast } from "../Toaster/toast";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const CampusInsights = () => {
    const { insights, loading, toggleLikeInsight, getAllInsights } = useContext(CampusInsightContext);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const [selectedInsight, setSelectedInsight] = useState(null);

    // Initial data fetch happens inside CampusInsightState, but we can verify it here.
    // As per the state file, it automatically fires `getAllInsights()` on mount.

    const handleLike = async (e, id) => {
        e.stopPropagation(); // prevent modal opening
        if (!user) {
            return toast.error("Log in to like insights");
        }
        await toggleLikeInsight(id, token);
    };

    return (
        <div className="pt-28 pb-32 overflow-x-hidden bg-[#eef2f6] min-h-screen font-sans text-slate-800 relative z-0">
            {/* Ambient Lighting & Grid Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            </div>
            <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-white/60 blur-[100px] pointer-events-none" />
            <div className="absolute top-40 right-0 h-[500px] w-[500px] rounded-full bg-slate-300/40 blur-[100px] pointer-events-none" />

            <section className="relative px-6 mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm"
                    >
                        Campus <span className="text-blue-700">Insights</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 font-medium"
                    >
                        Discover thoughts, stories, and experiences shared by students and faculty across the campus.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="text-xl font-bold text-slate-500 animate-pulse">Loading amazing stories...</div>
                    </div>
                ) : !insights || insights.length === 0 ? (
                    <div className="text-center rounded-3xl bg-slate-200 border-t border-l border-white/80 p-12 shadow-[15px_25px_40px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_rgba(0,0,0,0.05),inset_4px_4px_15px_rgba(255,255,255,0.7)]">
                        <p className="text-xl text-slate-500 font-bold">No insights published yet!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[280px] gap-6">
                        {insights.map((insight, i) => {
                            // Bento grid dynamic sizing logic
                            // First item spans 2 columns, 2 rows (hero item)
                            // Every 6th item spans 2 columns
                            const isHero = i === 0;
                            const isWide = i % 6 === 3 && !isHero; // some random variations
                            
                            const spanClasses = isHero 
                                ? "md:col-span-2 md:row-span-2" 
                                : isWide 
                                    ? "md:col-span-2 lg:col-span-2 row-span-1" 
                                    : "col-span-1 row-span-1";

                            const isLiked = user && insight.likes?.includes(user.id || user._id);

                            return (
                                <motion.div
                                    key={insight._id}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ delay: (i % 4) * 0.1, duration: 0.5 }}
                                    onClick={() => setSelectedInsight(insight)}
                                    className={`group cursor-pointer rounded-3xl bg-slate-200 border-t border-l border-white p-5 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] hover:shadow-[12px_18px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-end relative ${spanClasses}`}
                                >
                                    {/* Cover Background */}
                                    <div className="absolute inset-0 z-0">
                                        <img 
                                            src={insight.coverImage} 
                                            alt={insight.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                                    </div>
                                    
                                    <div className="relative z-10 w-full">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden shadow-lg">
                                                <img 
                                                    src={insight.author?.profileImage || "https://ik.imagekit.io/aniketmedia/campusconnect/images/avatar1"} 
                                                    alt={insight.author?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-200 drop-shadow-md">
                                                    {insight.author?.name}
                                                </p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {insight.author?.role}
                                                </p>
                                            </div>
                                        </div>

                                        <h2 className={`font-extrabold text-white drop-shadow-lg leading-tight mb-4 ${isHero ? 'text-2xl md:text-3xl' : 'text-lg line-clamp-2'}`}>
                                            {insight.title}
                                        </h2>

                                        <div className="flex items-center justify-between border-t border-white/20 pt-3">
                                            <p className="text-xs font-bold text-slate-300 flex items-center gap-1">
                                                <FiClock /> {new Date(insight.createdAt).toLocaleDateString()}
                                            </p>
                                            
                                            <button 
                                                onClick={(e) => handleLike(e, insight._id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border ${isLiked ? 'bg-rose-500/80 border-rose-400 text-white shadow-rose-900/50' : 'bg-white/10 border-white/20 hover:bg-white/20 text-slate-200'} transition-all`}
                                            >
                                                <FiHeart className={isLiked ? 'fill-white' : ''} />
                                                <span className="text-xs font-bold">{insight.likes?.length || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Read Insight Modal */}
            <AnimatePresence>
                {selectedInsight && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedInsight(null)}
                    >
                        <motion.div
                            initial={{ y: 50, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 20, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#eef2f6] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-t-2 border-l-2 border-white/80"
                        >
                            {/* Modal Header Image */}
                            <div className="relative h-64 sm:h-80 w-full flex-shrink-0">
                                <img 
                                    src={selectedInsight.coverImage} 
                                    alt={selectedInsight.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#eef2f6] via-transparent to-transparent"></div>
                                
                                <button 
                                    onClick={() => setSelectedInsight(null)}
                                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full border border-white/30 transition-all shadow-lg"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="px-8 sm:px-12 -mt-16 sm:-mt-24 relative z-10 flex-1 overflow-y-auto pb-12 custom-scrollbar">
                                <div className="bg-slate-200 rounded-3xl p-6 sm:p-8 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.7),8px_12px_20px_rgba(0,0,0,0.1)] border border-white mb-8">
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-300">
                                        <img 
                                            src={selectedInsight.author?.profileImage || "https://ik.imagekit.io/aniketmedia/campusconnect/images/avatar1"} 
                                            alt={selectedInsight.author?.name}
                                            className="w-14 h-14 rounded-full border-2 border-slate-300 shadow-md object-cover"
                                        />
                                        <div>
                                            <p className="text-lg font-extrabold text-slate-800">
                                                {selectedInsight.author?.name}
                                            </p>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                {selectedInsight.author?.role} • {new Date(selectedInsight.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight mb-6">
                                        {selectedInsight.title}
                                    </h1>
                                </div>

                                {/* Rich Text Content Render */}
                                <div 
                                    className="prose prose-slate max-w-none prose-img:rounded-2xl prose-img:shadow-md prose-headings:font-extrabold prose-a:text-blue-600 font-medium text-slate-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedInsight.content }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
            `}} />
        </div>
    );
};

export default CampusInsights;