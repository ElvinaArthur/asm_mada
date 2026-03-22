// controllers/eventController.js - VERSION SIMPLIFIÉE POUR BETTER-SQLITE3
const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll(req.query);

    // Formater les événements
    const formattedEvents = events.map((event) => ({
      ...event,
      imageUrl: event.image
        ? `/uploads/events/${event.image}`
        : "/default-event.jpg",
      featured: Boolean(event.featured),
      registration_open: Boolean(event.registration_open),
    }));

    res.json({
      success: true,
      data: formattedEvents,
      count: formattedEvents.length,
    });
  } catch (error) {
    console.error("❌ Erreur getEvents:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    // Formater l'événement
    event.imageUrl = event.image
      ? `/uploads/events/${event.image}`
      : "/default-event.jpg";
    event.featured = Boolean(event.featured);
    event.registration_open = Boolean(event.registration_open);

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("❌ Erreur getEvent:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// Les autres méthodes restent les mêmes
// createEvent, updateEvent, deleteEvent, getEventTypes

exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      created_by: req.user.id,
      image: req.file ? req.file.filename : null,
    };

    // Validation simple
    if (!eventData.title || !eventData.date || !eventData.location) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Titre, date et lieu sont requis",
      });
    }

    const eventId = await Event.create(eventData);
    const event = await Event.findById(eventId);
    event.imageUrl = event.image
      ? `/uploads/events/${event.image}`
      : "/default-event.jpg";

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      data: event,
    });
  } catch (error) {
    console.error("❌ Erreur createEvent:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création",
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.filename;
      // Supprimer l'ancienne image
      if (event.image) {
        const oldPath = path.join(__dirname, "../uploads/events", event.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await Event.update(req.params.id, updateData);
    const updatedEvent = await Event.findById(req.params.id);
    updatedEvent.imageUrl = updatedEvent.image
      ? `/uploads/events/${updatedEvent.image}`
      : "/default-event.jpg";

    res.json({
      success: true,
      message: "Événement mis à jour",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("❌ Erreur updateEvent:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour",
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé",
      });
    }

    // Supprimer l'image
    if (event.image) {
      const imagePath = path.join(__dirname, "../uploads/events", event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Event.delete(req.params.id);

    res.json({
      success: true,
      message: "Événement supprimé",
    });
  } catch (error) {
    console.error("❌ Erreur deleteEvent:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
    });
  }
};

exports.getEventTypes = async (req, res) => {
  try {
    const types = await Event.getTypes();

    res.json({
      success: true,
      data: types,
    });
  } catch (error) {
    console.error("❌ Erreur getEventTypes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
