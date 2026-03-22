// Book Manager - Gestion complète des livres
const BookManager = {
  // Configuration
  API_BASE: "http://localhost:3000/api",
  PDF_UPLOAD_URL: "http://localhost:3000/uploads/pdfs/",
  THUMBNAIL_URL: "http://localhost:3000/uploads/thumbnails/",

  // État
  currentBooks: [],
  selectedBook: null,

  // Initialisation
  init() {
    this.bindEvents();
    this.loadUploadsInfo();
  },

  // Événements
  bindEvents() {
    // Recherche
    document.getElementById("searchBooks")?.addEventListener("input", (e) => {
      this.filterBooks(e.target.value);
    });

    // Filtre par catégorie
    document
      .getElementById("filterCategory")
      ?.addEventListener("change", (e) => {
        this.filterByCategory(e.target.value);
      });
  },

  // Charger tous les livres
  async loadBooks() {
    try {
      const response = await fetch(`${this.API_BASE}/books?limit=100`);
      const data = await response.json();

      this.currentBooks = data.data || [];
      this.renderBooksList(this.currentBooks);

      return this.currentBooks;
    } catch (error) {
      console.error("Erreur chargement livres:", error);
      this.showError("Impossible de charger les livres");
      return [];
    }
  },

  // Rendre la liste des livres
  renderBooksList(books) {
    const container = document.getElementById("booksList");
    if (!container) return;

    if (books.length === 0) {
      container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-book text-gray-300 text-4xl mb-4"></i>
                    <p class="text-gray-500 font-medium mb-2">Aucun livre trouvé</p>
                    <p class="text-gray-400 text-sm mb-6">Commencez par ajouter un livre</p>
                    <button onclick="BookManager.openAddModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                        <i class="fas fa-plus mr-2"></i>Ajouter un livre
                    </button>
                </div>
            `;
      return;
    }

    container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Livre
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Catégorie
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pages
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vues/Téléchargements
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${books.map((book) => this.renderBookRow(book)).join("")}
                    </tbody>
                </table>
            </div>
        `;
  },

  // Rendre une ligne de livre
  renderBookRow(book) {
    const pdfUrl = `${this.PDF_UPLOAD_URL}${book.fileName}`;
    const thumbUrl = `${this.THUMBNAIL_URL}${book.thumbnail}`;

    return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-16 w-12 mr-4">
                            <img src="${thumbUrl}" alt="${book.title}" 
                                 class="h-16 w-12 object-cover rounded shadow-sm"
                                 onerror="this.src='https://via.placeholder.com/48x64/cccccc/666666?text=PDF'">
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">${book.title}</div>
                            <div class="text-sm text-gray-500">${book.author}</div>
                            <div class="text-xs text-gray-400 mt-1">
                                ${book.year} • ${book.readTime}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getCategoryColor(book.category)}">
                        ${book.category}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${book.pages} pages
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-sm font-medium text-gray-900">${book.views || 0}</div>
                            <div class="text-xs text-gray-500">vues</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-medium text-gray-900">${book.downloads || 0}</div>
                            <div class="text-xs text-gray-500">téléch.</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                        <button onclick="BookManager.viewBook('${book.id}')" 
                                class="text-blue-600 hover:text-blue-900" 
                                title="Voir">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="BookManager.editBook('${book.id}')" 
                                class="text-green-600 hover:text-green-900"
                                title="Éditer">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="BookManager.deleteBook('${book.id}', '${book.title}')" 
                                class="text-red-600 hover:text-red-900"
                                title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                        <a href="${pdfUrl}" target="_blank" 
                           class="text-purple-600 hover:text-purple-900"
                           title="Télécharger PDF">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
  },

  // Ouvrir modal d'ajout
  openAddModal() {
    fetch("components/add-book-modal.html")
      .then((response) => response.text())
      .then((html) => {
        const modal = document.getElementById("addBookModal");
        modal.innerHTML = html;
        modal.classList.remove("hidden");

        // Initialiser le formulaire
        this.initAddForm();
      });
  },

  // Initialiser formulaire d'ajout
  initAddForm() {
    const form = document.getElementById("addBookForm");
    if (!form) return;

    form.reset();

    // Pré-remplir avec les valeurs de seedDatabase si besoin
    document.getElementById("bookFileName").addEventListener("change", (e) => {
      const fileName = e.target.value;
      // Si le nom de fichier correspond au pattern seedDatabase
      if (fileName.match(/^\d+\.pdf$/)) {
        const bookNumber = fileName.replace(".pdf", "");
        // Suggestions automatiques
        document.getElementById("bookThumbnail").value = `${bookNumber}.jpg`;
      }
    });

    // Gérer la soumission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.submitAddForm(form);
    });

    // Fermer le modal
    document.getElementById("closeModal").addEventListener("click", () => {
      document.getElementById("addBookModal").classList.add("hidden");
    });

    // Upload PDF
    document.getElementById("uploadPdfBtn").addEventListener("click", () => {
      document.getElementById("pdfUpload").click();
    });

    document
      .getElementById("pdfUpload")
      .addEventListener("change", async (e) => {
        await this.uploadFile(e.target.files[0], "pdf");
      });

    // Upload thumbnail
    document.getElementById("uploadThumbBtn").addEventListener("click", () => {
      document.getElementById("thumbUpload").click();
    });

    document
      .getElementById("thumbUpload")
      .addEventListener("change", async (e) => {
        await this.uploadFile(e.target.files[0], "thumbnail");
      });
  },

  // Upload de fichier
  async uploadFile(file, type) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch(`${this.API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess(
          `${type === "pdf" ? "PDF" : "Thumbnail"} uploadé avec succès`,
        );

        // Mettre à jour le champ correspondant
        if (type === "pdf") {
          document.getElementById("bookFileName").value = result.filename;
        } else {
          document.getElementById("bookThumbnail").value = result.filename;
        }

        // Mettre à jour l'info des uploads
        this.loadUploadsInfo();
      }
    } catch (error) {
      this.showError(`Erreur lors de l'upload: ${error.message}`);
    }
  },

  // Soumettre le formulaire d'ajout
  async submitAddForm(form) {
    const formData = new FormData(form);
    const bookData = Object.fromEntries(formData);

    // Validation
    if (!bookData.title || !bookData.author || !bookData.fileName) {
      this.showError("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess("Livre ajouté avec succès !");
        document.getElementById("addBookModal").classList.add("hidden");

        // Rafraîchir la liste
        this.loadBooks();
        window.loadStats(); // Mettre à jour les stats
      } else {
        this.showError(result.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      this.showError("Erreur de connexion au serveur");
    }
  },

  // Éditer un livre
  async editBook(bookId) {
    try {
      const response = await fetch(`${this.API_BASE}/books/${bookId}`);
      const book = await response.json();

      this.selectedBook = book;
      this.openEditModal(book);
    } catch (error) {
      this.showError("Impossible de charger les détails du livre");
    }
  },

  // Ouvrir modal d'édition
  openEditModal(book) {
    // Créer un modal similaire à l'ajout mais pré-rempli
    const modalHtml = `
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                    <div class="px-6 py-4 border-b">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900">Éditer le livre</h3>
                            <button id="closeEditModal" class="text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <form id="editBookForm" class="px-6 py-4">
                        <input type="hidden" name="id" value="${book.id}">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                                <input type="text" name="title" value="${book.title}" 
                                       class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Auteur *</label>
                                <input type="text" name="author" value="${book.author}"
                                       class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <select name="category" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                                    ${[
                                      "santé",
                                      "travail",
                                      "environnement",
                                      "sociologie",
                                      "psychologie",
                                      "éducation",
                                    ]
                                      .map(
                                        (cat) =>
                                          `<option value="${cat}" ${book.category === cat ? "selected" : ""}>${cat}</option>`,
                                      )
                                      .join("")}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Année</label>
                                <input type="number" name="year" value="${book.year}"
                                       class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                                <input type="number" name="pages" value="${book.pages}"
                                       class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Temps de lecture</label>
                                <input type="text" name="readTime" value="${book.readTime}"
                                       class="w-full border border-gray-300 rounded-lg px-3 py-2"
                                       placeholder="ex: 30 minutes">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" rows="3"
                                          class="w-full border border-gray-300 rounded-lg px-3 py-2">${book.description || ""}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nom du fichier PDF</label>
                                <div class="flex">
                                    <input type="text" name="fileName" value="${book.fileName}"
                                           id="editFileName" class="flex-1 border border-gray-300 rounded-l-lg px-3 py-2" readonly>
                                    <button type="button" onclick="document.getElementById('editPdfUpload').click()"
                                            class="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 hover:bg-gray-200">
                                        <i class="fas fa-upload"></i>
                                    </button>
                                    <input type="file" id="editPdfUpload" class="hidden" accept=".pdf">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                                <div class="flex">
                                    <input type="text" name="thumbnail" value="${book.thumbnail}"
                                           id="editThumbnail" class="flex-1 border border-gray-300 rounded-l-lg px-3 py-2" readonly>
                                    <button type="button" onclick="document.getElementById('editThumbUpload').click()"
                                            class="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 hover:bg-gray-200">
                                        <i class="fas fa-upload"></i>
                                    </button>
                                    <input type="file" id="editThumbUpload" class="hidden" accept="image/*">
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end space-x-3">
                            <button type="button" id="cancelEdit" 
                                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" 
                                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    const modal = document.getElementById("editBookModal");
    modal.innerHTML = modalHtml;
    modal.classList.remove("hidden");

    // Gérer les événements
    document.getElementById("closeEditModal").addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    document.getElementById("cancelEdit").addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    document
      .getElementById("editBookForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.submitEditForm();
      });

    // Uploads dans l'édition
    document
      .getElementById("editPdfUpload")
      .addEventListener("change", async (e) => {
        await this.uploadFile(e.target.files[0], "pdf", true);
      });

    document
      .getElementById("editThumbUpload")
      .addEventListener("change", async (e) => {
        await this.uploadFile(e.target.files[0], "thumbnail", true);
      });
  },

  // Soumettre l'édition
  async submitEditForm() {
    const form = document.getElementById("editBookForm");
    const formData = new FormData(form);
    const bookData = Object.fromEntries(formData);

    try {
      const response = await fetch(`${this.API_BASE}/books/${bookData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess("Livre mis à jour avec succès !");
        document.getElementById("editBookModal").classList.add("hidden");

        // Rafraîchir
        this.loadBooks();
      } else {
        this.showError(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      this.showError("Erreur de connexion au serveur");
    }
  },

  // Supprimer un livre
  async deleteBook(bookId, bookTitle) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${bookTitle}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE}/books/${bookId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess("Livre supprimé avec succès");
        this.loadBooks();
        window.loadStats();
      } else {
        this.showError(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      this.showError("Erreur de connexion au serveur");
    }
  },

  // Voir les détails d'un livre
  async viewBook(bookId) {
    try {
      const response = await fetch(`${this.API_BASE}/books/${bookId}`);
      const book = await response.json();

      // Ouvrir un modal avec les détails
      this.openViewModal(book);
    } catch (error) {
      this.showError("Impossible de charger les détails");
    }
  },

  // Ouvrir modal de visualisation
  openViewModal(book) {
    const pdfUrl = `${this.PDF_UPLOAD_URL}${book.fileName}`;
    const thumbUrl = `${this.THUMBNAIL_URL}${book.thumbnail}`;

    const modalHtml = `
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
                    <div class="px-6 py-4 border-b">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900">Détails du livre</h3>
                            <button onclick="this.closest('.modal').classList.add('hidden')" 
                                    class="text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="md:w-1/3">
                                <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                                    <img src="${thumbUrl}" alt="${book.title}" 
                                         class="max-h-64 object-contain"
                                         onerror="this.src='https://via.placeholder.com/200x300/cccccc/666666?text=PDF'">
                                </div>
                                <div class="mt-4 text-center">
                                    <a href="${pdfUrl}" target="_blank"
                                       class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        <i class="fas fa-download mr-2"></i>
                                        Télécharger le PDF
                                    </a>
                                </div>
                            </div>
                            <div class="md:w-2/3">
                                <h4 class="text-xl font-bold text-gray-900 mb-2">${book.title}</h4>
                                <p class="text-gray-600 mb-4">${book.author}</p>
                                
                                <div class="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p class="text-sm text-gray-500">Catégorie</p>
                                        <p class="font-medium">${book.category}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Année</p>
                                        <p class="font-medium">${book.year}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Pages</p>
                                        <p class="font-medium">${book.pages}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Temps de lecture</p>
                                        <p class="font-medium">${book.readTime}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Vues</p>
                                        <p class="font-medium">${book.views || 0}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Téléchargements</p>
                                        <p class="font-medium">${book.downloads || 0}</p>
                                    </div>
                                </div>
                                
                                <div class="mb-6">
                                    <p class="text-sm text-gray-500 mb-2">Description</p>
                                    <p class="text-gray-700">${book.description || "Aucune description disponible"}</p>
                                </div>
                                
                                <div>
                                    <p class="text-sm text-gray-500 mb-2">Fichiers</p>
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <i class="fas fa-file-pdf text-red-500 mr-3"></i>
                                            <div class="flex-1">
                                                <p class="font-medium">${book.fileName}</p>
                                                <p class="text-sm text-gray-500">PDF du livre</p>
                                            </div>
                                            <a href="${pdfUrl}" target="_blank" 
                                               class="text-blue-600 hover:text-blue-800">
                                                <i class="fas fa-external-link-alt"></i>
                                            </a>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-image text-green-500 mr-3"></i>
                                            <div class="flex-1">
                                                <p class="font-medium">${book.thumbnail}</p>
                                                <p class="text-sm text-gray-500">Image miniature</p>
                                            </div>
                                            <a href="${thumbUrl}" target="_blank"
                                               class="text-blue-600 hover:text-blue-800">
                                                <i class="fas fa-external-link-alt"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
  },

  // Filtrer les livres
  filterBooks(searchTerm) {
    if (!searchTerm) {
      this.renderBooksList(this.currentBooks);
      return;
    }

    const filtered = this.currentBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    this.renderBooksList(filtered);
  },

  // Filtrer par catégorie
  filterByCategory(category) {
    if (!category) {
      this.renderBooksList(this.currentBooks);
      return;
    }

    const filtered = this.currentBooks.filter(
      (book) => book.category === category,
    );
    this.renderBooksList(filtered);
  },

  // Charger les infos des uploads
  async loadUploadsInfo() {
    try {
      const [pdfsResponse, thumbsResponse] = await Promise.all([
        fetch(`${this.API_BASE}/uploads/pdfs`),
        fetch(`${this.API_BASE}/uploads/thumbnails`),
      ]);

      const pdfs = await pdfsResponse.json();
      const thumbs = await thumbsResponse.json();

      document.getElementById("pdfCount").textContent = pdfs.count || 0;
      document.getElementById("thumbCount").textContent = thumbs.count || 0;
    } catch (error) {
      console.error("Erreur chargement uploads:", error);
    }
  },

  // Utilitaires
  getCategoryColor(category) {
    const colors = {
      santé: "bg-blue-100 text-blue-800",
      travail: "bg-yellow-100 text-yellow-800",
      environnement: "bg-green-100 text-green-800",
      sociologie: "bg-purple-100 text-purple-800",
      psychologie: "bg-pink-100 text-pink-800",
      éducation: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  },

  showSuccess(message) {
    alert(`✅ ${message}`);
  },

  showError(message) {
    alert(`❌ ${message}`);
  },
};

// Initialiser quand le DOM est prêt
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => BookManager.init());
} else {
  BookManager.init();
}

// Exposer au scope global
window.BookManager = BookManager;
