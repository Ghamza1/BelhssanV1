import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as f3 from 'family-chart'
import 'family-chart/styles/family-chart.css'

const C = {
  bg:'#efe6d2', surface:'#f5ede0', card:'#faf6ef', border:'#d4c8b8',
  primary:'#1c3d5a', accent:'#c45a3d', gold:'#c89a3a', ink:'#1a1a1a',
  muted:'#6b5d4f', white:'#ffffff', shadow:'rgba(28,61,90,0.14)', gridLine:'#d8cebb',
}
const FONT = {
  ar:{ display:"'Reem Kufi', sans-serif", body:"'Tajawal', sans-serif" },
  fr:{ display:"'Fraunces', serif",       body:"'Manrope', sans-serif" },
  en:{ display:"'Fraunces', serif",       body:"'Manrope', sans-serif" },
  it:{ display:"'Fraunces', serif",       body:"'Manrope', sans-serif" },
}
const T = {
  ar:{app:'أصلي',tagline:'شجرة العائلة',families:'العائلات',newFamily:'عائلة جديدة',familyName:'اسم العائلة',backToFamilies:'← العائلات',deleteFamily:'حذف العائلة',emptyFamilies:'لا توجد عائلات بعد',peopleCount:'شخص',add:'إضافة شخص',search:'بحث في العائلة...',close:'إغلاق',edit:'تعديل',delete:'حذف',save:'حفظ',cancel:'إلغاء',firstName:'الاسم',lastName:'اللقب العائلي',nickname:'الكنية',maiden:'اسم العائلة قبل الزواج',middleName:'الاسم الأوسط',sex:'الجنس',male:'ذكر',female:'أنثى',born:'الميلاد',died:'الوفاة',place:'المكان',bio:'السيرة الذاتية',job:'المهنة',company:'الشركة',phone:'الهاتف',email:'البريد الإلكتروني',address:'العنوان',notes:'ملاحظات',interests:'الاهتمامات',father:'الأب',mother:'الأم',spouses:'الزوج/الزوجة',children:'الأبناء',relations:'العلاقات العائلية',childOf:'ابن/ابنة لـ',spouseOf:'زوج/زوجة لـ',root:'شخص مستقل',photo:'صورة',changePhoto:'تغيير الصورة',removePhoto:'حذف الصورة',deleteWarn:'حذف هذا الشخص نهائياً؟',noMatch:'لا توجد نتائج',addChild:'+ ابن/ابنة',addSpouse:'+ زوج/زوجة',deceased:'متوفى',alive:'على قيد الحياة',contactInfo:'معلومات التواصل',noParent:'لا يوجد (جذر العائلة)',emptyTree:'أضف أول فرد من العائلة',settings:'إعدادات',cardDetail:'تفاصيل البطاقة',showPhotos:'عرض الصور',cardSize:'حجم البطاقات',detailName:'الاسم فقط',detailNameYear:'الاسم + السنة',detailFull:'الاسم + السنة + المهنة',sizeSm:'صغير',sizeMd:'متوسط',sizeLg:'كبير',fitScreen:'ملاءمة الشاشة',viewFull:'عرض كامل',viewPartial:'عرض مُركَّز',relativeTo:'علاقة بشخص موجود',gedcomExport:'تصدير GEDCOM',gedcomImport:'استيراد GEDCOM',jsonExport:'تصدير JSON',jsonImport:'استيراد JSON',enterPassword:'أدخل كلمة المرور',adminMode:'مدير',guestMode:'زائر',wrongPassword:'كلمة المرور غير صحيحة',logout:'خروج',surnameFirst:'اللقب أولاً',showMaidenName:'إظهار اسم ما قبل الزواج',nameOptions:'خيارات الاسم',colorSettings:'ألوان الواجهة',resetColors:'إعادة تعيين',colorBg:'الخلفية',colorMale:'لون الذكر',colorFemale:'لون الأنثى',colorGold:'لون التمييز',colorInk:'لون النص',genUp:'أجيال للأعلى',genDown:'أجيال للأسفل',tabDisplay:'العرض',tabColors:'الألوان',tabData:'البيانات',importWarning:'سيُستبدل المحتوى الحالي. هل أنت متأكد؟'},
  fr:{app:'Asli',tagline:'Arbre généalogique',families:'Familles',newFamily:'Nouvelle famille',familyName:'Nom de la famille',backToFamilies:'← Familles',deleteFamily:'Supprimer la famille',emptyFamilies:'Aucune famille',peopleCount:'personne(s)',add:'Ajouter',search:'Rechercher...',close:'Fermer',edit:'Modifier',delete:'Supprimer',save:'Enregistrer',cancel:'Annuler',firstName:'Prénom',lastName:'Nom',nickname:'Surnom',maiden:'Nom de jeune fille',middleName:'Deuxième prénom',sex:'Sexe',male:'Homme',female:'Femme',born:'Naissance',died:'Décès',place:'Lieu',bio:'Biographie',job:'Profession',company:'Entreprise',phone:'Téléphone',email:'E-mail',address:'Adresse',notes:'Notes',interests:'Intérêts',father:'Père',mother:'Mère',spouses:'Conjoint(e)',children:'Enfants',relations:'Relations familiales',childOf:'Enfant de',spouseOf:'Conjoint(e) de',root:'Personne indépendante',photo:'Photo',changePhoto:'Changer',removePhoto:'Supprimer',deleteWarn:'Supprimer définitivement ?',noMatch:'Aucun résultat',addChild:'+ Enfant',addSpouse:'+ Conjoint(e)',deceased:'Décédé(e)',alive:'Vivant(e)',contactInfo:'Coordonnées',noParent:'Aucun (racine)',emptyTree:'Ajoutez le premier membre',settings:'Paramètres',cardDetail:'Détail',showPhotos:'Afficher photos',cardSize:'Taille cartes',detailName:'Nom seul',detailNameYear:'Nom + année',detailFull:'Nom + année + métier',sizeSm:'Petit',sizeMd:'Moyen',sizeLg:'Grand',fitScreen:'Ajuster',viewFull:'Vue complète',viewPartial:'Vue focalisée',relativeTo:'Relation avec',gedcomExport:'Exporter GEDCOM',gedcomImport:'Importer GEDCOM',jsonExport:'Exporter JSON',jsonImport:'Importer JSON',enterPassword:'Mot de passe',adminMode:'Admin',guestMode:'Invité',wrongPassword:'Mot de passe incorrect',logout:'Déconnexion',surnameFirst:'Nom en premier',showMaidenName:'Nom de jeune fille',nameOptions:'Options nom',colorSettings:'Couleurs',resetColors:'Réinitialiser',colorBg:'Fond',colorMale:'Couleur homme',colorFemale:'Couleur femme',colorGold:'Accent',colorInk:'Texte',genUp:'Générations haut',genDown:'Générations bas',tabDisplay:'Affichage',tabColors:'Couleurs',tabData:'Données',importWarning:'Remplacer les données actuelles ?'},
  en:{app:'Asli',tagline:'Family Tree',families:'Families',newFamily:'New family',familyName:'Family name',backToFamilies:'← Families',deleteFamily:'Delete family',emptyFamilies:'No families yet',peopleCount:'people',add:'Add',search:'Search family...',close:'Close',edit:'Edit',delete:'Delete',save:'Save',cancel:'Cancel',firstName:'First name',lastName:'Last name',nickname:'Nickname',maiden:'Maiden name',middleName:'Middle name',sex:'Sex',male:'Male',female:'Female',born:'Born',died:'Died',place:'Place',bio:'Biography',job:'Occupation',company:'Company',phone:'Phone',email:'Email',address:'Address',notes:'Notes',interests:'Interests',father:'Father',mother:'Mother',spouses:'Spouse',children:'Children',relations:'Family relations',childOf:'Child of',spouseOf:'Spouse of',root:'Independent person',photo:'Photo',changePhoto:'Change',removePhoto:'Remove',deleteWarn:'Permanently delete?',noMatch:'No results',addChild:'+ Child',addSpouse:'+ Spouse',deceased:'Deceased',alive:'Living',contactInfo:'Contact info',noParent:'None (root)',emptyTree:'Add the first family member',settings:'Settings',cardDetail:'Card detail',showPhotos:'Show photos',cardSize:'Card size',detailName:'Name only',detailNameYear:'Name + year',detailFull:'Name + year + job',sizeSm:'Small',sizeMd:'Medium',sizeLg:'Large',fitScreen:'Fit',viewFull:'Full tree',viewPartial:'Focused view',relativeTo:'Relation to',gedcomExport:'Export GEDCOM',gedcomImport:'Import GEDCOM',jsonExport:'Export JSON',jsonImport:'Import JSON',enterPassword:'Enter password',adminMode:'Admin',guestMode:'Guest',wrongPassword:'Wrong password',logout:'Logout',surnameFirst:'Surname first',showMaidenName:'Show maiden name',nameOptions:'Name options',colorSettings:'Colors',resetColors:'Reset colors',colorBg:'Background',colorMale:'Male color',colorFemale:'Female color',colorGold:'Accent',colorInk:'Text',genUp:'Generations up',genDown:'Generations down',tabDisplay:'Display',tabColors:'Colors',tabData:'Data',importWarning:'Replace current data?'},
  it:{app:'Asli',tagline:'Albero genealogico',families:'Famiglie',newFamily:'Nuova famiglia',familyName:'Nome famiglia',backToFamilies:'← Famiglie',deleteFamily:'Elimina famiglia',emptyFamilies:'Nessuna famiglia',peopleCount:'persone',add:'Aggiungi',search:'Cerca...',close:'Chiudi',edit:'Modifica',delete:'Elimina',save:'Salva',cancel:'Annulla',firstName:'Nome',lastName:'Cognome',nickname:'Soprannome',maiden:'Nome da nubile',middleName:'Secondo nome',sex:'Sesso',male:'Maschio',female:'Femmina',born:'Nascita',died:'Morte',place:'Luogo',bio:'Biografia',job:'Professione',company:'Azienda',phone:'Telefono',email:'Email',address:'Indirizzo',notes:'Note',interests:'Interessi',father:'Padre',mother:'Madre',spouses:'Coniuge',children:'Figli',relations:'Relazioni familiari',childOf:'Figlio/a di',spouseOf:'Coniuge di',root:'Persona indipendente',photo:'Foto',changePhoto:'Cambia',removePhoto:'Rimuovi',deleteWarn:'Eliminare definitivamente?',noMatch:'Nessun risultato',addChild:'+ Figlio/a',addSpouse:'+ Coniuge',deceased:'Deceduto/a',alive:'In vita',contactInfo:'Contatti',noParent:'Nessuno (radice)',emptyTree:'Aggiungi il primo membro',settings:'Impostazioni',cardDetail:'Dettaglio',showPhotos:'Mostra foto',cardSize:'Dimensione',detailName:'Solo nome',detailNameYear:'Nome + anno',detailFull:'Nome + anno + lavoro',sizeSm:'Piccolo',sizeMd:'Medio',sizeLg:'Grande',fitScreen:'Adatta',viewFull:'Albero completo',viewPartial:'Vista focalizzata',relativeTo:'Relazione con',gedcomExport:'Esporta GEDCOM',gedcomImport:'Importa GEDCOM',jsonExport:'Esporta JSON',jsonImport:'Importa JSON',enterPassword:'Password',adminMode:'Admin',guestMode:'Ospite',wrongPassword:'Password errata',logout:'Esci',surnameFirst:'Cognome prima',showMaidenName:'Nome da nubile',nameOptions:'Opzioni nome',colorSettings:'Colori',resetColors:'Ripristina',colorBg:'Sfondo',colorMale:'Colore maschile',colorFemale:'Colore femminile',colorGold:'Accento',colorInk:'Testo',genUp:'Generazioni su',genDown:'Generazioni giù',tabDisplay:'Visualizzazione',tabColors:'Colori',tabData:'Dati',importWarning:'Sostituire i dati attuali?'},
}

