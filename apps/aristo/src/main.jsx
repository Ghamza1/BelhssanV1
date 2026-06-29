import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const SB_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const HAS_SB = !!(SB_URL && SB_KEY)
const sbH = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

window.sbAristo = {
  async get(personId) {
    if (!HAS_SB) return null
    try {
      const r = await fetch(`${SB_URL}/rest/v1/aristo_history?id=eq.${encodeURIComponent(personId)}&select=*`, { headers: sbH })
      if (!r.ok) return null
      const rows = await r.json()
      return rows[0] || null
    } catch { return null }
  },
  async upsert(personId, history, rom) {
    if (!HAS_SB) return
    try {
      await fetch(`${SB_URL}/rest/v1/aristo_history`, {
        method: 'POST',
        headers: { ...sbH, Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({ id: personId, history, rom, updated_at: new Date().toISOString() })
      })
    } catch {}
  }
}

window.storage = {
  async get(key) {
    const val = localStorage.getItem(key);
    return val ? { key, value: val } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App/></React.StrictMode>
)
