import { Router } from "express";
import { producerConsumerDemo } from "../services/synchronization/producerConsumer.js";
import { mutexDemo } from "../services/synchronization/mutexManager.js";
import { semaphoreDemo } from "../services/resources/semaphoreManager.js";

const router = Router();

router.post("/producer-consumer", (req, res) => res.json(producerConsumerDemo(req.body.bufferSize || 4)));
router.post("/mutex-demo", (req, res) => res.json(mutexDemo(req.body.inventory)));
router.post("/semaphore-demo", (req, res) => res.json(semaphoreDemo(req.body.resources)));

export default router;
