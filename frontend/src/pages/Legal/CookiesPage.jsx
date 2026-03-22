// src/pages/Legal/CookiesPage.jsx
import React from "react";
import LegalLayout from "./LegalLayout";

const CookiesPage = () => (
  <LegalLayout title="Politique des cookies" lastUpdated="Janvier 2025">
    <h2>1. Qu'est-ce qu'un cookie ?</h2>
    <p>
      Un cookie est un petit fichier texte déposé sur votre appareil lors de
      votre visite sur notre plateforme. Il permet de mémoriser des informations
      sur votre session et vos préférences pour améliorer votre expérience.
    </p>

    <h2>2. Cookies utilisés par l'ASM</h2>

    <h3>Cookies essentiels (toujours actifs)</h3>
    <p>
      Ces cookies sont indispensables au fonctionnement de la plateforme. Ils ne
      peuvent pas être désactivés.
    </p>
    <ul>
      <li>
        <strong>token</strong> — Votre jeton d'authentification JWT. Durée :
        session.
      </li>
      <li>
        <strong>user</strong> — Informations de session (nom, rôle). Durée :
        session.
      </li>
      <li>
        <strong>asm_cookie_consent</strong> — Mémorisation de vos préférences
        cookies. Durée : 1 an.
      </li>
    </ul>

    <h3>Cookies analytiques (optionnels)</h3>
    <p>
      Utilisés pour comprendre comment les membres utilisent la plateforme afin
      de l'améliorer. Aucune donnée n'est partagée avec des tiers.
    </p>
    <ul>
      <li>Mesure du nombre de visites par page.</li>
      <li>Temps moyen passé sur la plateforme.</li>
      <li>Fréquence d'accès à la bibliothèque.</li>
    </ul>

    <h3>Cookies de préférences (optionnels)</h3>
    <p>
      Permettent de mémoriser vos choix d'interface (langue, affichage) pour
      personnaliser votre expérience.
    </p>

    <h2>3. Gestion de vos préférences</h2>
    <p>
      Lors de votre première visite, un bandeau vous permet d'accepter ou de
      refuser les différentes catégories de cookies. Vous pouvez modifier vos
      choix à tout moment depuis les paramètres de votre navigateur ou en
      effaçant le cookie <code>asm_cookie_consent</code>.
    </p>

    <h2>4. Comment désactiver les cookies ?</h2>
    <p>
      Vous pouvez configurer votre navigateur pour refuser les cookies. Notez
      que la désactivation des cookies essentiels empêchera la connexion à votre
      compte.
    </p>
    <ul>
      <li>Chrome : Paramètres → Confidentialité → Cookies.</li>
      <li>Firefox : Paramètres → Vie privée → Cookies.</li>
      <li>Safari : Préférences → Confidentialité.</li>
      <li>Edge : Paramètres → Confidentialité → Cookies.</li>
    </ul>

    <h2>5. Contact</h2>
    <p>
      Pour toute question relative aux cookies :{" "}
      <a href="mailto:contact@asm.mg">contact@asm.mg</a>
    </p>
  </LegalLayout>
);

export default CookiesPage;
