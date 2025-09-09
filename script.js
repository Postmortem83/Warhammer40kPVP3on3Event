// script.js

// Prüfen, ob Admin-Token im localStorage ist
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminToken") === "VALID_ADMIN") {
    enableAdminMode();
  }
});

function adminLogin(username, password) {
  // Passwort lokal geprüft (sicherer als sichtbar im HTML)
  // Du kannst hier auch ein Hash vergleichen für etwas mehr Sicherheit
  if (username === "admin" && password === "ForTheEmperor83!") {
    localStorage.setItem("adminToken", "VALID_ADMIN");
    enableAdminMode();
    alert("Admin eingeloggt!");
  } else {
    alert("Falscher Benutzername oder Passwort!");
  }
}

function adminLogout() {
  localStorage.removeItem("adminToken");
  document.querySelector(".admin-tools").style.display = "none";
  document.getElementById("adminLogoutBtn").style.display = "none";
  document.getElementById("adminLoginLink").style.display = "inline-flex";
  alert("Admin ausgeloggt!");
}

function enableAdminMode() {
  document.querySelector(".admin-tools").style.display = "block";
  document.getElementById("adminLogoutBtn").style.display = "inline-flex";
  document.getElementById("adminLoginLink").style.display = "none";
}

// Speicher-Buttons für Bracket
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveLocal");
  const clearBtn = document.getElementById("clearLocal");
  const exportBtn = document.getElementById("exportJSON");
  const importInput = document.getElementById("importJSON");

  if (saveBtn) saveBtn.onclick = () => {
    localStorage.setItem("wbBracket", document.getElementById("wb-bracket").innerHTML);
    localStorage.setItem("lbBracket", document.getElementById("lb-bracket").innerHTML);
    alert("Bracket lokal gespeichert!");
  };

  if (clearBtn) clearBtn.onclick = () => {
    localStorage.removeItem("wbBracket");
    localStorage.removeItem("lbBracket");
    alert("Lokal gespeicherte Daten gelöscht!");
  };

  if (exportBtn) exportBtn.onclick = () => {
    const data = {
      wb: document.getElementById("wb-bracket").innerHTML,
      lb: document.getElementById("lb-bracket").innerHTML
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bracket.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (importInput) importInput.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        document.getElementById("wb-bracket").innerHTML = data.wb;
        document.getElementById("lb-bracket").innerHTML = data.lb;
        alert("Bracket importiert!");
      } catch {
        alert("Fehler beim Importieren!");
      }
    };
    reader.readAsText(file);
  };

  // Wenn localStorage Brackets gespeichert hat, laden
  if (localStorage.getItem("wbBracket")) {
    document.getElementById("wb-bracket").innerHTML = localStorage.getItem("wbBracket");
  }
  if (localStorage.getItem("lbBracket")) {
    document.getElementById("lb-bracket").innerHTML = localStorage.getItem("lbBracket");
  }
});
