import { useContext, useMemo, useState } from "react";
import {
    FiSearch,
    FiDownload,
    FiFileText,
    FiImage,
    FiFile,
    FiBarChart2,
    FiChevronDown
} from "react-icons/fi";
import { RiResetLeftFill } from "react-icons/ri";
import ResourceContext from "../contexts/ResourceContext/ResourceContext";

/* ---------- FILE TYPE ---------- */
const getFileType = (url) => {
    if (!url) return "file";
    if (url.endsWith(".pdf")) return "pdf";
    if (url.endsWith(".ppt") || url.endsWith(".pptx")) return "ppt";
    if (url.match(/\.(jpg|jpeg|png)$/)) return "image";
    return "file";
};

const FileIcon = ({ type }) => {
    const base =
        "h-12 w-12 rounded-xl flex items-center justify-center text-slate-100 shrink-0 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_4px_6px_rgba(0,0,0,0.2)] border border-slate-600";

    const map = {
        pdf: "bg-gradient-to-br from-red-500 to-red-700",
        ppt: "bg-gradient-to-br from-orange-500 to-orange-700",
        image: "bg-gradient-to-br from-emerald-500 to-emerald-700",
        file: "bg-gradient-to-br from-slate-500 to-slate-700"
    };

    const Icon =
        type === "pdf"
            ? FiFileText
            : type === "ppt"
                ? FiBarChart2
                : type === "image"
                    ? FiImage
                    : FiFile;

    return (
        <div className={`${base} ${map[type]}`}>
            <Icon size={20} />
        </div>
    );
};

