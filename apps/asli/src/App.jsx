import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — Maghrebi Modern
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
  shadow:  'rgba(28,61,90,0.13)',
}

const FONT = {
  ar:   { display: "'Reem Kufi', sans-serif",  body: "'Tajawal', sans-serif" },
  fr:   { display: "'Fraunces', serif",         body: "'Manrope', sans-serif" },
  en:   { display: "'Fraunces', serif",         body: "'Manrope', sans-serif" },
  it:   { display: "'Fraunces', serif",         body: "'Manrope', sans-serif" },
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
    maiden: 'اسم العائلة قبل الزواج', sex: 'الجنس',
    male: 'ذكر', female: 'أنثى',
    born: 'الميلاد', died: 'الوفاة', place: 'المكان',
    bio: 'السيرة الذاتية', job: 'المهنة',
    phone: 'الهاتف', email: 'البريد الإلكتروني', address: 'العنوان',
    father: 'الأب', mother: 'الأم', spouses: 'الزوج / الزوجة', children: 'الأبناء',
    relations: 'العلاقات',
    relType: 'علاقة بـ', childOf: 'ابن/ابنة لـ', spouseOf: 'زوج/زوجة لـ', root: 'شخص مستقل',
    photo: 'صورة', changePhoto: 'تغيير الصورة', removePhoto: 'حذف الصورة',
    deleteWarn: 'حذف هذا الشخص نهائياً؟', noMatch: 'لا توجد نتائج',
    addChild: '+ ابن / ابنة', addSpouse: '+ زوج / زوجة',
    deceased: 'متوفى', alive: 'على قيد الحياة',
    contactInfo: 'معلومات التواصل', personalInfo: 'معلومات شخصية',
    relativeTo: 'علاقة بشخص موجود',
    noParent: 'لا يوجد (جذر العائلة)',
    panHint: 'اسحب للتنقل • ادفع للتكبير',
    emptyTree: 'أضف أول فرد من العائلة',
  },
  fr: {
    app: 'Asli', tagline: 'Arbre généalogique',
    add: 'Ajouter une personne', search: 'Rechercher dans la famille...', close: 'Fermer',
    edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler',
    firstName: 'Prénom', lastName: 'Nom de famille', nickname: 'Surnom',
    maiden: 'Nom de jeune fille', sex: 'Sexe',
    male: 'Homme', female: 'Femme',
    born: 'Naissance', died: 'Décès', place: 'Lieu',
    bio: 'Biographie', job: 'Profession',
    phone: 'Téléphone', email: 'E-mail', address: 'Adresse',
    father: 'Père', mother: 'Mère', spouses: 'Conjoint(e)', children: 'Enfants',
    relations: 'Relations',
    relType: 'Relation avec', childOf: 'Enfant de', spouseOf: 'Conjoint(e) de', root: 'Personne indépendante',
    photo: 'Photo', changePhoto: 'Changer la photo', removePhoto: 'Supprimer la photo',
    deleteWarn: 'Supprimer définitivement cette personne ?', noMatch: 'Aucun résultat',
    addChild: '+ Enfant', addSpouse: '+ Conjoint(e)',
    deceased: 'Décédé(e)', alive: 'Vivant(e)',
    contactInfo: 'Coordonnées', personalInfo: 'Informations personnelles',
    relativeTo: 'Relation à une personne existante',
    noParent: 'Aucun (racine de l\'arbre)',
    panHint: 'Glisser pour naviguer • Pincer pour zoomer',
    emptyTree: 'Ajoutez le premier membre de la famille',
  },
  en: {
    app: 'Asli', tagline: 'Family Tree',
    add: 'Add person', search: 'Search family...', close: 'Close',
    edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    firstName: 'First name', lastName: 'Last name', nickname: 'Nickname',
    maiden: 'Maiden name', sex: 'Sex',
    male: 'Male', female: 'Female',
    born: 'Born', died: 'Died', place: 'Place',
    bio: 'Biography', job: 'Occupation',
    phone: 'Phone', email: 'Email', address: 'Address',
    father: 'Father', mother: 'Mother', spouses: 'Spouse', children: 'Children',
    relations: 'Relations',
    relType: 'Relation to', childOf: 'Child of', spouseOf: 'Spouse of', root: 'Independent person',
    photo: 'Photo', changePhoto: 'Change photo', removePhoto: 'Remove photo',
    deleteWarn: 'Permanently delete this person?', noMatch: 'No results',
    addChild: '+ Child', addSpouse: '+ Spouse',
    deceased: 'Deceased', alive: 'Living',
    contactInfo: 'Contact info', personalInfo: 'Personal info',
    relativeTo: 'Relation to existing person',
    noParent: 'None (tree root)',
    panHint: 'Drag to pan • Pinch to zoom',
    emptyTree: 'Add the first family member',
  },
  it: {
    app: 'Asli', tagline: 'Albero genealogico',
    add: 'Aggiungi persona', search: 'Cerca nella famiglia...', close: 'Chiudi',
    edit: 'Modifica', delete: 'Elimina', save: 'Salva', cancel: 'Annulla',
    firstName: 'Nome', lastName: 'Cognome', nickname: 'Soprannome',
    maiden: 'Nome da nubile', sex: 'Sesso',
    male: 'Maschio', female: 'Femmina',
    born: 'Nascita', died: 'Morte', place: 'Luogo',
    bio: 'Biografia', job: 'Professione',
    phone: 'Telefono', email: 'Email', address: 'Indirizzo',
    father: 'Padre', mother: 'Madre', spouses: 'Coniuge', children: 'Figli',
    relations: 'Relazioni',
    relType: 'Relazione con', childOf: 'Figlio/a di', spouseOf: 'Coniuge di', root: 'Persona indipendente',
    photo: 'Foto', changePhoto: 'Cambia foto', removePhoto: 'Rimuovi foto',
    deleteWarn: 'Eliminare definitivamente questa persona?', noMatch: 'Nessun risultato',
    addChild: '+ Figlio/a', addSpouse: '+ Coniuge',
    deceased: 'Deceduto/a', alive: 'In vita',
    contactInfo: 'Informazioni di contatto', personalInfo: 'Informazioni personali',
    relativeTo: 'Relazione con persona esistente',
    noParent: 'Nessuno (radice dell\'albero)',
    panHint: 'Trascina per spostarti • Pizzica per ingrandire',
    emptyTree: 'Aggiungi il primo membro della famiglia',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL MOCK DATA — Tunisian family, 3 generations, 12 people
// ═══════════════════════════════════════════════════════════════════════════
const INITIAL_DATA = [
  {
    id: 'p1',
    data: {
      first_name: 'محمد', last_name: 'بن سالم', nickname: 'الحاج محمد', maiden: '',
      sex: 'M',
      birth: { date: '1938', place: 'تونس العاصمة' },
      death: { date: '2010', place: 'تونس العاصمة' },
      photo: '', bio: 'مؤسس العائلة، تاجر زيتون معروف في حي الباردو.', job: 'تاجر',
      contact: { phone: '', email: '', address: 'الباردو، تونس' },
    },
    rels: { father: null, mother: null, spouses: ['p2'], children: ['p3', 'p4', 'p5'] },
  },
  {
    id: 'p2',
    data: {
      first_name: 'فاطمة', last_name: 'بن سالم', nickname: '', maiden: 'القيراوني',
      sex: 'F',
      birth: { date: '1943', place: 'القيروان' },
      death: null,
      photo: '', bio: 'ربة منزل وأم حنون، معروفة بطبخها الشهي.', job: '',
      contact: { phone: '216 20 000 001', email: '', address: 'الباردو، تونس' },
    },
    rels: { father: null, mother: null, spouses: ['p1'], children: ['p3', 'p4', 'p5'] },
  },
  {
    id: 'p3',
    data: {
      first_name: 'أحمد', last_name: 'بن سالم', nickname: '', maiden: '',
      sex: 'M',
      birth: { date: '1965', place: 'تونس العاصمة' },
      death: null,
      photo: '', bio: '', job: 'مهندس في شركة اتصالات تونس',
      contact: { phone: '216 20 000 002', email: 'ahmed.bensalem@email.tn', address: 'المرسى، تونس' },
    },
    rels: { father: 'p1', mother: 'p2', spouses: ['p6'], children: ['p8', 'p9', 'p10'] },
  },
  {
    id: 'p4',
    data: {
      first_name: 'ليلى', last_name: 'المنصوري', nickname: '', maiden: 'بن سالم',
      sex: 'F',
      birth: { date: '1968', place: 'تونس العاصمة' },
      death: null,
      photo: '', bio: '', job: 'طبيبة عامة',
      contact: { phone: '216 20 000 003', email: '', address: 'صفاقس، تونس' },
    },
    rels: { father: 'p1', mother: 'p2', spouses: ['p7'], children: ['p11', 'p12'] },
  },
  {
    id: 'p5',
    data: {
      first_name: 'عمر', last_name: 'بن سالم', nickname: '', maiden: '',
      sex: 'M',
      birth: { date: '1972', place: 'تونس العاصمة' },
      death: null,
      photo: '', bio: '', job: 'محامي',
      contact: { phone: '216 20 000 004', email: '', address: 'تونس العاصمة' },
    },
    rels: { father: 'p1', mother: 'p2', spouses: [], children: [] },
  },
  {
    id: 'p6',
    data: {
      first_name: 'نادية', last_name: 'بن سالم', nickname: '', maiden: 'الشابي',
      sex: 'F',
      birth: { date: '1967', place: 'بنزرت' },
      death: null,
      photo: '', bio: '', job: 'أستاذة لغة عربية',
      contact: { phone: '216 20 000 005', email: '', address: 'المرسى، تونس' },
    },
    rels: { father: null, mother: null, spouses: ['p3'], children: ['p8', 'p9', 'p10'] },
  },
  {
    id: 'p7',
    data: {
      first_name: 'كريم', last_name: 'المنصوري', nickname: '', maiden: '',
      sex: 'M',
      birth: { date: '1964', place: 'نابل' },
      death: null,
      photo: '', bio: '', job: 'مدير شركة خاصة',
      contact: { phone: '216 20 000 006', email: '', address: 'صفاقس، تونس' },
    },
    rels: { father: null, mother: null, spouses: ['p4'], children: ['p11', 'p12'] },
  },
  {
    id: 'p8',
    data: {
      first_name: 'يوسف', last_name: 'بن سالم', nickname: '', maiden: '',
      sex: 'M',
      birth: { date: '1990', place: 'تونس العاصمة' },
      death: null,
      photo: '', bio: '', job: 'مبرمج',
      contact: { phone: '', email: 'youssef@email.tn', address: '' },
    },
    rels: { father: 'p3', mother: 'p6', spouses: [], children: [] },
  },
  {
    id: 'p9',
    data: {
      first_name: 'سارة', last_name: 'بن سالم', nickname: '', maiden: '',
      sex: 'F',
      birth: { date: '1993', place: 'تونس العاصمة' },
      death: null,
      photo: '', bio: '', job: 'طالبة دكتوراه',
      contact: { phone: '', email: '', address: '' },
    },
    rels: { father: 'p3', mother: 'p6', spouses: [], children: [] },
  },
  {
    id: 'p10',
    data: {
      first_name: 'إيناس', last_name: 'بن سالم', nickname: '', maiden: '',
      sex: 'F',
      birth: { date: '1997', place: 'تونس العاصمة' },
      death: null,
      photo: '', bio: '', job: 'طالبة',
      contact: { phone: '', email: '', address: '' },
    },
    rels: { father: 'p3', mother: 'p6', spouses: [], children: [] },
  },
  {
    id: 'p11',
    data: {
      first_name: 'أمين', last_name: 'المنصوري', nickname: '', maiden: '',
      sex: 'M',
      birth: { date: '1992', place: 'صفاقس' },
      death: null,
      photo: '', bio: '', job: 'مهندس معماري',
      contact: { phone: '', email: '', address: '' },
    },
    rels: { father: 'p7', mother: 'p4', spouses: [], children: [] },
  },
  {
    id: 'p12',
    data: {
      first_name: 'رانية', last_name: 'المنصوري', nickname: '', maiden: '',
      sex: 'F',
      birth: { date: '1995', place: 'صفاقس' },
      death: null,
      photo: '', bio: '', job: '',
      contact: { phone: '', email: '', address: '' },
    },
    rels: { father: 'p7', mother: 'p4', spouses: [], children: [] },
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'asli-data-v1'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return INITIAL_DATA
}

function saveData(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
}

function genId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ═══════════════════════════════════════════════════════════════════════════
// TREE LAYOUT ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════
const NW = 180  // node width
const NH = 88   // node height
const HGAP = 36 // horizontal gap between unrelated nodes
const SGAP = 12 // gap between spouses
const VGAP = 130 // vertical gap between generations

function computeLayout(people) {
  if (!people.length) return { positions: {}, edges: [] }

  const byId = {}
  people.forEach(p => { byId[p.id] = p })

  // ── Assign generations via BFS from roots ──────────────────────────────
  const genMap = {}
  const roots = people.filter(p => !p.rels.father && !p.rels.mother)
  if (!roots.length) roots.push(people[0])

  const visited = new Set()
  const queue = roots.map(r => ({ id: r.id, g: 0 }))

  while (queue.length) {
    const { id, g } = queue.shift()
    if (visited.has(id)) continue
    visited.add(id)
    genMap[id] = g
    const p = byId[id]
    if (!p) continue
    p.rels.spouses.forEach(sid => { if (!visited.has(sid)) queue.push({ id: sid, g }) })
    p.rels.children.forEach(cid => { if (!visited.has(cid)) queue.push({ id: cid, g: g + 1 }) })
  }
  people.forEach(p => { if (!(p.id in genMap)) genMap[p.id] = 0 })

  // ── Group by generation ────────────────────────────────────────────────
  const byGen = {}
  people.forEach(p => {
    const g = genMap[p.id]
    if (!byGen[g]) byGen[g] = []
    byGen[g].push(p.id)
  })

  // ── Order within each generation: keep couples adjacent ───────────────
  const orderedByGen = {}
  Object.entries(byGen).forEach(([g, ids]) => {
    const placed = new Set()
    const ordered = []
    ids.forEach(id => {
      if (placed.has(id)) return
      ordered.push(id)
      placed.add(id)
      const p = byId[id]
      if (p) {
        p.rels.spouses.forEach(sid => {
          if (!placed.has(sid) && ids.includes(sid)) {
            ordered.push(sid)
            placed.add(sid)
          }
        })
      }
    })
    orderedByGen[g] = ordered
  })

  // ── Assign x positions ─────────────────────────────────────────────────
  const positions = {}
  const gens = Object.keys(orderedByGen).map(Number).sort((a, b) => a - b)

  gens.forEach(g => {
    const ids = orderedByGen[g]
    // Compute total row width
    let totalW = 0
    ids.forEach((id, i) => {
      totalW += NW
      if (i < ids.length - 1) {
        const p = byId[id]
        const nextId = ids[i + 1]
        const isSpouse = p && p.rels.spouses.includes(nextId)
        totalW += isSpouse ? SGAP : HGAP
      }
    })

    let cx = -totalW / 2
    ids.forEach((id, i) => {
      positions[id] = { x: cx, y: g * (NH + VGAP) }
      if (i < ids.length - 1) {
        const p = byId[id]
        const nextId = ids[i + 1]
        const isSpouse = p && p.rels.spouses.includes(nextId)
        cx += NW + (isSpouse ? SGAP : HGAP)
      }
    })
  })

  // ── Try to center children under parents ──────────────────────────────
  // Two passes to pull parents toward their children midpoints
  for (let pass = 0; pass < 2; pass++) {
    gens.slice().reverse().forEach(g => {
      const ids = orderedByGen[g] || []
      // For each couple in this generation, find their children's x midpoint
      const shifted = {}
      ids.forEach(id => {
        const p = byId[id]
        if (!p || !p.rels.children.length) return
        const childXs = p.rels.children.map(cid => positions[cid]?.x).filter(x => x != null)
        if (!childXs.length) return
        const mid = (Math.min(...childXs) + Math.max(...childXs) + NW) / 2 - NW / 2
        const curr = positions[id].x
        const delta = mid - curr
        if (!shifted[id] && Math.abs(delta) > 2) {
          shifted[id] = delta
        }
      })
      // Apply deltas (avoid cascading overlaps by capping)
      Object.entries(shifted).forEach(([id, delta]) => {
        const p = byId[id]
        if (!p) return
        // Move person and their spouses as a unit
        const unit = [id, ...p.rels.spouses.filter(sid => positions[sid] && genMap[sid] === g)]
        unit.forEach(uid => {
          if (positions[uid]) positions[uid] = { ...positions[uid], x: positions[uid].x + delta }
        })
      })
    })
  }

  // ── Build edges ────────────────────────────────────────────────────────
  const edges = []
  const edgeSeen = new Set()

  people.forEach(p => {
    const pPos = positions[p.id]
    if (!pPos) return

    // Spouse line
    p.rels.spouses.forEach(sid => {
      const key = [p.id, sid].sort().join('~')
      if (edgeSeen.has(key)) return
      edgeSeen.add(key)
      const sPos = positions[sid]
      if (sPos) {
        edges.push({
          type: 'spouse',
          x1: pPos.x + NW, y1: pPos.y + NH / 2,
          x2: sPos.x,      y2: sPos.y + NH / 2,
          id: key,
        })
      }
    })

    // Parent → child lines
    p.rels.children.forEach(cid => {
      const cPos = positions[cid]
      if (!cPos) return

      // Find the co-parent (spouse who also has this child)
      let coPos = null
      p.rels.spouses.forEach(sid => {
        const sp = byId[sid]
        if (sp && sp.rels.children.includes(cid)) coPos = positions[sid]
      })

      const parentMidX = coPos
        ? (pPos.x + NW / 2 + coPos.x + NW / 2) / 2
        : pPos.x + NW / 2
      const parentBottomY = pPos.y + NH

      const edgeKey = `${p.id}>${cid}`
      if (edgeSeen.has(edgeKey)) return
      edgeSeen.add(edgeKey)

      const midY = parentBottomY + VGAP / 2
      edges.push({
        type: 'parent-child',
        path: `M ${parentMidX} ${parentBottomY} L ${parentMidX} ${midY} L ${cPos.x + NW / 2} ${midY} L ${cPos.x + NW / 2} ${cPos.y}`,
        id: edgeKey,
      })
    })
  })

  return { positions, edges }
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSON CARD — SVG component
// ═══════════════════════════════════════════════════════════════════════════
function PersonCard({ person, x, y, selected, onClick, lang }) {
  const d = person.data
  const name = `${d.first_name || ''} ${d.last_name || ''}`.trim() || '—'
  const year = d.birth?.date ? d.birth.date.slice(0, 4) : ''
  const isDead = !!d.death
  const isMale = d.sex === 'M'
  const accentCol = isMale ? C.primary : C.accent
  const cardFill = selected ? C.primary : C.card

  // Truncate long names
  const displayName = name.length > 18 ? name.slice(0, 17) + '…' : name

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={e => { e.stopPropagation(); onClick(person.id) }}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={name}
    >
      {/* Card shadow */}
      <rect width={NW} height={NH} rx={12} fill={C.shadow} transform="translate(2,3)" />
      {/* Card bg */}
      <rect
        width={NW} height={NH} rx={12}
        fill={cardFill}
        stroke={selected ? C.gold : C.border}
        strokeWidth={selected ? 2.5 : 1}
      />

      {/* Left accent bar */}
      <rect x={0} y={12} width={4} height={NH - 24} rx={2} fill={accentCol} opacity={selected ? 0.6 : 0.4} />

      {/* Photo circle */}
      {d.photo ? (
        <>
          <defs>
            <clipPath id={`clip-${person.id}`}>
              <circle cx={36} cy={NH / 2} r={24} />
            </clipPath>
          </defs>
          <image
            href={d.photo}
            x={12} y={NH / 2 - 24}
            width={48} height={48}
            clipPath={`url(#clip-${person.id})`}
            preserveAspectRatio="xMidYMid slice"
          />
          <circle cx={36} cy={NH / 2} r={24} fill="none" stroke={selected ? C.gold : accentCol} strokeWidth={1.5} opacity={0.5} />
        </>
      ) : (
        <>
          <circle cx={36} cy={NH / 2} r={24} fill={accentCol} opacity={selected ? 0.3 : 0.1} />
          <text x={36} y={NH / 2 + 7} textAnchor="middle" fontSize={20} fill={accentCol}>
            {isMale ? '◈' : '◇'}
          </text>
        </>
      )}

      {/* Name */}
      <text
        x={70} y={NH / 2 - 10}
        fontSize={13}
        fontWeight="700"
        fill={selected ? C.white : C.ink}
        fontFamily={FONT[lang].body}
      >
        {displayName}
      </text>

      {/* Year + deceased marker */}
      <text
        x={70} y={NH / 2 + 10}
        fontSize={11}
        fill={selected ? '#ffffffaa' : C.muted}
        fontFamily="'Karla', sans-serif"
        letterSpacing="0.5"
      >
        {year}{isDead ? ' †' : ''}
      </text>

      {/* Job */}
      {d.job ? (
        <text
          x={70} y={NH / 2 + 26}
          fontSize={10}
          fill={selected ? '#ffffff88' : C.muted}
          fontFamily="'Karla', sans-serif"
          opacity={0.8}
        >
          {d.job.length > 20 ? d.job.slice(0, 19) + '…' : d.job}
        </text>
      ) : null}

      {/* Gold dot if selected */}
      {selected && (
        <circle cx={NW - 14} cy={14} r={5} fill={C.gold} />
      )}
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TREE VIEW — SVG with pan + zoom
// ═══════════════════════════════════════════════════════════════════════════
function TreeView({ data, selectedId, onPersonClick, t, lang }) {
  const svgRef = useRef(null)
  const [vb, setVb] = useState({ x: -500, y: -100, w: 1200, h: 900 })
  const drag = useRef({ active: false, startX: 0, startY: 0, startVb: null })
  const pinch = useRef({ active: false, dist: 0 })

  const layout = useMemo(() => computeLayout(data), [data])

  // Center on selected person
  useEffect(() => {
    if (!selectedId) return
    const pos = layout.positions[selectedId]
    if (!pos) return
    setVb(v => ({
      ...v,
      x: pos.x + NW / 2 - v.w / 2,
      y: pos.y + NH / 2 - v.h / 2,
    }))
  }, [selectedId, layout])

  const getClientXY = e => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const toSvgScale = useCallback((svgEl) => {
    const rect = svgEl.getBoundingClientRect()
    return { sx: vb.w / rect.width, sy: vb.h / rect.height }
  }, [vb])

  const onPointerDown = e => {
    if (e.target.closest('[data-card]')) return
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, startVb: { ...vb } }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = e => {
    if (!drag.current.active) return
    const svgEl = svgRef.current
    if (!svgEl) return
    const { sx, sy } = toSvgScale(svgEl)
    const dx = (e.clientX - drag.current.startX) * sx
    const dy = (e.clientY - drag.current.startY) * sy
    const sv = drag.current.startVb
    setVb(v => ({ ...v, x: sv.x - dx, y: sv.y - dy }))
  }

  const onPointerUp = () => { drag.current.active = false }

  const onWheel = e => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1.12 : 0.9
    setVb(v => {
      const svgEl = svgRef.current
      if (!svgEl) return v
      const rect = svgEl.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left) / rect.width
      const mouseY = (e.clientY - rect.top) / rect.height
      const newW = v.w * factor
      const newH = v.h * factor
      return {
        x: v.x + v.w * mouseX - newW * mouseX,
        y: v.y + v.h * mouseY - newH * mouseY,
        w: newW,
        h: newH,
      }
    })
  }

  // Touch pinch zoom
  const onTouchStart = e => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinch.current = { active: true, dist: Math.hypot(dx, dy) }
    }
  }
  const onTouchMove = e => {
    if (pinch.current.active && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const newDist = Math.hypot(dx, dy)
      const factor = pinch.current.dist / newDist
      pinch.current.dist = newDist
      setVb(v => ({ x: v.x, y: v.y, w: v.w * factor, h: v.h * factor }))
      e.preventDefault()
    }
  }
  const onTouchEnd = () => { pinch.current.active = false }

  if (!data.length) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontFamily: FONT[lang].body, fontSize: 15 }}>
        {t.emptyTree}
      </div>
    )
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      style={{ flex: 1, display: 'block', touchAction: 'none', cursor: drag.current.active ? 'grabbing' : 'grab', background: C.bg }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Subtle grid */}
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.border} strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      <rect x={vb.x - 2000} y={vb.y - 2000} width={vb.w + 4000} height={vb.h + 4000} fill="url(#grid)" />

      {/* Edges */}
      {layout.edges.map(e => (
        e.type === 'spouse' ? (
          <line
            key={e.id}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={C.gold}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        ) : (
          <path
            key={e.id}
            d={e.path}
            stroke={C.muted}
            strokeWidth={1.5}
            fill="none"
            opacity={0.6}
          />
        )
      ))}

      {/* Cards */}
      {data.map(p => {
        const pos = layout.positions[p.id]
        if (!pos) return null
        return (
          <g key={p.id} data-card="1">
            <PersonCard
              person={p}
              x={pos.x}
              y={pos.y}
              selected={p.id === selectedId}
              onClick={onPersonClick}
              lang={lang}
            />
          </g>
        )
      })}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE MODAL
