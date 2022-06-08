import express from "express";
import morgan from "morgan";
import config from "./config/index";
import { disconnect } from "@db/db";
import authRouter from "./apps/auth/routes";
import { handleUnauthorizedError } from "./apps/auth/customErrors";

// import cors from 'cors'

export const app = express();

app.disable("x-powered-by");

// app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

app.get("/api", (req, res) => {
  res.send("Hello World 2! " + process.env.NODE_ENV);
});

app.use("/auth", authRouter);
app.use(handleUnauthorizedError);

export const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
    });
  } catch (e) {
    disconnect();
    console.error(e);
  }
};
