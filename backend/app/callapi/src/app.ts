import express from "express";
import campaignRoutes from "./api/campaign.routes";

const app = express();
app.use(express.json());
app.use("/api", campaignRoutes);
console.log("hi")

export default app;
