// frontend/src/components/admin/AdminBooks.jsx
import React, { useState, useEffect } from "react";
import {
  adminBookService,
  adminUserService,
} from "../../services/adminService";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "sociologie",
    year: "",
    pages: "",
    readTime: "",
    fileName: "",
    thumbnail: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksRes, usersRes] = await Promise.all([
        adminBookService.getAllBooks(),
        adminUserService.getPendingUsers(),
      ]);

      setBooks(booksRes.data || []);
      setPendingUsers(usersRes.data || []);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      alert(
        "Erreur de chargement: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "pdf") {
      setPdfFile(file);
      setFormData((prev) => ({ ...prev, fileName: file.name }));
    } else {
      setThumbnailFile(file);
      setFormData((prev) => ({ ...prev, thumbnail: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload des fichiers si nécessaire
      let uploadedFiles = {};

      if (pdfFile) {
        const pdfRes = await adminBookService.uploadPDF(pdfFile);
        uploadedFiles.fileName = pdfRes.filename;
      }

      if (thumbnailFile) {
        const thumbRes = await adminBookService.uploadThumbnail(thumbnailFile);
        uploadedFiles.thumbnail = thumbRes.filename;
      }

      // Ajouter le livre
      const bookData = {
        ...formData,
        ...uploadedFiles,
      };

      const result = await adminBookService.addBook(bookData);
      alert("Livre ajouté avec succès!");

      // Réinitialiser le formulaire
      setFormData({
        title: "",
        author: "",
        description: "",
        category: "sociologie",
        year: "",
        pages: "",
        readTime: "",
        fileName: "",
        thumbnail: "",
      });
      setPdfFile(null);
      setThumbnailFile(null);

      // Recharger les données
      loadData();
    } catch (error) {
      console.error("Erreur ajout livre:", error);
      alert("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const handleVerifyUser = async (userId) => {
    if (!confirm("Vérifier cet utilisateur ?")) return;

    try {
      await adminUserService.verifyUser(userId);
      alert("Utilisateur vérifié!");
      loadData();
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Ajout Livre */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter un Livre</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Titre"
                value={formData.title}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              />
              <input
                type="text"
                name="author"
                placeholder="Auteur"
                value={formData.author}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              rows="3"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border rounded p-2"
                required
              >
                <option value="sociologie">Sociologie</option>
                <option value="psychologie">Psychologie</option>
                <option value="travail">Travail</option>
                <option value="santé">Santé</option>
                <option value="environnement">Environnement</option>
                <option value="éducation">Éducation</option>
              </select>

              <input
                type="number"
                name="year"
                placeholder="Année"
                value={formData.year}
                onChange={handleInputChange}
                className="border rounded p-2"
              />

              <input
                type="number"
                name="pages"
                placeholder="Pages"
                value={formData.pages}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="readTime"
                placeholder="Temps de lecture (ex: 30 minutes)"
                value={formData.readTime}
                onChange={handleInputChange}
                className="border rounded p-2"
              />

              <input
                type="text"
                name="fileName"
                placeholder="Nom fichier PDF (ou uploader)"
                value={formData.fileName}
                onChange={handleInputChange}
                className="border rounded p-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">PDF:</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "pdf")}
                  className="border rounded p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-1">Thumbnail:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ajouter le Livre
            </button>
          </form>
        </div>

        {/* Section Utilisateurs en attente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Utilisateurs en attente ({pendingUsers.length})
          </h2>

          {pendingUsers.length === 0 ? (
            <p className="text-gray-500">Aucun utilisateur en attente</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Inscrit le:{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVerifyUser(user.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Vérifier
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Liste des livres */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Livres ({books.length})</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Titre</th>
                <th className="p-2 text-left">Auteur</th>
                <th className="p-2 text-left">Catégorie</th>
                <th className="p-2 text-left">Vues</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b">
                  <td className="p-2">{book.id}</td>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-2">{book.views || 0}</td>
                  <td className="p-2">
                    <a
                      href={`/api/books/${book.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Voir
                    </a>
                    <button className="text-red-600 hover:underline">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooks;
