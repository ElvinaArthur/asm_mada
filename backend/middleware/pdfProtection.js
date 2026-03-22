// middleware/pdfProtection.js
const protectPDF = (req, res, next) => {
  // Appliquer seulement aux routes de PDF
  if (req.path.includes("/view") || req.path.match(/\/api\/books\/\d+\/file/)) {
    // 1. Bloquer certaines méthodes
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Méthode non autorisée pour les PDF",
      });
    }

    // 2. Vérifier les en-têtes de référence (optionnel)
    const referer = req.headers.referer || req.headers.origin;
    if (
      referer &&
      !referer.includes("localhost") &&
      !referer.includes("127.0.0.1")
    ) {
      // Vous pouvez ajouter ici une validation des domaines autorisés
      console.log(`Accès PDF depuis: ${referer}`);
    }

    // 3. Ajouter des en-têtes de sécurité supplémentaires
    res.setHeader("X-PDF-Protection", "no-download, no-print, no-copy");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // 4. Empêcher la mise en cache problématique
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // 5. Date courante pour éviter les conflits de cache
    res.setHeader("Date", new Date().toUTCString());
  }

  next();
};

module.exports = protectPDF;
