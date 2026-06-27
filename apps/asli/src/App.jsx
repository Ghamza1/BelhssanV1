import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  bg:      '#efe6d2',
  surface: '#f5ede0',
  card:    '#faf6ef',
  border:  '#d4c8b8',
  primary: '#1c3d5a',
  accent:  '#c45a3d',
  gold:    '#c89a3a',
  ink:     '#1a1a1a',
  muted:   '#6b5d4f',
  white:   '#ffffff',
  shadow:  'rgba(28,61,90,0.14)',
  gridLine:'#d8cebb',
}

const FONT = {
  ar: { display: "'Reem Kufi', sans-serif",  body: "'Tajawal', sans-serif" },
  fr: { display: "'Fraunces', serif",         body: "'Manrope', sans-serif" },
  en: { display: "'Fraunces', serif",         body: "'Manrope', sans-serif" },
  it: { display: "'Fraunces', serif",         body: "'Manrope', sans-serif" },
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════
const T = {
  ar: {
    app: 'أصلي', tagline: 'شجرة العائلة',
    add: 'إضافة شخص', search: 'بحث في العائلة...', close: 'إغلاق',
    edit: 'تعديل', delete: 'حذف', save: 'حفظ', cancel: 'إلغاء',
    firstName: 'الاسم', lastName: 'اللقب العائلي', nickname: 'الكنية',
    maiden: 'اسم العائلة قبل الزواج', middleName: 'الاسم الأوسط',
    sex: 'الجنس', male: 'ذكر', female: 'أنثى',
    born: 'الميلاد', died: 'الوفاة', place: 'المكان',
    bio: 'السيرة الذاتية', job: 'المهنة', company: 'الشركة / المؤسسة',
    phone: 'الهاتف', email: 'البريد الإلكتروني', address: 'العنوان',
    notes: 'ملاحظات', interests: 'الاهتمامات',
    father: 'الأب', mother: 'الأم', spouses: 'الزوج / الزوجة', children: 'الأبناء',
    relations: 'العلاقات العائلية',
    childOf: 'ابن/ابنة لـ', spouseOf: 'زوج/زوجة لـ', root: 'شخص مستقل',
    photo: 'صورة', changePhoto: 'تغيير الصورة', removePhoto: 'حذف الصورة',
    deleteWarn: 'حذف هذا الشخص نهائياً؟', noMatch: 'لا توجد نتائج',
    addChild: '+ ابن / ابنة', addSpouse: '+ زوج / زوجة',
    deceased: 'متوفى', alive: 'على قيد الحياة',
    contactInfo: 'معلومات التواصل',
    noParent: 'لا يوجد (جذر العائلة)',
    emptyTree: 'أضف أول فرد من العائلة',
    settings: 'إعدادات العرض',
    cardDetail: 'تفاصيل البطاقة', showPhotos: 'عرض الصور',
    cardSize: 'حجم البطاقات',
    detailName: 'الاسم فقط', detailNameYear: 'الاسم + السنة', detailFull: 'الاسم + السنة + المهنة',
    sizeSm: 'صغير', sizeMd: 'متوسط', sizeLg: 'كبير',
    fitScreen: 'ملاءمة الشاشة',
    viewFull: 'عرض كامل', viewPartial: 'عرض مُركَّز',
    relativeTo: 'علاقة بشخص موجود',
    gedcomExport: 'تصدير GEDCOM',
  },
  fr: {
    app: 'Asli', tagline: 'Arbre généalogique',
    add: 'Ajouter une personne', search: 'Rechercher...', close: 'Fermer',
    edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler',
    firstName: 'Prénom', lastName: 'Nom de famille', nickname: 'Surnom',
    maiden: 'Nom de jeune fille', middleName: 'Deuxième prénom',
    sex: 'Sexe', male: 'Homme', female: 'Femme',
    born: 'Naissance', died: 'Décès', place: 'Lieu',
    bio: 'Biographie', job: 'Profession', company: 'Entreprise',
    phone: 'Téléphone', email: 'E-mail', address: 'Adresse',
    notes: 'Notes', interests: 'Intérêts',
    father: 'Père', mother: 'Mère', spouses: 'Conjoint(e)', children: 'Enfants',
    relations: 'Relations familiales',
    childOf: 'Enfant de', spouseOf: 'Conjoint(e) de', root: 'Personne indépendante',
    photo: 'Photo', changePhoto: 'Changer', removePhoto: 'Supprimer',
    deleteWarn: 'Supprimer définitivement ?', noMatch: 'Aucun résultat',
    addChild: '+ Enfant', addSpouse: '+ Conjoint(e)',
    deceased: 'Décédé(e)', alive: 'Vivant(e)',
    contactInfo: 'Coordonnées',
    noParent: 'Aucun (racine)',
    emptyTree: 'Ajoutez le premier membre',
    settings: 'Affichage', cardDetail: 'Détail carte', showPhotos: 'Afficher les photos',
    cardSize: 'Taille des cartes',
    detailName: 'Nom seul', detailNameYear: 'Nom + année', detailFull: 'Nom + année + métier',
    sizeSm: 'Petit', sizeMd: 'Moyen', sizeLg: 'Grand',
    fitScreen: 'Ajuster',
    viewFull: 'Vue complète', viewPartial: 'Vue focalisée',
    relativeTo: 'Relation avec',
    gedcomExport: 'Exporter GEDCOM',
  },
  en: {
    app: 'Asli', tagline: 'Family Tree',
    add: 'Add person', search: 'Search family...', close: 'Close',
    edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    firstName: 'First name', lastName: 'Last name', nickname: 'Nickname',
    maiden: 'Maiden name', middleName: 'Middle name',
    sex: 'Sex', male: 'Male', female: 'Female',
    born: 'Born', died: 'Died', place: 'Place',
    bio: 'Biography', job: 'Occupation', company: 'Company',
    phone: 'Phone', email: 'Email', address: 'Address',
    notes: 'Notes', interests: 'Interests',
    father: 'Father', mother: 'Mother', spouses: 'Spouse', children: 'Children',
    relations: 'Family relations',
    childOf: 'Child of', spouseOf: 'Spouse of', root: 'Independent person',
    photo: 'Photo', changePhoto: 'Change', removePhoto: 'Remove',
    deleteWarn: 'Permanently delete?', noMatch: 'No results',
    addChild: '+ Child', addSpouse: '+ Spouse',
    deceased: 'Deceased', alive: 'Living',
    contactInfo: 'Contact info',
    noParent: 'None (tree root)',
    emptyTree: 'Add the first family member',
    settings: 'Display', cardDetail: 'Card detail', showPhotos: 'Show photos',
    cardSize: 'Card size',
    detailName: 'Name only', detailNameYear: 'Name + year', detailFull: 'Name + year + job',
    sizeSm: 'Small', sizeMd: 'Medium', sizeLg: 'Large',
    fitScreen: 'Fit',
    viewFull: 'Full tree', viewPartial: 'Focused view',
    relativeTo: 'Relation to',
    gedcomExport: 'Export GEDCOM',
  },
  it: {
    app: 'Asli', tagline: 'Albero genealogico',
    add: 'Aggiungi persona', search: 'Cerca...', close: 'Chiudi',
    edit: 'Modifica', delete: 'Elimina', save: 'Salva', cancel: 'Annulla',
    firstName: 'Nome', lastName: 'Cognome', nickname: 'Soprannome',
    maiden: 'Nome da nubile', middleName: 'Secondo nome',
    sex: 'Sesso', male: 'Maschio', female: 'Femmina',
    born: 'Nascita', died: 'Morte', place: 'Luogo',
    bio: 'Biografia', job: 'Professione', company: 'Azienda',
    phone: 'Telefono', email: 'Email', address: 'Indirizzo',
    notes: 'Note', interests: 'Interessi',
    father: 'Padre', mother: 'Madre', spouses: 'Coniuge', children: 'Figli',
    relations: 'Relazioni familiari',
    childOf: 'Figlio/a di', spouseOf: 'Coniuge di', root: 'Persona indipendente',
    photo: 'Foto', changePhoto: 'Cambia', removePhoto: 'Rimuovi',
    deleteWarn: 'Eliminare definitivamente?', noMatch: 'Nessun risultato',
    addChild: '+ Figlio/a', addSpouse: '+ Coniuge',
    deceased: 'Deceduto/a', alive: 'In vita',
    contactInfo: 'Contatti',
    noParent: 'Nessuno (radice)',
    emptyTree: 'Aggiungi il primo membro',
    settings: 'Visualizza', cardDetail: 'Dettaglio card', showPhotos: 'Mostra foto',
    cardSize: 'Dimensione card',
    detailName: 'Solo nome', detailNameYear: 'Nome + anno', detailFull: 'Nome + anno + lavoro',
    sizeSm: 'Piccolo', sizeMd: 'Medio', sizeLg: 'Grande',
    fitScreen: 'Adatta',
    viewFull: 'Albero completo', viewPartial: 'Vista focalizzata',
    relativeTo: 'Relazione con',
    gedcomExport: 'Esporta GEDCOM',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA — Tunisian family, 3 generations
// ═══════════════════════════════════════════════════════════════════════════
const INITIAL_DATA = [
  { id:'p1', data:{ first_name:'محمد', last_name:'بن سالم', middle_name:'', nickname:'الحاج', maiden:'', sex:'M', birth:{date:'1938',place:'تونس'}, death:{date:'2010',place:'تونس'}, photo:'', bio:'مؤسس العائلة، تاجر زيتون.', job:'تاجر', company:'', phone:'', email:'', address:'الباردو', notes:'', interests:'' }, rels:{father:null,mother:null,spouses:['p2'],children:['p3','p4','p5']} },
  { id:'p2', data:{ first_name:'فاطمة', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'القيراوني', sex:'F', birth:{date:'1943',place:'القيروان'}, death:null, photo:'', bio:'أم كريمة ومربية أجيال.', job:'', company:'', phone:'216 20 000 001', email:'', address:'الباردو', notes:'', interests:'' }, rels:{father:null,mother:null,spouses:['p1'],children:['p3','p4','p5']} },
  { id:'p3', data:{ first_name:'أحمد', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'', sex:'M', birth:{date:'1965',place:'تونس'}, death:null, photo:'', bio:'', job:'مهندس', company:'اتصالات تونس', phone:'216 20 000 002', email:'ahmed@email.tn', address:'المرسى', notes:'', interests:'' }, rels:{father:'p1',mother:'p2',spouses:['p6'],children:['p8','p9','p10']} },
  { id:'p4', data:{ first_name:'ليلى', last_name:'المنصوري', middle_name:'', nickname:'', maiden:'بن سالم', sex:'F', birth:{date:'1968',place:'تونس'}, death:null, photo:'', bio:'', job:'طبيبة', company:'', phone:'216 20 000 003', email:'', address:'صفاقس', notes:'', interests:'' }, rels:{father:'p1',mother:'p2',spouses:['p7'],children:['p11','p12']} },
  { id:'p5', data:{ first_name:'عمر', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'', sex:'M', birth:{date:'1972',place:'تونس'}, death:null, photo:'', bio:'', job:'محامي', company:'', phone:'216 20 000 004', email:'', address:'تونس', notes:'', interests:'' }, rels:{father:'p1',mother:'p2',spouses:[],children:[]} },
  { id:'p6', data:{ first_name:'نادية', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'الشابي', sex:'F', birth:{date:'1967',place:'بنزرت'}, death:null, photo:'', bio:'', job:'أستاذة', company:'', phone:'216 20 000 005', email:'', address:'المرسى', notes:'', interests:'' }, rels:{father:null,mother:null,spouses:['p3'],children:['p8','p9','p10']} },
  { id:'p7', data:{ first_name:'كريم', last_name:'المنصوري', middle_name:'', nickname:'', maiden:'', sex:'M', birth:{date:'1964',place:'نابل'}, death:null, photo:'', bio:'', job:'مدير', company:'', phone:'216 20 000 006', email:'', address:'صفاقس', notes:'', interests:'' }, rels:{father:null,mother:null,spouses:['p4'],children:['p11','p12']} },
  { id:'p8', data:{ first_name:'يوسف', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'', sex:'M', birth:{date:'1990',place:'تونس'}, death:null, photo:'', bio:'', job:'مبرمج', company:'', phone:'', email:'youssef@email.tn', address:'', notes:'', interests:'' }, rels:{father:'p3',mother:'p6',spouses:[],children:[]} },
  { id:'p9', data:{ first_name:'سارة', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'', sex:'F', birth:{date:'1993',place:'تونس'}, death:null, photo:'', bio:'', job:'طالبة دكتوراه', company:'', phone:'', email:'', address:'', notes:'', interests:'' }, rels:{father:'p3',mother:'p6',spouses:[],children:[]} },
  { id:'p10', data:{ first_name:'إيناس', last_name:'بن سالم', middle_name:'', nickname:'', maiden:'', sex:'F', birth:{date:'1997',place:'تونس'}, death:null, photo:'', bio:'', job:'طالبة', company:'', phone:'', email:'', address:'', notes:'', interests:'' }, rels:{father:'p3',mother:'p6',spouses:[],children:[]} },
  { id:'p11', data:{ first_name:'أمين', last_name:'المنصوري', middle_name:'', nickname:'', maiden:'', sex:'M', birth:{date:'1992',place:'صفاقس'}, death:null, photo:'', bio:'', job:'مهندس معماري', company:'', phone:'', email:'', address:'', notes:'', interests:'' }, rels:{father:'p7',mother:'p4',spouses:[],children:[]} },
  { id:'p12', data:{ first_name:'رانية', last_name:'المنصوري', middle_name:'', nickname:'', maiden:'', sex:'F', birth:{date:'1995',place:'صفاقس'}, death:null, photo:'', bio:'', job:'', company:'', phone:'', email:'', address:'', notes:'', interests:'' }, rels:{father:'p7',mother:'p4',spouses:[],children:[]} },
]

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE + UTILS
// ═══════════════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'asli-data-v1'
const SETTINGS_KEY = 'asli-settings-v1'

function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return INITIAL_DATA
}
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }

function loadSettings() {
  try { const r = localStorage.getItem(SETTINGS_KEY); if (r) return { ...DEFAULT_SETTINGS, ...JSON.parse(r) } } catch {}
  return DEFAULT_SETTINGS
}
function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) }