const INITIAL_DATA = [
  {id:'p1',data:{first_name:'محمد',last_name:'بن سالم',middle_name:'',nickname:'الحاج',maiden:'',sex:'M',birth:{date:'1938',place:'تونس'},death:{date:'2010',place:'تونس'},photo:'',bio:'مؤسس العائلة، تاجر زيتون.',job:'تاجر',company:'',phone:'',email:'',address:'الباردو',notes:'',interests:''},rels:{father:null,mother:null,spouses:['p2'],children:['p3','p4','p5']}},
  {id:'p2',data:{first_name:'فاطمة',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'القيراوني',sex:'F',birth:{date:'1943',place:'القيروان'},death:null,photo:'',bio:'أم كريمة ومربية أجيال.',job:'',company:'',phone:'216 20 000 001',email:'',address:'الباردو',notes:'',interests:''},rels:{father:null,mother:null,spouses:['p1'],children:['p3','p4','p5']}},
  {id:'p3',data:{first_name:'أحمد',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'',sex:'M',birth:{date:'1965',place:'تونس'},death:null,photo:'',bio:'',job:'مهندس',company:'اتصالات تونس',phone:'216 20 000 002',email:'ahmed@email.tn',address:'المرسى',notes:'',interests:''},rels:{father:'p1',mother:'p2',spouses:['p6'],children:['p8','p9','p10']}},
  {id:'p4',data:{first_name:'ليلى',last_name:'المنصوري',middle_name:'',nickname:'',maiden:'بن سالم',sex:'F',birth:{date:'1968',place:'تونس'},death:null,photo:'',bio:'',job:'طبيبة',company:'',phone:'216 20 000 003',email:'',address:'صفاقس',notes:'',interests:''},rels:{father:'p1',mother:'p2',spouses:['p7'],children:['p11','p12']}},
  {id:'p5',data:{first_name:'عمر',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'',sex:'M',birth:{date:'1972',place:'تونس'},death:null,photo:'',bio:'',job:'محامي',company:'',phone:'216 20 000 004',email:'',address:'تونس',notes:'',interests:''},rels:{father:'p1',mother:'p2',spouses:[],children:[]}},
  {id:'p6',data:{first_name:'نادية',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'الشابي',sex:'F',birth:{date:'1967',place:'بنزرت'},death:null,photo:'',bio:'',job:'أستاذة',company:'',phone:'216 20 000 005',email:'',address:'المرسى',notes:'',interests:''},rels:{father:null,mother:null,spouses:['p3'],children:['p8','p9','p10']}},
  {id:'p7',data:{first_name:'كريم',last_name:'المنصوري',middle_name:'',nickname:'',maiden:'',sex:'M',birth:{date:'1964',place:'نابل'},death:null,photo:'',bio:'',job:'مدير',company:'',phone:'216 20 000 006',email:'',address:'صفاقس',notes:'',interests:''},rels:{father:null,mother:null,spouses:['p4'],children:['p11','p12']}},
  {id:'p8',data:{first_name:'يوسف',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'',sex:'M',birth:{date:'1990',place:'تونس'},death:null,photo:'',bio:'',job:'مبرمج',company:'',phone:'',email:'youssef@email.tn',address:'',notes:'',interests:''},rels:{father:'p3',mother:'p6',spouses:[],children:[]}},
  {id:'p9',data:{first_name:'سارة',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'',sex:'F',birth:{date:'1993',place:'تونس'},death:null,photo:'',bio:'',job:'طالبة دكتوراه',company:'',phone:'',email:'',address:'',notes:'',interests:''},rels:{father:'p3',mother:'p6',spouses:[],children:[]}},
  {id:'p10',data:{first_name:'إيناس',last_name:'بن سالم',middle_name:'',nickname:'',maiden:'',sex:'F',birth:{date:'1997',place:'تونس'},death:null,photo:'',bio:'',job:'طالبة',company:'',phone:'',email:'',address:'',notes:'',interests:''},rels:{father:'p3',mother:'p6',spouses:[],children:[]}},
  {id:'p11',data:{first_name:'أمين',last_name:'المنصوري',middle_name:'',nickname:'',maiden:'',sex:'M',birth:{date:'1992',place:'صفاقس'},death:null,photo:'',bio:'',job:'مهندس معماري',company:'',phone:'',email:'',address:'',notes:'',interests:''},rels:{father:'p7',mother:'p4',spouses:[],children:[]}},
  {id:'p12',data:{first_name:'رانية',last_name:'المنصوري',middle_name:'',nickname:'',maiden:'',sex:'F',birth:{date:'1995',place:'صفاقس'},death:null,photo:'',bio:'',job:'',company:'',phone:'',email:'',address:'',notes:'',interests:''},rels:{father:'p7',mother:'p4',spouses:[],children:[]}},
]

const FAMILIES_KEY='asli-families-v1', SETTINGS_KEY='asli-settings-v1'
const DEFAULT_SETTINGS={cardDetail:'full',showPhotos:true,boxSize:'md',surnameFirst:false,showMaidenName:true,genUp:2,genDown:2,colors:{}}

