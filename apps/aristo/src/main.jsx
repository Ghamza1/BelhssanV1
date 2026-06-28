import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const SB_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const HAS_SB = !!(SB_URL && SB_KEY)
const sbH = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }
const GYM_KEY = 'gym-history-v3'

async function sbGetAristo() {
  if (!HAS_SB) return null
  try {
    const r = await fetch(`${SB_URL}/rest/v1/aristo_history?id=eq.default&select=*`, { headers: sbH })
    if (!r.ok) return null
    const rows = await r.json()
    return rows[0] || null
  } catch { return null }
}

async function sbUpsertAristo(history, rom) {
  if (!HAS_SB) return
  try {
    await fetch(`${SB_URL}/rest/v1/aristo_history`, {
      method: 'POST',
      headers: { ...sbH, Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ id: 'default', history, rom, updated_at: new Date().toISOString() })
    })
  } catch {}
}

window.storage = {
  async get(key) {
    const val = localStorage.getItem(key);
    return val ? { key, value: val } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    if (key === GYM_KEY) {
      try {
        const parsed = JSON.parse(value)
        sbUpsertAristo(parsed.history || {}, parsed.rom || {})
      } catch {}
    }
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
  async list(prefix) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!prefix || k.startsWith(prefix)) keys.push(k);
    }
    return { keys };
  }
};

// On startup: fetch remote and seed local if remote is newer
async function initSync() {
  if (!HAS_SB) return
  const remote = await sbGetAristo()
  const localRaw = localStorage.getItem(GYM_KEY)
  if (!remote) {
    // Remote has no data yet — push local up
    if (localRaw) {
      try {
        const local = JSON.parse(localRaw)
        sbUpsertAristo(local.history || {}, local.rom || {})
      } catch {}
    }
    return
  }
  if (!localRaw) {
    localStorage.setItem(GYM_KEY, JSON.stringify({ history: remote.history, rom: remote.rom }))
    return
  }
  // If remote is newer, overwrite local
  try {
    // We don't store updatedAt locally so just check if remote has more data
    // Use remote if local is missing keys that remote has
    const local = JSON.parse(localRaw)
    const localKeys = Object.keys(local.history || {}).length
    const remoteKeys = Object.keys(remote.history || {}).length
    if (remoteKeys > localKeys) {
      localStorage.setItem(GYM_KEY, JSON.stringify({ history: remote.history, rom: remote.rom }))
    }
  } catch {
    localStorage.setItem(GYM_KEY, JSON.stringify({ history: remote.history, rom: remote.rom }))
  }
}

initSync().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><App/></React.StrictMode>
  )
})
