// Configuration
const API_BASE = "http://https://asm-mada.onrender.com/api";

// Éléments DOM
const elements = {
  totalBooks: document.getElementById("totalBooks"),
  totalMembers: document.getElementById("totalMembers"),
  totalUsers: document.getElementById("totalUsers"),
  pendingUsers: document.getElementById("pendingUsers"),
  booksContainer: document.getElementById("booksContainer"),
  membersContainer: document.getElementById("membersContainer"),
  currentTime: document.getElementById("currentTime"),
  lastUpdateTime: document.getElementById("lastUpdateTime"),
  totalRequests: document.getElementById("totalRequests"),
  uptime: document.getElementById("uptime"),
};

// Fonctions utilitaires
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("fr-FR");
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (elements.currentTime) {
    elements.currentTime.textContent = `${dateStr} - ${timeStr}`;
  }
  if (elements.lastUpdateTime) {
    elements.lastUpdateTime.textContent = timeStr;
  }
}

function updateStats() {
  // Simuler des données pour les métriques supplémentaires
  if (elements.totalRequests) {
    elements.totalRequests.textContent = Math.floor(Math.random() * 1000) + 500;
  }
  if (elements.uptime) {
    elements.uptime.textContent =
      "99." + (Math.floor(Math.random() * 9) + 1) + "%";
  }
}