const SB_URL=import.meta.env.VITE_SUPABASE_URL||''
const SB_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY||''
const HAS_SB=!!(SB_URL&&SB_KEY)
const sbH={apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json'}
async function sbGet(){if(!HAS_SB)return null;try{const r=await fetch(`${SB_URL}/rest/v1/families?select=*`,{headers:sbH});if(!r.ok)return null;return r.json()}catch{return null}}
async function sbUpsert(f){if(!HAS_SB)return false;try{const r=await fetch(`${SB_URL}/rest/v1/families`,{method:'POST',headers:{...sbH,Prefer:'resolution=merge-duplicates'},body:JSON.stringify({id:f.id,name:f.name,data:f.data,updated_at:new Date().toISOString()})});console.log('[Asli] UPSERT',f.id,r.status);if(!r.ok){console.error('[Asli] UPSERT failed',await r.text());return false}return true}catch(e){console.error('[Asli] UPSERT error',e);return false}}
async function sbDelete(id){if(!HAS_SB)return;try{await fetch(`${SB_URL}/rest/v1/families?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:sbH})}catch{}}

function loadFamilies(){
  try{const r=localStorage.getItem(FAMILIES_KEY);if(r)return JSON.parse(r)}catch{}
  // Migrate from old single-family key
  let migData=INITIAL_DATA
  try{const r=localStorage.getItem('asli-data-v1');if(r)migData=JSON.parse(r)}catch{}
  const fams=[{id:'fam-default',name:'عائلتي',data:migData,updatedAt:Date.now()}]
  localStorage.setItem(FAMILIES_KEY,JSON.stringify(fams))
  return fams
}
function saveFamilies(fs){localStorage.setItem(FAMILIES_KEY,JSON.stringify(fs))}
function loadSettings(){try{const r=localStorage.getItem(SETTINGS_KEY);if(r)return{...DEFAULT_SETTINGS,...JSON.parse(r)}}catch{}return{...DEFAULT_SETTINGS}}
function saveSettings(s){localStorage.setItem(SETTINGS_KEY,JSON.stringify(s))}
function genId(){return'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function fullName(d,s={}){const parts=s.surnameFirst?[d.last_name,d.first_name]:[d.first_name,d.last_name];let n=parts.filter(Boolean).join(' ').trim()||'—';if(s.showMaidenName&&d.maiden&&d.sex==='F')n+=` (${d.maiden})`;return n}

const ADMIN_PWD=import.meta.env.VITE_ASLI_ADMIN_PASSWORD||null
const GUEST_PWD=import.meta.env.VITE_ASLI_GUEST_PASSWORD||null
const AUTH_REQUIRED=!!(ADMIN_PWD||GUEST_PWD)

function getFocusedData(data,fid,genUp,genDown){
  if(!fid)return data
  const byId=Object.fromEntries(data.map(p=>[p.id,p])),inc=new Set()
  function up(id,d){if(!id||!byId[id]||inc.has(id))return;inc.add(id);byId[id].rels.spouses.forEach(s=>{if(byId[s])inc.add(s)});if(d>0){up(byId[id].rels.father,d-1);up(byId[id].rels.mother,d-1)}}
  function dn(id,d){if(!id||!byId[id]||inc.has(id))return;inc.add(id);byId[id].rels.spouses.forEach(s=>{if(byId[s])inc.add(s)});if(d>0)byId[id].rels.children.forEach(c=>dn(c,d-1))}
  up(fid,genUp);dn(fid,genDown)
  return data.filter(p=>inc.has(p.id))
}

// Convert our data format to family-chart format
function toF3(people){
  return people.map(p=>({
    id:p.id,
    data:{
      ...p.data,
      gender:p.data.sex,
      'first name':p.data.first_name||'',
      'last name':p.data.last_name||'',
      birthday:p.data.birth?.date||'',
    },
    rels:{
      spouses:p.rels.spouses||[],
      children:p.rels.children||[],
      parents:[p.rels.father,p.rels.mother].filter(Boolean),
    }
  }))
}

function FamilyChartView({data,focusedId,onPersonClick,EC,t,lang}){
  const elRef=useRef(null)
  const chartRef=useRef(null)
  const chartId=useRef('f3-'+Math.random().toString(36).slice(2))
  const onClickRef=useRef(null)

  useEffect(()=>{
    if(!elRef.current||!data.length)return
    const el=elRef.current
    el.innerHTML=''
    const chart=f3.createChart('#'+chartId.current,toF3(data))
    const card=chart.setCardHtml()
    // Use library's built-in click callback (d.data.id = person id)
    card.setOnCardClick((e,d)=>{
      e.stopPropagation()
      onClickRef.current?.(d.data.id)
    })
    card.setCardDisplay([['first name','last name'],['birthday']])
    chart.updateTree({initial:true})
    chartRef.current=chart

    // Background click → deselect
    const onBgClick=e=>{
      if(!e.target.closest('.card'))onClickRef.current?.(null)
    }
    el.addEventListener('click',onBgClick)
    return()=>el.removeEventListener('click',onBgClick)
  },[]) // eslint-disable-line

  useEffect(()=>{onClickRef.current=onPersonClick},[onPersonClick])

  useEffect(()=>{
    if(!chartRef.current||!data.length)return
    chartRef.current.updateData(toF3(data))
    chartRef.current.updateTree({})
  },[data])

  if(!data.length)return(
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:C.muted,fontFamily:FONT[lang].body,fontSize:15}}>{t.emptyTree}</div>
  )
  return(
    <div id={chartId.current} ref={elRef} className="f3"
      style={{width:'100%',height:'100%','--f3-bg-color':EC.bg,'--f3-card-bg-color':C.card,'--f3-border-color':C.border}}/>
  )
}

function dl(content,filename,mime){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:mime}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
function pickFile(accept,cb){const i=document.createElement('input');i.type='file';i.accept=accept;i.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>cb(ev.target.result);r.readAsText(f)};i.click()}

function exportGEDCOM(data){
  const L=['0 HEAD','1 GEDC','2 VERS 5.5.1','1 CHAR UTF-8','1 SOUR Asli']
  data.forEach(p=>{const d=p.data;L.push(`0 @${p.id}@ INDI`);if(d.first_name||d.last_name)L.push(`1 NAME ${d.first_name||''} /${d.last_name||''}/`);if(d.sex)L.push(`1 SEX ${d.sex}`);if(d.birth?.date||d.birth?.place){L.push('1 BIRT');if(d.birth?.date)L.push(`2 DATE ${d.birth.date}`);if(d.birth?.place)L.push(`2 PLAC ${d.birth.place}`)}if(d.death){L.push('1 DEAT');if(d.death.date)L.push(`2 DATE ${d.death.date}`);if(d.death.place)L.push(`2 PLAC ${d.death.place}`)}if(d.job)L.push(`1 OCCU ${d.job}`);if(d.notes)L.push(`1 NOTE ${d.notes}`)})
  const fs=new Set();data.forEach(p=>p.rels.spouses.forEach(sid=>{const k=[p.id,sid].sort().join('~');if(fs.has(k))return;fs.add(k);const fi=`F${k.replace('~','_')}`;L.push(`0 @${fi}@ FAM`,`1 ${p.data.sex==='M'?'HUSB':'WIFE'} @${p.id}@`,`1 ${p.data.sex==='M'?'WIFE':'HUSB'} @${sid}@`);p.rels.children.forEach(c=>L.push(`1 CHIL @${c}@`))}))
  L.push('0 TRLR');dl(L.join('\n'),'asli-family.ged','text/plain')
}

function parseGEDCOM(text){
  const lines=text.split(/\r?\n/),indis={},fams={};let ci=null,cf=null,tag=null
  for(const raw of lines){const m=raw.match(/^(\d+)\s+(@[^@]+@)?\s*(\S+)?\s*(.*)$/);if(!m)continue;const[,lvl,xref,t,v]=m;const lv=parseInt(lvl)
    if(lv===0){ci=null;cf=null;tag=null;if(xref&&t==='INDI'){ci=xref;indis[xref]={data:{first_name:'',last_name:'',middle_name:'',nickname:'',maiden:'',sex:'M',birth:null,death:null,photo:'',bio:'',job:'',company:'',phone:'',email:'',address:'',notes:'',interests:''},rels:{father:null,mother:null,spouses:[],children:[]}}}else if(xref&&t==='FAM'){cf=xref;fams[xref]={husb:null,wife:null,children:[]}}}
    else if(ci){if(lv===1){tag=t;if(t==='NAME'){const nm=v.match(/^(.*?)\s*\/(.*)\/\s*$/);if(nm){indis[ci].data.first_name=nm[1].trim();indis[ci].data.last_name=nm[2].trim()}else indis[ci].data.first_name=v.trim()}else if(t==='SEX')indis[ci].data.sex=v==='F'?'F':'M';else if(t==='OCCU')indis[ci].data.job=v;else if(t==='NOTE')indis[ci].data.notes=v;else if(t==='BIRT')indis[ci].data.birth={date:'',place:''};else if(t==='DEAT')indis[ci].data.death={date:'',place:''}}else if(lv===2){if(tag==='BIRT'&&indis[ci].data.birth){if(t==='DATE')indis[ci].data.birth.date=v;if(t==='PLAC')indis[ci].data.birth.place=v}if(tag==='DEAT'&&indis[ci].data.death){if(t==='DATE')indis[ci].data.death.date=v;if(t==='PLAC')indis[ci].data.death.place=v}}}
    else if(cf){if(lv===1){if(t==='HUSB')fams[cf].husb=v.trim();else if(t==='WIFE')fams[cf].wife=v.trim();else if(t==='CHIL')fams[cf].children.push(v.trim())}}}
  const idMap={};Object.entries(indis).forEach(([x])=>{idMap[x]=x.replace(/@/g,'').toLowerCase()})
  const people=Object.entries(indis).map(([x,p])=>({id:idMap[x],data:p.data,rels:{...p.rels}}))
  Object.values(fams).forEach(f=>{const h=f.husb?idMap[f.husb]:null,w=f.wife?idMap[f.wife]:null,kids=f.children.map(c=>idMap[c]).filter(Boolean),hp=people.find(p=>p.id===h),wp=people.find(p=>p.id===w);if(hp&&w&&!hp.rels.spouses.includes(w))hp.rels.spouses.push(w);if(wp&&h&&!wp.rels.spouses.includes(h))wp.rels.spouses.push(h);kids.forEach(cid=>{const ch=people.find(p=>p.id===cid);if(!ch)return;if(h)ch.rels.father=h;if(w)ch.rels.mother=w;if(hp&&!hp.rels.children.includes(cid))hp.rels.children.push(cid);if(wp&&!wp.rels.children.includes(cid))wp.rels.children.push(cid)})})
  return people
}

const SX={
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.38)',zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center',padding:16},
  sheet:{background:C.card,borderRadius:20,padding:22,boxShadow:'0 -4px 40px rgba(0,0,0,0.18)'},
  input:f=>({width:'100%',padding:'8px 11px',border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:f.body,color:C.ink,background:C.surface,outline:'none',boxSizing:'border-box'}),
  iconBtn:{background:'none',border:'none',cursor:'pointer',fontSize:16,color:C.muted,padding:6,lineHeight:1,borderRadius:8},
  secLabel:{fontSize:10,color:C.muted,fontFamily:'Karla,sans-serif',letterSpacing:'0.4px',textTransform:'uppercase',fontWeight:500},
  contactRow:{display:'flex',alignItems:'center',gap:8,fontSize:12,color:C.ink,padding:'3px 0'},
  primaryBtn:f=>({flex:1,background:C.primary,color:C.white,border:'none',borderRadius:10,padding:'10px 14px',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:f.body}),
  dangerBtn:f=>({background:'transparent',color:C.accent,border:`1px solid ${C.accent}`,borderRadius:10,padding:'10px 14px',cursor:'pointer',fontSize:14,fontFamily:f.body}),
  ghostBtn:f=>({flex:1,background:C.surface,color:C.muted,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px',cursor:'pointer',fontSize:14,fontFamily:f.body}),
  smallBtn:f=>({background:C.surface,color:C.ink,border:`1px solid ${C.border}`,borderRadius:8,padding:'6px 11px',cursor:'pointer',fontSize:12,fontFamily:f.body}),
  addRelBtn:{background:C.surface,color:C.primary,border:`1px solid ${C.gold}`,borderRadius:8,padding:'6px 11px',cursor:'pointer',fontSize:12,fontWeight:600},
}

function PasswordModal({t,lang,isRTL,onLogin}){
  const[pwd,setPwd]=useState('');const[err,setErr]=useState(false);const f=FONT[lang]
  const try_=role=>{const exp=role==='admin'?ADMIN_PWD:GUEST_PWD;if(pwd===exp){onLogin(role);setErr(false)}else setErr(true)}
  return(
    <div style={{position:'fixed',inset:0,background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:24}}>
      <div style={{background:C.card,borderRadius:24,padding:36,maxWidth:340,width:'100%',boxShadow:`0 8px 48px ${C.shadow}`}} dir={isRTL?'rtl':'ltr'}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:32,fontWeight:700,color:C.primary,fontFamily:f.display}}>{t.app}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:6,fontFamily:'Karla,sans-serif',letterSpacing:1,textTransform:'uppercase'}}>{t.tagline}</div>
        </div>
        <input type="password" value={pwd} autoFocus onChange={e=>{setPwd(e.target.value);setErr(false)}} placeholder={t.enterPassword}
          onKeyDown={e=>{if(e.key==='Enter'){if(ADMIN_PWD)try_('admin');else if(GUEST_PWD)try_('guest')}}}
          style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${err?C.accent:C.border}`,borderRadius:12,fontSize:14,fontFamily:f.body,color:C.ink,background:C.surface,outline:'none',marginBottom:10,boxSizing:'border-box'}} dir={isRTL?'rtl':'ltr'}/>
        {err&&<div style={{color:C.accent,fontSize:12,marginBottom:10,fontFamily:'Karla,sans-serif'}}>{t.wrongPassword}</div>}
        <div style={{display:'flex',gap:8}}>
          {ADMIN_PWD&&<button onClick={()=>try_('admin')} style={{flex:1,background:C.primary,color:C.white,border:'none',borderRadius:11,padding:'11px 14px',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:f.body}}>{t.adminMode}</button>}
          {GUEST_PWD&&<button onClick={()=>try_('guest')} style={{flex:1,background:C.surface,color:C.ink,border:`1px solid ${C.border}`,borderRadius:11,padding:'11px 14px',cursor:'pointer',fontSize:13,fontFamily:f.body}}>{t.guestMode}</button>}
        </div>
      </div>
    </div>
  )
}

