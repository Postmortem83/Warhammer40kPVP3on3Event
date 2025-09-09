// Admin toggle: enable/disable contenteditable + localStorage save
const adminToggle = document.getElementById('adminToggle');
const saveBtn = document.getElementById('saveLocal');
const clearBtn = document.getElementById('clearLocal');
const exportBtn = document.getElementById('exportJSON');
const importInput = document.getElementById('importJSON');

const KEY = 'pvpBracketV1';

function allEditableNodes(){
  return Array.from(document.querySelectorAll('.match .slot[contenteditable], .match .score[contenteditable]'));
}

function setEditable(enabled){
  allEditableNodes().forEach(n => { n.setAttribute('contenteditable', enabled ? 'true' : 'false'); });
}

function serialize(){
  const matches = Array.from(document.querySelectorAll('.match')).map(m => {
    const id = m.dataset.id;
    const slots = Array.from(m.querySelectorAll('.slot')).map(s => s.textContent.trim());
    const score = (m.querySelector('.score')?.textContent || '').trim();
    return { id, slots, score };
  });
  return { matches };
}

function applyData(data){
  if(!data || !Array.isArray(data.matches)) return;
  const map = new Map(data.matches.map(m => [m.id, m]));
  document.querySelectorAll('.match').forEach(m => {
    const found = map.get(m.dataset.id);
    if(found){
      const slots = m.querySelectorAll('.slot');
      if(slots[0]) slots[0].textContent = found.slots?.[0] ?? '';
      if(slots[1]) slots[1].textContent = found.slots?.[1] ?? '';
      const sc = m.querySelector('.score');
      if(sc) sc.textContent = found.score ?? '';
    }
  });
}

function saveLocal(){
  const data = serialize();
  localStorage.setItem(KEY, JSON.stringify(data));
  alert('Turnierbaum lokal gespeichert.');
}

function loadLocal(){
  const raw = localStorage.getItem(KEY);
  if(!raw) return;
  try { applyData(JSON.parse(raw)); } catch(e){ console.warn('loadLocal error', e); }
}

function clearLocal(){
  localStorage.removeItem(KEY);
  location.reload();
}

function exportJSON(){
  const blob = new Blob([JSON.stringify(serialize(), null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pvp_bracket_export.json';
  a.click();
  URL.revokeObjectURL(url);
}

importInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(String(reader.result));
      applyData(data);
      saveLocal();
      alert('Import erfolgreich angewendet.');
    }catch(err){ alert('Import fehlgeschlagen: ' + err.message); }
  };
  reader.readAsText(file);
});

adminToggle?.addEventListener('change', (e)=>{
  setEditable(e.target.checked);
});

saveBtn?.addEventListener('click', saveLocal);
clearBtn?.addEventListener('click', clearLocal);
exportBtn?.addEventListener('click', exportJSON);

// Init
loadLocal();
setEditable(false);
