// backend/routes/directoryRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { protect } = require("../middleware/auth");

// @desc    Récupérer la liste des membres (version publique)
// @route   GET /api/directory/members
// @access  Public (ou protégé selon tes besoins)
router.get("/members", async (req, res) => {
  try {
    const { page = 1, limit = 12, search, filter, region } = req.query;
    const offset = (page - 1) * limit;

    // Construire la requête de base
    let sql = `
      SELECT 
        id, firstName, lastName, 
        currentPosition as title,
        company as institution,
        location,
        bio,
        photoUrl,
        isVerified,
        createdAt as memberSince,
        -- Champs publics uniquement
        CASE 
          WHEN json_extract(privacy, '$.showPhone') = 1 THEN phone 
          ELSE NULL 
        END as phone,
        CASE 
          WHEN json_extract(privacy, '$.showEmail') = 1 THEN email 
          ELSE NULL 
        END as email,
        CASE 
          WHEN json_extract(privacy, '$.showCompany') = 1 THEN company 
          ELSE NULL 
        END as company_public,
        CASE 
          WHEN json_extract(privacy, '$.showLocation') = 1 THEN location 
          ELSE NULL 
        END as location_public,
        CASE 
          WHEN json_extract(privacy, '$.showAcademic') = 1 THEN academicBackground 
          ELSE NULL 
        END as academicBackground_public,
        CASE 
          WHEN json_extract(privacy, '$.showPreviousPositions') = 1 THEN previousPositions 
          ELSE NULL 
        END as previousPositions_public,
        CASE 
          WHEN json_extract(privacy, '$.showBio') = 1 THEN bio 
          ELSE NULL 
        END as bio_public
      FROM users
      WHERE isVerified = 1
    `;

    const params = [];

    // Filtre par recherche
    if (search) {
      sql += ` AND (firstName LIKE ? OR lastName LIKE ? OR currentPosition LIKE ? OR company LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filtre par région
    if (region && region !== "all") {
      sql += ` AND location LIKE ?`;
      params.push(`%${region}%`);
    }

    // Filtre par type (enseignants, chercheurs, etc.)
    if (filter === "enseignants") {
      sql += ` AND currentPosition LIKE '%enseignant%' OR currentPosition LIKE '%professeur%'`;
    } else if (filter === "chercheurs") {
      sql += ` AND currentPosition LIKE '%chercheur%'`;
    } else if (filter === "professionnels") {
      sql += ` AND currentPosition NOT LIKE '%enseignant%' AND currentPosition NOT LIKE '%chercheur%'`;
    } else if (filter === "nouveaux") {
      sql += ` AND createdAt > datetime('now', '-30 days')`;
    }

    // Compter le total
    const countSql = sql.replace(
      /SELECT.*FROM/,
      "SELECT COUNT(*) as total FROM",
    );
    const countStmt = db.prepare(countSql);
    const total = countStmt.get(...params).total;

    // Ajouter la pagination
    sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    // Exécuter la requête
    const stmt = db.prepare(sql);
    const members = stmt.all(...params);

    // Parser les champs JSON pour chaque membre
    const formattedMembers = members.map((member) => ({
      ...member,
      academicBackground: member.academicBackground_public
        ? JSON.parse(member.academicBackground_public)
        : null,
      previousPositions: member.previousPositions_public
        ? JSON.parse(member.previousPositions_public)
        : [],
      expertise: [], // À remplir si tu as une table d'expertise
      fullName: `${member.firstName} ${member.lastName}`,
      avatarColor: getAvatarColor(member.id), // Fonction utilitaire
    }));

    res.json({
      success: true,
      data: formattedMembers,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Erreur GET /directory/members:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des membres",
    });
  }
});

// @desc    Récupérer les détails complets d'un membre
// @route   GET /api/directory/members/:id
// @access  Public
router.get("/members/:id", async (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        id, firstName, lastName, email, phone, birthYear,
        currentPosition, company, location, bio, photoUrl,
        academicBackground, previousPositions, privacy,
        isVerified, createdAt as memberSince
      FROM users
      WHERE id = ? AND isVerified = 1
    `);

    const member = stmt.get(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Membre non trouvé",
      });
    }

    // Parser les champs JSON
    const privacy = member.privacy ? JSON.parse(member.privacy) : {};
    const academicBackground = member.academicBackground
      ? JSON.parse(member.academicBackground)
      : null;
    const previousPositions = member.previousPositions
      ? JSON.parse(member.previousPositions)
      : [];

    // Filtrer selon les préférences de confidentialité
    const publicProfile = {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      fullName: `${member.firstName} ${member.lastName}`,
      title: member.currentPosition,
      isVerified: member.isVerified,
      memberSince: member.memberSince,
      photoUrl: member.photoUrl,

      // Champs avec contrôle de confidentialité
      email: privacy.showEmail ? member.email : null,
      phone: privacy.showPhone ? member.phone : null,
      company: privacy.showCompany ? member.company : null,
      location: privacy.showLocation ? member.location : null,
      bio: privacy.showBio ? member.bio : null,
      academicBackground: privacy.showAcademic ? academicBackground : null,
      previousPositions: privacy.showPreviousPositions
        ? previousPositions
        : null,

      // Champs toujours publics
      currentPosition: member.currentPosition,
    };

    res.json({
      success: true,
      profile: publicProfile,
    });
  } catch (error) {
    console.error("❌ Erreur GET /directory/members/:id:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du membre",
    });
  }
});

// @desc    Récupérer les statistiques de l'annuaire
// @route   GET /api/directory/stats
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    // Total des membres vérifiés
    const totalStmt = db.prepare(
      "SELECT COUNT(*) as total FROM users WHERE isVerified = 1",
    );
    const total = totalStmt.get().total;

    // Répartition par région
    const regionStmt = db.prepare(`
      SELECT location, COUNT(*) as count 
      FROM users 
      WHERE isVerified = 1 AND location IS NOT NULL 
      GROUP BY location 
      ORDER BY count DESC
    `);
    const byRegion = {};
    regionStmt.all().forEach((row) => {
      byRegion[row.location] = row.count;
    });

    // Répartition par domaine (à adapter selon ta structure)
    const expertiseStmt = db.prepare(`
      SELECT currentPosition, COUNT(*) as count 
      FROM users 
      WHERE isVerified = 1 AND currentPosition IS NOT NULL 
      GROUP BY currentPosition 
      ORDER BY count DESC 
      LIMIT 10
    `);
    const byExpertise = {};
    expertiseStmt.all().forEach((row) => {
      byExpertise[row.currentPosition] = row.count;
    });

    // Nouveaux membres (30 derniers jours)
    const newStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE isVerified = 1 AND createdAt > datetime('now', '-30 days')
    `);
    const newMembers = newStmt.get().count;

    res.json({
      success: true,
      total,
      verified: total,
      pending: 0, // Non applicable pour l'annuaire public
      byRegion,
      byExpertise,
      newMembers,
    });
  } catch (error) {
    console.error("❌ Erreur GET /directory/stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
});

// Fonction utilitaire pour les couleurs d'avatar
function getAvatarColor(id) {
  const colors = [
    "from-blue-500 to-cyan-600",
    "from-green-500 to-emerald-600",
    "from-yellow-500 to-orange-600",
    "from-purple-500 to-pink-600",
    "from-red-500 to-rose-600",
    "from-indigo-500 to-blue-600",
  ];
  return colors[id % colors.length];
}

module.exports = router;
