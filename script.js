// -------------------- CONFIG --------------------
const ADMIN_USER = "admin";           // dein Benutzername
const ADMIN_PASS = "SpaceMarine42";   // dein Passwort

// -------------------- ADMIN LOGIN --------------------
function adminLogin(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("adminToken", "true");
    alert("Admin erfolgreich eingeloggt!");
    showAdminTools(true);
    // Optional: direkt zurück zur Bracket-Seite
    window.location.href = "bracket.html";
  } else {
    alert("Falscher Benutzername oder Passwort!");
  }
}

function adminLogout() {
  localStorage.removeItem("adminToken");
  showAdminTools(false);
  alert("Admin ausgeloggt!");
}

// -------------------- ADMIN TOOLS ANZEIGEN --------------------
function showAdminTools(show) {
  const adminTools = document.querySelectorAll(".admin-tools");
  const loginLink = document.getElementById("adminLoginLink");
  const logoutBtn = document.getElementById("adminLogoutBtn");

  adminTools.forEach(el => el.style.display = show ? "block" : "none");
  if (loginLink) loginLink.style.display = show ? "none" : "inline-flex";
  if (logoutBtn) logoutBtn.style.display = show ? "inline-flex" : "none";
}

// -------------------- LOCAL STORAGE FUNKTIONEN --------------------
function saveBrackets() {
  const wb = document.getElementById("wb-bracket");
  const lb = document.getElementById("lb-bracket");
  if (!wb || !lb) return;

  const data = {
    wbHTML: wb.innerHTML,
    lbHTML: lb.innerHTML
  };

  localStorage.setItem("bracketsData", JSON.stringify(data));
  alert("Brackets lokal gespeichert!");
}

function loadBrackets() {
  const wb = document.getElementById("wb-bracket");
  const lb = document.getElementById("lb-bracket");
  const data = JSON.parse(localStorage.getItem("bracketsData") || "{}");

  if (wb && data.wbHTML) wb.innerHTML = data.wbHTML;
  if (lb && data.lbHTML) lb.innerHTML = data.lbHTML;
}

function clearBrackets() {
  localStorage.removeItem("bracketsData");
  loadBrackets();
  alert("Lokale Brackets gelöscht!");
}

// -------------------- EXPORT / IMPORT JSON --------------------
function exportBrackets() {
  const data = localStorage.getItem("bracketsData");
  if (!data) return alert("Keine Daten zum Exportieren!");

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "brackets.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importBrackets(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem("bracketsData", JSON.stringify(data));
      loadBrackets();
      alert("Brackets importiert!");
    } catch (err) {
      alert("Fehler beim Importieren der Datei!");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// -------------------- EVENT LISTENER --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Admin-Status prüfen
  const isAdmin = localStorage.getItem("adminToken") === "true";
  showAdminTools(isAdmin);

  // Brackets beim Laden anzeigen
  loadBrackets();

  // Buttons
  const saveBtn = document.getElementById("saveLocal");
  if (saveBtn) saveBtn.addEventListener("click", saveBrackets);

  const clearBtn = document.getElementById("clearLocal");
  if (clearBtn) clearBtn.addEventListener("click", clearBrackets);

  const exportBtn = document.getElementById("exportJSON");
  if (exportBtn) exportBtn.addEventListener("click", exportBrackets);

  const importInput = document.getElementById("importJSON");
  if (importInput) importInput.addEventListener("change", importBrackets);
});
