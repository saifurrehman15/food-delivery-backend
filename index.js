import express from "express";
import "dotenv/config";
import authRoute from "./src/routes/auth/index.js"
const app = express();
app.use(express.json());

app.get("/", async(req, res) => {
  res.send("Hello World");
});

app.use("/auth/api", authRoute)

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
});
