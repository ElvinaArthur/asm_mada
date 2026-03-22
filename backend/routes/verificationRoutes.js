// backend/routes/verificationRoutes.js
const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Routes publiques
router.post(
  "/upload-proof",
  authMiddleware.verifyToken,
  upload.single("membershipProof"),
  verificationController.uploadProof,
);

// Routes admin
router.get(
  "/pending",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  verificationController.getPendingUsers,
);

router.put(
  "/verify/:userId",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  verificationController.verifyUser,
);

router.put(
  "/reject/:userId",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  verificationController.rejectUser,
);

module.exports = router;
