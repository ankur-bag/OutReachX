import express, { Request, Response } from "express";
import multer from "multer";
import { runCampaignAgents } from "../agents/agentGraph";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/campaign", upload.single("csv"), async (req: Request, res: Response) => {
  try {
    const result = await runCampaignAgents({
      campaign_name: req.body.campaign_name,
      campaign_description: req.body.campaign_description,
      csvPath: (req.file as Express.Multer.File).path
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