async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Erreur sur ${endpoint}:`, error);
    throw error;
  }
}

// Chargement des données
async function loadStats() {
  try {
    const [booksData, statsData] = await Promise.all([
      fetchData("/books"),
      fetchData("/members/stats"),
    ]);

    if (elements.totalBooks)
      elements.totalBooks.textContent = booksData.total || 0;
    if (elements.totalMembers)
      elements.totalMembers.textContent = statsData.verified || 0;
    if (elements.totalUsers)
      elements.totalUsers.textContent = statsData.total || 0;
    if (elements.pendingUsers)
      elements.pendingUsers.textContent = statsData.pending || 0;

    updateStats();
  } catch (error) {
    showError("stats");
  }
}

async function loadBooks() {
  try {
    const data = await fetchData("/books?limit=5");
    renderBooks(data.data || []);
  } catch (error) {
    showError("books");
  }
}

async function loadMembers() {
  try {
    const data = await fetchData("/members/verified?limit=5");
    renderMembers(data.data || []);
  } catch (error) {
    showError("members");
  }
}

// Rendu des données
function renderBooks(books) {
  if (!elements.booksContainer) return;

  if (books.length === 0) {
    elements.booksContainer.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-book text-gray-300 text-4xl mb-4"></i>
                <p class="text-gray-500">No books found</p>
            </div>
        `;
    return;
  }

  elements.booksContainer.innerHTML = `
        <div class="space-y-4">
            ${books
              .map(
                (book, index) => `
                <div class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fade-in">
                    <div class="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-book text-blue-600"></i>
                    </div>
                    <div class="flex-grow">
                        <h4 class="font-semibold text-gray-900">${book.title}</h4>
                        <p class="text-gray-500 text-sm">${book.author} • ${book.category}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-gray-900 font-bold">${book.views || 0}</div>
                        <div class="text-gray-400 text-xs">views</div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function renderMembers(members) {
  if (!elements.membersContainer) return;

  if (members.length === 0) {
    elements.membersContainer.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-users text-gray-300 text-4xl mb-4"></i>
                <p class="text-gray-500">No members found</p>
            </div>
        `;
    return;
  }

  elements.membersContainer.innerHTML = `
        <div class="space-y-4">
            ${members
              .map(
                (member, index) => `
                <div class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fade-in">
                    <div class="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-user text-green-600"></i>
                    </div>
                    <div class="flex-grow">
                        <h4 class="font-semibold text-gray-900">${member.firstName} ${member.lastName}</h4>
                        <p class="text-gray-500 text-sm">${member.email}</p>
                        <p class="text-gray-400 text-xs">${member.institution || "No institution"} • ${member.location || "No location"}</p>
                    </div>
                    <div class="text-right">
                        <span class="badge badge-get">Verified</span>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function showError(type) {
  const errorHtml = `
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <p class="text-red-500 font-medium mb-2">Failed to load ${type}</p>
            <p class="text-gray-400 text-sm">Check your API connection</p>
            <button onclick="retryLoad('${type}')" class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Retry
            </button>
        </div>
    `;

  const container =
    type === "books" ? elements.booksContainer : elements.membersContainer;
  if (container) container.innerHTML = errorHtml;
}

function retryLoad(type) {
  const container =
    type === "books" ? elements.booksContainer : elements.membersContainer;
  if (container) {
    container.innerHTML = `
            <div class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        `;
  }

  setTimeout(() => {
    if (type === "books") loadBooks();
    else if (type === "members") loadMembers();
  }, 500);
}

// Fonction de rafraîchissement
function refreshAll() {
  loadStats();
  loadBooks();
  loadMembers();
  updateTime();

  // Animation de rafraîchissement
  const refreshBtn = document.querySelector(".refresh-btn i");
  if (refreshBtn) {
    refreshBtn.classList.add("animate-spin");
    setTimeout(() => {
      refreshBtn.classList.remove("animate-spin");
    }, 1000);
  }
}

// Initialisation
function init() {
  updateTime();
  setInterval(updateTime, 1000);

  loadStats();
  loadBooks();
  loadMembers();

  // Auto-refresh toutes les 30 secondes
  setInterval(refreshAll, 30000);
}

// Export pour utilisation globale
window.retryLoad = retryLoad;
window.refreshAll = refreshAll;

// Démarrer quand le DOM est prêt
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Dans dashboard.js - Ajouter ces fonctions

// Charger les membres
async function loadMembers() {
  try {
    const response = await fetch(`${API_BASE}/members/verified?limit=10`);
    const data = await response.json();
    renderMembers(data.data || []);
  } catch (error) {
    console.error("Erreur chargement membres:", error);
  }
}

// Rendre les membres
function renderMembers(members) {
  const container = document.getElementById("membersList");
  if (!container) return;

  if (members.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Aucun membre trouvé</p>';
    return;
  }

  container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promotion</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialisation</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${members
                      .map(
                        (member) => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="font-medium text-gray-900">${member.firstName} ${member.lastName}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.email}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.graduationYear}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.specialization || "-"}</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `;
}

// Charger les statistiques détaillées
async function loadDetailedStats() {
  try {
    const [booksRes, membersRes, categoriesRes] = await Promise.all([
      fetch(`${API_BASE}/books/stats`),
      fetch(`${API_BASE}/members/stats`),
      fetch(`${API_BASE}/books/categories/stats`),
    ]);

    const booksStats = await booksRes.json();
    const membersStats = await membersRes.json();
    const categoriesStats = await categoriesRes.json();

    renderDetailedStats({ booksStats, membersStats, categoriesStats });
  } catch (error) {
    console.error("Erreur chargement stats détaillées:", error);
  }
}

// Rendre les statistiques détaillées
function renderDetailedStats(stats) {
  const container = document.getElementById("detailedStats");
  if (!container) return;

  container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h4 class="font-bold text-gray-900 mb-4">Statistiques Livres</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total livres</span>
                        <span class="font-bold">${stats.booksStats?.total || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total pages</span>
                        <span class="font-bold">${stats.booksStats?.totalPages || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total vues</span>
                        <span class="font-bold">${stats.booksStats?.totalViews || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total téléchargements</span>
                        <span class="font-bold">${stats.booksStats?.totalDownloads || 0}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h4 class="font-bold text-gray-900 mb-4">Statistiques Membres</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total membres</span>
                        <span class="font-bold">${stats.membersStats?.total || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Membres vérifiés</span>
                        <span class="font-bold">${stats.membersStats?.verified || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">En attente</span>
                        <span class="font-bold">${stats.membersStats?.pending || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Administrateurs</span>
                        <span class="font-bold">${stats.membersStats?.admins || 0}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white border border-gray-200 rounded-lg p-6 md:col-span-1 lg:col-span-1">
                <h4 class="font-bold text-gray-900 mb-4">Livres par Catégorie</h4>
                <div class="space-y-3">
                    ${
                      stats.categoriesStats
                        ?.map(
                          (cat) => `
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">${cat.category}</span>
                            <div class="flex items-center">
                                <span class="font-bold mr-2">${cat.count}</span>
                                <div class="w-24 bg-gray-200 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" 
                                         style="width: ${(cat.count / stats.booksStats?.total) * 100 || 0}%"></div>
                                </div>
                            </div>
                        </div>
                    `,
                        )
                        .join("") ||
                      '<p class="text-gray-500">Aucune donnée</p>'
                    }
                </div>
            </div>
        </div>
    `;
}

// Dans la fonction refreshAll(), ajoutez :
async function refreshAll() {
  updateTime();
  loadStats();
  await BookManager.loadBooks();
  await BookManager.loadUploadsInfo();

  // Rafraîchir l'onglet actif
  const activeTab = document
    .querySelector(".tab-button.active")
    .id.replace("tab-", "");
  if (activeTab === "members") {
    loadMembers();
  } else if (activeTab === "stats") {
    loadDetailedStats();
  }
}

// Exporter au scope global
window.loadMembers = loadMembers;
window.loadDetailedStats = loadDetailedStats;
window.refreshAll = refreshAll;
