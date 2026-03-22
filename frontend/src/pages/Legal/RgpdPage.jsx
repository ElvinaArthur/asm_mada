// src/pages/Legal/RgpdPage.jsx
import React from "react";
import LegalLayout from "./LegalLayout";

const RgpdPage = () => (
  <LegalLayout title="Données personnelles & RGPD" lastUpdated="Janvier 2025">
    <p>
      Bien que Madagascar ne soit pas membre de l'Union Européenne, l'ASM
      s'engage à respecter les principes du Règlement Général sur la Protection
      des Données (RGPD) comme standard international de référence, notamment
      pour protéger les membres de la diaspora résidant en Europe.
    </p>

    <h2>1. Principes appliqués</h2>
    <ul>
      <li>
        <strong>Licéité :</strong> Toute collecte est fondée sur votre
        consentement.
      </li>
      <li>
        <strong>Transparence :</strong> Vous savez exactement quelles données
        sont collectées et pourquoi.
      </li>
      <li>
        <strong>Minimisation :</strong> Seules les données nécessaires sont
        collectées.
      </li>
      <li>
        <strong>Exactitude :</strong> Vous pouvez corriger vos données à tout
        moment.
      </li>
      <li>
        <strong>Limitation de conservation :</strong> Vos données sont
        supprimées à la clôture du compte.
      </li>
      <li>
        <strong>Intégrité :</strong> Vos données sont protégées par des mesures
        de sécurité adéquates.
      </li>
    </ul>

    <h2>2. Données et finalités</h2>

    <h3>Données de compte</h3>
    <p>
      Email, prénom, nom — nécessaires pour vous identifier et sécuriser votre
      accès. Base légale : exécution du contrat d'adhésion.
    </p>

    <h3>Données de profil</h3>
    <p>
      Photo, biographie, localisation, téléphone, parcours académique,
      expériences professionnelles — renseignées volontairement. Chaque champ
      dispose d'un contrôle de visibilité (public / privé) dans votre profil.
      Base légale : consentement.
    </p>

    <h3>Données techniques</h3>
    <p>
      Adresse IP, navigateur, horodatage des connexions — collectées
      automatiquement pour la sécurité et le bon fonctionnement. Base légale :
      intérêt légitime.
    </p>

    <h2>3. Vos droits RGPD</h2>
    <ul>
      <li>
        <strong>Droit d'accès (Art. 15) :</strong> Obtenez une copie de vos
        données via votre profil ou par email.
      </li>
      <li>
        <strong>Droit de rectification (Art. 16) :</strong> Modifiez vos données
        dans votre profil à tout moment.
      </li>
      <li>
        <strong>Droit à l'effacement (Art. 17) :</strong> Demandez la
        suppression de votre compte et de vos données.
      </li>
      <li>
        <strong>Droit à la limitation (Art. 18) :</strong> Demandez la
        suspension du traitement de vos données.
      </li>
      <li>
        <strong>Droit à la portabilité (Art. 20) :</strong> Recevez vos données
        dans un format lisible par machine.
      </li>
      <li>
        <strong>Droit d'opposition (Art. 21) :</strong> Opposez-vous à certains
        traitements (ex. communications marketing).
      </li>
    </ul>

    <h2>4. Comment exercer vos droits ?</h2>
    <p>
      Envoyez votre demande à <a href="mailto:contact@asm.mg">contact@asm.mg</a>{" "}
      en précisant votre nom, prénom et le droit que vous souhaitez exercer.
      Nous répondrons dans un délai de 30 jours maximum.
    </p>

    <h2>5. Transferts de données</h2>
    <p>
      Vos données sont stockées à Madagascar. Aucun transfert vers des pays
      tiers n'est effectué sans garanties appropriées.
    </p>

    <h2>6. Réclamation</h2>
    <p>
      Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser
      une réclamation auprès de l'autorité de protection des données de votre
      pays de résidence.
    </p>

    <h2>7. Modifications</h2>
    <p>
      Cette politique peut être mise à jour. Vous serez informé par email de
      tout changement substantiel.
    </p>

    <h2>8. Contact DPO</h2>
    <p>
      Délégué à la protection des données :{" "}
      <a href="mailto:contact@asm.mg">contact@asm.mg</a>
    </p>
  </LegalLayout>
);

export default RgpdPage;
