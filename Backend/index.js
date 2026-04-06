import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";
// Route Import
import uploadrouter from "./routes/ImagekitRoute.js";
import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js"
import preApprovedUserRoutes from "./routes/preApprovedUserRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js"
import submissionRoutes from "./routes/submissionRoutes.js";
import campusInsightRoutes from "./routes/campusInsightRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import facultyDashboardRoutes from "./routes/facultyDashboardRoutes.js";

// Configuring dotenv to load environment variables
dotenv.config({
    path: "./env"
});

connectToMongo()

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send({
        activeStatus: true,
        error: false
    })
})

// Api Call
app.use("/api", uploadrouter);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes)
app.use("/api/preapproved", preApprovedUserRoutes);
app.use("/api/assignments", assignmentRoutes)
app.use("/api/submissions", submissionRoutes);
app.use("/api/campus-insights", campusInsightRoutes);
app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/dashboard", facultyDashboardRoutes);


const PORT = process.env.PORT || 3000;

// app listener to start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`); // Log the server URL

});