function Sidebar({person,data,t,lang,isRTL,EC,role,settings,onClose,onEdit,onDelete,onNavigate,onAddRelative}){
  const d=person.data,byId=Object.fromEntries(data.map(p=>[p.id,p])),f=FONT[lang],name=fullName(d,settings),isAdmin=role==='admin'
  const Chip=({id,lbl})=>{const rel=byId[id];if(!rel)return null;return<button onClick={()=>onNavigate(id)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'5px 10px',cursor:'pointer',fontSize:12,color:EC.primary,fontFamily:f.body,display:'flex',flexDirection:'column',gap:1,textAlign:isRTL?'right':'left'}}><span style={{fontSize:9,color:C.muted}}>{lbl}</span><span style={{fontWeight:600}}>{fullName(rel.data,settings)}</span></button>}
  return(
    <div style={{position:'absolute',bottom:0,left:0,right:0,background:C.card,borderRadius:'20px 20px 0 0',boxShadow:`0 -4px 30px ${C.shadow}`,maxHeight:'55%',overflowY:'auto',zIndex:50,fontFamily:f.body}} dir={isRTL?'rtl':'ltr'}>
      <div style={{display:'flex',justifyContent:'center',padding:'10px 0 0'}}><div style={{width:36,height:4,borderRadius:2,background:C.border}}/></div>
      <div style={{padding:'12px 20px 24px'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:14}}>
          <div style={{width:60,height:60,borderRadius:'50%',flexShrink:0,overflow:'hidden',background:d.sex==='M'?`${EC.primary}18`:`${EC.accent}18`,border:`2px solid ${d.sex==='M'?EC.primary:EC.accent}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            {d.photo?<img src={d.photo} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:24,color:d.sex==='M'?EC.primary:EC.accent}}>{d.sex==='M'?'◈':'◇'}</span>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:17,fontWeight:700,color:EC.ink,fontFamily:f.display,lineHeight:1.2}}>{name}</div>
            {d.nickname&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>"{d.nickname}"</div>}
            {settings.showMaidenName&&d.maiden&&<div style={{fontSize:11,color:C.muted}}>née {d.maiden}</div>}
            <div style={{fontSize:11,color:C.muted,marginTop:3,lineHeight:1.6}}>
              {d.birth?.date&&<span>b. {d.birth.date}{d.birth.place?`, ${d.birth.place}`:''} </span>}
              {d.death&&<span style={{color:EC.accent}}>† {d.death.date}{d.death.place?`, ${d.death.place}`:''}</span>}
            </div>
            {d.job&&<div style={{fontSize:11,color:EC.gold,marginTop:1}}>{d.job}{d.company?` · ${d.company}`:''}</div>}
          </div>
          <button onClick={onClose} style={SX.iconBtn}>✕</button>
        </div>
        {d.bio&&<div style={{background:C.surface,borderRadius:10,padding:'8px 12px',marginBottom:12,fontSize:12,color:EC.ink,lineHeight:1.6}}>{d.bio}</div>}
        {(person.rels.father||person.rels.mother||person.rels.spouses.length||person.rels.children.length)?<div style={{marginBottom:12}}><div style={SX.secLabel}>{t.relations}</div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{person.rels.father&&<Chip id={person.rels.father} lbl={t.father}/>}{person.rels.mother&&<Chip id={person.rels.mother} lbl={t.mother}/>}{person.rels.spouses.map(id=><Chip key={id} id={id} lbl={t.spouses}/>)}{person.rels.children.map(id=><Chip key={id} id={id} lbl={t.children}/>)}</div></div>:null}
        {(d.phone||d.email||d.address)&&<div style={{marginBottom:12}}><div style={SX.secLabel}>{t.contactInfo}</div>{d.phone&&<div style={SX.contactRow}><span>📞</span>{d.phone}</div>}{d.email&&<div style={SX.contactRow}><span>✉</span>{d.email}</div>}{d.address&&<div style={SX.contactRow}><span>📍</span>{d.address}</div>}</div>}
        {isAdmin&&<><div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}><button onClick={()=>onAddRelative('child')} style={SX.addRelBtn}>{t.addChild}</button><button onClick={()=>onAddRelative('spouse')} style={SX.addRelBtn}>{t.addSpouse}</button></div><div style={{display:'flex',gap:8}}><button onClick={onEdit} style={SX.primaryBtn(f)}>{t.edit}</button><button onClick={onDelete} style={SX.dangerBtn(f)}>{t.delete}</button></div></>}
      </div>
    </div>
  )
}

function SettingsPanel({settings,setSettings,t,lang,isRTL,EC,role,onClose,onExportGEDCOM,onImportGEDCOM,onExportJSON,onImportJSON}){
  const f=FONT[lang],s=settings,isAdmin=role==='admin'
  const upd=(k,v)=>setSettings(p=>({...p,[k]:v}))
  const updC=(k,v)=>setSettings(p=>({...p,colors:{...(p.colors||{}),[k]:v}}))
  const[tab,setTab]=useState('display')
  const Radio=({lbl,val,opts,onChange})=><div style={{marginBottom:16}}><div style={SX.secLabel}>{lbl}</div><div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{opts.map(o=><button key={o.v} onClick={()=>onChange(o.v)} style={{...SX.smallBtn(f),background:val===o.v?EC.primary:C.surface,color:val===o.v?C.white:C.ink,borderColor:val===o.v?EC.primary:C.border,flex:1,minWidth:60}}>{o.l}</button>)}</div></div>
  const Toggle=({lbl,val,onChange})=><div style={{marginBottom:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{fontSize:13,color:EC.ink,fontFamily:f.body}}>{lbl}</div><button onClick={()=>onChange(!val)} style={{width:44,height:26,borderRadius:13,border:'none',cursor:'pointer',background:val?EC.primary:C.border,position:'relative',transition:'background .2s',flexShrink:0}}><div style={{position:'absolute',top:3,left:val?21:3,width:20,height:20,borderRadius:'50%',background:C.white,transition:'left .2s'}}/></button></div>
  const ColRow=({lbl,ck,def})=><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}><div style={{fontSize:13,color:EC.ink,fontFamily:f.body}}>{lbl}</div><input type="color" value={(s.colors||{})[ck]||def} onChange={e=>updC(ck,e.target.value)} style={{width:38,height:28,border:`1px solid ${C.border}`,borderRadius:6,cursor:'pointer',padding:2,background:C.surface}}/></div>
  const tabS=a=>({flex:1,padding:'8px 4px',border:'none',cursor:'pointer',fontSize:11,background:a?EC.primary:C.surface,color:a?C.white:C.muted,borderRadius:8,fontFamily:'Karla,sans-serif',fontWeight:600,letterSpacing:'.3px',textTransform:'uppercase'})
  return(
    <div style={SX.overlay} onClick={onClose}>
      <div style={{...SX.sheet,maxWidth:420,width:'100%',fontFamily:f.body,maxHeight:'88vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()} dir={isRTL?'rtl':'ltr'}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><div style={{fontSize:16,fontWeight:700,color:EC.ink,fontFamily:f.display}}>{t.settings}</div><button onClick={onClose} style={SX.iconBtn}>✕</button></div>
        <div style={{display:'flex',gap:6,marginBottom:18}}>
          <button style={tabS(tab==='display')} onClick={()=>setTab('display')}>{t.tabDisplay}</button>
          <button style={tabS(tab==='colors')} onClick={()=>setTab('colors')}>{t.tabColors}</button>
          {isAdmin&&<button style={tabS(tab==='data')} onClick={()=>setTab('data')}>{t.tabData}</button>}
        </div>
        {tab==='display'&&<>
          <Radio lbl={t.cardDetail} val={s.cardDetail} opts={[{v:'name',l:t.detailName},{v:'nameyear',l:t.detailNameYear},{v:'full',l:t.detailFull}]} onChange={v=>upd('cardDetail',v)}/>
          <Radio lbl={t.cardSize} val={s.boxSize} opts={[{v:'sm',l:t.sizeSm},{v:'md',l:t.sizeMd},{v:'lg',l:t.sizeLg}]} onChange={v=>upd('boxSize',v)}/>
          <Toggle lbl={t.showPhotos} val={s.showPhotos} onChange={v=>upd('showPhotos',v)}/>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,marginBottom:14}}>
            <div style={{...SX.secLabel,marginBottom:10}}>{t.nameOptions}</div>
            <Toggle lbl={t.surnameFirst} val={s.surnameFirst} onChange={v=>upd('surnameFirst',v)}/>
            <Toggle lbl={t.showMaidenName} val={s.showMaidenName} onChange={v=>upd('showMaidenName',v)}/>
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
            <div style={{...SX.secLabel,marginBottom:10}}>{t.viewPartial}</div>
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}><label style={{fontSize:12,color:EC.ink,flex:1,fontFamily:f.body}}>{t.genUp} ({s.genUp})</label><input type="range" min={1} max={5} value={s.genUp} onChange={e=>upd('genUp',Number(e.target.value))} style={{flex:2}}/></div>
            <div style={{display:'flex',gap:12,alignItems:'center'}}><label style={{fontSize:12,color:EC.ink,flex:1,fontFamily:f.body}}>{t.genDown} ({s.genDown})</label><input type="range" min={1} max={5} value={s.genDown} onChange={e=>upd('genDown',Number(e.target.value))} style={{flex:2}}/></div>
          </div>
        </>}
        {tab==='colors'&&<>
          <ColRow lbl={t.colorBg} ck="bg" def={C.bg}/>
          <ColRow lbl={t.colorMale} ck="primary" def={C.primary}/>
          <ColRow lbl={t.colorFemale} ck="accent" def={C.accent}/>
          <ColRow lbl={t.colorGold} ck="gold" def={C.gold}/>
          <ColRow lbl={t.colorInk} ck="ink" def={C.ink}/>
          <button onClick={()=>upd('colors',{})} style={{...SX.ghostBtn(f),width:'100%',textAlign:'center',marginTop:8}}>↺ {t.resetColors}</button>
        </>}
        {tab==='data'&&isAdmin&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <button onClick={onExportJSON} style={{...SX.ghostBtn(f),textAlign:'center'}}>⬇ {t.jsonExport}</button>
          <button onClick={onImportJSON} style={{...SX.ghostBtn(f),textAlign:'center'}}>⬆ {t.jsonImport}</button>
          <button onClick={onExportGEDCOM} style={{...SX.ghostBtn(f),textAlign:'center'}}>⬇ {t.gedcomExport}</button>
          <button onClick={onImportGEDCOM} style={{...SX.ghostBtn(f),textAlign:'center'}}>⬆ {t.gedcomImport}</button>
        </div>}
      </div>
    </div>
  )
}

function PersonForm({person,data,t,lang,isRTL,mode,relation,settings,onSave,onCancel}){
  const f=FONT[lang],blank={first_name:'',last_name:'',middle_name:'',nickname:'',maiden:'',sex:'M',birth:{date:'',place:''},death:null,photo:'',bio:'',job:'',company:'',phone:'',email:'',address:'',notes:'',interests:''}
  const[form,setForm]=useState(person?{...blank,...person.data}:blank)
  const[isDead,setIsDead]=useState(!!(person?.data.death))
  const[relId,setRelId]=useState(relation?.relativeId||(data.length?data[0].id:''))
  const[relType,setRelType]=useState(relation?.type==='spouse'?'spouse':(data.length?'child':'root'))
  const fr=useRef(null)
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  const setBirth=(k,v)=>setForm(p=>({...p,birth:{...p.birth,[k]:v}}))
  const setDeath=(k,v)=>setForm(p=>({...p,death:{...(p.death||{date:'',place:''}),[k]:v}}))
  const handlePhoto=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>set('photo',ev.target.result);r.readAsDataURL(file)}
  const submit=()=>{if(!form.first_name.trim())return;const fd={...form,death:isDead?(form.death||{date:'',place:''}):null};mode==='edit'?onSave(fd):onSave(fd,{type:relType,relativeId:relType==='root'?null:relId})}
  const F=({lbl,children})=><div style={{marginBottom:12}}><label style={{display:'block',fontSize:10,color:C.muted,fontFamily:'Karla,sans-serif',letterSpacing:'.5px',textTransform:'uppercase',marginBottom:3}}>{lbl}</label>{children}</div>
  const inp=(val,onChange,ph='')=><input value={val||''} onChange={e=>onChange(e.target.value)} placeholder={ph} style={SX.input(f)}/>
  return(
    <div style={SX.overlay} onClick={onCancel}>
      <div style={{...SX.sheet,maxWidth:480,width:'100%',maxHeight:'90vh',overflowY:'auto',fontFamily:f.body}} onClick={e=>e.stopPropagation()} dir={isRTL?'rtl':'ltr'}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><div style={{fontSize:16,fontWeight:700,color:C.ink,fontFamily:f.display}}>{mode==='edit'?t.edit:t.add}</div><button onClick={onCancel} style={SX.iconBtn}>✕</button></div>
        <F lbl={t.photo}><div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:56,height:56,borderRadius:'50%',border:`2px dashed ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:C.surface,cursor:'pointer',flexShrink:0}} onClick={()=>fr.current?.click()}>{form.photo?<img src={form.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:20,color:C.border}}>+</span>}</div><input ref={fr} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/><div style={{display:'flex',gap:6}}><button onClick={()=>fr.current?.click()} style={SX.smallBtn(f)}>{form.photo?t.changePhoto:t.photo}</button>{form.photo&&<button onClick={()=>set('photo','')} style={{...SX.smallBtn(f),color:C.accent,borderColor:C.accent}}>{t.removePhoto}</button>}</div></div></F>
        <F lbl={t.sex}><div style={{display:'flex',gap:8}}>{['M','F'].map(s=><button key={s} onClick={()=>set('sex',s)} style={{...SX.smallBtn(f),flex:1,background:form.sex===s?C.primary:C.surface,color:form.sex===s?C.white:C.ink,borderColor:form.sex===s?C.primary:C.border}}>{s==='M'?t.male:t.female}</button>)}</div></F>
        <F lbl={t.firstName}>{inp(form.first_name,v=>set('first_name',v))}</F>
        <F lbl={t.lastName}>{inp(form.last_name,v=>set('last_name',v))}</F>
        <F lbl={t.middleName}>{inp(form.middle_name,v=>set('middle_name',v))}</F>
        <F lbl={t.nickname}>{inp(form.nickname,v=>set('nickname',v))}</F>
        {form.sex==='F'&&<F lbl={t.maiden}>{inp(form.maiden,v=>set('maiden',v))}</F>}
        <F lbl={t.born}><div style={{display:'flex',gap:8}}>{inp(form.birth?.date,v=>setBirth('date',v),'1980')}{inp(form.birth?.place,v=>setBirth('place',v),t.place)}</div></F>
        <F lbl={t.deceased}><button onClick={()=>setIsDead(x=>!x)} style={{...SX.smallBtn(f),background:isDead?C.accent:C.surface,color:isDead?C.white:C.ink,borderColor:isDead?C.accent:C.border}}>{isDead?`† ${t.deceased}`:t.alive}</button></F>
        {isDead&&<F lbl={t.died}><div style={{display:'flex',gap:8}}>{inp(form.death?.date,v=>setDeath('date',v),'2020')}{inp(form.death?.place,v=>setDeath('place',v),t.place)}</div></F>}
        <F lbl={t.job}>{inp(form.job,v=>set('job',v))}</F>
        <F lbl={t.company}>{inp(form.company,v=>set('company',v))}</F>
        <F lbl={t.bio}><textarea value={form.bio||''} onChange={e=>set('bio',e.target.value)} rows={3} style={{...SX.input(f),resize:'vertical',lineHeight:1.5}}/></F>
        <F lbl={t.phone}>{inp(form.phone,v=>set('phone',v))}</F>
        <F lbl={t.email}>{inp(form.email,v=>set('email',v))}</F>
        <F lbl={t.address}>{inp(form.address,v=>set('address',v))}</F>
        <F lbl={t.notes}>{inp(form.notes,v=>set('notes',v))}</F>
        <F lbl={t.interests}>{inp(form.interests,v=>set('interests',v))}</F>
        {mode==='add'&&data.length>0&&<><F lbl={t.relativeTo}><select value={relType} onChange={e=>setRelType(e.target.value)} style={SX.input(f)}><option value="child">{t.childOf}</option><option value="spouse">{t.spouseOf}</option><option value="root">{t.root}</option></select></F>{relType!=='root'&&<F lbl={relType==='child'?`${t.father} / ${t.mother}`:t.spouses}><select value={relId} onChange={e=>setRelId(e.target.value)} style={SX.input(f)}>{data.map(p=><option key={p.id} value={p.id}>{fullName(p.data,settings)}</option>)}</select></F>}</>}
        <div style={{display:'flex',gap:10,marginTop:8}}><button onClick={submit} style={SX.primaryBtn(f)}>{t.save}</button><button onClick={onCancel} style={SX.ghostBtn(f)}>{t.cancel}</button></div>
      </div>
    </div>
  )
}

