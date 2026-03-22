// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventTypes,
} = require("../controllers/eventController");
const { uploadEvent } = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");

// Routes publiques
router.get("/", getEvents);
router.get("/types", getEventTypes);
router.get("/:id", getEvent);

// Routes protégées (admin seulement)
router.post("/", protect, authorize("admin"), uploadEvent, createEvent);
router.put("/:id", protect, authorize("admin"), uploadEvent, updateEvent);
router.delete("/:id", protect, authorize("admin"), deleteEvent);

module.exports = router;
