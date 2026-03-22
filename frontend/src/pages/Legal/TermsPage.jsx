// src/pages/Legal/TermsPage.jsx
import React from "react";
import LegalLayout from "./LegalLayout";

const TermsPage = () => (
  <LegalLayout title="Conditions d'utilisation" lastUpdated="Janvier 2025">
    <h2>1. Objet</h2>
    <p>
      Les présentes conditions régissent l'accès et l'utilisation de la
      plateforme numérique de l'Association des Sociologues Malagasy (ASM),
      accessible à l'adresse du site. En accédant à la plateforme, vous acceptez
      sans réserve les présentes conditions.
    </p>

    <h2>2. Accès à la plateforme</h2>
    <p>
      L'accès complet à la plateforme est réservé aux membres de l'ASM dont le
      compte a été vérifié et validé par un administrateur. Certaines sections
      (annuaire public, événements) sont accessibles sans inscription.
    </p>

    <h2>3. Inscription et compte membre</h2>
    <p>
      Pour devenir membre, vous devez fournir des informations exactes et à jour
      lors de votre inscription. Vous êtes responsable de la confidentialité de
      vos identifiants de connexion. Tout accès via votre compte est réputé
      effectué par vous.
    </p>
    <ul>
      <li>Une seule inscription par personne est autorisée.</li>
      <li>Le compte est personnel et non cessible.</li>
      <li>
        En cas de perte d'identifiants, utilisez la fonction "Mot de passe
        oublié".
      </li>
    </ul>

    <h2>4. Utilisation de la bibliothèque numérique</h2>
    <p>
      Les documents mis à disposition dans la bibliothèque sont réservés à un
      usage personnel et académique. Toute reproduction, redistribution ou
      exploitation commerciale sans autorisation écrite de l'ASM est interdite.
    </p>

    <h2>5. Comportement des utilisateurs</h2>
    <p>Il est interdit de :</p>
    <ul>
      <li>Publier des informations fausses ou trompeuses dans votre profil.</li>
      <li>
        Tenter d'accéder à des sections auxquelles vous n'êtes pas autorisé.
      </li>
      <li>
        Utiliser la plateforme à des fins commerciales non approuvées par l'ASM.
      </li>
      <li>Porter atteinte aux droits d'autres membres.</li>
    </ul>

    <h2>6. Suspension et résiliation</h2>
    <p>
      L'ASM se réserve le droit de suspendre ou supprimer tout compte ne
      respectant pas les présentes conditions, sans préavis ni remboursement
      éventuel de cotisation.
    </p>

    <h2>7. Limitation de responsabilité</h2>
    <p>
      L'ASM met tout en œuvre pour assurer la disponibilité de la plateforme,
      mais ne garantit pas un service ininterrompu. L'ASM ne saurait être tenue
      responsable des pertes de données ou dommages indirects liés à
      l'utilisation de la plateforme.
    </p>

    <h2>8. Modification des conditions</h2>
    <p>
      L'ASM peut modifier ces conditions à tout moment. Les membres seront
      informés par email ou notification sur la plateforme. La poursuite de
      l'utilisation après notification vaut acceptation des nouvelles
      conditions.
    </p>

    <h2>9. Droit applicable</h2>
    <p>
      Les présentes conditions sont régies par le droit malgache. Tout litige
      sera soumis à la compétence des juridictions compétentes d'Antananarivo,
      Madagascar.
    </p>

    <h2>10. Contact</h2>
    <p>
      Pour toute question relative aux présentes conditions :{" "}
      <a href="mailto:contact@asm.mg">contact@asm.mg</a>
    </p>
  </LegalLayout>
);

export default TermsPage;
