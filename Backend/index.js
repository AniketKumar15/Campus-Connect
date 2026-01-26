import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";
// Route Import
import uploadrouter from "./routes/ImagekitRoute.js";
import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js"
import preApprovedUserRoutes from "./routes/preApprovedUserRoutes.js";

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

const PORT = process.env.PORT || 3000;

// app listener to start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`); // Log the server URL

});