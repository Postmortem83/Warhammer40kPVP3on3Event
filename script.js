// Admin Passwort
const ADMIN_PASSWORD = "DeinGeheimesPW123"; // nur du kennst es

const adminToggle = document.getElementById("adminToggle");
const saveBtn = document.getElementById("saveLocal");
const clearBtn = document.getElementById("clearLocal");
const exportBtn = document.getElementById("exportJSON");
const importInput = document.getElementById("importJSON");

// Admin Login beim Aktivieren
if(adminToggle){
  adminToggle.addEventListener("change", () => {
    if(adminToggle.checked){
      const pw = prompt("Admin Passwort eingeben:");
      if(pw !== ADMIN_PASSWORD){
        alert("Falsches Passwort!");
        adminToggle.checked = false;
      }
    }
  });
}

// Lokale Speicherung (nur für dich)
if(saveBtn){
  saveBtn.addEventListener("click", () => {
    const brackets = {
      wb: document.getElementById("wb-bracket")?.innerHTML,
      lb: document.getElementById("lb-bracket")?.innerHTML
    };
    localStorage.setItem("brackets", JSON.stringify(brackets));
    alert("Brackets lokal gespeichert!");
  });
}

if(clearBtn){
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("brackets");
    alert("Lokale Daten gelöscht!");
  });
}

if(exportBtn){
  exportBtn.addEventListener("click", () => {
    const brackets = localStorage.getItem("brackets");
    const blob = new Blob([brackets], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brackets.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

if(importInput){
  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event){
      const data = event.target.result;
      localStorage.setItem("brackets", data);
      alert("Brackets importiert!");
      location.reload();
    }
    reader.readAsText(file);
  });
}

// Lade gespeicherte Brackets automatisch
window.addEventListener("load", () => {
  const data = localStorage.getItem("brackets");
  if(data){
    const brackets = JSON.parse(data);
    if(document.getElementById("wb-bracket")) document.getElementById("wb-bracket").innerHTML = brackets.wb;
    if(document.getElementById("lb-bracket")) document.getElementById("lb-bracket").innerHTML = brackets.lb;
  }
});
