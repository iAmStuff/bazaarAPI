import express from "express";
import morgan from "morgan";
import { connect, disconnect } from "./database.js";
import marketplaceRouter from "./routers/marketplaceRouter.js";
import authRouter from "./routers/authRouter.js";
import errorHandler from "./middleware/errorHandler.js";

connect();
const server = express();
const PORT = 5000;

server.use(express.json());
server.use(morgan("dev"));
server.use("/auth", authRouter);
server.use("/api/marketplaces", marketplaceRouter);

server.use("*", (req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
