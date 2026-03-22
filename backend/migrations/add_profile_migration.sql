-- migrations/add_profile_fields.sql
-- Ajouter les colonnes de profil à la table users

-- Vérifier si les colonnes existent déjà avant de les ajouter
-- SQLite ne supporte pas ADD COLUMN IF NOT EXISTS, donc on utilise un script conditionnel

-- Photo de profil
ALTER TABLE users ADD COLUMN photoUrl TEXT DEFAULT NULL;

-- Informations de contact
ALTER TABLE users ADD COLUMN phone TEXT DEFAULT NULL;
ALTER TABLE users ADD COLUMN birthYear INTEGER DEFAULT NULL;
ALTER TABLE users ADD COLUMN location TEXT DEFAULT NULL;

-- Informations professionnelles
ALTER TABLE users ADD COLUMN currentPosition TEXT DEFAULT NULL;
ALTER TABLE users ADD COLUMN company TEXT DEFAULT NULL;

-- Biographie
ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL;

-- Background académique (JSON)
ALTER TABLE users ADD COLUMN academicBackground TEXT DEFAULT NULL;

-- Postes précédents (JSON array)
ALTER TABLE users ADD COLUMN previousPositions TEXT DEFAULT NULL;

-- Paramètres de confidentialité (JSON)
ALTER TABLE users ADD COLUMN privacy TEXT DEFAULT NULL;

-- Date de mise à jour
ALTER TABLE users ADD COLUMN updatedAt TEXT DEFAULT (datetime('now'));

-- Créer un index sur les champs fréquemment recherchés
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company);
CREATE INDEX IF NOT EXISTS idx_users_currentPosition ON users(currentPosition);

-- Initialiser les paramètres de confidentialité par défaut pour les utilisateurs existants
UPDATE users 
SET privacy = '{"showPhone":false,"showEmail":false,"showBirthYear":false,"showCompany":false,"showLocation":false,"showAcademic":false,"showPreviousPositions":false,"showBio":false}'
WHERE privacy IS NULL;

-- Initialiser academicBackground vide pour les utilisateurs existants
UPDATE users 
SET academicBackground = '{"degree":"","field":"","graduationYear":"","institution":""}'
WHERE academicBackground IS NULL;

-- Initialiser previousPositions vide pour les utilisateurs existants
UPDATE users 
SET previousPositions = '[]'
WHERE previousPositions IS NULL;