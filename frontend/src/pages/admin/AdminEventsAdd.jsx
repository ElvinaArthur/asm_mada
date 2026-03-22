// pages/admin/AdminEventsAdd.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminEventService } from "../../services/api/events";

const AdminEventsAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Créer FormData pour l'image
      const formDataToSend = new FormData();

      // Ajouter tous les champs texte
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Ajouter l'image si elle existe
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await adminEventService.createEvent(formDataToSend);
      navigate("/admin/events");
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/events")}
            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un événement
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border p-6"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
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
                className="w-full px-4 py-2 border rounded-lg"
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Description de l'événement..."
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de l'événement (thumbnail)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Supprimer l'image
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Glissez-déposez ou cliquez pour sélectionner une image
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
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option>Colloque</option>
                  <option>Formation</option>
                  <option>Conférence</option>
                  <option>Atelier</option>
                  <option>Séminaire</option>
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
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option>Sociologie</option>
                  <option>Méthodologie</option>
                  <option>Éducation</option>
                  <option>Santé</option>
                  <option>Travail</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
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
                  className="w-full px-4 py-2 border rounded-lg"
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="14h00 - 17h00"
                />
              </div>
            </div>

            {/* Location */}
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Université d'Antananarivo"
              />
            </div>

            {/* Price & Attendees */}
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
                  className="w-full px-4 py-2 border rounded-lg"
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="0 pour gratuit"
                />
              </div>
            </div>

            {/* Organizer & Speaker */}
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
                  className="w-full px-4 py-2 border rounded-lg"
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Dr. Jean Dupont"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Mettre en avant sur la page d'accueil</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="registration_open"
                  checked={formData.registration_open}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Ouvrir les inscriptions</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="px-6 py-3 border text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.title ||
                  !formData.date ||
                  !formData.location
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer l'événement"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventsAdd;
