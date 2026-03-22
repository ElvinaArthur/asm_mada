// src/pages/Legal/MentionsPage.jsx
import React from "react";
import LegalLayout from "./LegalLayout";

const MentionsPage = () => (
  <LegalLayout title="Mentions légales" lastUpdated="Janvier 2025">
    <h2>1. Éditeur de la plateforme</h2>
    <p>La plateforme numérique de l'ASM est éditée par :</p>
    <ul>
      <li>
        <strong>Dénomination :</strong> Association des Sociologues Malagasy
        (ASM)
      </li>
      <li>
        <strong>Forme juridique :</strong> Association à but non lucratif
      </li>
      <li>
        <strong>Siège social :</strong> Antananarivo, Madagascar
      </li>
      <li>
        <strong>Fondée en :</strong> 1990
      </li>
      <li>
        <strong>Email :</strong>{" "}
        <a href="mailto:contact@asm.mg">contact@asm.mg</a>
      </li>
    </ul>

    <h2>2. Directeur de la publication</h2>
    <p>
      Le directeur de la publication est le Président en exercice de
      l'Association des Sociologues Malagasy, dont les coordonnées sont
      disponibles sur demande à l'adresse
      <a href="mailto:contact@asm.mg"> contact@asm.mg</a>.
    </p>

    <h2>3. Hébergement</h2>
    <p>
      La plateforme est hébergée sur des serveurs dédiés. Pour toute question
      technique relative à l'hébergement, contactez l'équipe technique à{" "}
      <a href="mailto:contact@asm.mg">contact@asm.mg</a>.
    </p>

    <h2>4. Propriété intellectuelle</h2>
    <p>
      L'ensemble du contenu de la plateforme (textes, documents, logos,
      illustrations, structure de la base de données) est protégé par le droit
      d'auteur et appartient à l'ASM ou à ses membres contributeurs, sauf
      mention contraire.
    </p>
    <p>
      Toute reproduction, représentation, modification ou exploitation de tout
      ou partie de la plateforme sans autorisation écrite préalable de l'ASM est
      interdite et constitue une contrefaçon.
    </p>

    <h2>5. Contenu des membres</h2>
    <p>
      Les informations publiées dans les profils et l'annuaire sont fournies par
      les membres eux-mêmes et relèvent de leur responsabilité. L'ASM ne saurait
      être tenue responsable de l'exactitude de ces informations.
    </p>

    <h2>6. Liens hypertextes</h2>
    <p>
      La plateforme peut contenir des liens vers des sites tiers. L'ASM n'exerce
      aucun contrôle sur ces sites et décline toute responsabilité quant à leur
      contenu.
    </p>

    <h2>7. Droit applicable</h2>
    <p>
      La plateforme est soumise au droit malgache. Tout litige relatif à son
      utilisation sera soumis aux juridictions compétentes d'Antananarivo.
    </p>

    <h2>8. Contact</h2>
    <p>
      Pour toute question ou signalement :{" "}
      <a href="mailto:contact@asm.mg">contact@asm.mg</a>
    </p>
  </LegalLayout>
);

export default MentionsPage;
