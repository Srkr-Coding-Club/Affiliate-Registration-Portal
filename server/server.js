import express from "express";
import formRouter from "./routes/form.js"
import authRouter from "./routes/auth.js"
import cors from 'cors';
import connectDB from "./utils/db.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

try {
    connectDB();
} catch (error) {
    console.error("Database connection failed:", error);
}


app.use(formRouter);
app.use(authRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
