// Shared Supabase client for all Belhssan tools.
// Phase 2: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel env vars,
// then import { supabase } from '@shared/supabaseClient' in any app.
// One Supabase project serves all tools; tables are prefixed by tool name.

let supabase = null

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (url && key) {
  // Dynamically import to avoid bundling the SDK when not configured.
  // Apps that need Supabase must add @supabase/supabase-js to their package.json.
  import('@supabase/supabase-js').then(({ createClient }) => {
    supabase = createClient(url, key)
  })
}

export { supabase }
export const hasSupabase = !!(url && key)
