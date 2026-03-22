// pages/admin/AdminEventsEdit.jsx - CORRECTIONS
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminEventService } from "../../services/api/events";
import ConfirmDeleteModal from "../../components/events/ConfirmDeleteModal";

const AdminEventsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // États principaux
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);

  // États pour l'image
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  // Modal de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Données du formulaire
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Colloque",
    category: "Sociologie",
    date: "",
    time: "",
    location: "",
    max_attendees: "",
    price: "",
    featured: false,
    registration_open: true,
    organizer: "ASM",
    speaker: "",
  });

  // Charger l'événement
  useEffect(() => {
    if (id) loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");

      // Récupérer l'événement
      const response = await adminEventService.getEvents({});
      const events = response.data || [];
      const currentEvent = events.find((e) => e.id === parseInt(id));

      if (!currentEvent) {
        throw new Error("Événement non trouvé");
      }

      // Stocker l'événement complet
      setEvent(currentEvent);

      // Mettre à jour l'image
      if (currentEvent.imageUrl) {
        setImagePreview(currentEvent.imageUrl);
        setExistingImage(currentEvent.imageUrl);
      }

      // Mettre à jour le formulaire
      setFormData({
        title: currentEvent.title || "",
        description: currentEvent.description || "",
        type: currentEvent.type || "Colloque",
        category: currentEvent.category || "Sociologie",
        date: currentEvent.date ? currentEvent.date.split("T")[0] : "",
        time: currentEvent.time || "",
        location: currentEvent.location || "",
        max_attendees: currentEvent.max_attendees || "",
        price: currentEvent.price || "",
        featured: Boolean(currentEvent.featured),
        registration_open: Boolean(currentEvent.registration_open),
        organizer: currentEvent.organizer || "ASM",
        speaker: currentEvent.speaker || "",
      });
    } catch (err) {
      console.error("❌ Erreur chargement:", err);
      setError("Impossible de charger l'événement");
    } finally {
      setLoading(false);
    }
  };

  // Gestion des changements du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image est trop grande (max 5MB)");
        return;
      }

      // Prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage("");
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Créer FormData
      const formDataToSend = new FormData();

      // Debug: afficher les données
      console.log("📤 Données à envoyer:", formData);

      // Ajouter tous les champs texte
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          console.log(
            `📤 ${key}: ${formData[key]} (type: ${typeof formData[key]})`,
          );

          if (key === "featured" || key === "registration_open") {
            formDataToSend.append(key, formData[key] ? "1" : "0");
          } else if (key === "max_attendees" || key === "price") {
            // S'assurer que les nombres sont des strings
            formDataToSend.append(key, String(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Debug FormData
      console.log("📤 FormData créé");
      for (let pair of formDataToSend.entries()) {
        console.log(`📤 ${pair[0]}: ${pair[1]}`);
      }

      // Ajouter l'image si elle existe
      if (imageFile) {
        console.log("📤 Ajout de l'image:", imageFile.name);
        formDataToSend.append("image", imageFile);
      }

      // Si on a supprimé l'image existante
      if (!imagePreview && existingImage) {
        console.log("📤 Demande de suppression d'image");
        formDataToSend.append("remove_image", "true");
      }

      console.log("📤 Envoi de la requête update...");
      await adminEventService.updateEvent(id, formDataToSend);

      console.log("✅ Événement mis à jour avec succès");
      navigate("/admin/events");
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(
        "Erreur lors de la mise à jour : " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setSaving(false);
    }
  };

  // Suppression de l'événement
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminEventService.deleteEvent(id);
      setShowDeleteModal(false);
      navigate("/admin/events");
    } catch (err) {
      console.error("❌ Erreur suppression:", err);
      setError("Erreur lors de la suppression");
      setDeleting(false);
    }
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/events")}
            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour aux événements
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier l'événement
              </h1>
              <p className="text-gray-600 mt-1">
                Modifiez les informations de l'événement
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border shadow-sm"
        >
          {error && (
            <div className="m-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Colloque International"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de l'événement..."
              />
            </div>

            {/* IMAGE - SECTION AJOUTÉE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de l'événement (thumbnail)
              </label>

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer">
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Changer l'image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Supprimer l'image
                    </button>
                    {existingImage && !imageFile && (
                      <span className="text-sm text-gray-500 self-center">
                        (Image actuelle conservée)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {existingImage
                      ? "Aucun aperçu disponible"
                      : "Ajoutez une image pour cet événement"}
                  </p>
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Sélectionner une image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-4">
                    PNG, JPG, GIF jusqu'à 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Type & Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Colloque">Colloque</option>
                  <option value="Formation">Formation</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Atelier">Atelier</option>
                  <option value="Séminaire">Séminaire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Sociologie">Sociologie</option>
                  <option value="Méthodologie">Méthodologie</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Santé">Santé</option>
                  <option value="Travail">Travail</option>
                </select>
              </div>
            </div>

            {/* Date & Heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="14h00 - 17h00"
                />
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Université d'Antananarivo"
              />
            </div>

            {/* Places & Prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Places disponibles
                </label>
                <input
                  type="number"
                  name="max_attendees"
                  value={formData.max_attendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (en MGA)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0 pour gratuit"
                />
              </div>
            </div>

            {/* Organisateur & Intervenant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organisateur
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervenant(s)
                </label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr. Jean Dupont"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Mettre en avant sur la page d'accueil
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="registration_open"
                  checked={formData.registration_open}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Ouvrir les inscriptions</span>
              </label>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={
                  saving ||
                  !formData.title ||
                  !formData.date ||
                  !formData.location
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sauvegarde...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL DE CONFIRMATION DE SUPPRESSION - À METTRE ICI */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer l'événement"
        message="Êtes-vous sûr de vouloir supprimer cet événement ?"
        itemName={formData.title}
        loading={deleting}
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
      />
    </div>
  );
};

export default AdminEventsEdit;
