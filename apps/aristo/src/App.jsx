import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "gym-history-v4";
const ORDER_KEY = "gym-order-v1";

// ── Muscle highlight body icon ───────────────────────────────────────
function MuscleIcon({ groups = [], size = 36 }) {
  const h = size * 1.4;
  const regionColors = {
    quads: "#FF6B35", hams: "#FF6B35", glutes: "#FF6B35", calves: "#FF6B35",
    abs: "#3B82F6", obliques: "#3B82F6",
    chest: "#F59E0B",
    lats: "#8B5CF6", traps: "#8B5CF6", erectors: "#8B5CF6",
    delts: "#EF4444", biceps: "#EF4444", triceps: "#EF4444", forearms: "#EF4444",
    hip: "#22C55E",
  };
  const active = new Set(groups);
  const fill = r => active.has(r) ? (regionColors[r] || "#FF4D1C") : "transparent";
  const op = r => active.has(r) ? 0.85 : 0;

  return (
    <svg viewBox="0 0 44 62" width={size} height={h} style={{ display: "block", flexShrink: 0 }}>
      <g fill="none" stroke="#333" strokeWidth="1">
        <circle cx="22" cy="7" r="5.5"/>
        <rect x="19.5" y="12.5" width="5" height="3" rx="1"/>
        <path d="M13 15.5 L31 15.5 L32 18 L33 24 L32 32 L30 36 L28 37 L16 37 L14 36 L12 32 L11 24 L12 18 Z"/>
        <path d="M13 15.5 L9 17 L7 22 L6 28 L6.5 32 L7 35 L9 36 L10 34 L10 28 L11 22 L13 18"/>
        <path d="M31 15.5 L35 17 L37 22 L38 28 L37.5 32 L37 35 L35 36 L34 34 L34 28 L33 22 L31 18"/>
        <path d="M16 37 L15 42 L14 48 L13.5 52 L13 56 L12 59 L16 59 L16.5 56 L17 52 L18 48 L19.5 42 L21 37"/>
        <path d="M28 37 L29 42 L30 48 L30.5 52 L31 56 L32 59 L28 59 L27.5 56 L27 52 L26 48 L24.5 42 L23 37"/>
      </g>
      <ellipse cx="18" cy="20" rx="4.5" ry="3.5" fill={fill("chest")} opacity={op("chest")}/>
      <ellipse cx="26" cy="20" rx="4.5" ry="3.5" fill={fill("chest")} opacity={op("chest")}/>
      <rect x="17" y="24" width="10" height="12" rx="3" fill={fill("abs")} opacity={op("abs")}/>
      <ellipse cx="14" cy="30" rx="2.5" ry="5" fill={fill("obliques")} opacity={op("obliques")}/>
      <ellipse cx="30" cy="30" rx="2.5" ry="5" fill={fill("obliques")} opacity={op("obliques")}/>
      <ellipse cx="12" cy="17" rx="2.5" ry="2.5" fill={fill("delts")} opacity={op("delts")}/>
      <ellipse cx="32" cy="17" rx="2.5" ry="2.5" fill={fill("delts")} opacity={op("delts")}/>
      <ellipse cx="9" cy="23" rx="2" ry="4" fill={fill("biceps")} opacity={op("biceps")}/>
      <ellipse cx="35" cy="23" rx="2" ry="4" fill={fill("biceps")} opacity={op("biceps")}/>
      <ellipse cx="7" cy="30" rx="1.5" ry="3" fill={fill("forearms")} opacity={op("forearms")}/>
      <ellipse cx="37" cy="30" rx="1.5" ry="3" fill={fill("forearms")} opacity={op("forearms")}/>
      <ellipse cx="13.5" cy="24" rx="2" ry="5" fill={fill("lats")} opacity={op("lats")}/>
      <ellipse cx="30.5" cy="24" rx="2" ry="5" fill={fill("lats")} opacity={op("lats")}/>
      <path d="M16 13 L22 15.5 L28 13 L28 16 L22 18 L16 16 Z" fill={fill("traps")} opacity={op("traps")}/>
      <rect x="19" y="28" width="6" height="8" rx="2" fill={fill("erectors")} opacity={op("erectors") * 0.6}/>
      <ellipse cx="18" cy="38" rx="3.5" ry="2.5" fill={fill("glutes")} opacity={op("glutes")}/>
      <ellipse cx="26" cy="38" rx="3.5" ry="2.5" fill={fill("glutes")} opacity={op("glutes")}/>
      <ellipse cx="17" cy="45" rx="3" ry="5" fill={fill("quads")} opacity={op("quads")}/>
      <ellipse cx="27" cy="45" rx="3" ry="5" fill={fill("quads")} opacity={op("quads")}/>
      <ellipse cx="17" cy="46" rx="2.5" ry="4.5" fill={fill("hams")} opacity={op("hams") * 0.7}/>
      <ellipse cx="27" cy="46" rx="2.5" ry="4.5" fill={fill("hams")} opacity={op("hams") * 0.7}/>
      <ellipse cx="18" cy="37" rx="3" ry="2" fill={fill("hip")} opacity={op("hip")}/>
      <ellipse cx="26" cy="37" rx="3" ry="2" fill={fill("hip")} opacity={op("hip")}/>
      <ellipse cx="15" cy="54" rx="2" ry="3.5" fill={fill("calves")} opacity={op("calves")}/>
      <ellipse cx="29" cy="54" rx="2" ry="3.5" fill={fill("calves")} opacity={op("calves")}/>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────
const MUSCLE_MAP = {
  nr1: ["quads","glutes","hams","calves"], nr2a: ["quads"], nr2b: ["hams"],
  nr3: ["glutes","hip"], nr4: ["obliques","abs"], nr5: ["obliques","abs"],
  nr6: ["abs"], nr7: ["erectors","glutes"], nr8: ["traps","delts"],
  nr9: ["triceps","chest","delts"], nr10: ["lats","traps","biceps"],
  nr11: ["lats","biceps"], nr12: ["erectors","abs"],
  sz_rot: ["obliques","abs"], trx: ["lats","biceps","abs"],
  sz_huft: ["hip","glutes","hams"], brustpr: ["chest","delts","triceps"],
  bw_pushup: ["chest","triceps","delts"], bw_diamond: ["triceps","chest"],
  bw_wide: ["chest","delts"], bw_crunch: ["abs"], bw_legr: ["abs","hip"],
  bw_plank: ["abs","obliques","delts","erectors"], bw_squat: ["quads","glutes","hams"],
  bw_lunge: ["quads","glutes","hams"], bw_hip: ["hip","glutes"],
  bw_shoulder: ["delts","traps"], bw_spine: ["erectors","abs"],
  bw_stretch: ["quads","hams","hip","erectors","delts","calves"],
};

const BODY_GROUPS = {
  legs: { label: "Legs", color: "#FF6B35" },
  core: { label: "Core", color: "#3B82F6" },
  upper: { label: "Upper Body", color: "#EF4444" },
};

const GYM_EXERCISES = [
  // Legs
  { id: "nr1",  num: "1",  name: "Leg Press",                   planWeight: 35,   group: "legs" },
  { id: "nr2a", num: "2a", name: "Leg Extension",               planWeight: 35,   group: "legs" },
  { id: "nr2b", num: "2b", name: "Leg Curl",                    planWeight: 32.5, group: "legs" },
  { id: "nr3",  num: "3",  name: "Hip Abduction",               planWeight: 35,   group: "legs" },
  { id: "sz_huft", num: "—", name: "Cable Hip Ext. & Flex.",    planWeight: null,  group: "legs" },
  // Core (abs + back + glutes)
  { id: "nr4",  num: "4",  name: "Lateral Flexion / Side Bend", planWeight: 37.5, group: "core" },
  { id: "nr5",  num: "5",  name: "Torso Rotation",              planWeight: 50,   group: "core" },
  { id: "nr6",  num: "6",  name: "Ab Crunch Machine",           planWeight: 45,   group: "core" },
  { id: "nr7",  num: "7",  name: "Back Extension",              planWeight: 22.5, group: "core" },
  { id: "nr8",  num: "8",  name: "Reverse Fly",                 planWeight: 20,   group: "core" },
  { id: "nr10", num: "10", name: "Rowing",                      planWeight: null,  group: "core" },
  { id: "nr11", num: "11", name: "Lat Pulldown",                planWeight: null,  group: "core" },
  { id: "nr12", num: "12", name: "Back Trainer",                planWeight: null,  group: "core" },
  { id: "sz_rot", num: "—", name: "Cable Torso Rotation",       planWeight: null,  group: "core" },
  { id: "trx",    num: "—", name: "TRX Row",                    planWeight: null,  group: "core" },
  // Upper Body
  { id: "nr9",    num: "9",  name: "Tricep Dips",               planWeight: 22,   group: "upper" },
  { id: "brustpr", num: "—", name: "Cable Chest Press",         planWeight: null,  group: "upper" },
];

const BW_EXERCISES = [
  { id: "bw_pushup",   num: "—", name: "Push Ups",           planWeight: null, group: "upper" },
  { id: "bw_diamond",  num: "—", name: "Diamond Push Ups",   planWeight: null, group: "upper" },
  { id: "bw_wide",     num: "—", name: "Wide Push Ups",      planWeight: null, group: "upper" },
  { id: "bw_crunch",   num: "—", name: "Crunches",           planWeight: null, group: "core" },
  { id: "bw_legr",     num: "—", name: "Leg Raises",         planWeight: null, group: "core" },
  { id: "bw_plank",    num: "—", name: "Plank",              planWeight: null, group: "core" },
  { id: "bw_squat",    num: "—", name: "Bodyweight Squats",  planWeight: null, group: "legs" },
  { id: "bw_lunge",    num: "—", name: "Lunges",             planWeight: null, group: "legs" },
  { id: "bw_hip",      num: "—", name: "Hip Mobility",       planWeight: null, group: "legs" },
  { id: "bw_shoulder", num: "—", name: "Shoulder Mobility",  planWeight: null, group: "upper" },
  { id: "bw_spine",    num: "—", name: "Spine Mobility",     planWeight: null, group: "core" },
  { id: "bw_stretch",  num: "—", name: "Full Stretch",       planWeight: null, group: "core" },
];

const INITIAL_HISTORY = {
  nr11: [
    { date: "2026-04-23", weight: 20, sets: 3, reps: 15 },
    { date: "2026-04-29", weight: 20, sets: 3, reps: 15 },
    { date: "2026-05-08", weight: 22, sets: 3, reps: 15 },
    { date: "2026-05-18", weight: 22, sets: 3, reps: 15 },
    { date: "2026-06-09", weight: 22, sets: 3, reps: 15 },
    { date: "2026-06-16", weight: 22, sets: 3, reps: 15 },
    { date: "2026-06-18", weight: 22, sets: 3, reps: 15 },
    { date: "2026-06-22", weight: 22, sets: 3, reps: 15 },
  ],
  nr5: [
    { date: "2026-04-23", weight: 30, sets: 3, reps: 15 },
    { date: "2026-04-29", weight: 30, sets: 3, reps: 15 },
    { date: "2026-05-08", weight: 30, sets: 3, reps: 15 },
    { date: "2026-05-18", weight: 30, sets: 3, reps: 15 },
    { date: "2026-06-03", weight: 35, sets: 3, reps: 15 },
    { date: "2026-06-09", weight: 35, sets: 3, reps: 15 },
    { date: "2026-06-16", weight: 35, sets: 3, reps: 15 },
    { date: "2026-06-18", weight: 35, sets: 3, reps: 15 },
    { date: "2026-06-24", weight: 37.5, sets: 3, reps: 15 },
    { date: "2026-06-29", weight: 45, sets: 3, reps: 15 },
  ],
  nr7: [
    { date: "2026-04-23", weight: 35, sets: 3, reps: 15 },
    { date: "2026-04-29", weight: 35, sets: 3, reps: 15 },
    { date: "2026-05-08", weight: 37.5, sets: 3, reps: 15 },
    { date: "2026-05-18", weight: 42.5, sets: 3, reps: 15 },
    { date: "2026-06-03", weight: 42.5, sets: 3, reps: 15 },
    { date: "2026-06-16", weight: 45, sets: 3, reps: 15 },
    { date: "2026-06-22", weight: 45, sets: 3, reps: 15 },
    { date: "2026-06-29", weight: 45, sets: 3, reps: 15 },
  ],
  nr6: [
    { date: "2026-04-23", weight: 30, sets: 3, reps: 15 },
    { date: "2026-05-08", weight: 35, sets: 3, reps: 15, notes: "30,35,40 per set" },
    { date: "2026-05-18", weight: 37, sets: 3, reps: 15, notes: "35,35,40 per set" },
    { date: "2026-06-16", weight: 45, sets: 3, reps: 15, notes: "40,45,45,50" },
    { date: "2026-06-22", weight: 51, sets: 3, reps: 15, notes: "47.5,47.5,50,55" },
    { date: "2026-06-24", weight: 51, sets: 3, reps: 15, notes: "47.5,50,55" },
    { date: "2026-06-26", weight: 51, sets: 3, reps: 15, notes: "47.5,50,55" },
    { date: "2026-06-29", weight: 51, sets: 3, reps: 15, notes: "47.5,50,55" },
  ],
  nr3: [
    { date: "2026-04-23", weight: 30, sets: 3, reps: 15 },
    { date: "2026-06-03", weight: 30, sets: 3, reps: 15 },
    { date: "2026-06-18", weight: 30, sets: 3, reps: 15 },
    { date: "2026-06-09", weight: 32.5, sets: 3, reps: 15 },
    { date: "2026-06-16", weight: 32.5, sets: 3, reps: 15 },
    { date: "2026-06-29", weight: 30, sets: 3, reps: 15 },
  ],
  nr10: [
    { date: "2026-05-08", weight: 17.5, sets: 3, reps: 15 },
    { date: "2026-06-09", weight: 17.5, sets: 3, reps: 15 },
    { date: "2026-06-16", weight: 17.5, sets: 3, reps: 15 },
    { date: "2026-06-18", weight: 20, sets: 3, reps: 15 },
  ],
  nr4: [
    { date: "2026-05-08", weight: 30, sets: 3, reps: 15 },
    { date: "2026-06-22", weight: 35, sets: 3, reps: 15 },
    { date: "2026-06-29", weight: 35, sets: 3, reps: 15 },
  ],
  nr8: [
    { date: "2026-05-08", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-03", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-09", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-16", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-18", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-22", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-24", weight: 22.5, sets: 3, reps: 15 },
    { date: "2026-06-26", weight: 22.5, sets: 3, reps: 15 },
  ],
  sz_rot: [{ date: "2026-05-08", weight: 22.5, sets: 3, reps: 15, notes: "Carabiners clipped" }],
  trx: [{ date: "2026-05-08", weight: 0, sets: 3, reps: 15, notes: "Bodyweight" }],
  nr12: [
    { date: "2026-06-03", weight: 0, sets: 3, reps: 15, notes: "Level 0, Height 6" },
    { date: "2026-06-18", weight: 5, sets: 3, reps: 15 },
    { date: "2026-06-26", weight: 5, sets: 3, reps: 15 },
  ],
  nr2a: [
    { date: "2026-06-09", weight: 30, sets: 3, reps: 15, notes: "30,30,35 per set" },
    { date: "2026-06-26", weight: 35, sets: 3, reps: 10 },
  ],
  sz_huft: [
    { date: "2026-06-22", weight: 27.5, sets: 3, reps: 15 },
    { date: "2026-06-24", weight: 27.5, sets: 3, reps: 15 },
  ],
  brustpr: [{ date: "2026-06-26", weight: 12.5, sets: 3, reps: 10 }],
};

// ── Helpers ──────────────────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDateFull(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "2-digit" });
}

function Spark({ entries }) {
  if (!entries || entries.length < 2) return null;
  const weights = entries.map(e => e.weight);
  const mn = Math.min(...weights), mx = Math.max(...weights);
  const range = mx - mn || 1;
  const w = 44, h = 16;
  const pts = weights.map((v, i) => `${(i / (weights.length - 1)) * w},${h - 2 - ((v - mn) / range) * (h - 4)}`).join(" ");
  return <svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke="#FF4D1C" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}

// ── Bottom Sheet ─────────────────────────────────────────────────────
function BottomSheet({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, margin: "0 auto", background: "#111", borderRadius: "20px 20px 0 0", padding: "20px 18px 28px", borderTop: "1px solid #222" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#333", margin: "0 auto 16px" }}/>
        {children}
      </div>
    </div>
  );
}

function EntryModal({ entry, isBW, onSave, onClose }) {
  const [weight, setWeight] = useState(String(entry?.weight ?? ""));
  const [sets, setSets] = useState(String(entry?.sets ?? "3"));
  const [reps, setReps] = useState(String(entry?.reps ?? "15"));
  const [duration, setDuration] = useState(String(entry?.duration ?? ""));
  const [date, setDate] = useState(entry?.date ?? today());
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const canSave = isBW ? (reps || duration) : weight;
  const inp = { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#fff", padding: "12px 14px", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" };
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 14 }}>{entry ? "Edit entry" : "New entry"}</div>
      <div style={{ display: "grid", gridTemplateColumns: isBW ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        {!isBW && <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Weight (kg)</label><input style={inp} type="number" step="0.5" value={weight} onChange={e => setWeight(e.target.value)} autoFocus placeholder="kg"/></div>}
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Sets</label><input style={inp} type="number" min="1" value={sets} onChange={e => setSets(e.target.value)} autoFocus={isBW}/></div>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Reps</label><input style={inp} type="number" min="1" value={reps} onChange={e => setReps(e.target.value)}/></div>
      </div>
      {isBW && <div style={{ marginBottom: 10 }}><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Duration (sec)</label><input style={inp} type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 60"/></div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Date</label><input style={inp} type="date" value={date} onChange={e => setDate(e.target.value)} max={today()}/></div>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Notes</label><input style={inp} value={notes} onChange={e => setNotes(e.target.value)} placeholder="optional"/></div>
      </div>
      <button onClick={() => { if (!canSave) return; const e = { date, weight: weight ? parseFloat(weight) : 0, sets: parseInt(sets) || 3, reps: parseInt(reps) || 15, notes: notes.trim() || undefined }; if (duration) e.duration = parseInt(duration); onSave(e); }} disabled={!canSave} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: canSave ? "#FF4D1C" : "#222", color: canSave ? "#fff" : "#555", fontWeight: 700, fontSize: 15, cursor: canSave ? "pointer" : "default" }}>Save</button>
    </BottomSheet>
  );
}

