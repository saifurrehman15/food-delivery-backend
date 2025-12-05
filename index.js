import express from "express";
import "dotenv/config";
import helmet from "helmet";
import passport2 from "./src/routers/auth/passport.js";
import connectDb from "./src/utils/db/index.js";

import authRouter from "./src/routers/auth/auth.js";
import userRouter from "./src/routers/user/index.js";
import restaurantRoute from "./src/routers/restaurants/restaurant.application.js";
import ridersRoute from "./src/routers/riders/index.js";

const app = express();
app.use(express.json());
app.use(helmet());

app.get("/", async (req, res) => {
  res.send("Hello World");
});
passport2.serializeUser((user, done) => {
  done(null, user.id);
});
passport2.deserializeUser((id, done) => {
  done(null, user);
});

app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api", restaurantRoute);
app.use("/api", ridersRoute);

// connectDb
connectDb();

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
});