function genId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2,5) }

function fullName(d) {
  return [d.first_name, d.last_name].filter(Boolean).join(' ').trim() || '—'
}

const DEFAULT_SETTINGS = { cardDetail: 'full', showPhotos: true, boxSize: 'md' }

// ═══════════════════════════════════════════════════════════════════════════
// TREE LAYOUT — DFS ordering + centering pass
// ═══════════════════════════════════════════════════════════════════════════
const BOX = { sm: [150, 76], md: [180, 88], lg: [210, 100] }
const HGAP = 32   // gap between unrelated nodes
const SGAP = 10   // gap between spouses
const VGAP = 130  // vertical gap between generations

function computeLayout(people, boxSize = 'md') {
  if (!people.length) return { positions: {}, edges: [], bounds: { x:0, y:0, w:0, h:0 } }
  const [NW, NH] = BOX[boxSize]

  const byId = {}
  people.forEach(p => { byId[p.id] = p })

  // ── Assign generations via BFS ────────────────────────────────────────
  const gen = {}
  const hasParentInData = new Set()
  people.forEach(p => {
    if (p.rels.father && byId[p.rels.father]) hasParentInData.add(p.id)
    if (p.rels.mother && byId[p.rels.mother]) hasParentInData.add(p.id)
  })
  const roots = people.filter(p => !hasParentInData.has(p.id))
  if (!roots.length) roots.push(people[0])

  const visited = new Set()
  const queue = roots.map(r => [r.id, 0])
  while (queue.length) {
    const [id, g] = queue.shift()
    if (visited.has(id)) continue
    visited.add(id); gen[id] = g
    const p = byId[id]; if (!p) continue
    p.rels.spouses.forEach(sid => { if (!visited.has(sid) && byId[sid]) queue.push([sid, g]) })
    p.rels.children.forEach(cid => { if (!visited.has(cid) && byId[cid]) queue.push([cid, g+1]) })
  }
  people.forEach(p => { if (gen[p.id] === undefined) gen[p.id] = 0 })

  // ── DFS placement order (keeps family units together) ─────────────────
  const orderedByGen = {}
  const placed = new Set()

  function place(id) {
    if (placed.has(id)) return
    placed.add(id)
    const g = gen[id]; if (!orderedByGen[g]) orderedByGen[g] = []
    orderedByGen[g].push(id)
    const p = byId[id]; if (!p) return
    p.rels.spouses.forEach(sid => {
      if (!placed.has(sid) && byId[sid]) { placed.add(sid); orderedByGen[g].push(sid) }
    })
    p.rels.children.forEach(cid => { if (!placed.has(cid) && byId[cid]) place(cid) })
  }
  roots.forEach(r => place(r.id))
  people.forEach(p => { if (!placed.has(p.id)) place(p.id) })

  // ── Assign x positions left to right ─────────────────────────────────
  const positions = {}
  const gens = Object.keys(orderedByGen).map(Number).sort((a, b) => a - b)

  gens.forEach(g => {
    const ids = orderedByGen[g]; let cx = 0
    ids.forEach((id, i) => {
      positions[id] = { x: cx, y: g * (NH + VGAP) }
      if (i < ids.length - 1) {
        const p = byId[id]; const isSpouse = p && p.rels.spouses.includes(ids[i+1])
        cx += NW + (isSpouse ? SGAP : HGAP)
      }
    })
  })

  // Center the whole layout
  const allX = Object.values(positions).map(p => p.x)
  const totalW = Math.max(...allX) + NW - Math.min(...allX)
  const offsetX = -totalW / 2 - Math.min(...allX)
  Object.keys(positions).forEach(id => { positions[id].x += offsetX })

  // ── Centering pass: move parents above their children (3 iterations) ──
  for (let pass = 0; pass < 3; pass++) {
    gens.slice().reverse().forEach(g => {
      const done = new Set()
      ;(orderedByGen[g] || []).forEach(id => {
        if (done.has(id)) return
        const p = byId[id]; if (!p || !p.rels.children.length) return
        const unit = [id, ...p.rels.spouses.filter(s => gen[s] === g && byId[s])]
        unit.forEach(u => done.add(u))
        const children = p.rels.children.filter(c => positions[c])
        if (!children.length) return
        const cMinX = Math.min(...children.map(c => positions[c].x))
        const cMaxX = Math.max(...children.map(c => positions[c].x)) + NW
        const childCenter = (cMinX + cMaxX) / 2
        const uMinX = Math.min(...unit.map(u => positions[u].x))
        const uMaxX = Math.max(...unit.map(u => positions[u].x)) + NW
        const unitCenter = (uMinX + uMaxX) / 2
        const delta = childCenter - unitCenter
        if (Math.abs(delta) > 1) unit.forEach(u => { positions[u].x += delta })
      })
    })
  }

  // ── Build edges ────────────────────────────────────────────────────────
  const edges = []; const edgeSeen = new Set()
  people.forEach(p => {
    const pPos = positions[p.id]; if (!pPos) return
    // Spouse line
    p.rels.spouses.forEach(sid => {
      const key = [p.id, sid].sort().join('~')
      if (edgeSeen.has(key)) return; edgeSeen.add(key)
      const sPos = positions[sid]; if (!sPos) return
      edges.push({ type:'spouse', x1:pPos.x+NW, y1:pPos.y+NH/2, x2:sPos.x, y2:sPos.y+NH/2, id:key })
    })
    // Parent-child lines
    p.rels.children.forEach(cid => {
      const cPos = positions[cid]; if (!cPos) return
      const edgeKey = `${p.id}>${cid}`; if (edgeSeen.has(edgeKey)) return; edgeSeen.add(edgeKey)
      let coPos = null
      p.rels.spouses.forEach(sid => { const sp = byId[sid]; if (sp && sp.rels.children.includes(cid)) coPos = positions[sid] })
      const parentMidX = coPos ? (pPos.x + NW/2 + coPos.x + NW/2) / 2 : pPos.x + NW/2
      const midY = pPos.y + NH + VGAP/2
      edges.push({ type:'parent-child', path:`M${parentMidX} ${pPos.y+NH}L${parentMidX} ${midY}L${cPos.x+NW/2} ${midY}L${cPos.x+NW/2} ${cPos.y}`, id:edgeKey })
    })
  })

  const allXFinal = Object.values(positions).map(p => p.x)
  const allY = Object.values(positions).map(p => p.y)
  const bounds = {
    x: Math.min(...allXFinal) - 60,
    y: Math.min(...allY) - 60,
    w: Math.max(...allXFinal) + NW - Math.min(...allXFinal) + 120,
    h: Math.max(...allY) + NH - Math.min(...allY) + 120,
  }

  return { positions, edges, NW, NH, bounds }
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSON CARD — SVG
// ═══════════════════════════════════════════════════════════════════════════
function PersonCard({ person, x, y, NW, NH, selected, hovered, onClick, onHover, lang, settings }) {
  const d = person.data
  const name = fullName(d)
  const isMale = d.sex === 'M'
  const isDead = !!d.death
  const accentCol = isMale ? C.primary : C.accent
  const cardFill = selected ? C.primary : hovered ? C.surface : C.card
  const strokeCol = selected ? C.gold : hovered ? C.primary : C.border
  const strokeW = selected ? 2.5 : hovered ? 1.5 : 1

  const displayName = name.length > (NW < 160 ? 14 : NW < 190 ? 17 : 20) ? name.slice(0, NW < 160 ? 13 : NW < 190 ? 16 : 19) + '…' : name
  const year = d.birth?.date ? d.birth.date.slice(0,4) : ''
  const showYear = settings.cardDetail !== 'name'
  const showJob = settings.cardDetail === 'full' && d.job
  const showPhoto = settings.showPhotos
  const photoRadius = NH < 80 ? 20 : 24
  const photoCX = 14 + photoRadius

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={e => { e.stopPropagation(); onClick(person.id) }}
      onMouseEnter={() => onHover(person.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor:'pointer' }}
    >
      {/* Shadow */}
      <rect width={NW} height={NH} rx={11} fill={selected ? C.shadow : hovered ? C.shadow : 'transparent'} transform="translate(2,3)" opacity={0.5} />
      {/* Card */}
      <rect width={NW} height={NH} rx={11} fill={cardFill} stroke={strokeCol} strokeWidth={strokeW} />
      {/* Accent bar */}
      <rect x={0} y={10} width={3.5} height={NH-20} rx={2} fill={accentCol} opacity={selected ? 0.7 : 0.35} />

      {/* Photo */}
      {showPhoto && d.photo ? (
        <>
          <defs><clipPath id={`cl-${person.id}`}><circle cx={photoCX} cy={NH/2} r={photoRadius} /></clipPath></defs>
          <image href={d.photo} x={photoCX-photoRadius} y={NH/2-photoRadius} width={photoRadius*2} height={photoRadius*2} clipPath={`url(#cl-${person.id})`} preserveAspectRatio="xMidYMid slice" />
          <circle cx={photoCX} cy={NH/2} r={photoRadius} fill="none" stroke={selected ? C.gold : accentCol} strokeWidth={1.5} opacity={0.5} />
        </>
      ) : (
        <>
          <circle cx={photoCX} cy={NH/2} r={photoRadius} fill={accentCol} opacity={selected ? 0.25 : 0.1} />
          <text x={photoCX} y={NH/2+6} textAnchor="middle" fontSize={photoRadius} fill={accentCol} opacity={0.7}>{isMale ? '◈' : '◇'}</text>
        </>
      )}

      {/* Text */}
      {(() => {
        const tx = photoCX + photoRadius + 10
        const availW = NW - tx - 8
        const nameSize = NW < 160 ? 12 : 13
        const subSize = nameSize - 1
        let yName = NH/2 - (showYear || showJob ? (showJob ? 12 : 7) : 0)
        return (
          <>
            <text x={tx} y={yName} fontSize={nameSize} fontWeight="700" fill={selected ? C.white : C.ink} fontFamily={FONT[lang].body}>
              {displayName}
            </text>
            {showYear && (
              <text x={tx} y={yName+16} fontSize={subSize} fill={selected ? '#ffffffbb' : C.muted} fontFamily="Karla, sans-serif">
                {year}{isDead ? ' †' : ''}
              </text>
            )}
            {showJob && (
              <text x={tx} y={yName+30} fontSize={subSize-1} fill={selected ? '#ffffff99' : C.muted} fontFamily="Karla, sans-serif">
                {d.job.length > Math.floor(availW/6) ? d.job.slice(0, Math.floor(availW/6)-1)+'…' : d.job}
              </text>
            )}
          </>
        )
      })()}

      {/* Selected dot */}
      {selected && <circle cx={NW-12} cy={12} r={5} fill={C.gold} />}
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TREE VIEW — SVG canvas with pan, zoom, and zoom controls
// ═══════════════════════════════════════════════════════════════════════════
function TreeView({ data, focusedId, onPersonClick, t, lang, settings, onFitRef }) {
  const svgRef = useRef(null)
  const [vb, setVb] = useState({ x: -600, y: -150, w: 1400, h: 900 })
  const [hovered, setHovered] = useState(null)
  const drag = useRef({ on: false, sx: 0, sy: 0, svb: null })
  const pinch = useRef({ on: false, d: 0 })

  const layout = useMemo(() => computeLayout(data, settings.boxSize), [data, settings.boxSize])

  // Fit to screen
  const fitToScreen = useCallback(() => {
    const b = layout.bounds
    if (!b || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = rect.width / b.w
    const scaleY = rect.height / b.h
    const scale = Math.min(scaleX, scaleY, 1)
    const w = rect.width / scale
    const h = rect.height / scale
    setVb({ x: b.x + (b.w - w) / 2, y: b.y + (b.h - h) / 2, w, h })
  }, [layout])

  // Expose fitToScreen via ref
  useEffect(() => { if (onFitRef) onFitRef.current = fitToScreen }, [fitToScreen, onFitRef])

  // Fit on first load / data change
  useEffect(() => { setTimeout(fitToScreen, 50) }, [data.length > 0]) // eslint-disable-line

  // Pan to focused person
  useEffect(() => {
    if (!focusedId) return
    const pos = layout.positions[focusedId]
    if (!pos) return
    const [NW, NH] = BOX[settings.boxSize]
    setVb(v => ({ ...v, x: pos.x + NW/2 - v.w/2, y: pos.y + NH/2 - v.h/2 }))
  }, [focusedId]) // eslint-disable-line

  const scale = useCallback(() => {
    const el = svgRef.current; if (!el) return {sx:1,sy:1}
    const r = el.getBoundingClientRect()
    return { sx: vb.w / r.width, sy: vb.h / r.height }
  }, [vb])

  const zoom = useCallback((factor, cx, cy) => {
    setVb(v => {
      const newW = v.w * factor; const newH = v.h * factor
      const fx = cx ?? 0.5; const fy = cy ?? 0.5
      return { x: v.x + v.w*fx - newW*fx, y: v.y + v.h*fy - newH*fy, w: newW, h: newH }
    })
  }, [])

  const onPD = e => {
    if (e.target.closest('[data-card]')) return
    drag.current = { on:true, sx:e.clientX, sy:e.clientY, svb:{...vb} }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPM = e => {
    if (!drag.current.on) return
    const {sx,sy,svb} = drag.current; const {sx:scx,sy:scy} = scale()
    setVb(v => ({ ...v, x:svb.x-(e.clientX-sx)*scx, y:svb.y-(e.clientY-sy)*scy }))
  }
  const onPU = () => { drag.current.on = false }

  const onWheel = e => {
    e.preventDefault()
    const r = svgRef.current.getBoundingClientRect()
    zoom(e.deltaY > 0 ? 1.1 : 0.9, (e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height)
  }
  const onTS = e => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinch.current = { on:true, d:Math.hypot(dx,dy) }
    }
  }
  const onTM = e => {
    if (pinch.current.on && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const nd = Math.hypot(dx,dy)
      zoom(pinch.current.d / nd)
      pinch.current.d = nd
      e.preventDefault()
    }
  }

  const [NW, NH] = BOX[settings.boxSize]

  if (!data.length) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, fontFamily:FONT[lang].body, fontSize:15 }}>
      {t.emptyTree}
    </div>
  )

  return (
    <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        style={{ width:'100%', height:'100%', display:'block', touchAction:'none', background:C.bg, cursor:drag.current.on ? 'grabbing':'grab' }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
        onWheel={onWheel} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={()=>{pinch.current.on=false}}
        onClick={() => onPersonClick(null)}
      >
        {/* Grid */}
        <defs>
          <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0L0 0 0 60" fill="none" stroke={C.gridLine} strokeWidth="0.5" opacity="0.6"/>
          </pattern>
        </defs>
        <rect x={vb.x-3000} y={vb.y-3000} width={vb.w+6000} height={vb.h+6000} fill="url(#g)"/>

        {/* Edges */}
        {layout.edges.map(e => e.type === 'spouse' ? (
          <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={C.gold} strokeWidth={2} strokeDasharray="6 4"/>
        ) : (
          <path key={e.id} d={e.path} stroke={C.muted} strokeWidth={1.5} fill="none" opacity={0.55}/>
        ))}

        {/* Cards */}
        {data.map(p => {
          const pos = layout.positions[p.id]; if (!pos) return null
          return (
            <g key={p.id} data-card="1">
              <PersonCard
                person={p} x={pos.x} y={pos.y} NW={NW} NH={NH}
                selected={p.id === focusedId} hovered={p.id === hovered}
                onClick={onPersonClick} onHover={setHovered}
                lang={lang} settings={settings}
              />
            </g>
          )
        })}
      </svg>

      {/* Zoom controls — bottom right */}
      <div style={{ position:'absolute', bottom:16, right:16, display:'flex', flexDirection:'column', gap:6 }}>
        {[
          { label:'⊡', title:t.fitScreen, action: fitToScreen },
          { label:'+', title:'+', action: () => zoom(0.85) },
          { label:'−', title:'−', action: () => zoom(1.18) },
        ].map(btn => (
          <button key={btn.label} onClick={btn.action} title={btn.title} style={{
            width:38, height:38, borderRadius:10, border:`1px solid ${C.border}`,
            background:C.card, color:C.primary, fontSize:18, cursor:'pointer',
            boxShadow:`0 2px 8px ${C.shadow}`, fontWeight:700, lineHeight:1,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{btn.label}</button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR — focused person profile (bottom sheet)
// ═══════════════════════════════════════════════════════════════════════════
function Sidebar({ person, data, t, lang, isRTL, onClose, onEdit, onDelete, onNavigate, onAddRelative }) {
  const d = person.data
  const byId = Object.fromEntries(data.map(p => [p.id, p]))
  const fonts = FONT[lang]
  const name = fullName(d)

  const RelChip = ({ id, label }) => {
    const rel = byId[id]; if (!rel) return null
    return (
      <button onClick={() => onNavigate(id)} style={{
        background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
        padding:'5px 10px', cursor:'pointer', fontSize:12, color:C.primary,
        fontFamily:fonts.body, display:'flex', flexDirection:'column', gap:1,
        textAlign: isRTL ? 'right' : 'left',
      }}>
        <span style={{fontSize:9,color:C.muted,letterSpacing:'0.3px'}}>{label}</span>
        <span style={{fontWeight:600}}>{fullName(rel.data)}</span>
      </button>
    )
  }

  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      background:C.card,
      borderRadius:'20px 20px 0 0',
      boxShadow:`0 -4px 30px ${C.shadow}`,
      maxHeight:'55%',
      overflowY:'auto',
      zIndex:50,
      fontFamily:fonts.body,
    }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Drag handle */}
      <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 0' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:C.border }} />
      </div>

      <div style={{ padding:'12px 20px 24px' }}>
        {/* Header row */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
          {/* Photo */}
          <div style={{
            width:60, height:60, borderRadius:'50%', flexShrink:0, overflow:'hidden',
            background: d.sex==='M' ? `${C.primary}18` : `${C.accent}18`,
            border:`2px solid ${d.sex==='M' ? C.primary : C.accent}`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {d.photo
              ? <img src={d.photo} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              : <span style={{fontSize:24,color:d.sex==='M'?C.primary:C.accent}}>{d.sex==='M'?'◈':'◇'}</span>
            }
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:17,fontWeight:700,color:C.ink,fontFamily:fonts.display,lineHeight:1.2}}>{name}</div>
            {d.nickname && <div style={{fontSize:11,color:C.muted,marginTop:1}}>"{d.nickname}"</div>}
            {d.maiden && <div style={{fontSize:11,color:C.muted}}>née {d.maiden}</div>}
            <div style={{fontSize:11,color:C.muted,marginTop:3,lineHeight:1.6}}>
              {d.birth?.date && <span>b. {d.birth.date}{d.birth.place ? `, ${d.birth.place}` : ''} </span>}
              {d.death && <span style={{color:C.accent}}>† {d.death.date}{d.death.place ? `, ${d.death.place}` : ''}</span>}
            </div>
            {d.job && <div style={{fontSize:11,color:C.gold,marginTop:1}}>{d.job}{d.company ? ` · ${d.company}` : ''}</div>}
          </div>
          <button onClick={onClose} style={SX.iconBtn}>✕</button>
        </div>

        {/* Bio */}
        {d.bio && (
          <div style={{background:C.surface,borderRadius:10,padding:'8px 12px',marginBottom:12,fontSize:12,color:C.ink,lineHeight:1.6}}>
            {d.bio}
          </div>
        )}

        {/* Relations */}
        {(person.rels.father || person.rels.mother || person.rels.spouses.length || person.rels.children.length) > 0 && (
          <div style={{marginBottom:12}}>
            <div style={SX.secLabel}>{t.relations}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
              {person.rels.father && <RelChip id={person.rels.father} label={t.father}/>}
              {person.rels.mother && <RelChip id={person.rels.mother} label={t.mother}/>}
              {person.rels.spouses.map(id => <RelChip key={id} id={id} label={t.spouses}/>)}
              {person.rels.children.map(id => <RelChip key={id} id={id} label={t.children}/>)}
            </div>
          </div>
        )}

        {/* Contact */}
        {(d.phone || d.email || d.address) && (
          <div style={{marginBottom:12}}>
            <div style={SX.secLabel}>{t.contactInfo}</div>
            {d.phone && <div style={SX.contactRow}><span>📞</span>{d.phone}</div>}
            {d.email && <div style={SX.contactRow}><span>✉</span>{d.email}</div>}
            {d.address && <div style={SX.contactRow}><span>📍</span>{d.address}</div>}
          </div>
        )}

        {/* Add relative + actions */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
          <button onClick={() => onAddRelative('child')} style={SX.addRelBtn}>{t.addChild}</button>
          <button onClick={() => onAddRelative('spouse')} style={SX.addRelBtn}>{t.addSpouse}</button>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onEdit} style={SX.primaryBtn(FONT[lang])}>{t.edit}</button>
          <button onClick={onDelete} style={SX.dangerBtn(FONT[lang])}>{t.delete}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS PANEL
// ═══════════════════════════════════════════════════════════════════════════
function SettingsPanel({ settings, setSettings, t, lang, isRTL, onClose, onExport }) {
  const fonts = FONT[lang]
  const s = settings
  const upd = (key, val) => setSettings(prev => ({ ...prev, [key]: val }))

  const RadioGroup = ({ label, value, options, onChange }) => (
    <div style={{ marginBottom:16 }}>
      <div style={SX.secLabel}>{label}</div>
      <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            ...SX.smallBtn(fonts),
            background: value === o.value ? C.primary : C.surface,
            color: value === o.value ? C.white : C.ink,
            borderColor: value === o.value ? C.primary : C.border,
            flex:1, minWidth:60,
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={SX.overlay} onClick={onClose}>
      <div style={{...SX.sheet(isRTL), maxWidth:400, width:'100%', fontFamily:fonts.body}} onClick={e=>e.stopPropagation()} dir={isRTL?'rtl':'ltr'}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:C.ink,fontFamily:fonts.display}}>{t.settings}</div>
          <button onClick={onClose} style={SX.iconBtn}>✕</button>
        </div>

        <RadioGroup
          label={t.cardDetail}
          value={s.cardDetail}
          options={[
            { value:'name', label:t.detailName },
            { value:'nameyear', label:t.detailNameYear },
            { value:'full', label:t.detailFull },
          ]}
          onChange={v => upd('cardDetail', v)}
        />

        <RadioGroup
          label={t.cardSize}
          value={s.boxSize}
          options={[
            { value:'sm', label:t.sizeSm },
            { value:'md', label:t.sizeMd },
            { value:'lg', label:t.sizeLg },
          ]}
          onChange={v => upd('boxSize', v)}
        />

        <div style={{ marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={SX.secLabel}>{t.showPhotos}</div>
          <button onClick={() => upd('showPhotos', !s.showPhotos)} style={{
            width:44, height:26, borderRadius:13, border:'none', cursor:'pointer',
            background: s.showPhotos ? C.primary : C.border,
            position:'relative', transition:'background 0.2s',
          }}>
            <div style={{
              position:'absolute', top:3, left: s.showPhotos ? 21 : 3,
              width:20, height:20, borderRadius:'50%', background:C.white,
              transition:'left 0.2s',
            }}/>
          </button>
        </div>

        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:4 }}>
          <button onClick={onExport} style={{ ...SX.ghostBtn(fonts), width:'100%', textAlign:'center' }}>
            📥 {t.gedcomExport}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSON FORM — Add & Edit
// ═══════════════════════════════════════════════════════════════════════════
function PersonForm({ person, data, t, lang, isRTL, mode, relation, onSave, onCancel }) {
  const fonts = FONT[lang]
  const blank = { first_name:'', last_name:'', middle_name:'', nickname:'', maiden:'', sex:'M', birth:{date:'',place:''}, death:null, photo:'', bio:'', job:'', company:'', phone:'', email:'', address:'', notes:'', interests:'' }
  const [form, setForm] = useState(person ? {...blank,...person.data} : blank)
  const [isDead, setIsDead] = useState(!!(person?.data.death))
  const [relativeId, setRelativeId] = useState(relation?.relativeId || (data.length ? data[0].id : ''))
  const [relType, setRelType] = useState(relation?.type === 'spouse' ? 'spouse' : (data.length ? 'child' : 'root'))
  const fileRef = useRef(null)

  const set = (k,v) => setForm(f => ({...f,[k]:v}))
  const setBirth = (k,v) => setForm(f => ({...f,birth:{...f.birth,[k]:v}}))
  const setDeath = (k,v) => setForm(f => ({...f,death:{...(f.death||{date:'',place:''}),[k]:v}}))

  const handlePhoto = e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('photo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.first_name.trim()) return
    const finalData = {...form, death: isDead ? (form.death || {date:'',place:''}) : null}
    mode === 'edit' ? onSave(finalData) : onSave(finalData, { type:relType, relativeId: relType==='root' ? null : relativeId })
  }

  const F = ({label, children}) => (
    <div style={{marginBottom:12}}>
      <label style={{display:'block',fontSize:10,color:C.muted,fontFamily:'Karla,sans-serif',letterSpacing:'0.5px',textTransform:'uppercase',marginBottom:3}}>{label}</label>
      {children}
    </div>
  )
  const inp = (val, onChange, placeholder='') => (
    <input value={val||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={SX.input(fonts)} />
  )

  return (
    <div style={SX.overlay} onClick={onCancel}>
      <div style={{...SX.sheet(isRTL),maxWidth:480,width:'100%',maxHeight:'90vh',overflowY:'auto',fontFamily:fonts.body}} onClick={e=>e.stopPropagation()} dir={isRTL?'rtl':'ltr'}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div style={{fontSize:16,fontWeight:700,color:C.ink,fontFamily:fonts.display}}>{mode==='edit'?t.edit:t.add}</div>
          <button onClick={onCancel} style={SX.iconBtn}>✕</button>
        </div>

        {/* Photo */}
        <F label={t.photo}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:56,height:56,borderRadius:'50%',border:`2px dashed ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:C.surface,cursor:'pointer',flexShrink:0}} onClick={()=>fileRef.current?.click()}>
              {form.photo ? <img src={form.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:20,color:C.border}}>+</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>fileRef.current?.click()} style={SX.smallBtn(fonts)}>{form.photo?t.changePhoto:t.photo}</button>
              {form.photo && <button onClick={()=>set('photo','')} style={{...SX.smallBtn(fonts),color:C.accent,borderColor:C.accent}}>{t.removePhoto}</button>}
            </div>
          </div>
        </F>

        {/* Sex */}
        <F label={t.sex}>
          <div style={{display:'flex',gap:8}}>
            {['M','F'].map(s => (
              <button key={s} onClick={()=>set('sex',s)} style={{...SX.smallBtn(fonts),flex:1,background:form.sex===s?C.primary:C.surface,color:form.sex===s?C.white:C.ink,borderColor:form.sex===s?C.primary:C.border}}>
                {s==='M'?t.male:t.female}
              </button>
            ))}
          </div>
        </F>

        <F label={t.firstName}>{inp(form.first_name, v=>set('first_name',v))}</F>
        <F label={t.lastName}>{inp(form.last_name, v=>set('last_name',v))}</F>
        <F label={t.middleName}>{inp(form.middle_name, v=>set('middle_name',v))}</F>
        <F label={t.nickname}>{inp(form.nickname, v=>set('nickname',v))}</F>
        {form.sex==='F' && <F label={t.maiden}>{inp(form.maiden, v=>set('maiden',v))}</F>}

        <F label={t.born}>
          <div style={{display:'flex',gap:8}}>
            {inp(form.birth?.date, v=>setBirth('date',v), '1980')}
            {inp(form.birth?.place, v=>setBirth('place',v), t.place)}
          </div>
        </F>

        <F label={t.deceased}>
          <button onClick={()=>setIsDead(x=>!x)} style={{...SX.smallBtn(fonts),background:isDead?C.accent:C.surface,color:isDead?C.white:C.ink,borderColor:isDead?C.accent:C.border}}>
            {isDead ? `† ${t.deceased}` : t.alive}
          </button>
        </F>

        {isDead && (
          <F label={t.died}>
            <div style={{display:'flex',gap:8}}>
              {inp(form.death?.date, v=>setDeath('date',v), '2020')}
              {inp(form.death?.place, v=>setDeath('place',v), t.place)}
            </div>
          </F>
        )}

        <F label={t.job}>{inp(form.job, v=>set('job',v))}</F>
        <F label={t.company}>{inp(form.company, v=>set('company',v))}</F>
        <F label={t.bio}>
          <textarea value={form.bio||''} onChange={e=>set('bio',e.target.value)} rows={3} style={{...SX.input(fonts),resize:'vertical',lineHeight:1.5}}/>
        </F>
        <F label={t.phone}>{inp(form.phone, v=>set('phone',v))}</F>
        <F label={t.email}>{inp(form.email, v=>set('email',v))}</F>
        <F label={t.address}>{inp(form.address, v=>set('address',v))}</F>
        <F label={t.notes}>{inp(form.notes, v=>set('notes',v))}</F>
        <F label={t.interests}>{inp(form.interests, v=>set('interests',v))}</F>

        {mode==='add' && data.length > 0 && (
          <>
            <F label={t.relativeTo}>
              <select value={relType} onChange={e=>setRelType(e.target.value)} style={SX.input(fonts)}>
                <option value="child">{t.childOf}</option>
                <option value="spouse">{t.spouseOf}</option>
                <option value="root">{t.root}</option>
              </select>
            </F>
            {relType !== 'root' && (
              <F label={relType==='child' ? `${t.father} / ${t.mother}` : t.spouses}>
                <select value={relativeId} onChange={e=>setRelativeId(e.target.value)} style={SX.input(fonts)}>
                  {data.map(p => <option key={p.id} value={p.id}>{fullName(p.data)}</option>)}
                </select>
              </F>
            )}
          </>
        )}

        <div style={{display:'flex',gap:10,marginTop:8}}>
          <button onClick={handleSubmit} style={SX.primaryBtn(fonts)}>{t.save}</button>
          <button onClick={onCancel} style={SX.ghostBtn(fonts)}>{t.cancel}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════
function Header({ t, lang, setLang, isRTL, data, onAdd, onSettings, onFocusPerson }) {
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const fonts = FONT[lang]

  const results = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return data.filter(p => {
      const n = `${p.data.first_name||''} ${p.data.last_name||''} ${p.data.nickname||''} ${p.data.job||''}`.toLowerCase()
      return n.includes(q)
    }).slice(0, 8)
  }, [search, data])

  const pick = id => { onFocusPerson(id); setSearch(''); setShowSearch(false) }

  return (
    <div style={{ background:C.primary, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0, position:'relative', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <div style={{ display:'flex', flexDirection:'column', marginInlineEnd:'auto' }}>
        <div style={{ fontSize:18, fontWeight:700, color:C.white, fontFamily:fonts.display, lineHeight:1 }}>{t.app}</div>
        <div style={{ fontSize:9, color:`${C.white}77`, fontFamily:'Karla,sans-serif', letterSpacing:1 }}>{t.tagline.toUpperCase()}</div>
      </div>

      {/* Search */}
      <div style={{ position:'relative' }}>
        <button onClick={() => setShowSearch(x => !x)} style={{ ...SX.iconBtn, color:C.white, opacity:0.85 }}>🔍</button>
        {showSearch && (
          <div style={{ position:'absolute', top:'110%', [isRTL?'left':'right']:0, width:280, background:C.white, borderRadius:12, boxShadow:`0 8px 32px ${C.shadow}`, zIndex:300, overflow:'hidden' }}>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search}
              style={{ width:'100%', border:'none', outline:'none', padding:'11px 14px', fontSize:13, fontFamily:fonts.body, color:C.ink, borderBottom: results.length ? `1px solid ${C.border}` : 'none' }}
              dir={isRTL?'rtl':'ltr'}
            />
            {results.map(p => (
              <div key={p.id} onClick={() => pick(p.id)} style={{ padding:'9px 14px', cursor:'pointer', fontSize:13, color:C.ink, fontFamily:fonts.body, borderBottom:`1px solid ${C.border}` }}
                onMouseEnter={e=>e.currentTarget.style.background=C.surface} onMouseLeave={e=>e.currentTarget.style.background=''}>
                {fullName(p.data)}
                {p.data.birth?.date && <span style={{ color:C.muted, marginInlineStart:8, fontSize:11 }}>{p.data.birth.date}</span>}
              </div>
            ))}
            {search && !results.length && <div style={{ padding:'9px 14px', color:C.muted, fontSize:13, fontFamily:fonts.body }}>{t.noMatch}</div>}
          </div>
        )}
      </div>

      {/* Settings */}
      <button onClick={onSettings} style={{ ...SX.iconBtn, color:C.white, opacity:0.85 }}>⚙</button>

      {/* Add */}
      <button onClick={onAdd} style={{ background:C.gold, color:C.white, border:'none', borderRadius:9, padding:'7px 13px', cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:fonts.body, whiteSpace:'nowrap' }}>
        + {t.add.split(' ')[0]}
      </button>

      {/* Lang */}
      <div style={{ display:'flex', gap:3 }}>
        {['ar','fr','en','it'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ background:lang===l?C.gold:'transparent', color:C.white, border:`1px solid ${lang===l?C.gold:`${C.white}44`}`, borderRadius:6, padding:'3px 6px', fontSize:10, cursor:'pointer', fontFamily:'Karla,sans-serif', fontWeight:lang===l?700:400 }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED STYLES
// ═══════════════════════════════════════════════════════════════════════════
const SX = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.38)', zIndex:100, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:16 },
  sheet: isRTL => ({ background:C.card, borderRadius:20, padding:22, boxShadow:`0 -4px 40px rgba(0,0,0,0.18)` }),
  input: fonts => ({ width:'100%', padding:'8px 11px', border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, fontFamily:fonts.body, color:C.ink, background:C.surface, outline:'none' }),
  iconBtn: { background:'none', border:'none', cursor:'pointer', fontSize:16, color:C.muted, padding:6, lineHeight:1, borderRadius:8 },
  secLabel: { fontSize:10, color:C.muted, fontFamily:'Karla,sans-serif', letterSpacing:'0.4px', textTransform:'uppercase', fontWeight:500 },
  contactRow: { display:'flex', alignItems:'center', gap:8, fontSize:12, color:C.ink, padding:'3px 0' },
  primaryBtn: fonts => ({ flex:1, background:C.primary, color:C.white, border:'none', borderRadius:10, padding:'10px 14px', cursor:'pointer', fontSize:14, fontWeight:700, fontFamily:fonts.body }),
  dangerBtn: fonts => ({ background:'transparent', color:C.accent, border:`1px solid ${C.accent}`, borderRadius:10, padding:'10px 14px', cursor:'pointer', fontSize:14, fontFamily:fonts.body }),
  ghostBtn: fonts => ({ flex:1, background:C.surface, color:C.muted, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', cursor:'pointer', fontSize:14, fontFamily:fonts.body }),
  smallBtn: fonts => ({ background:C.surface, color:C.ink, border:`1px solid ${C.border}`, borderRadius:8, padding:'6px 11px', cursor:'pointer', fontSize:12, fontFamily:fonts.body }),
  addRelBtn: { background:C.surface, color:C.primary, border:`1px solid ${C.gold}`, borderRadius:8, padding:'6px 11px', cursor:'pointer', fontSize:12, fontWeight:600 },
}

// ═══════════════════════════════════════════════════════════════════════════
// GEDCOM EXPORT
// ═══════════════════════════════════════════════════════════════════════════
function exportGEDCOM(data) {
  const lines = ['0 HEAD', '1 GEDC', '2 VERS 5.5.1', '1 CHAR UTF-8', '1 SOUR Asli']
  data.forEach(p => {
    const d = p.data
    lines.push(`0 @${p.id}@ INDI`)
    if (d.first_name || d.last_name) lines.push(`1 NAME ${d.first_name||''} /${d.last_name||''}/`)
    if (d.sex) lines.push(`1 SEX ${d.sex}`)
    if (d.birth?.date || d.birth?.place) {
      lines.push('1 BIRT')
      if (d.birth?.date) lines.push(`2 DATE ${d.birth.date}`)
      if (d.birth?.place) lines.push(`2 PLAC ${d.birth.place}`)
    }
    if (d.death) {
      lines.push('1 DEAT')
      if (d.death.date) lines.push(`2 DATE ${d.death.date}`)
      if (d.death.place) lines.push(`2 PLAC ${d.death.place}`)
    }
    if (d.job) lines.push(`1 OCCU ${d.job}`)
    if (d.notes) lines.push(`1 NOTE ${d.notes}`)
  })
  // Family records
  const famSeen = new Set()
  data.forEach(p => {
    p.rels.spouses.forEach(sid => {
      const fkey = [p.id, sid].sort().join('~')
      if (famSeen.has(fkey)) return; famSeen.add(fkey)
      const famId = `F${fkey.replace('~','_')}`
      lines.push(`0 @${famId}@ FAM`)
      lines.push(`1 ${p.data.sex==='M'?'HUSB':'WIFE'} @${p.id}@`)
      lines.push(`1 ${p.data.sex==='M'?'WIFE':'HUSB'} @${sid}@`)
      p.rels.children.forEach(cid => lines.push(`1 CHIL @${cid}@`))
    })
  })
  lines.push('0 TRLR')
  const blob = new Blob([lines.join('\n')], { type:'text/plain' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'asli-family.ged'; a.click()
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('asli-lang') || 'ar')
  const [data, setData] = useState(loadData)
  const [settings, setSettings] = useState(loadSettings)
  const [focusedId, setFocusedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [addRelation, setAddRelation] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const fitRef = useRef(null)

  const isRTL = lang === 'ar'
  const t = T[lang]

  useEffect(() => {
    localStorage.setItem('asli-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [lang, isRTL])

  useEffect(() => { saveData(data) }, [data])
  useEffect(() => { saveSettings(settings) }, [settings])

  const updateData = useCallback(d => { setData(d); saveData(d) }, [])

  const addPerson = useCallback((personData, relation) => {
    const newId = genId()
    const newPerson = { id:newId, data:personData, rels:{father:null,mother:null,spouses:[],children:[]} }
    let next = [...data, newPerson]

    if (relation?.type === 'child' && relation.relativeId) {
      const parent = data.find(p => p.id === relation.relativeId)
      if (parent) {
        const field = parent.data.sex === 'M' ? 'father' : 'mother'
        const otherField = field === 'father' ? 'mother' : 'father'
        next = next.map(p => {
          if (p.id === newId) {
            let np = {...p, rels:{...p.rels, [field]: relation.relativeId}}
            parent.rels.spouses.forEach(sid => { np = {...np, rels:{...np.rels, [otherField]: sid}} })
            return np
          }
          if (p.id === relation.relativeId) return {...p, rels:{...p.rels, children:[...p.rels.children, newId]}}
          if (parent.rels.spouses.includes(p.id)) return {...p, rels:{...p.rels, children:[...p.rels.children, newId]}}
          return p
        })
      }
    } else if (relation?.type === 'spouse' && relation.relativeId) {
      next = next.map(p => {
        if (p.id === newId) return {...p, rels:{...p.rels, spouses:[relation.relativeId]}}
        if (p.id === relation.relativeId) return {...p, rels:{...p.rels, spouses:[...p.rels.spouses, newId]}}
        return p
      })
    }
    updateData(next); setFocusedId(newId)
  }, [data, updateData])

  const editPerson = useCallback((id, personData) => {
    updateData(data.map(p => p.id === id ? {...p, data:personData} : p))
  }, [data, updateData])

  const deletePerson = useCallback((id) => {
    if (!window.confirm(t.deleteWarn)) return
    const next = data.filter(p => p.id !== id).map(p => ({
      ...p, rels: {
        father: p.rels.father===id ? null : p.rels.father,
        mother: p.rels.mother===id ? null : p.rels.mother,
        spouses: p.rels.spouses.filter(s => s !== id),
        children: p.rels.children.filter(c => c !== id),
      }
    }))
    updateData(next); setFocusedId(null)
  }, [data, updateData, t.deleteWarn])

  const focusedPerson = data.find(p => p.id === focusedId)
  const editingPerson = data.find(p => p.id === editingId)

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', background:C.bg, overflow:'hidden' }}>
      <Header
        t={t} lang={lang} setLang={setLang} isRTL={isRTL}
        data={data}
        onAdd={() => setAddRelation({ type:'root', relativeId:null })}
        onSettings={() => setShowSettings(true)}
        onFocusPerson={id => setFocusedId(id)}
      />

      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        <TreeView
          data={data}
          focusedId={focusedId}
          onPersonClick={id => setFocusedId(id === focusedId ? null : id)}
          t={t} lang={lang} settings={settings}
          onFitRef={fitRef}
        />

        {focusedPerson && !editingId && !addRelation && !showSettings && (
          <Sidebar
            person={focusedPerson} data={data} t={t} lang={lang} isRTL={isRTL}
            onClose={() => setFocusedId(null)}
            onEdit={() => { setEditingId(focusedId); setFocusedId(null) }}
            onDelete={() => deletePerson(focusedId)}
            onNavigate={id => setFocusedId(id)}
            onAddRelative={type => { setAddRelation({type, relativeId:focusedId}); setFocusedId(null) }}
          />
        )}
      </div>

      {editingPerson && (
        <PersonForm
          person={editingPerson} data={data} t={t} lang={lang} isRTL={isRTL} mode="edit"
          onSave={d => { editPerson(editingId, d); setEditingId(null); setFocusedId(editingId) }}
          onCancel={() => setEditingId(null)}
        />
      )}

      {addRelation && (
        <PersonForm
          person={null} data={data} t={t} lang={lang} isRTL={isRTL} mode="add" relation={addRelation}
          onSave={(d, rel) => { addPerson(d, rel); setAddRelation(null) }}
          onCancel={() => setAddRelation(null)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings} setSettings={setSettings}
          t={t} lang={lang} isRTL={isRTL}
          onClose={() => setShowSettings(false)}
          onExport={() => exportGEDCOM(data)}
        />
      )}
    </div>
  )
}