function FamilyPicker({families,t,lang,isRTL,EC,role,onSelect,onCreate,onDelete,onLogout}){
  const[newName,setNewName]=useState(''),f=FONT[lang],[creating,setCreating]=useState(false)
  const submit=()=>{if(!newName.trim())return;onCreate(newName.trim());setNewName('');setCreating(false)}
  return(
    <div style={{width:'100vw',height:'100vh',display:'flex',flexDirection:'column',background:EC.bg,overflow:'hidden'}}>
      <div style={{background:EC.primary,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,flexShrink:0,flexDirection:isRTL?'row-reverse':'row'}}>
        <div style={{display:'flex',flexDirection:'column',marginInlineEnd:'auto'}}>
          <div style={{fontSize:20,fontWeight:700,color:'#fff',fontFamily:FONT[lang].display,lineHeight:1}}>{t.app}</div>
          <div style={{fontSize:9,color:'#ffffff77',fontFamily:'Karla,sans-serif',letterSpacing:1}}>{t.families.toUpperCase()}</div>
        </div>
        <div style={{display:'flex',gap:3}}>{['ar','fr','en','it'].map(l=><button key={l} onClick={()=>typeof setLang==='function'&&setLang(l)} style={{background:'transparent',color:'#fff',border:'1px solid #ffffff44',borderRadius:6,padding:'3px 6px',fontSize:10,cursor:'pointer'}}>{l.toUpperCase()}</button>)}</div>
        {AUTH_REQUIRED&&role&&<button onClick={onLogout} style={{...SX.iconBtn,color:'#ffffff88',fontSize:13}}>⏏</button>}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:20}}>
        {!families.length&&<div style={{textAlign:'center',color:C.muted,fontFamily:f.body,padding:40,fontSize:14}}>{t.emptyFamilies}</div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
          {families.map(fam=>(
            <div key={fam.id} onClick={()=>onSelect(fam.id)} style={{background:C.card,borderRadius:16,padding:20,cursor:'pointer',boxShadow:`0 2px 12px ${C.shadow}`,border:`1.5px solid ${C.border}`,display:'flex',flexDirection:'column',gap:8,position:'relative',transition:'box-shadow .15s'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 24px ${C.shadow}`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 2px 12px ${C.shadow}`}>
              <div style={{fontSize:32,textAlign:'center',marginBottom:4}}>🌳</div>
              <div style={{fontSize:16,fontWeight:700,color:EC.ink,fontFamily:f.display,textAlign:'center'}}>{fam.name}</div>
              <div style={{fontSize:12,color:C.muted,fontFamily:'Karla,sans-serif',textAlign:'center'}}>{fam.data.length} {t.peopleCount}</div>
              {role==='admin'&&<button onClick={e=>{e.stopPropagation();if(window.confirm(t.deleteFamily+'?'))onDelete(fam.id)}} style={{position:'absolute',top:10,insetInlineEnd:10,background:'none',border:'none',cursor:'pointer',fontSize:14,color:C.muted,padding:4}}>🗑</button>}
            </div>
          ))}
        </div>
        {role==='admin'&&<div style={{marginTop:20}}>
          {creating?(
            <div style={{background:C.card,borderRadius:14,padding:16,border:`1px solid ${C.border}`,display:'flex',gap:8,flexDirection:isRTL?'row-reverse':'row'}}>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')submit();if(e.key==='Escape')setCreating(false)}}
                placeholder={t.familyName} style={{flex:1,...SX.input(f)}} dir={isRTL?'rtl':'ltr'}/>
              <button onClick={submit} style={{background:EC.primary,color:'#fff',border:'none',borderRadius:9,padding:'8px 16px',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:f.body}}>{t.save}</button>
              <button onClick={()=>{setCreating(false);setNewName('')}} style={{background:C.surface,color:C.muted,border:`1px solid ${C.border}`,borderRadius:9,padding:'8px 12px',cursor:'pointer',fontSize:13,fontFamily:f.body}}>{t.cancel}</button>
            </div>
          ):(
            <button onClick={()=>setCreating(true)} style={{width:'100%',background:C.surface,color:EC.primary,border:`2px dashed ${EC.primary}`,borderRadius:14,padding:'16px',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:f.body}}>+ {t.newFamily}</button>
          )}
        </div>}
      </div>
    </div>
  )
}

