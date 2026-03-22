// src/pages/user/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Eye,
  EyeOff,
  Save,
  Camera,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

// ─── Privacy Toggle ────────────────────────────────────────────────
const PrivacyToggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={onChange}
    className="flex items-center gap-1.5 text-sm"
  >
    {checked ? (
      <>
        <Eye className="w-4 h-4 text-green-600" />
        <span className="text-green-600">{label || "Public"}</span>
      </>
    ) : (
      <>
        <EyeOff className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400">{label || "Privé"}</span>
      </>
    )}
  </button>
);

// ─── Section Header ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, rightSlot }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-900 flex items-center">
      <Icon className="w-6 h-6 mr-3 text-green-600" />
      {title}
    </h2>
    {rightSlot}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────
const ProfilePage = () => {
  const { user } = useAuth();

  const emptyAcademic = {
    degree: "",
    field: "",
    institution: "",
    startYear: "",
    endYear: "",
    description: "",
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phone2: "",
    birthDate: "",
    currentPosition: "",
    company: "",
    // Localisation décomposée
    country: "",
    province: "",
    region: "",
    city: "",
    neighborhood: "",
    bio: "",
    // Tableau de formations (multiple)
    academicEducations: [],
    previousPositions: [],
    privacy: {
      showPhone: false,
      showPhone2: false,
      showEmail: false,
      showBirthDate: false,
      showCompany: false,
      showLocation: false,
      showAcademic: false,
      showPreviousPositions: false,
      showBio: false,
    },
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedAcademic, setExpandedAcademic] = useState([]);

  // ── Charger profil ──────────────────────────────────────────────
  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.profile) {
        const p = data.profile;

        // Décomposer location JSON si nécessaire
        let locationParsed = {};
        if (p.location) {
          try {
            locationParsed =
              typeof p.location === "string"
                ? JSON.parse(p.location)
                : p.location;
          } catch {
            // ancien format texte brut → mettre dans city
            locationParsed = { city: p.location };
          }
        }

        // Normaliser academicEducations (ancien champ unique → tableau)
        let educations = [];
        if (Array.isArray(p.academicEducations)) {
          educations = p.academicEducations;
        } else if (
          p.academicBackground &&
          typeof p.academicBackground === "object"
        ) {
          // migration depuis ancien format objet unique
          const ab = p.academicBackground;
          if (ab.degree || ab.field || ab.institution) {
            educations = [
              {
                degree: ab.degree || "",
                field: ab.field || "",
                institution: ab.institution || "",
                startYear: "",
                endYear: ab.graduationYear || "",
                description: "",
              },
            ];
          }
        }

        setFormData({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          email: p.email || "",
          phone: p.phone || "",
          phone2: p.phone2 || "",
          birthDate: p.birthDate || (p.birthYear ? `${p.birthYear}-01-01` : ""),
          currentPosition: p.currentPosition || "",
          company: p.company || "",
          country: locationParsed.country || "",
          province: locationParsed.province || "",
          region: locationParsed.region || "",
          city: locationParsed.city || "",
          neighborhood: locationParsed.neighborhood || "",
          bio: p.bio || "",
          academicEducations: educations,
          previousPositions: p.previousPositions || [],
          privacy: {
            showPhone: false,
            showPhone2: false,
            showEmail: false,
            showBirthDate: false,
            showCompany: false,
            showLocation: false,
            showAcademic: false,
            showPreviousPositions: false,
            showBio: false,
            ...(p.privacy || {}),
          },
        });
        setExpandedAcademic(educations.map((_, i) => i));

        // Photo de profil — préfixer avec API_BASE si relatif
        if (p.photoUrl) {
          setPhotoPreview(
            p.photoUrl.startsWith("http")
              ? p.photoUrl
              : `${API_BASE}${p.photoUrl}`,
          );
        }
      }
    } catch (err) {
      console.error("Erreur chargement profil:", err);
    } finally {
      setPageLoading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const togglePrivacy = (field) => {
    setFormData((f) => ({
      ...f,
      privacy: { ...f.privacy, [field]: !f.privacy[field] },
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Formations académiques ──────────────────────────────────────
  const addEducation = () => {
    const newList = [...formData.academicEducations, { ...emptyAcademic }];
    setFormData((f) => ({ ...f, academicEducations: newList }));
    setExpandedAcademic((ex) => [...ex, newList.length - 1]);
  };

  const updateEducation = (idx, field, value) => {
    const list = [...formData.academicEducations];
    list[idx] = { ...list[idx], [field]: value };
    setFormData((f) => ({ ...f, academicEducations: list }));
  };

  const removeEducation = (idx) => {
    setFormData((f) => ({
      ...f,
      academicEducations: f.academicEducations.filter((_, i) => i !== idx),
    }));
    setExpandedAcademic((ex) =>
      ex.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)),
    );
  };

  const toggleExpandAcademic = (idx) => {
    setExpandedAcademic((ex) =>
      ex.includes(idx) ? ex.filter((i) => i !== idx) : [...ex, idx],
    );
  };

  // ── Postes précédents ───────────────────────────────────────────
  const addPreviousPosition = () => {
    setFormData((f) => ({
      ...f,
      previousPositions: [
        ...f.previousPositions,
        { title: "", company: "", startYear: "", endYear: "" },
      ],
    }));
  };

  const updatePreviousPosition = (idx, field, value) => {
    const list = [...formData.previousPositions];
    list[idx] = { ...list[idx], [field]: value };
    setFormData((f) => ({ ...f, previousPositions: list }));
  };

  const removePreviousPosition = (idx) => {
    setFormData((f) => ({
      ...f,
      previousPositions: f.previousPositions.filter((_, i) => i !== idx),
    }));
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      // Champs simples
      [
        "firstName",
        "lastName",
        "email",
        "phone",
        "phone2",
        "birthDate",
        "currentPosition",
        "company",
        "bio",
      ].forEach((k) => fd.append(k, formData[k]));

      // Localisation → JSON
      const locationObj = {
        country: formData.country,
        province: formData.province,
        region: formData.region,
        city: formData.city,
        neighborhood: formData.neighborhood,
      };
      fd.append("location", JSON.stringify(locationObj));

      // Formations académiques
      fd.append(
        "academicEducations",
        JSON.stringify(formData.academicEducations),
      );

      // Compatibilité ancien champ (premier diplôme)
      if (formData.academicEducations.length > 0) {
        const first = formData.academicEducations[0];
        fd.append(
          "academicBackground",
          JSON.stringify({
            degree: first.degree,
            field: first.field,
            institution: first.institution,
            graduationYear: first.endYear,
          }),
        );
      }

      fd.append(
        "previousPositions",
        JSON.stringify(formData.previousPositions),
      );
      fd.append("privacy", JSON.stringify(formData.privacy));

      if (profilePhoto) fd.append("photo", profilePhoto);

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: "Profil mis à jour avec succès !",
        });
        loadProfile();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Erreur lors de la mise à jour",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour du profil",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mon Profil</h1>
          <p className="text-gray-600">
            Gérez vos informations personnelles et vos préférences de
            confidentialité
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── 1. Photo de profil ─────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <SectionHeader icon={Camera} title="Photo de profil" />
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-4 ring-green-100">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-1 right-1 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 shadow-md transition"
                  title="Changer la photo"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Formats acceptés : JPG, PNG (max 5 Mo)
                </p>
                <label
                  htmlFor="photo-upload"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition text-sm"
                >
                  Choisir une photo
                </label>
              </div>
            </div>
          </div>

          {/* ── 2. Informations personnelles ───────────────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <SectionHeader icon={User} title="Informations personnelles" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Toujours visible dans l'annuaire
                </p>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Toujours visible dans l'annuaire
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <PrivacyToggle
                    checked={formData.privacy.showEmail}
                    onChange={() => togglePrivacy("showEmail")}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Date de naissance complète */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Date de naissance
                  </label>
                  <PrivacyToggle
                    checked={formData.privacy.showBirthDate}
                    onChange={() => togglePrivacy("showBirthDate")}
                  />
                </div>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInput}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Téléphone principal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Téléphone principal
                  </label>
                  <PrivacyToggle
                    checked={formData.privacy.showPhone}
                    onChange={() => togglePrivacy("showPhone")}
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInput}
                  placeholder="+261 34 00 000 00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Téléphone secondaire (facultatif) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Téléphone secondaire
                    <span className="text-xs text-gray-400 ml-1">
                      (facultatif)
                    </span>
                  </label>
                  <PrivacyToggle
                    checked={formData.privacy.showPhone2}
                    onChange={() => togglePrivacy("showPhone2")}
                  />
                </div>
                <input
                  type="tel"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleInput}
                  placeholder="+261 33 00 000 00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* ── 3. Localisation détaillée ──────────────────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader
                icon={MapPin}
                title="Localisation"
                rightSlot={
                  <PrivacyToggle
                    checked={formData.privacy.showLocation}
                    onChange={() => togglePrivacy("showLocation")}
                    label="Afficher dans l'annuaire"
                  />
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Pays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Globe className="w-4 h-4 text-gray-400" /> Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInput}
                  placeholder="Ex : Madagascar, France…"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Utile pour les membres de la diaspora
                </p>
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInput}
                  placeholder="Ex : Antananarivo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Région */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInput}
                  placeholder="Ex : Analamanga"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville / Commune
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInput}
                  placeholder="Ex : Antananarivo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Quartier */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quartier / Fokontany
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInput}
                  placeholder="Ex : Analakely, Mahamasina…"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* ── 4. Poste actuel ────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <SectionHeader icon={Briefcase} title="Poste actuel" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du poste *
                </label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInput}
                  placeholder="Ex : Sociologue chercheur"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Toujours visible dans l'annuaire
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Organisation / Employeur
                  </label>
                  <PrivacyToggle
                    checked={formData.privacy.showCompany}
                    onChange={() => togglePrivacy("showCompany")}
                  />
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInput}
                  placeholder="Ex : Université d'Antananarivo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* ── 5. Background académique (multiple) ───────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Parcours académique
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <PrivacyToggle
                  checked={formData.privacy.showAcademic}
                  onChange={() => togglePrivacy("showAcademic")}
                  label="Afficher dans l'annuaire"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
            </div>

            {formData.academicEducations.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Aucune formation ajoutée — cliquez sur « Ajouter » pour
                  commencer
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.academicEducations.map((edu, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    {/* Header de la carte */}
                    <div
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => toggleExpandAcademic(idx)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {edu.degree || "Diplôme non renseigné"}
                            {edu.field ? ` — ${edu.field}` : ""}
                          </p>
                          {edu.institution && (
                            <p className="text-xs text-gray-500">
                              {edu.institution}
                              {edu.endYear ? ` • ${edu.endYear}` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEducation(idx);
                          }}
                          className="text-red-400 hover:text-red-600 p-1 rounded transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {expandedAcademic.includes(idx) ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    {expandedAcademic.includes(idx) && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diplôme / Titre
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(idx, "degree", e.target.value)
                            }
                            placeholder="Ex : Licence, Master, Doctorat…"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Domaine / Spécialité
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) =>
                              updateEducation(idx, "field", e.target.value)
                            }
                            placeholder="Ex : Sociologie, Anthropologie…"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institution / École
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              updateEducation(
                                idx,
                                "institution",
                                e.target.value,
                              )
                            }
                            placeholder="Ex : Université d'Antananarivo"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Année de début
                          </label>
                          <input
                            type="number"
                            value={edu.startYear}
                            onChange={(e) =>
                              updateEducation(idx, "startYear", e.target.value)
                            }
                            placeholder="2015"
                            min="1950"
                            max={new Date().getFullYear()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Année de fin / obtention
                          </label>
                          <input
                            type="number"
                            value={edu.endYear}
                            onChange={(e) =>
                              updateEducation(idx, "endYear", e.target.value)
                            }
                            placeholder="2018"
                            min="1950"
                            max={new Date().getFullYear() + 10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description / Notes{" "}
                            <span className="text-gray-400 font-normal">
                              (facultatif)
                            </span>
                          </label>
                          <textarea
                            value={edu.description}
                            onChange={(e) =>
                              updateEducation(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={2}
                            placeholder="Mention, sujet de thèse, spécialisation…"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 6. Postes précédents ───────────────────────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Expériences professionnelles
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <PrivacyToggle
                  checked={formData.privacy.showPreviousPositions}
                  onChange={() => togglePrivacy("showPreviousPositions")}
                  label="Afficher"
                />
                <button
                  type="button"
                  onClick={addPreviousPosition}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
            </div>

            {formData.previousPositions.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-sm">
                Aucun poste précédent ajouté
              </p>
            ) : (
              <div className="space-y-4">
                {formData.previousPositions.map((pos, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removePreviousPosition(idx)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre du poste
                        </label>
                        <input
                          type="text"
                          value={pos.title}
                          onChange={(e) =>
                            updatePreviousPosition(idx, "title", e.target.value)
                          }
                          placeholder="Ex : Chargé de recherche"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organisation
                        </label>
                        <input
                          type="text"
                          value={pos.company}
                          onChange={(e) =>
                            updatePreviousPosition(
                              idx,
                              "company",
                              e.target.value,
                            )
                          }
                          placeholder="Ex : ONG, Ministère…"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Année de début
                        </label>
                        <input
                          type="number"
                          value={pos.startYear}
                          onChange={(e) =>
                            updatePreviousPosition(
                              idx,
                              "startYear",
                              e.target.value,
                            )
                          }
                          placeholder="2018"
                          min="1950"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Année de fin
                        </label>
                        <input
                          type="number"
                          value={pos.endYear}
                          onChange={(e) =>
                            updatePreviousPosition(
                              idx,
                              "endYear",
                              e.target.value,
                            )
                          }
                          placeholder="2021"
                          min="1950"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 7. Biographie ──────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Biographie</h2>
              <PrivacyToggle
                checked={formData.privacy.showBio}
                onChange={() => togglePrivacy("showBio")}
                label="Afficher dans l'annuaire"
              />
            </div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInput}
              rows={5}
              placeholder="Parlez un peu de vous, de votre parcours, de vos intérêts, de vos recherches…"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* ── Actions ────────────────────────────────────────── */}
          <div className="flex items-center justify-between pb-4">
            <a
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </a>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
