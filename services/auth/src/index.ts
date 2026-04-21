import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoute from "./routes/auth-route";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoute);
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Auth service is running on port: ${PORT}`);
  });
})();