function Header({t,lang,setLang,isRTL,data,EC,role,settings,focusedId,focusedView,currentFamName,onAdd,onSettings,onFocusPerson,onLogout,onToggleFocused,onBackToFamilies,onSave,syncStatus}){
  const[search,setSearch]=useState(''),[open,setOpen]=useState(false),f=FONT[lang]
  const results=useMemo(()=>{if(!search.trim())return[];const q=search.toLowerCase();return data.filter(p=>`${p.data.first_name||''} ${p.data.last_name||''} ${p.data.nickname||''} ${p.data.job||''}`.toLowerCase().includes(q)).slice(0,8)},[search,data])
  const pick=id=>{onFocusPerson(id);setSearch('');setOpen(false)}
  return(
    <div style={{background:EC.primary,padding:'10px 14px',display:'flex',alignItems:'center',gap:8,flexShrink:0,position:'relative',flexDirection:isRTL?'row-reverse':'row'}}>
      {onBackToFamilies&&<button onClick={onBackToFamilies} style={{...SX.iconBtn,color:`${C.white}bb`,fontSize:12,fontFamily:'Karla,sans-serif',fontWeight:600,padding:'4px 8px',border:`1px solid ${C.white}33`,borderRadius:7,whiteSpace:'nowrap'}}>{t.backToFamilies}</button>}
      <div style={{display:'flex',flexDirection:'column',marginInlineEnd:'auto',minWidth:0}}>
        <div style={{fontSize:18,fontWeight:700,color:C.white,fontFamily:f.display,lineHeight:1}}>{currentFamName||t.app}</div>
        <div style={{fontSize:9,color:`${C.white}77`,fontFamily:'Karla,sans-serif',letterSpacing:1}}>{t.tagline.toUpperCase()}</div>
      </div>
      {focusedId&&<button onClick={onToggleFocused} title={focusedView?t.viewFull:t.viewPartial} style={{background:focusedView?EC.gold:'transparent',color:C.white,border:`1px solid ${focusedView?EC.gold:`${C.white}44`}`,borderRadius:7,padding:'4px 8px',cursor:'pointer',fontSize:10,fontFamily:'Karla,sans-serif',fontWeight:600}}>{focusedView?'◎':'○'}</button>}
      <div style={{position:'relative'}}>
        <button onClick={()=>setOpen(x=>!x)} style={{...SX.iconBtn,color:C.white,opacity:.85}}>🔍</button>
        {open&&<div style={{position:'absolute',top:'110%',[isRTL?'left':'right']:0,width:280,background:C.white,borderRadius:12,boxShadow:`0 8px 32px ${C.shadow}`,zIndex:300,overflow:'hidden'}}>
          <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{width:'100%',border:'none',outline:'none',padding:'11px 14px',fontSize:13,fontFamily:f.body,color:C.ink,borderBottom:results.length?`1px solid ${C.border}`:'none',boxSizing:'border-box'}} dir={isRTL?'rtl':'ltr'}/>
          {results.map(p=><div key={p.id} onClick={()=>pick(p.id)} style={{padding:'9px 14px',cursor:'pointer',fontSize:13,color:C.ink,fontFamily:f.body,borderBottom:`1px solid ${C.border}`}} onMouseEnter={e=>e.currentTarget.style.background=C.surface} onMouseLeave={e=>e.currentTarget.style.background=''}>{fullName(p.data,settings)}{p.data.birth?.date&&<span style={{color:C.muted,marginInlineStart:8,fontSize:11}}>{p.data.birth.date}</span>}</div>)}
          {search&&!results.length&&<div style={{padding:'9px 14px',color:C.muted,fontSize:13,fontFamily:f.body}}>{t.noMatch}</div>}
        </div>}
      </div>
      {HAS_SB&&onSave&&<button onClick={onSave} style={{background:syncStatus==='ok'?'#22c55e':syncStatus==='err'?'#ef4444':'transparent',color:C.white,border:`1px solid ${syncStatus==='ok'?'#22c55e':syncStatus==='err'?'#ef4444':`${C.white}44`}`,borderRadius:7,padding:'4px 8px',cursor:'pointer',fontSize:10,fontFamily:'Karla,sans-serif',fontWeight:600,transition:'all .3s'}}>{syncStatus==='ok'?'✓ saved':syncStatus==='err'?'✗ failed':'☁ save'}</button>}
      <button onClick={onSettings} style={{...SX.iconBtn,color:C.white,opacity:.85}}>⚙</button>
      {role==='admin'&&<button onClick={onAdd} style={{background:EC.gold,color:C.white,border:'none',borderRadius:9,padding:'7px 13px',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:f.body,whiteSpace:'nowrap'}}>+ {t.add}</button>}
      <div style={{display:'flex',gap:3}}>{['ar','fr','en','it'].map(l=><button key={l} onClick={()=>setLang(l)} style={{background:lang===l?EC.gold:'transparent',color:C.white,border:`1px solid ${lang===l?EC.gold:`${C.white}44`}`,borderRadius:6,padding:'3px 6px',fontSize:10,cursor:'pointer',fontFamily:'Karla,sans-serif',fontWeight:lang===l?700:400}}>{l.toUpperCase()}</button>)}</div>
      {AUTH_REQUIRED&&role&&<button onClick={onLogout} title={t.logout} style={{...SX.iconBtn,color:`${C.white}88`,fontSize:13}}>⏏</button>}
    </div>
  )
}

