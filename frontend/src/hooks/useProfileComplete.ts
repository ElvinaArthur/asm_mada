'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || '';

export interface MissingField {
  key: string;
  label: string;
  section: string;
}

export interface ProfileCompleteResult {
  loading: boolean;
  isComplete: boolean;
  missing: MissingField[];
  progress: number; // 0–100
}

const parseJsonArray = (val: unknown): unknown[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const r = JSON.parse(val); return Array.isArray(r) ? r : []; } catch { return []; } }
  return [];
};

const parseLocation = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) return val as Record<string, string>;
  if (typeof val === 'string') { try { return JSON.parse(val) || {}; } catch { return {}; } }
  return {};
};

// Tous les champs obligatoires pour débloquer l'accès
const REQUIRED_FIELDS: MissingField[] = [
  { key: 'photoUrl',      label: 'Photo de profil',                      section: 'Photo' },
  { key: 'phone',         label: 'Numéro de téléphone',                  section: 'Infos personnelles' },
  { key: 'bio',           label: 'Bio / présentation',                   section: 'Infos personnelles' },
  { key: 'position',      label: 'Poste actuel ou titre professionnel',   section: 'Infos professionnelles' },
  { key: 'institution',   label: 'Institution / organisme',              section: 'Infos professionnelles' },
  { key: 'country',       label: 'Pays actuel',                          section: 'Localisation' },
  { key: 'nationality',   label: 'Nationalité',                          section: 'Localisation' },
  { key: 'province',      label: 'Province actuelle',                    section: 'Localisation' },
  { key: 'region',        label: 'Région actuelle',                      section: 'Localisation' },
  { key: 'city',          label: 'Ville actuelle',                       section: 'Localisation' },
  { key: 'neighborhood',  label: 'Quartier actuel',                      section: 'Localisation' },
  { key: 'academic',      label: 'Cursus académique (université + diplôme)', section: 'Cursus' },
];

function checkMissing(profile: Record<string, unknown>): MissingField[] {
  const loc = parseLocation(profile.location);
  const edus = parseJsonArray(profile.academicEducations);
  const hasAcademic = edus.some((e: unknown) => {
    const edu = e as Record<string, string>;
    return edu.institution && edu.degree;
  });

  return REQUIRED_FIELDS.filter(f => {
    switch (f.key) {
      case 'photoUrl':     return !profile.photoUrl;
      case 'phone':        return !profile.phone;
      case 'bio':          return !profile.bio;
      case 'position':     return !profile.currentPosition && !profile.title;
      case 'institution':  return !profile.institution;
      case 'country':      return !loc.country;
      case 'nationality':  return !loc.nationality;
      case 'province':     return !loc.province;
      case 'region':       return !loc.region;
      case 'city':         return !loc.city;
      case 'neighborhood': return !loc.neighborhood;
      case 'academic':     return !hasAcademic;
      default:             return false;
    }
  });
}

export function useProfileComplete(): ProfileCompleteResult {
  const { user, loading: authLoading } = useAuth() as { user: Record<string, unknown> | null; loading: boolean };
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState<MissingField[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const profile = data.data || data.profile || {};
        setMissing(checkMissing(profile));
      })
      .catch(() => setMissing([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const total = REQUIRED_FIELDS.length;
  const done = total - missing.length;
  const progress = Math.round((done / total) * 100);

  return { loading, isComplete: missing.length === 0, missing, progress };
}