function CardioModal({ entry, onSave, onClose }) {
  const [type, setType] = useState(entry?.type ?? "running");
  const [duration, setDuration] = useState(String(entry?.duration ?? ""));
  const [distance, setDistance] = useState(String(entry?.distance ?? ""));
  const [date, setDate] = useState(entry?.date ?? today());
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const inp = { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#fff", padding: "12px 14px", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" };
  const types = ["running", "cycling", "walking", "swimming", "elliptical", "stairs", "other"];
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 14 }}>{entry ? "Edit cardio" : "Log cardio"}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {types.map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid",
            borderColor: type === t ? "#22C55E" : "#2a2a2a",
            background: type === t ? "#22C55E18" : "#1a1a1a",
            color: type === t ? "#22C55E" : "#666",
            cursor: "pointer", fontSize: 12, fontWeight: 600, textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Duration (min)</label><input style={inp} type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} autoFocus placeholder="min"/></div>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Distance (km)</label><input style={inp} type="number" step="0.1" value={distance} onChange={e => setDistance(e.target.value)} placeholder="km"/></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Date</label><input style={inp} type="date" value={date} onChange={e => setDate(e.target.value)} max={today()}/></div>
        <div><label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Notes</label><input style={inp} value={notes} onChange={e => setNotes(e.target.value)} placeholder="optional"/></div>
      </div>
      <button onClick={() => { if (!duration && !distance) return; onSave({ date, type, duration: duration ? parseInt(duration) : null, distance: distance ? parseFloat(distance) : null, notes: notes.trim() || undefined }); }} disabled={!duration && !distance} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: (duration || distance) ? "#22C55E" : "#222", color: (duration || distance) ? "#fff" : "#555", fontWeight: 700, fontSize: 15, cursor: (duration || distance) ? "pointer" : "default" }}>Save</button>
    </BottomSheet>
  );
}

