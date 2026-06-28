// Seed événements ASM — node scripts/seed-events.mjs
import pg from 'pg';
const { Client } = pg;

const DB_URL = 'postgresql://neondb_owner:npg_FgmeV8prsCK7@ep-holy-band-atv3z7tw.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';

const events = [
  {
    title: "Colloque International de Sociologie Malgache 2026",
    description: "Le colloque annuel de l'ASM réunit chercheurs, enseignants-chercheurs et praticiens des sciences sociales pour présenter leurs travaux sur les transformations sociales à Madagascar. Thème 2026 : « Inégalités, résilience et dynamiques communautaires ». Appel à communications ouvert jusqu'au 15 juillet 2026.",
    date: "2026-09-18T08:00:00",
    location: "Université d'Antananarivo — Amphithéâtre central, Bâtiment principal",
    imageUrl: "/events/colloque-2026.jpg",
    maxParticipants: 300,
  },
  {
    title: "Conférence : Méthodes qualitatives en sciences sociales",
    description: "Conférence-atelier d'une journée sur les méthodes de recherche qualitative : entretiens semi-directifs, observation participante, analyse thématique et récits de vie. Animée par Dr Haingo Rakotomalala (CNRS/ASM). Ouverte aux étudiants Master et Doctorat, chercheurs juniors.",
    date: "2026-07-25T09:00:00",
    location: "Centre Culturel Albert Camus, Antananarivo",
    imageUrl: "/events/methodes-qualitatives.jpg",
    maxParticipants: 60,
  },
  {
    title: "Formation : Analyse quantitative avec SPSS et R",
    description: "Formation intensive de 3 jours sur l'analyse statistique des données sociales. Modules : statistiques descriptives, régressions linéaires et logistiques, analyse factorielle. Pré-requis : notions de base en statistiques. Places limitées — inscription obligatoire avant le 10 juillet 2026.",
    date: "2026-07-14T08:30:00",
    location: "Faculté des Lettres et Sciences Humaines, Salle informatique 204",
    imageUrl: "/events/formation-spss-r.jpg",
    maxParticipants: 25,
  },
  {
    title: "Offre de bourse de recherche — Sociologie rurale",
    description: "L'ASM, en partenariat avec l'IRD et l'Agence Universitaire de la Francophonie, propose 3 bourses de recherche de 12 mois pour des projets portant sur les dynamiques rurales, les migrations internes et le développement agricole à Madagascar. Dossier de candidature à soumettre avant le 30 juin 2026. Montant : 600€/mois.",
    date: "2026-06-30T23:59:00",
    location: "Candidature en ligne — soumission dossier PDF",
    imageUrl: "/events/bourse-recherche.jpg",
    maxParticipants: 3,
  },
  {
    title: "Offre d'emploi : Assistant(e) de recherche — Sociologie urbaine",
    description: "L'Institut National de la Statistique (INSTAT) recherche un(e) assistant(e) de recherche pour un projet de 18 mois sur l'urbanisation et les inégalités sociales dans les grandes villes malgaches. Profil : Master en sociologie ou sciences sociales, maîtrise des méthodes mixtes. CDD 18 mois renouvelable. Envoyer CV + lettre de motivation avant le 25 juillet 2026.",
    date: "2026-07-25T17:00:00",
    location: "INSTAT Antananarivo — Poste présentiel avec déplacements terrain",
    imageUrl: "/events/offre-emploi-assistant.jpg",
    maxParticipants: 1,
  },
  {
    title: "Atelier : Éthique de la recherche en terrain sensible",
    description: "Atelier interactif abordant les enjeux éthiques de la recherche qualitative sur des terrains sensibles : populations vulnérables, conflits, santé mentale, genre et violences. Animé par deux sociologues de l'INED et de l'Université de Fianarantsoa. Participation sur dossier de motivation (1 page).",
    date: "2026-08-05T09:00:00",
    location: "Hôtel Carlton, Antananarivo — Salle Panorama",
    imageUrl: "/events/ethique-recherche.jpg",
    maxParticipants: 30,
  },
  {
    title: "Offre de stage — Enquête nationale sur le bien-être social",
    description: "L'ASM recrute 5 enquêteurs/enquêtrices de terrain pour une enquête nationale sur le bien-être et la cohésion sociale à Madagascar (régions Analamanga, Vakinankaratra et Boeny). Indemnité : 200 000 MGA/mois + frais de déplacement. Profil : étudiant(e)s en sociologie, anthropologie ou sciences politiques (L3 minimum). Contrat 3 mois à partir d'août 2026.",
    date: "2026-07-31T17:00:00",
    location: "Terrain national — résidence sur zone requise",
    imageUrl: "/events/stage-enquete.jpg",
    maxParticipants: 5,
  },
  {
    title: "Conférence publique : Sociologie du numérique en Afrique",
    description: "Conférence grand public animée par Pr. Jean-Marc Ratsimba sur l'impact des technologies numériques sur les pratiques sociales en Afrique subsaharienne et à Madagascar : fracture numérique, réseaux sociaux, mobilisation collective en ligne et nouvelles formes d'identité. Entrée libre, inscription recommandée.",
    date: "2026-08-20T18:30:00",
    location: "Alliance Française d'Antananarivo, Grande Salle",
    imageUrl: "/events/conference-numerique.jpg",
    maxParticipants: 150,
  },
];

const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

async function seed() {
  await client.connect();
  console.log('✅ Connecté à Neon\n');

  let count = 0;
  for (const ev of events) {
    try {
      await client.query(
        `INSERT INTO events (title, description, date, location, "imageUrl", "maxParticipants", "isPublished")
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT DO NOTHING`,
        [ev.title, ev.description, ev.date, ev.location, ev.imageUrl, ev.maxParticipants]
      );
      console.log(`✅ ${ev.title}`);
      count++;
    } catch (e) {
      console.error(`❌ ${ev.title} — ${e.message}`);
    }
  }

  console.log(`\n═══════════════════════════════`);
  console.log(`✅ ${count}/${events.length} événements insérés`);
  await client.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