// ═══════════════════════════════════════════════════════════════════════════
function ProfileModal({ person, data, t, lang, isRTL, onClose, onEdit, onDelete, onNavigate, onAddRelative }) {
  const d = person.data
  const byId = Object.fromEntries(data.map(p => [p.id, p]))
  const fonts = FONT[lang]

  const fullName = [d.first_name, d.nickname ? `"${d.nickname}"` : '', d.last_name].filter(Boolean).join(' ')

  const RelLink = ({ id, label }) => {
    const rel = byId[id]
    if (!rel) return null
    const rname = `${rel.data.first_name || ''} ${rel.data.last_name || ''}`.trim()
    return (
      <button
        onClick={() => onNavigate(id)}
        style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
          fontSize: 13, color: C.primary, fontFamily: fonts.body,
          display: 'inline-flex', flexDirection: 'column', gap: 1, textAlign: isRTL ? 'right' : 'left',
        }}
      >
        <span style={{ fontSize: 10, color: C.muted }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{rname}</span>
      </button>
    )
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={{
          ...sheetStyle(isRTL),
          maxWidth: 480,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          fontFamily: fonts.body,
        }}
        onClick={e => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          {/* Photo */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: d.sex === 'M' ? `${C.primary}22` : `${C.accent}22`,
            border: `2px solid ${d.sex === 'M' ? C.primary : C.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {d.photo
              ? <img src={d.photo} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 28, color: d.sex === 'M' ? C.primary : C.accent }}>{d.sex === 'M' ? '◈' : '◇'}</span>
            }
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: fonts.display, lineHeight: 1.2 }}>{fullName || '—'}</div>
            {d.maiden && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>née {d.maiden}</div>}
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {d.birth?.date && <span>b. {d.birth.date}{d.birth.place ? `, ${d.birth.place}` : ''}</span>}
              {d.death && <span style={{ color: C.accent }}>† {d.death.date}{d.death.place ? `, ${d.death.place}` : ''}</span>}
            </div>
            {d.job && <div style={{ fontSize: 12, color: C.gold, marginTop: 2 }}>{d.job}</div>}
          </div>

          <button onClick={onClose} style={iconBtn}>{'✕'}</button>
        </div>

        {/* Bio */}
        {d.bio && (
          <div style={{ background: C.surface, borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
            {d.bio}
          </div>
        )}

        {/* Relations */}
        {(person.rels.father || person.rels.mother || person.rels.spouses.length > 0 || person.rels.children.length > 0) && (
          <div style={{ marginBottom: 14 }}>
            <div style={sectionLabel(fonts)}>{t.relations}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {person.rels.father && <RelLink id={person.rels.father} label={t.father} />}
              {person.rels.mother && <RelLink id={person.rels.mother} label={t.mother} />}
              {person.rels.spouses.map(id => <RelLink key={id} id={id} label={t.spouses} />)}
              {person.rels.children.map(id => <RelLink key={id} id={id} label={t.children} />)}
            </div>
          </div>
        )}

        {/* Contact */}
        {(d.contact?.phone || d.contact?.email || d.contact?.address) && (
          <div style={{ marginBottom: 14 }}>
            <div style={sectionLabel(fonts)}>{t.contactInfo}</div>
            {d.contact.phone && <div style={contactRow}><span style={contactIcon}>📞</span>{d.contact.phone}</div>}
            {d.contact.email && <div style={contactRow}><span style={contactIcon}>✉</span>{d.contact.email}</div>}
            {d.contact.address && <div style={contactRow}><span style={contactIcon}>📍</span>{d.contact.address}</div>}
          </div>
        )}

        {/* Add relative buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => onAddRelative('child')} style={addRelBtn}>{t.addChild}</button>
          <button onClick={() => onAddRelative('spouse')} style={addRelBtn}>{t.addSpouse}</button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onEdit} style={primaryBtn(fonts)}>{t.edit}</button>
          <button onClick={onDelete} style={dangerBtn(fonts)}>{t.delete}</button>
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
  const blank = {
    first_name: '', last_name: '', nickname: '', maiden: '', sex: 'M',
    birth: { date: '', place: '' },
    death: null,
    photo: '', bio: '', job: '',
    contact: { phone: '', email: '', address: '' },
  }
  const [form, setForm] = useState(person ? { ...blank, ...person.data } : blank)
  const [isDead, setIsDead] = useState(!!(person?.data.death))
  const [relativeId, setRelativeId] = useState(relation?.relativeId || (data.length ? data[0].id : ''))
  const [relType, setRelType] = useState(relation?.type === 'spouse' ? 'spouse' : (data.length ? 'child' : 'root'))
  const fileRef = useRef(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setBirth = (key, val) => setForm(f => ({ ...f, birth: { ...f.birth, [key]: val } }))
  const setDeath = (key, val) => setForm(f => ({ ...f, death: { ...(f.death || { date: '', place: '' }), [key]: val } }))
  const setContact = (key, val) => setForm(f => ({ ...f, contact: { ...f.contact, [key]: val } }))

  const handlePhoto = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('photo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.first_name.trim()) return
    const finalData = { ...form, death: isDead ? (form.death || { date: '', place: '' }) : null }
    if (mode === 'edit') {
      onSave(finalData)
    } else {
      onSave(finalData, { type: relType, relativeId: relType === 'root' ? null : relativeId })
    }
  }

  const F = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: C.muted, fontFamily: 'Karla, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  )

  const inp = (val, onChange, placeholder = '') => (
    <input
      value={val || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle(fonts)}
    />
  )

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div
        style={{ ...sheetStyle(isRTL), maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', fontFamily: fonts.body }}
        onClick={e => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: fonts.display }}>
            {mode === 'edit' ? t.edit : t.add}
          </div>
          <button onClick={onCancel} style={iconBtn}>{'✕'}</button>
        </div>

        {/* Photo */}
        <F label={t.photo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', border: `2px dashed ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              background: C.surface, cursor: 'pointer', flexShrink: 0,
            }} onClick={() => fileRef.current?.click()}>
              {form.photo
                ? <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 22, color: C.border }}>+</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => fileRef.current?.click()} style={smallBtn(fonts)}>{form.photo ? t.changePhoto : t.photo}</button>
              {form.photo && <button onClick={() => set('photo', '')} style={{ ...smallBtn(fonts), color: C.accent, borderColor: C.accent }}>{t.removePhoto}</button>}
            </div>
          </div>
        </F>

        {/* Sex */}
        <F label={t.sex}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['M', 'F'].map(s => (
              <button
                key={s}
                onClick={() => set('sex', s)}
                style={{
                  ...smallBtn(fonts),
                  background: form.sex === s ? C.primary : C.surface,
                  color: form.sex === s ? C.white : C.ink,
                  borderColor: form.sex === s ? C.primary : C.border,
                  flex: 1,
                }}
              >
                {s === 'M' ? t.male : t.female}
              </button>
            ))}
          </div>
        </F>

        {/* Names */}
        <F label={t.firstName}>{inp(form.first_name, v => set('first_name', v))}</F>
        <F label={t.lastName}>{inp(form.last_name, v => set('last_name', v))}</F>
        <F label={t.nickname}>{inp(form.nickname, v => set('nickname', v))}</F>
        {form.sex === 'F' && <F label={t.maiden}>{inp(form.maiden, v => set('maiden', v))}</F>}

        {/* Birth */}
        <F label={t.born}>
          <div style={{ display: 'flex', gap: 8 }}>
            {inp(form.birth?.date, v => setBirth('date', v), '1980')}
            {inp(form.birth?.place, v => setBirth('place', v), t.place)}
          </div>
        </F>

        {/* Deceased toggle */}
        <F label={t.deceased}>
          <button
            onClick={() => setIsDead(x => !x)}
            style={{
              ...smallBtn(fonts),
              background: isDead ? C.accent : C.surface,
              color: isDead ? C.white : C.ink,
              borderColor: isDead ? C.accent : C.border,
            }}
          >
            {isDead ? '† ' + t.deceased : t.alive}
          </button>
        </F>

        {isDead && (
          <F label={t.died}>
            <div style={{ display: 'flex', gap: 8 }}>
              {inp(form.death?.date, v => setDeath('date', v), '2020')}
              {inp(form.death?.place, v => setDeath('place', v), t.place)}
            </div>
          </F>
        )}

        {/* Job + Bio */}
        <F label={t.job}>{inp(form.job, v => set('job', v))}</F>
        <F label={t.bio}>
          <textarea
            value={form.bio || ''}
            onChange={e => set('bio', e.target.value)}
            rows={3}
            style={{ ...inputStyle(fonts), resize: 'vertical', lineHeight: 1.5 }}
          />
        </F>

        {/* Contact */}
        <F label={t.phone}>{inp(form.contact?.phone, v => setContact('phone', v))}</F>
        <F label={t.email}>{inp(form.contact?.email, v => setContact('email', v))}</F>
        <F label={t.address}>{inp(form.contact?.address, v => setContact('address', v))}</F>

        {/* Relation (add mode only) */}
        {mode === 'add' && data.length > 0 && (
          <>
            <F label={t.relativeTo}>
              <select
                value={relType}
                onChange={e => setRelType(e.target.value)}
                style={inputStyle(fonts)}
              >
                <option value="child">{t.childOf}</option>
                <option value="spouse">{t.spouseOf}</option>
                <option value="root">{t.root}</option>
              </select>
            </F>
            {relType !== 'root' && (
              <F label={relType === 'child' ? t.father + ' / ' + t.mother : t.spouses}>
                <select
                  value={relativeId}
                  onChange={e => setRelativeId(e.target.value)}
                  style={inputStyle(fonts)}
                >
                  {data.map(p => (
                    <option key={p.id} value={p.id}>
                      {`${p.data.first_name || ''} ${p.data.last_name || ''}`.trim() || p.id}
                    </option>
                  ))}
                </select>
              </F>
            )}
          </>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={handleSubmit} style={primaryBtn(fonts)}>{t.save}</button>
          <button onClick={onCancel} style={ghostBtn(fonts)}>{t.cancel}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════
function Header({ t, lang, setLang, isRTL, search, setSearch, onAdd, data }) {
  const [showSearch, setShowSearch] = useState(false)
  const fonts = FONT[lang]

  const results = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return data.filter(p => {
      const n = `${p.data.first_name || ''} ${p.data.last_name || ''} ${p.data.nickname || ''}`.toLowerCase()
      return n.includes(q)
    }).slice(0, 8)
  }, [search, data])

  return (
    <div style={{
      background: C.primary,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
      position: 'relative',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    }}>
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', marginInlineEnd: 'auto' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: fonts.display, lineHeight: 1 }}>
          {t.app}
        </div>
        <div style={{ fontSize: 10, color: `${C.white}88`, fontFamily: 'Karla, sans-serif', letterSpacing: 1 }}>
          {t.tagline.toUpperCase()}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowSearch(x => !x)}
          style={{ ...iconBtn, color: C.white, opacity: 0.8 }}
          aria-label={t.search}
        >
          🔍
        </button>

        {showSearch && (
          <div style={{
            position: 'absolute',
            top: '110%',
            [isRTL ? 'left' : 'right']: 0,
            width: 280,
            background: C.white,
            borderRadius: 12,
            boxShadow: `0 8px 32px ${C.shadow}`,
            zIndex: 200,
            overflow: 'hidden',
          }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              style={{
                width: '100%', border: 'none', outline: 'none',
                padding: '12px 16px', fontSize: 14,
                fontFamily: fonts.body, color: C.ink,
                borderBottom: results.length ? `1px solid ${C.border}` : 'none',
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {results.map(p => (
              <div
                key={p.id}
                style={{
                  padding: '10px 16px', cursor: 'pointer', fontSize: 13,
                  color: C.ink, fontFamily: fonts.body,
                  borderBottom: `1px solid ${C.border}`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.surface}
                onMouseLeave={e => e.currentTarget.style.background = ''}
                onClick={() => { setSearch(''); setShowSearch(false) }}
              >
                {`${p.data.first_name || ''} ${p.data.last_name || ''}`.trim()}
                {p.data.birth?.date && <span style={{ color: C.muted, marginInlineStart: 8, fontSize: 11 }}>{p.data.birth.date}</span>}
              </div>
            ))}
            {search && !results.length && (
              <div style={{ padding: '10px 16px', color: C.muted, fontSize: 13, fontFamily: fonts.body }}>{t.noMatch}</div>
            )}
          </div>
        )}
      </div>

      {/* Add */}
      <button
        onClick={onAdd}
        style={{
          background: C.gold, color: C.white, border: 'none',
          borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
          fontSize: 13, fontWeight: 700, fontFamily: fonts.body,
          whiteSpace: 'nowrap',
        }}
      >
        + {t.add.split(' ')[0]}
      </button>

      {/* Lang switcher */}
      <div style={{ display: 'flex', gap: 4 }}>
        {['ar', 'fr', 'en', 'it'].map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              background: lang === l ? C.gold : 'transparent',
              color: C.white,
              border: `1px solid ${lang === l ? C.gold : `${C.white}44`}`,
              borderRadius: 6, padding: '4px 7px',
              fontSize: 10, cursor: 'pointer', fontFamily: 'Karla, sans-serif',
              fontWeight: lang === l ? 700 : 400,
            }}
          >
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
const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 100,
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  padding: 16,
}

const sheetStyle = (isRTL) => ({
  background: C.card,
  borderRadius: 20,
  padding: 24,
  boxShadow: `0 -4px 40px rgba(0,0,0,0.2)`,
})

const inputStyle = (fonts) => ({
  width: '100%', padding: '9px 12px',
  border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 13,
  fontFamily: fonts.body, color: C.ink,
  background: C.surface, outline: 'none',
})

const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 16, color: C.muted, padding: 6, lineHeight: 1,
  borderRadius: 8,
}

const sectionLabel = (fonts) => ({
  fontSize: 11, color: C.muted, fontFamily: 'Karla, sans-serif',
  letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500,
})

const contactRow = {
  display: 'flex', alignItems: 'center', gap: 8,
  fontSize: 13, color: C.ink, padding: '4px 0',
}

const contactIcon = { fontSize: 14, width: 20, flexShrink: 0 }

const primaryBtn = (fonts) => ({
  flex: 1, background: C.primary, color: C.white,
  border: 'none', borderRadius: 10,
  padding: '11px 16px', cursor: 'pointer',
  fontSize: 14, fontWeight: 700, fontFamily: fonts.body,
})

const dangerBtn = (fonts) => ({
  background: 'transparent', color: C.accent,
  border: `1px solid ${C.accent}`, borderRadius: 10,
  padding: '11px 16px', cursor: 'pointer',
  fontSize: 14, fontFamily: fonts.body,
})

const ghostBtn = (fonts) => ({
  flex: 1, background: C.surface, color: C.muted,
  border: `1px solid ${C.border}`, borderRadius: 10,
  padding: '11px 16px', cursor: 'pointer',
  fontSize: 14, fontFamily: fonts.body,
})

const smallBtn = (fonts) => ({
  background: C.surface, color: C.ink,
  border: `1px solid ${C.border}`, borderRadius: 8,
  padding: '7px 12px', cursor: 'pointer',
  fontSize: 12, fontFamily: fonts.body,
})

const addRelBtn = {
  background: C.surface, color: C.primary,
  border: `1px solid ${C.gold}`, borderRadius: 8,
  padding: '7px 12px', cursor: 'pointer',
  fontSize: 12, fontWeight: 600,
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('asli-lang') || 'ar')
  const [data, setData] = useState(loadData)
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [addRelation, setAddRelation] = useState(null) // { type, relativeId }
  const [search, setSearch] = useState('')

  const isRTL = lang === 'ar'
  const t = T[lang]

  // Persist language + update document dir
  useEffect(() => {
    localStorage.setItem('asli-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [lang, isRTL])

  const updateData = useCallback((newData) => {
    setData(newData)
    saveData(newData)
  }, [])

  const addPerson = useCallback((personData, relation) => {
    const newPerson = {
      id: genId(),
      data: personData,
      rels: { father: null, mother: null, spouses: [], children: [] },
    }

    let next = [...data, newPerson]
    const newId = newPerson.id

    if (relation?.type === 'child' && relation.relativeId) {
      const parent = data.find(p => p.id === relation.relativeId)
      if (parent) {
        const field = parent.data.sex === 'M' ? 'father' : 'mother'
        next = next.map(p => {
          if (p.id === newId) return { ...p, rels: { ...p.rels, [field]: relation.relativeId } }
          if (p.id === relation.relativeId) return { ...p, rels: { ...p.rels, children: [...p.rels.children, newId] } }
          // Also wire up spouse as co-parent if they share children
          if (parent.rels.spouses.includes(p.id)) return { ...p, rels: { ...p.rels, children: [...p.rels.children, newId] } }
          return p
        })
        // Wire other parent's field for the child
        const otherParentField = field === 'father' ? 'mother' : 'father'
        parent.rels.spouses.forEach(sid => {
          next = next.map(p => {
            if (p.id === newId) return { ...p, rels: { ...p.rels, [otherParentField]: sid } }
            return p
          })
        })
      }
    } else if (relation?.type === 'spouse' && relation.relativeId) {
      next = next.map(p => {
        if (p.id === newId) return { ...p, rels: { ...p.rels, spouses: [relation.relativeId] } }
        if (p.id === relation.relativeId) return { ...p, rels: { ...p.rels, spouses: [...p.rels.spouses, newId] } }
        return p
      })
    }

    updateData(next)
    setSelectedId(newId)
  }, [data, updateData])

  const editPerson = useCallback((id, personData) => {
    updateData(data.map(p => p.id === id ? { ...p, data: personData } : p))
  }, [data, updateData])

  const deletePerson = useCallback((id) => {
    if (!window.confirm(t.deleteWarn)) return
    const next = data
      .filter(p => p.id !== id)
      .map(p => ({
        ...p,
        rels: {
          father: p.rels.father === id ? null : p.rels.father,
          mother: p.rels.mother === id ? null : p.rels.mother,
          spouses: p.rels.spouses.filter(s => s !== id),
          children: p.rels.children.filter(c => c !== id),
        },
      }))
    updateData(next)
    setSelectedId(null)
  }, [data, updateData, t.deleteWarn])

  const selectedPerson = data.find(p => p.id === selectedId)
  const editingPerson = data.find(p => p.id === editingId)

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <Header
        t={t} lang={lang} setLang={setLang} isRTL={isRTL}
        search={search} setSearch={setSearch}
        onAdd={() => setAddRelation({ type: 'root', relativeId: null })}
        data={data}
      />

      <TreeView
        data={data}
        selectedId={selectedId}
        onPersonClick={id => setSelectedId(prev => prev === id ? null : id)}
        t={t}
        lang={lang}
      />

      {selectedPerson && !editingId && !addRelation && (
        <ProfileModal
          person={selectedPerson}
          data={data}
          t={t}
          lang={lang}
          isRTL={isRTL}
          onClose={() => setSelectedId(null)}
          onEdit={() => { setEditingId(selectedId); setSelectedId(null) }}
          onDelete={() => deletePerson(selectedId)}
          onNavigate={id => setSelectedId(id)}
          onAddRelative={type => {
            setAddRelation({ type, relativeId: selectedId })
            setSelectedId(null)
          }}
        />
      )}

      {editingPerson && (
        <PersonForm
          person={editingPerson}
          data={data}
          t={t}
          lang={lang}
          isRTL={isRTL}
          mode="edit"
          onSave={personData => { editPerson(editingId, personData); setEditingId(null); setSelectedId(editingId) }}
          onCancel={() => setEditingId(null)}
        />
      )}

      {addRelation && (
        <PersonForm
          person={null}
          data={data}
          t={t}
          lang={lang}
          isRTL={isRTL}
          mode="add"
          relation={addRelation}
          onSave={(personData, rel) => { addPerson(personData, rel); setAddRelation(null) }}
          onCancel={() => setAddRelation(null)}
        />
      )}
    </div>
  )
}
