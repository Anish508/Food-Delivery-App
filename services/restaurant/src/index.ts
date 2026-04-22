import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import restaurantRoute from "./Routes/restaurent-routes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/restaurant", restaurantRoute);

const PORT = process.env.PORT || 5001;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Restaurant service is running on port: ${PORT}`);
  });
})();
