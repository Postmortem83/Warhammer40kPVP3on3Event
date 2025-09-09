// script.js (Frontend) - Admin-Login + Bracket local storage + Logout

// ------ Admin Login (Frontend) ------
async function adminLogin(username, password) {
  try {
    const res = await fetch("/.netlify/functions/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>({}));
      alert("Login fehlgeschlagen: " + (err.error || res.statusText));
      return false;
    }

    const data = await res.json();
    localStorage.setItem("adminToken", data.token);
    alert("Login erfolgreich — Du wirst zum Turnierbaum weitergeleitet.");
    window.location.href = "bracket.html";
    return true;
  } catch (e) {
    console.error(e);
    alert("Fehler beim Login.");
    return false;
  }
}

// ------ JWT Hilfsfunktionen ------
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(c =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(""));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function isAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload) return false;
  // payload.exp (in Sekunden) -> in ms vergleichen
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    // Token abgelaufen
    localStorage.removeItem("adminToken");
    return false;
  }
  return payload.role === "admin";
}

function adminLogout() {
  localStorage.removeItem("adminToken");
  alert("Abgemeldet.");
  location.reload();
}

// ------ Admin UI Sichtbarkeit ------
function showAdminTools() {
  const adminEls = document.querySelectorAll(".admin-tools");
  const loginLink = document.getElementById("adminLoginLink");
  const logoutBtn = document.getElementById("adminLogout");
  if (isAdmin()) {
    adminEls.forEach(el => el.style.display = "block");
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    adminEls.forEach(el => el.style.display = "none");
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// ------ Bracket: lokale Speicherung / Export / Import (nur Admin) ------
function ensureAdminOrAlert() {
  if (!isAdmin()) {
    alert("Nur Admin kann das ausführen. Bitte zuerst einloggen.");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  showAdminTools();

  // Elemente (können auf manchen Seiten fehlen; daher checks)
  const saveBtn = document.getElementById("saveLocal");
  const clearBtn = document.getElementById("clearLocal");
  const exportBtn = document.getElementById("exportJSON");
  const importInput = document.getElementById("importJSON");
  const wbEl = document.getElementById("wb-bracket");
  const lbEl = document.getElementById("lb-bracket");

  // Lade gespeicherte Brackets
  const stored = localStorage.getItem("brackets");
  if (stored && (wbEl || lbEl)) {
    try {
      const data = JSON.parse(stored);
      if (wbEl && data.wb) wbEl.innerHTML = data.wb;
      if (lbEl && data.lb) lbEl.innerHTML = data.lb;
    } catch (e) { /* ignore */ }
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!ensureAdminOrAlert()) return;
      const data = {
        wb: wbEl ? wbEl.innerHTML : "",
        lb: lbEl ? lbEl.innerHTML : ""
      };
      localStorage.setItem("brackets", JSON.stringify(data));
      alert("Brackets lokal gespeichert.");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!ensureAdminOrAlert()) return;
      localStorage.removeItem("brackets");
      if (wbEl) wbEl.innerHTML = "";
      if (lbEl) lbEl.innerHTML = "";
      alert("Lokale Brackets gelöscht.");
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (!ensureAdminOrAlert()) return;
      const payload = localStorage.getItem("brackets") || JSON.stringify({ wb: "", lb: "" });
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "brackets.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importInput) {
    importInput.addEventListener("change", (e) => {
      if (!ensureAdminOrAlert()) return;
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          localStorage.setItem("brackets", JSON.stringify(parsed));
          alert("Brackets importiert. Seite wird neu geladen.");
          location.reload();
        } catch (err) {
          alert("Importfehler: ungültiges JSON.");
        }
      };
      reader.readAsText(file);
    });
  }
});
