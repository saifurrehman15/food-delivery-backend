import express from "express";
import "dotenv/config";
import connectDb from "./src/utils/db/index.js";
import authRouter from "./src/routers/auth/auth.js";
import userRouter from "./src/routers/user/index.js";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(helmet())

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api", userRouter);

// connectDb
connectDb();

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
});