function ROMModal({ currentROM, onSave, onClose }) {
  const [rom, setROM] = useState(currentROM || "");
  const inp = { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#fff", padding: "12px 14px", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" };
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 6 }}>Range of Motion</div>
      <input style={inp} value={rom} onChange={e => setROM(e.target.value)} placeholder="e.g. Level 3, Full range..." autoFocus/>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {currentROM && <button onClick={() => onSave("")} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #2a2a2a", background: "transparent", color: "#ef4444", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Clear</button>}
        <button onClick={() => onSave(rom)} style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: "#FF4D1C", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Save</button>
      </div>
    </BottomSheet>
  );
}

// ── Detail View ──────────────────────────────────────────────────────
function ExerciseDetail({ exercise, entries, rom, isBW, onAdd, onEdit, onDelete, onBack, onROM }) {
  const sorted = [...(entries || [])].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const first = sorted[0];
  const delta = latest && first ? +(latest.weight - first.weight).toFixed(1) : 0;
  const muscles = MUSCLE_MAP[exercise.id] || [];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#FF4D1C", fontSize: 22, cursor: "pointer", padding: "4px 8px 4px 0", fontWeight: 700 }}>←</button>
        <MuscleIcon groups={muscles} size={32}/>
        <div style={{ flex: 1 }}>
          {exercise.num !== "—" && <div style={{ fontSize: 10, color: "#555", fontWeight: 700, letterSpacing: 1 }}>Nr. {exercise.num}</div>}
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{exercise.name}</div>
        </div>
        {!isBW && <button onClick={onROM} style={{ background: rom ? "#1a1a2a" : "#141414", border: rom ? "1px solid #3B82F633" : "1px solid #222", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 10, fontWeight: 700, color: rom ? "#3B82F6" : "#444" }}>ROM</button>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 12px" }}><MuscleIcon groups={muscles} size={56}/></div>
      {rom && <div style={{ padding: "6px 12px", background: "#0f0f1a", borderRadius: 8, border: "1px solid #1a1a3a", marginBottom: 10, fontSize: 12, color: "#6B7FFF" }}>ROM: {rom}</div>}
      {sorted.length > 0 && (
        <div style={{ display: "flex", gap: 16, padding: "12px 14px", background: "#111", borderRadius: 12, marginBottom: 12, border: "1px solid #1a1a1a" }}>
          {!isBW ? (<>
            <div><div style={{ fontSize: 22, fontWeight: 800, color: "#FF4D1C", fontFamily: "monospace" }}>{latest.weight}<span style={{ fontSize: 12, color: "#666" }}> kg</span></div><div style={{ fontSize: 10, color: "#555" }}>Latest</div></div>
            {exercise.planWeight != null && <div><div style={{ fontSize: 22, fontWeight: 800, color: "#555", fontFamily: "monospace" }}>{exercise.planWeight}<span style={{ fontSize: 12, color: "#444" }}> kg</span></div><div style={{ fontSize: 10, color: "#444" }}>Plan</div></div>}
            {sorted.length >= 2 && <div><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#555" }}>{delta > 0 ? "+" : ""}{delta}</div><div style={{ fontSize: 10, color: "#555" }}>Progress</div></div>}
          </>) : (<>
            <div><div style={{ fontSize: 22, fontWeight: 800, color: "#FF4D1C", fontFamily: "monospace" }}>{latest.reps}</div><div style={{ fontSize: 10, color: "#555" }}>Last reps</div></div>
            {latest.duration && <div><div style={{ fontSize: 22, fontWeight: 800, color: "#14B8A6", fontFamily: "monospace" }}>{latest.duration}s</div><div style={{ fontSize: 10, color: "#555" }}>Duration</div></div>}
          </>)}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>{!isBW && <Spark entries={sorted}/>}</div>
        </div>
      )}
      <button onClick={onAdd} style={{ width: "100%", padding: 13, borderRadius: 12, border: "1px dashed #2a2a2a", background: "transparent", color: "#FF4D1C", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>+ Log entry</button>
      {sorted.length === 0 ? <div style={{ textAlign: "center", color: "#444", fontSize: 13, marginTop: 30 }}>No entries yet.</div> : (
        [...sorted].reverse().map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid #151515" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#aaa" }}>{fmtDateFull(e.date)}</div>
              {e.notes && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{e.notes}</div>}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {!isBW && <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#fff" }}>{e.weight}<span style={{ fontSize: 11, color: "#555" }}> kg</span></span>}
              <span style={{ background: "#1a1a1a", borderRadius: 6, padding: "3px 7px", fontSize: 11, color: "#666" }}>{e.sets}×{e.reps}{e.duration ? ` · ${e.duration}s` : ""}</span>
            </div>
            <button onClick={() => onEdit(e)} style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", padding: "4px" }}>✏️</button>
            <button onClick={() => onDelete(e)} style={{ background: "none", border: "none", color: "#333", fontSize: 14, cursor: "pointer", padding: "2px 4px" }} onMouseEnter={ev => ev.target.style.color = "#ef4444"} onMouseLeave={ev => ev.target.style.color = "#333"}>×</button>
          </div>
        ))
      )}
    </div>
  );
}

// ── Draggable Exercise Row ───────────────────────────────────────────
function ExRow({ ex, history, romData, isBW, reordering, onSelect, onDragStart, onDragOver, onDrop, dragging }) {
  const lw = (() => { const h = history[ex.id]; if (!h || !h.length) return null; return [...h].sort((a, b) => a.date.localeCompare(b.date)).pop().weight; })();
  const lr = (() => { const h = history[ex.id]; if (!h || !h.length) return null; return [...h].sort((a, b) => a.date.localeCompare(b.date)).pop().reps; })();
  const cnt = (history[ex.id] || []).length;
  const sorted = [...(history[ex.id] || [])].sort((a, b) => a.date.localeCompare(b.date));
  const hasROM = !!romData[ex.id];
  const muscles = MUSCLE_MAP[ex.id] || [];

  return (
    <div
      draggable={reordering}
      onDragStart={e => { e.dataTransfer.effectAllowed = "move"; onDragStart(ex.id); }}
      onDragOver={e => { e.preventDefault(); onDragOver(ex.id); }}
      onDrop={e => { e.preventDefault(); onDrop(ex.id); }}
      onClick={() => !reordering && onSelect(ex.id)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
        background: dragging === ex.id ? "#1a1a1a" : "#0f0f0f",
        borderBottom: "1px solid #151515", cursor: reordering ? "grab" : "pointer",
        opacity: dragging === ex.id ? 0.5 : 1,
        transition: "background 0.12s, opacity 0.15s",
      }}
    >
      {reordering && <span style={{ color: "#444", fontSize: 16, cursor: "grab", userSelect: "none", padding: "0 4px" }}>⠿</span>}
      <MuscleIcon groups={muscles} size={28}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 5 }}>
          {ex.name}
          {hasROM && <span style={{ fontSize: 8, color: "#3B82F6", fontWeight: 800 }}>ROM</span>}
        </div>
        <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{cnt > 0 ? `${cnt} sessions` : "No history"}</div>
      </div>
      {!isBW && sorted.length >= 2 && <Spark entries={sorted}/>}
      {!isBW && lw !== null && <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "#fff", minWidth: 40, textAlign: "right" }}>{lw}<span style={{ fontSize: 10, color: "#555" }}> kg</span></div>}
      {isBW && lr !== null && <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "#fff", minWidth: 30, textAlign: "right" }}>{lr}<span style={{ fontSize: 10, color: "#555" }}> reps</span></div>}
      {!reordering && <span style={{ color: "#2a2a2a", fontSize: 16 }}>›</span>}
    </div>
  );
}

