// src/pages/Legal/PrivacyPage.jsx
import React from "react";
import LegalLayout from "./LegalLayout";

const PrivacyPage = () => (
  <LegalLayout title="Politique de confidentialité" lastUpdated="Janvier 2025">
    <h2>1. Responsable du traitement</h2>
    <p>
      L'Association des Sociologues Malagasy (ASM), dont le siège est à
      Antananarivo, Madagascar, est responsable du traitement de vos données
      personnelles collectées via la plateforme.
    </p>
    <p>
      Contact DPO : <a href="mailto:contact@asm.mg">contact@asm.mg</a>
    </p>

    <h2>2. Données collectées</h2>
    <p>Nous collectons les données suivantes :</p>
    <ul>
      <li>
        <strong>Données d'identité :</strong> prénom, nom, date de naissance.
      </li>
      <li>
        <strong>Données de contact :</strong> adresse email, numéro(s) de
        téléphone.
      </li>
      <li>
        <strong>Données de localisation :</strong> pays, région, ville, quartier
        (si renseignés).
      </li>
      <li>
        <strong>Données professionnelles :</strong> poste actuel, organisation,
        parcours académique.
      </li>
      <li>
        <strong>Données de connexion :</strong> date de dernière connexion,
        adresse IP.
      </li>
      <li>
        <strong>Contenu utilisateur :</strong> photo de profil, biographie.
      </li>
    </ul>

    <h2>3. Finalités du traitement</h2>
    <p>Vos données sont utilisées pour :</p>
    <ul>
      <li>Gérer votre compte membre et votre accès à la plateforme.</li>
      <li>
        Alimenter l'annuaire des membres (selon vos préférences de
        confidentialité).
      </li>
      <li>Vous envoyer des notifications relatives aux activités de l'ASM.</li>
      <li>Améliorer nos services et assurer la sécurité de la plateforme.</li>
    </ul>

    <h2>4. Base légale</h2>
    <p>
      Le traitement est fondé sur votre consentement (inscription volontaire) et
      sur l'intérêt légitime de l'ASM à gérer son réseau de membres.
    </p>

    <h2>5. Partage des données</h2>
    <p>
      Vos données ne sont jamais vendues à des tiers. Seules les informations
      que vous choisissez de rendre publiques (via les toggles de
      confidentialité dans votre profil) sont visibles par les autres membres
      connectés dans l'annuaire.
    </p>

    <h2>6. Vos droits</h2>
    <p>
      Conformément à la réglementation applicable, vous disposez des droits
      suivants :
    </p>
    <ul>
      <li>
        <strong>Accès :</strong> consulter vos données via votre profil.
      </li>
      <li>
        <strong>Rectification :</strong> modifier vos données dans votre profil.
      </li>
      <li>
        <strong>Effacement :</strong> demander la suppression de votre compte.
      </li>
      <li>
        <strong>Opposition :</strong> vous opposer à certains traitements.
      </li>
      <li>
        <strong>Portabilité :</strong> obtenir une copie de vos données.
      </li>
    </ul>
    <p>
      Pour exercer vos droits, contactez-nous à{" "}
      <a href="mailto:contact@asm.mg">contact@asm.mg</a>.
    </p>

    <h2>7. Durée de conservation</h2>
    <p>
      Vos données sont conservées tant que votre compte est actif. En cas de
      suppression de compte, vos données sont effacées dans un délai de 30
      jours, sauf obligation légale contraire.
    </p>

    <h2>8. Sécurité</h2>
    <p>
      Nous mettons en œuvre des mesures techniques appropriées (chiffrement des
      mots de passe, connexion HTTPS, tokens JWT) pour protéger vos données
      contre tout accès non autorisé.
    </p>
  </LegalLayout>
);

export default PrivacyPage;
