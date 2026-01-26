import { useContext, useMemo, useState } from "react";
import {
    FiSearch,
    FiDownload,
    FiFileText,
    FiImage,
    FiFile,
    FiBarChart2
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
        "h-11 w-11 rounded-lg flex items-center justify-center text-white shrink-0";

    const map = {
        pdf: "bg-red-500",
        ppt: "bg-orange-500",
        image: "bg-green-500",
        file: "bg-slate-500"
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
            <Icon />
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
        <div className="pt-28 px-6 max-w-7xl mx-auto">
            {/* HEADER */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Resources <RiResetLeftFill className="size-5 mt-2 hidden md:block" onClick={resetFilters} />
            </h1>
            <button
                onClick={() => setShowFilters(true)}
                className="md:hidden mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black"
            >
                Filters
            </button>

            {/* FILTER CARD */}
            <div className="hidden md:block mt-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4">
                <div className="grid gap-3 md:grid-cols-6">
                    {/* SEARCH */}
                    <div className="relative md:col-span-2">
                        <FiSearch className="absolute left-3 top-3 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search resources..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 dark:border-white/10 dark:text-white"
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
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowFilters(false)}
                    />

                    {/* Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-slate-900 p-5 border-t dark:border-white/10 animate-slideUp">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg dark:text-white">
                                Filters
                            </h3>
                            <button onClick={() => setShowFilters(false)}>✕</button>
                        </div>

                        <div className="grid gap-3">
                            <Select label="Course" value={course} onChange={setCourse} options={["BCA", "MCA"]} />
                            <Select label="Semester" value={semester} onChange={setSemester} options={[1, 2, 3, 4, 5, 6]} />
                            <Select label="Category" value={category} onChange={setCategory} options={["notes", "pyq"]} />
                            <Select label="Sort" value={sort} onChange={setSort} options={["latest", "az"]} />
                        </div>

                        <button
                            onClick={() => { setShowFilters(false); resetFilters() }}
                            className="mt-5 w-full py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}


            {/* GRID */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((r) => {
                    const type = getFileType(r.fileUrl);

                    return (
                        <div
                            key={r._id}
                            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 hover:shadow-lg transition"
                        >
                            <div className="flex gap-4">
                                <FileIcon type={type} />

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {r.title}
                                        </h3>
                                        <UploaderBadge role={r.uploadedBy.role} />
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                        {r?.description}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        <Tag>{r.course}</Tag>
                                        <Tag>Sem {r.semester}</Tag>
                                        <Tag>{r.category}</Tag>
                                        <Tag>{type.toUpperCase()}</Tag>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <a
                                            href={r.fileUrl}
                                            target="_blank"
                                            className="text-sky-500 text-sm font-medium"
                                        >
                                            View
                                        </a>
                                        <a
                                            href={r.fileUrl}
                                            download
                                            className="flex items-center gap-1 text-indigo-500 text-sm"
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
                    <p className="text-slate-500">No resources found.</p>
                )}
            </div>
        </div>
    );
}

/* ---------- SMALL UI ---------- */
const Select = ({ label, value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:border-white/10 dark:text-white"
    >
        <option value="all">{label}: All</option>
        {options.map((o) => (
            <option key={o} value={o}>{o}</option>
        ))}
    </select>
);

const Tag = ({ children }) => (
    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
        {children}
    </span>
);
const UploaderBadge = ({ role }) => {
    const isFaculty = role === "faculty";

    return (
        <span
            className={`
        text-xs px-2 py-0.5 rounded-full font-medium
        ${isFaculty
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"}
      `}
        >
            {isFaculty ? "Faculty" : "Student"}
        </span>
    );
};