export default function Resources() {
    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("all");
    const [semester, setSemester] = useState("all");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("latest");
    const [showFilters, setShowFilters] = useState(false);
    const { resources, loading } = useContext(ResourceContext);


    const filtered = useMemo(() => {
        if (!resources) return [];

        let data = [...resources];

        if (search) {
            data = data.filter((r) =>
                r.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (course !== "all") data = data.filter((r) => r.course === course);
        if (semester !== "all")
            data = data.filter((r) => r.semester === Number(semester));
        if (category !== "all") data = data.filter((r) => r.category === category);

        if (sort === "latest")
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sort === "az") data.sort((a, b) => a.title.localeCompare(b.title));

        return data;
    }, [resources, search, course, semester, category, sort]);


    const resetFilters = () => {
        setSearch("");
        setCourse("all");
        setSemester("all");
        setCategory("all");
        setSort("latest");
    };


    return (
        <div className="bg-[#eef2f6]">


            <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto font-sans text-slate-800">
                {/* HEADER */}
                <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm flex items-center gap-2">
                    Resources
                    <button onClick={resetFilters} className="mt-2 hidden md:flex items-center justify-center p-2 rounded-lg bg-slate-200 shadow-[0_3px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-slate-400 active:border-b-0 active:translate-y-[2px] transition-all">
                        <RiResetLeftFill className="size-5 text-slate-700" />
                    </button>
                </h1>
                <button
                    onClick={() => setShowFilters(true)}
                    className="md:hidden mt-4 px-6 py-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[2px] transition-all"
                >
                    Filters
                </button>

                {/* FILTER CARD */}
                <div className="hidden md:block mt-6 rounded-2xl bg-slate-200 border-t border-l border-white p-6 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]">
                    <div className="grid gap-4 md:grid-cols-6">
                        {/* SEARCH */}
                        <div className="relative md:col-span-2">
                            <FiSearch className="absolute left-3 top-3 text-slate-500" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search resources..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                            />
                        </div>

                        <Select label="Course" value={course} onChange={setCourse} options={["BCA", "MCA"]} />
                        <Select label="Semester" value={semester} onChange={setSemester} options={[1, 2, 3, 4, 5, 6]} />
                        <Select label="Category" value={category} onChange={setCategory} options={["notes", "pyq"]} />
                        <Select label="Sort" value={sort} onChange={setSort} options={["latest", "az"]} />
                    </div>
                </div>
                {showFilters && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-slate-800/60 backdrop-blur-sm"
                            onClick={() => setShowFilters(false)}
                        />

                        {/* Sheet */}
                        <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-slate-200 p-6 border-t border-white shadow-[0_-10px_25px_rgba(0,0,0,0.2)] animate-slideUp">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-slate-800 drop-shadow-sm">
                                    Filters
                                </h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg bg-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-slate-700 font-bold">✕</button>
                            </div>

                            <div className="grid gap-4">
                                <Select label="Course" value={course} onChange={setCourse} options={["BCA", "MCA"]} />
                                <Select label="Semester" value={semester} onChange={setSemester} options={[1, 2, 3, 4, 5, 6]} />
                                <Select label="Category" value={category} onChange={setCategory} options={["notes", "pyq"]} />
                                <Select label="Sort" value={sort} onChange={setSort} options={["latest", "az"]} />
                            </div>

                            <button
                                onClick={() => { setShowFilters(false); resetFilters() }}
                                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[2px] transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}


                {/* GRID */}
                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((r) => {
                        const type = getFileType(r.fileUrl);

                        return (
                            <div
                                key={r._id}
                                className="rounded-2xl bg-slate-200 border-t border-l border-white p-6 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] hover:-translate-y-1 hover:shadow-[12px_16px_25px_rgba(0,0,0,0.15)] transition-all duration-300"
                            >
                                <div className="flex gap-5">
                                    <FileIcon type={type} />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-bold text-slate-800 leading-snug">
                                                {r.title}
                                            </h3>
                                        </div>
                                        <div className="mt-1">
                                            <UploaderBadge role={r.uploadedBy.role} />
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-slate-600 line-clamp-2">
                                            {r?.description}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold font-mono">
                                            <Tag>{r.course}</Tag>
                                            <Tag>Sem {r.semester}</Tag>
                                            <Tag>{r.category}</Tag>
                                            <Tag>{type.toUpperCase()}</Tag>
                                        </div>

                                        <div className="mt-6 flex items-center gap-3">
                                            <a
                                                href={r.fileUrl}
                                                target="_blank"
                                                className="px-4 py-2 rounded-lg bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 font-bold shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.9)] border-b-2 border-blue-300 hover:text-blue-900 active:border-b-0 active:translate-y-[2px] transition-all text-sm"
                                            >
                                                View
                                            </a>
                                            <a
                                                href={r.fileUrl}
                                                download
                                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 font-bold shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.9)] border-b-2 border-slate-300 hover:text-slate-900 active:border-b-0 active:translate-y-[2px] transition-all text-sm"
                                            >
                                                <FiDownload /> Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="col-span-full py-12 text-center rounded-2xl bg-slate-200 border-t border-l border-white shadow-[inset_0_3px_10px_rgba(0,0,0,0.1)]">
                            <p className="text-slate-500 font-bold text-lg drop-shadow-sm">No resources found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------- SMALL UI ---------- */
const Select = ({ label, value, onChange, options }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                className="w-full flex items-center justify-between rounded-lg bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-medium cursor-pointer focus:bg-slate-200"
            >
                <span className="truncate">{value === "all" ? `${label}: All` : value}</span>
                <FiChevronDown className={`transition-transform duration-200 ml-2 shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-full z-50 rounded-xl bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.8)] p-2">
                    <div
                        onClick={() => { onChange("all"); setOpen(false); }}
                        className={`cursor-pointer font-bold px-3 py-2 text-sm text-slate-700 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-lg transition ${value === "all" ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" : ""}`}
                    >
                        {label}: All
                    </div>
                    {options.map((o) => (
                        <div
                            key={o}
                            onClick={() => { onChange(o); setOpen(false); }}
                            className={`cursor-pointer font-bold px-3 py-2 text-sm text-slate-700 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-lg transition mt-1 ${value === o ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" : ""}`}
                        >
                            {o}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Tag = ({ children }) => (
    <span className="px-2 py-1 rounded bg-slate-300/50 text-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
        {children}
    </span>
);
const UploaderBadge = ({ role }) => {
    const isFaculty = role === "faculty";

    return (
        <span
            className={`
        text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)] font-bold
        ${isFaculty
                    ? "bg-gradient-to-br from-emerald-100 to-emerald-300 text-emerald-800"
                    : "bg-gradient-to-br from-blue-100 to-blue-300 text-blue-800"}
      `}
        >
            {isFaculty ? "Faculty" : "Student"}
        </span>
    );
};