// ── Cardio Card ──────────────────────────────────────────────────────
function CardioCard({ entries, onAdd, onDelete }) {
  const sorted = [...(entries || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const totalMin = (entries || []).reduce((s, e) => s + (e.duration || 0), 0);
  const totalKm = (entries || []).reduce((s, e) => s + (e.distance || 0), 0);
  return (
    <div style={{ background: "#0a120a", border: "1px solid #1a2a1a", borderRadius: 14, padding: 14, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🏃</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#22C55E" }}>Cardio</div>
            <div style={{ fontSize: 11, color: "#444" }}>{(entries || []).length} sessions</div>
          </div>
        </div>
        {totalMin > 0 && (
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#22C55E" }}>{totalMin}</div>
              <div style={{ fontSize: 9, color: "#555" }}>min total</div>
            </div>
            {totalKm > 0 && <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#22C55E" }}>{totalKm.toFixed(1)}</div>
              <div style={{ fontSize: 9, color: "#555" }}>km total</div>
            </div>}
          </div>
        )}
      </div>
      <button onClick={onAdd} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px dashed #1a3a1a", background: "transparent", color: "#22C55E", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: sorted.length ? 10 : 0 }}>+ Log cardio</button>
      {sorted.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: "1px solid #151515" }}>
          <span style={{ fontSize: 12, textTransform: "capitalize", color: "#22C55E", fontWeight: 600, minWidth: 60 }}>{e.type}</span>
          <div style={{ flex: 1, fontSize: 12, color: "#888" }}>{fmtDateFull(e.date)}</div>
          <div style={{ display: "flex", gap: 6, fontSize: 12 }}>
            {e.duration && <span style={{ color: "#aaa", fontFamily: "monospace" }}>{e.duration}min</span>}
            {e.distance && <span style={{ color: "#aaa", fontFamily: "monospace" }}>{e.distance}km</span>}
          </div>
          <button onClick={() => onDelete(e)} style={{ background: "none", border: "none", color: "#333", fontSize: 13, cursor: "pointer" }} onMouseEnter={ev => ev.target.style.color = "#ef4444"} onMouseLeave={ev => ev.target.style.color = "#333"}>×</button>
        </div>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("gym");
  const [history, setHistory] = useState({});
  const [romData, setRomData] = useState({});
  const [cardio, setCardio] = useState([]);
  const [exerciseOrder, setExerciseOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [showROM, setShowROM] = useState(false);
  const [showCardio, setShowCardio] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const baseExercises = mode === "gym" ? GYM_EXERCISES : BW_EXERCISES;
  const exercises = exerciseOrder && exerciseOrder[mode]
    ? exerciseOrder[mode].map(id => baseExercises.find(e => e.id === id)).filter(Boolean)
    : baseExercises;

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res?.value) { const d = JSON.parse(res.value); setHistory(d.history || {}); setRomData(d.rom || {}); setCardio(d.cardio || []); }
        else { setHistory(INITIAL_HISTORY); await window.storage.set(STORAGE_KEY, JSON.stringify({ history: INITIAL_HISTORY, rom: {}, cardio: [] })); }
        const ord = await window.storage.get(ORDER_KEY);
        if (ord?.value) setExerciseOrder(JSON.parse(ord.value));
      } catch (_) { setHistory(INITIAL_HISTORY); }
      setLoaded(true);
    })();
  }, []);

  async function persist(h, r, c) { setHistory(h); setRomData(r); setCardio(c); try { await window.storage.set(STORAGE_KEY, JSON.stringify({ history: h, rom: r, cardio: c })); } catch (_) {} }
  async function persistOrder(o) { setExerciseOrder(o); try { await window.storage.set(ORDER_KEY, JSON.stringify(o)); } catch (_) {} }

  function addEntry(id, entry) { persist({ ...history, [id]: [...(history[id] || []), entry] }, romData, cardio); setModal(null); }
  function editEntry(id, old, nw) { const cur = history[id] || []; const idx = cur.findIndex(e => e.date === old.date && e.weight === old.weight && e.sets === old.sets); if (idx >= 0) { const n = [...cur]; n[idx] = nw; persist({ ...history, [id]: n }, romData, cardio); } setModal(null); }
  function deleteEntry(id, entry) { const cur = history[id] || []; const idx = cur.findIndex(e => e.date === entry.date && e.weight === entry.weight && e.sets === entry.sets); if (idx >= 0) { const n = [...cur]; n.splice(idx, 1); persist({ ...history, [id]: n }, romData, cardio); } }
  function saveROM(id, val) { const r = { ...romData }; if (val) r[id] = val; else delete r[id]; persist(history, r, cardio); setShowROM(false); }
  function addCardio(entry) { persist(history, romData, [...cardio, entry]); setShowCardio(false); }
  function deleteCardio(entry) { const idx = cardio.findIndex(e => e.date === entry.date && e.type === entry.type && e.duration === entry.duration); if (idx >= 0) { const n = [...cardio]; n.splice(idx, 1); persist(history, romData, n); } }

  function handleDragStart(id) { setDragging(id); }
  function handleDragOver(id) { setDragOver(id); }
  function handleDrop(targetId) {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const ids = exercises.map(e => e.id);
    const fromIdx = ids.indexOf(dragging);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const newIds = [...ids];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, dragging);
    const newOrder = { ...(exerciseOrder || {}), [mode]: newIds };
    persistOrder(newOrder);
    setDragging(null);
    setDragOver(null);
  }

  if (!loaded) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>Loading…</div>;

  const ex = selected ? [...GYM_EXERCISES, ...BW_EXERCISES].find(e => e.id === selected) : null;
  const isBW = mode === "bw";

  const grouped = {};
  exercises.forEach(e => {
    if (!grouped[e.group]) grouped[e.group] = [];
    grouped[e.group].push(e);
  });
  const groupOrder = reordering ? [null] : ["legs", "core", "upper"];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", padding: "16px 14px 40px", maxWidth: 520, margin: "0 auto" }}>
      {ex ? (
        <>
          <ExerciseDetail exercise={ex} entries={history[ex.id]} rom={romData[ex.id]} isBW={isBW}
            onAdd={() => setModal({ mode: "add" })} onEdit={entry => setModal({ mode: "edit", entry })}
            onDelete={entry => deleteEntry(ex.id, entry)} onBack={() => { setSelected(null); setModal(null); setShowROM(false); }}
            onROM={() => setShowROM(true)}/>
          {modal && <EntryModal entry={modal.mode === "edit" ? modal.entry : null} isBW={isBW}
            onSave={entry => modal.mode === "edit" ? editEntry(ex.id, modal.entry, entry) : addEntry(ex.id, entry)}
            onClose={() => setModal(null)}/>}
          {showROM && <ROMModal currentROM={romData[ex.id]} onSave={val => saveROM(ex.id, val)} onClose={() => setShowROM(false)}/>}
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: 4, background: "#111", borderRadius: 12, padding: 3, marginBottom: 12 }}>
            <button onClick={() => { setMode("gym"); setReordering(false); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: mode === "gym" ? "#FF4D1C" : "transparent", color: mode === "gym" ? "#fff" : "#555", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Gym</button>
            <button onClick={() => { setMode("bw"); setReordering(false); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: mode === "bw" ? "#14B8A6" : "transparent", color: mode === "bw" ? "#fff" : "#555", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Bodyweight</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#555" }}>
              {exercises.length} exercises · {exercises.reduce((s, e) => s + (history[e.id] || []).length, 0)} entries
            </div>
            <button onClick={() => setReordering(!reordering)} style={{
              background: reordering ? "#FF4D1C18" : "transparent",
              border: reordering ? "1px solid #FF4D1C44" : "1px solid #222",
              borderRadius: 8, padding: "5px 10px", cursor: "pointer",
              fontSize: 11, fontWeight: 700, color: reordering ? "#FF4D1C" : "#444",
            }}>{reordering ? "Done" : "Reorder"}</button>
          </div>
          {reordering ? (
            <div>
              {exercises.map(ex => (
                <ExRow key={ex.id} ex={ex} history={history} romData={romData} isBW={isBW}
                  reordering onSelect={setSelected} dragging={dragging}
                  onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}/>
              ))}
            </div>
          ) : (
            groupOrder.map(g => {
              const items = grouped[g];
              if (!items || items.length === 0) return null;
              const cfg = BODY_GROUPS[g];
              return (
                <div key={g} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: cfg?.color || "#555", letterSpacing: 1.5, textTransform: "uppercase", padding: "6px 10px", borderLeft: `3px solid ${cfg?.color || "#333"}`, marginBottom: 4 }}>
                    {cfg?.label || g}
                  </div>
                  {items.map(ex => (
                    <ExRow key={ex.id} ex={ex} history={history} romData={romData} isBW={isBW}
                      reordering={false} onSelect={setSelected} dragging={null}
                      onDragStart={() => {}} onDragOver={() => {}} onDrop={() => {}}/>
                  ))}
                </div>
              );
            })
          )}
          <CardioCard entries={cardio} onAdd={() => setShowCardio(true)} onDelete={deleteCardio}/>
          {showCardio && <CardioModal onSave={addCardio} onClose={() => setShowCardio(false)}/>}
        </>
      )}
    </div>
  );
}
