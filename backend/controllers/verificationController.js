// backend/controllers/verificationController.js
const User = require("../models/User");

const verificationController = {
  // Récupérer les utilisateurs en attente
  getPendingUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const query = {
        status: "pending",
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };

      const users = await User.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-password")
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Vérifier un utilisateur
  verifyUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      user.status = "verified";
      user.verifiedAt = new Date();
      user.verifiedBy = req.user._id;
      await user.save();

      // Envoyer un email de confirmation
      await sendVerificationEmail(user.email, user.firstName);

      res.json({
        success: true,
        message: "Utilisateur vérifié avec succès",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Rejeter un utilisateur
  rejectUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { reason } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      user.status = "rejected";
      user.rejectionReason = reason;
      user.rejectedAt = new Date();
      await user.save();

      // Envoyer un email de rejet
      await sendRejectionEmail(user.email, user.firstName, reason);

      res.json({
        success: true,
        message: "Utilisateur rejeté",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Upload de justificatif
  uploadProof: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier uploadé" });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      user.membershipProof = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };

      user.status = "pending";
      await user.save();

      res.json({
        success: true,
        message: "Justificatif uploadé avec succès",
        proof: user.membershipProof,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = verificationController;