export default function App(){
  const[lang,setLang]          =useState(()=>localStorage.getItem('asli-lang')||'ar')
  const[families,setFamilies]  =useState(loadFamilies)
  const[currentFamId,setCurFam]=useState(null)
  const[settings,setSettings]  =useState(loadSettings)
  const[focusedId,setFocused]  =useState(null)
  const[editingId,setEditing]  =useState(null)
  const[addRel,setAddRel]      =useState(null)
  const[showSettings,setShowS] =useState(false)
  const[focusedView,setFV]     =useState(false)
  const[role,setRole]          =useState(()=>AUTH_REQUIRED?null:'admin')
  const[syncStatus,setSyncStatus]=useState(null)
  const isRTL=lang==='ar',t=T[lang]
  const EC=useMemo(()=>({...C,...(settings.colors||{})}),[settings.colors])

  const currentFamily=families.find(f=>f.id===currentFamId)
  const data=currentFamily?.data||[]

  useEffect(()=>{localStorage.setItem('asli-lang',lang);document.documentElement.lang=lang;document.documentElement.dir=isRTL?'rtl':'ltr'},[lang,isRTL])
  useEffect(()=>saveSettings(settings),[settings])
  useEffect(()=>{
    const onKey=e=>{if(e.key==='Escape'){setFocused(null);setFV(false);setEditing(null);setAddRel(null);setShowS(false)}}
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[])

  // Track which IDs were last seen in remote, so we can detect remote deletions
  const REMOTE_SEEN_KEY='asli-remote-seen-v1'
  function getRemoteSeen(){try{return new Set(JSON.parse(localStorage.getItem(REMOTE_SEEN_KEY)||'[]'))}catch{return new Set()}}

  // On mount: bidirectional sync with Supabase
  useEffect(()=>{
    if(!HAS_SB)return
    sbGet().then(remote=>{
      setFamilies(local=>{
        const remoteArr=Array.isArray(remote)?remote:[]
        const remoteById=Object.fromEntries(remoteArr.map(r=>[r.id,r]))
        const localById=Object.fromEntries(local.map(f=>[f.id,f]))
        const prevSeen=getRemoteSeen()
        const hasPrevSeen=prevSeen.size>0
        // Save current remote IDs for next sync
        localStorage.setItem(REMOTE_SEEN_KEY,JSON.stringify(Object.keys(remoteById)))
        // Push local families that never existed in remote (newly created locally)
        // Only push if we've synced before — otherwise remote might have deleted them intentionally
        local.forEach(lf=>{if(!remoteById[lf.id]&&(!hasPrevSeen||!prevSeen.has(lf.id)))sbUpsert(lf)})
        // Merge: remote wins when newer; skip families deleted in remote
        const merged={...localById}
        // Remove local families deleted remotely (only when we have a previous sync baseline)
        local.forEach(lf=>{if(hasPrevSeen&&!remoteById[lf.id]&&prevSeen.has(lf.id))delete merged[lf.id]})
        Object.values(remoteById).forEach(rf=>{
          const lf=localById[rf.id]
          const remoteTs=new Date(rf.updated_at).getTime()
          if(!lf||!lf.updatedAt||remoteTs>lf.updatedAt)
            merged[rf.id]={id:rf.id,name:rf.name,data:rf.data,updatedAt:remoteTs}
        })
        const result=Object.values(merged)
        saveFamilies(result);return result
      })
    })
  },[])

  const updData=useCallback(d=>{
    setFamilies(prev=>{
      const next=prev.map(f=>f.id===currentFamId?{...f,data:d,updatedAt:Date.now()}:f)
      saveFamilies(next)
      const updated=next.find(f=>f.id===currentFamId)
      if(updated)sbUpsert(updated)
      return next
    })
  },[currentFamId])

  const handleSave=useCallback(async()=>{
    const fam=families.find(f=>f.id===currentFamId)
    if(!fam)return
    setSyncStatus('saving')
    const ok=await sbUpsert(fam)
    setSyncStatus(ok?'ok':'err')
    setTimeout(()=>setSyncStatus(null),3000)
  },[families,currentFamId])

  const openFamily=useCallback(id=>{setCurFam(id);setFocused(null);setFV(false)},[])
  const createFamily=useCallback(name=>{
    const id=genId(),fam={id,name,data:[],updatedAt:Date.now()}
    setFamilies(prev=>{const next=[...prev,fam];saveFamilies(next);return next})
    sbUpsert(fam)
    openFamily(id)
  },[openFamily])
  const deleteFamily=useCallback(id=>{
    setFamilies(prev=>{const next=prev.filter(f=>f.id!==id);saveFamilies(next);return next})
    sbDelete(id)
    if(currentFamId===id)setCurFam(null)
  },[currentFamId])

  const addPerson=useCallback((pd,rel)=>{
    const nid=genId(),np={id:nid,data:pd,rels:{father:null,mother:null,spouses:[],children:[]}}
    let next=[...data,np]
    if(rel?.type==='child'&&rel.relativeId){
      const par=data.find(p=>p.id===rel.relativeId)
      if(par){const field=par.data.sex==='M'?'father':'mother',other=field==='father'?'mother':'father';next=next.map(p=>{if(p.id===nid){let nx={...p,rels:{...p.rels,[field]:rel.relativeId}};par.rels.spouses.forEach(s=>{nx={...nx,rels:{...nx.rels,[other]:s}}});return nx}if(p.id===rel.relativeId)return{...p,rels:{...p.rels,children:[...p.rels.children,nid]}};if(par.rels.spouses.includes(p.id))return{...p,rels:{...p.rels,children:[...p.rels.children,nid]}};return p})}
    }else if(rel?.type==='spouse'&&rel.relativeId){next=next.map(p=>{if(p.id===nid)return{...p,rels:{...p.rels,spouses:[rel.relativeId]}};if(p.id===rel.relativeId)return{...p,rels:{...p.rels,spouses:[...p.rels.spouses,nid]}};return p})}
    updData(next);setFocused(nid)
  },[data,updData])

  const editPerson=useCallback((id,pd)=>updData(data.map(p=>p.id===id?{...p,data:pd}:p)),[data,updData])
  const deletePerson=useCallback(id=>{if(!window.confirm(t.deleteWarn))return;updData(data.filter(p=>p.id!==id).map(p=>({...p,rels:{father:p.rels.father===id?null:p.rels.father,mother:p.rels.mother===id?null:p.rels.mother,spouses:p.rels.spouses.filter(s=>s!==id),children:p.rels.children.filter(c=>c!==id)}})));setFocused(null)},[data,updData,t.deleteWarn])

  const handleImportJSON=()=>pickFile('.json',txt=>{try{const p=JSON.parse(txt);if(!Array.isArray(p))throw 0;if(window.confirm(t.importWarning)){updData(p);setFocused(null);setFV(false)}}catch{alert('Invalid JSON')}})
  const handleImportGEDCOM=()=>pickFile('.ged,.gedcom',txt=>{const p=parseGEDCOM(txt);if(!p.length){alert('No data found');return}if(window.confirm(t.importWarning)){updData(p);setFocused(null);setFV(false)}})

  const visData=useMemo(()=>{if(focusedView&&focusedId)return getFocusedData(data,focusedId,settings.genUp,settings.genDown);return data},[data,focusedView,focusedId,settings.genUp,settings.genDown])

  const focusedPerson=data.find(p=>p.id===focusedId)
  const editingPerson=data.find(p=>p.id===editingId)

  if(AUTH_REQUIRED&&!role)return<PasswordModal t={t} lang={lang} isRTL={isRTL} onLogin={setRole}/>
  if(!currentFamId)return<FamilyPicker families={families} t={t} lang={lang} isRTL={isRTL} EC={EC} role={role} onSelect={openFamily} onCreate={createFamily} onDelete={deleteFamily} onLogout={()=>setRole(null)}/>

  return(
    <div style={{width:'100vw',height:'100vh',display:'flex',flexDirection:'column',background:EC.bg,overflow:'hidden'}}>
      <Header t={t} lang={lang} setLang={l=>setLang(l)} isRTL={isRTL} data={data} EC={EC} role={role} settings={settings} focusedId={focusedId} focusedView={focusedView} currentFamName={currentFamily?.name} onAdd={()=>setAddRel({type:'root',relativeId:null})} onSettings={()=>setShowS(true)} onFocusPerson={id=>{setFocused(id);if(!id)setFV(false)}} onLogout={()=>setRole(null)} onToggleFocused={()=>setFV(v=>!v)} onBackToFamilies={()=>setCurFam(null)} onSave={handleSave} syncStatus={syncStatus}/>
      <div style={{flex:1,position:'relative',overflow:'hidden'}}>
        <FamilyChartView data={visData} focusedId={focusedId} onPersonClick={id=>setFocused(id===focusedId?null:id)} EC={EC} t={t} lang={lang} settings={settings}/>
        {focusedPerson&&!editingId&&!addRel&&!showSettings&&(
          <Sidebar person={focusedPerson} data={data} t={t} lang={lang} isRTL={isRTL} EC={EC} role={role} settings={settings} onClose={()=>{setFocused(null);setFV(false)}} onEdit={()=>{setEditing(focusedId);setFocused(null)}} onDelete={()=>deletePerson(focusedId)} onNavigate={id=>setFocused(id)} onAddRelative={type=>{setAddRel({type,relativeId:focusedId});setFocused(null)}}/>
        )}
      </div>
      {editingPerson&&<PersonForm person={editingPerson} data={data} t={t} lang={lang} isRTL={isRTL} mode="edit" settings={settings} onSave={d=>{editPerson(editingId,d);setEditing(null);setFocused(editingId)}} onCancel={()=>setEditing(null)}/>}
      {addRel&&<PersonForm person={null} data={data} t={t} lang={lang} isRTL={isRTL} mode="add" relation={addRel} settings={settings} onSave={(d,rel)=>{addPerson(d,rel);setAddRel(null)}} onCancel={()=>setAddRel(null)}/>}
      {showSettings&&<SettingsPanel settings={settings} setSettings={s=>{setSettings(s);saveSettings(s)}} t={t} lang={lang} isRTL={isRTL} EC={EC} role={role} onClose={()=>setShowS(false)} onExportGEDCOM={()=>exportGEDCOM(data)} onImportGEDCOM={handleImportGEDCOM} onExportJSON={()=>dl(JSON.stringify(data,null,2),'asli-family.json','application/json')} onImportJSON={handleImportJSON}/>}
    </div>
  )
}
