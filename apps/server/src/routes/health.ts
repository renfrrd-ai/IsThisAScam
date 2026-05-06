import { Router } from "express";
import type { ApiHealth } from "@scamradar/types";

export const healthRouter = Router();

export function getHealthPayload(): ApiHealth {
  return {
    status: "ok",
    service: "scamradar-api",
  };
}

healthRouter.get("/", (_, res) => {
  res.json(getHealthPayload());
});
