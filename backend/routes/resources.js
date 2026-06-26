import { Router } from "express";
import { defaultResources, allocate, release } from "../services/resources/resourceManager.js";

const router = Router();
let resources = { ...defaultResources };

router.get("/", (_req, res) => res.json(resources));
router.post("/configure", (req, res) => {
  resources = { ...resources, ...req.body };
  res.json(resources);
});
router.post("/allocate", (req, res) => {
  const result = allocate(resources, req.body.order || {});
  resources = result.resources;
  res.json(result);
});
router.post("/release", (req, res) => {
  const result = release(resources, req.body.order || {});
  resources = result.resources;
  res.json(result);
});

export default router;
