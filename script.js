document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    enableAdminMode();
  }

  // Speicher-Buttons für Bracket
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

// Admin Login über Netlify Function
async function adminLogin(username, password) {
  try {
    const res = await fetch("/.netlify/functions/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("adminToken", data.token);
      enableAdminMode();
      alert("Admin eingeloggt!");
    } else {
      alert(data.error || "Login fehlgeschlagen");
    }
  } catch (err) {
    console.error(err);
    alert("Serverfehler beim Login");
  }
}

// Admin Logout
function adminLogout() {
  localStorage.removeItem("adminToken");
  document.querySelector(".admin-tools").style.display = "none";
  document.getElementById("adminLogoutBtn").style.display = "none";
  document.getElementById("adminLoginLink").style.display = "inline-flex";
  alert("Admin ausgeloggt!");
}

// Admin-Modus aktivieren
function enableAdminMode() {
  document.querySelector(".admin-tools").style.display = "block";
  document.getElementById("adminLogoutBtn").style.display = "inline-flex";
  document.getElementById("adminLoginLink").style.display = "none";
}

