/* ---------------------------------------------
   Basis-Brackets (16 Teams Double Elimination)
--------------------------------------------- */
const wbBracket = document.getElementById('wb-bracket');
const lbBracket = document.getElementById('lb-bracket');

// Dummy-Daten für Teams (kann Admin später ändern)
let wbTeams = Array.from({length:16}, (_,i)=>({name:`Team ${i+1}`, score:"", winner:""}));
let lbTeams = Array.from({length:15}, (_,i)=>({name:`LB Match ${i+1}`, score:"", winner:""}));

function renderBracket() {
  wbBracket.innerHTML = '<h3>Winner Bracket</h3>';
  wbTeams.forEach((team,i)=>{
    const div = document.createElement('div');
    div.contentEditable = adminToggle.checked;
    div.className = 'bracket-slot';
    div.textContent = `${team.name} ${team.score?`(${team.score})`:''}`;
    wbBracket.appendChild(div);
  });

  lbBracket.innerHTML = '<h3>Lower Bracket</h3>';
  lbTeams.forEach((team,i)=>{
    const div = document.createElement('div');
    div.contentEditable = adminToggle.checked;
    div.className = 'bracket-slot';
    div.textContent = `${team.name} ${team.score?`(${team.score})`:''}`;
    lbBracket.appendChild(div);
  });
}

// ---------------------------------------------
// Admin Edit Toggle
// ---------------------------------------------
const adminToggle = document.getElementById('adminToggle');
adminToggle.addEventListener('change', renderBracket);

// ---------------------------------------------
// Local Storage Save & Load
// ---------------------------------------------
const saveBtn = document.getElementById('saveLocal');
const clearBtn = document.getElementById('clearLocal');
const exportBtn = document.getElementById('exportJSON');
const importInput = document.getElementById('importJSON');

function saveLocal() {
  const data = {
    wb: wbTeams.map((t,i)=>document.querySelectorAll('#wb-bracket .bracket-slot')[i].textContent),
    lb: lbTeams.map((t,i)=>document.querySelectorAll('#lb-bracket .bracket-slot')[i].textContent)
  };
  localStorage.setItem('warhammerBracket', JSON.stringify(data));
  alert('Bracket lokal gespeichert!');
}

function loadLocal() {
  const data = JSON.parse(localStorage.getItem('warhammerBracket')||'{}');
  if(data.wb) data.wb.forEach((text,i)=>wbTeams[i].name=text);
  if(data.lb) data.lb.forEach((text,i)=>lbTeams[i].name=text);
}

function clearLocal() {
  localStorage.removeItem('warhammerBracket');
  alert('Lokal gespeicherte Daten gelöscht!');
  location.reload();
}

function exportJSON() {
  const data = {
    wb: Array.from(document.querySelectorAll('#wb-bracket .bracket-slot')).map(d=>d.textContent),
    lb: Array.from(document.querySelectorAll('#lb-bracket .bracket-slot')).map(d=>d.textContent)
  };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'bracket.json';
  a.click();
}

function importJSONFile(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(event){
    const data = JSON.parse(event.target.result);
    if(data.wb) data.wb.forEach((text,i)=>wbTeams[i].name=text);
    if(data.lb) data.lb.forEach((text,i)=>lbTeams[i].name=text);
    renderBracket();
  }
  reader.readAsText(file);
}

// ---------------------------------------------
// Event Listeners
// ---------------------------------------------
saveBtn.addEventListener('click', saveLocal);
clearBtn.addEventListener('click', clearLocal);
exportBtn.addEventListener('click', exportJSON);
importInput.addEventListener('change', importJSONFile);

// ---------------------------------------------
// Initialisierung
// ---------------------------------------------
loadLocal();
renderBracket();
