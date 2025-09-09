const adminPassword = "MeinSuperGeheimesPasswort"; // ändere hier dein Passwort

const adminToggle = document.getElementById("adminToggle");
const saveLocalBtn = document.getElementById("saveLocal");
const clearLocalBtn = document.getElementById("clearLocal");
const exportJSONBtn = document.getElementById("exportJSON");
const importJSONInput = document.getElementById("importJSON");

// Passwortabfrage
if(adminToggle){
  adminToggle.addEventListener("change", () => {
    if(adminToggle.checked){
      const pw = prompt("Bitte Admin-Passwort eingeben:");
      if(pw !== adminPassword){
        alert("Falsches Passwort!");
        adminToggle.checked = false;
      } else {
        alert("Admin-Modus aktiviert!");
      }
    }
  });
}

// Beispiel: lokale Speicherung (nur wenn Admin aktiviert)
if(saveLocalBtn){
  saveLocalBtn.addEventListener("click", () => {
    if(!adminToggle.checked) return alert("Nur Admin kann speichern!");
    const wbData = document.getElementById("wb-bracket")?.innerHTML || "";
    const lbData = document.getElementById("lb-bracket")?.innerHTML || "";
    localStorage.setItem("wbBracket", wbData);
    localStorage.setItem("lbBracket", lbData);
    alert("Bracket lokal gespeichert!");
  });
}

if(clearLocalBtn){
  clearLocalBtn.addEventListener("click", () => {
    if(!adminToggle.checked) return alert("Nur Admin kann löschen!");
    localStorage.removeItem("wbBracket");
    localStorage.removeItem("lbBracket");
    alert("Lokale Daten gelöscht!");
  });
}

if(exportJSONBtn){
  exportJSONBtn.addEventListener("click", () => {
    if(!adminToggle.checked) return alert("Nur Admin kann exportieren!");
    const data = {
      wb: document.getElementById("wb-bracket")?.innerHTML || "",
      lb: document.getElementById("lb-bracket")?.innerHTML || ""
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bracket.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

if(importJSONInput){
  importJSONInput.addEventListener("change", (e) => {
    if(!adminToggle.checked) return alert("Nur Admin kann importieren!");
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const data = JSON.parse(reader.result);
        if(document.getElementById("wb-bracket")) document.getElementById("wb-bracket").innerHTML = data.wb || "";
        if(document.getElementById("lb-bracket")) document.getElementById("lb-bracket").innerHTML = data.lb || "";
        alert("Bracket importiert!");
      } catch(err){
        alert("Fehler beim Import!");
      }
    };
    reader.readAsText(file);
  });
}

// Brackets beim Laden wiederherstellen
window.addEventListener("load", () => {
  if(document.getElementById("wb-bracket")) document.getElementById("wb-bracket").innerHTML = localStorage.getItem("wbBracket") || "";
  if(document.getElementById("lb-bracket")) document.getElementById("lb-bracket").innerHTML = localStorage.getItem("lbBracket") || "";
});
