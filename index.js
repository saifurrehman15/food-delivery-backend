import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/", async(req, res) => {
  res.send("Hello World");
});

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
});
