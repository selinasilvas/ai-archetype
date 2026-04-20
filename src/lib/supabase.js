import { createClient } from '@supabase/supabase-js'

// ─── SETUP INSTRUCTIONS ───
// 1. Create a free Supabase project at https://supabase.com
// 2. Go to Settings > API and copy your URL and anon key
// 3. Replace the placeholders below
// 4. Run the SQL in supabase-schema.sql in the SQL editor

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

const isConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ─── ANALYTICS FUNCTIONS ───

export async function trackQuizResult({ archetype, runnerUp, dimensions }) {
  if (!supabase) {
    console.log('[Analytics] Supabase not configured. Result:', archetype)
    return
  }
  try {
    const { error } = await supabase.from('quiz_results').insert({
      archetype,
      runner_up: runnerUp,
      dim_depth: dimensions.depth,
      dim_breadth: dimensions.breadth,
      dim_mode: dimensions.mode,
      dim_relationship: dimensions.relationship,
      dim_trust: dimensions.trust,
      created_at: new Date().toISOString()
    })
    if (error) console.error('[Analytics] Insert error:', error)
  } catch (e) {
    console.error('[Analytics] Track error:', e)
  }
}

export async function trackMeetResult({ profile, runnerUp }) {
  if (!supabase) {
    console.log('[Analytics] Supabase not configured. Profile:', profile)
    return
  }
  try {
    const { error } = await supabase.from('meet_results').insert({
      profile,
      runner_up: runnerUp,
      created_at: new Date().toISOString()
    })
    if (error) console.error('[Analytics] Insert error:', error)
  } catch (e) {
    console.error('[Analytics] Track error:', e)
  }
}

export async function getArchetypeDistribution() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('archetype')
    if (error) return null
    const counts = {}
    let total = 0
    data.forEach(r => {
      counts[r.archetype] = (counts[r.archetype] || 0) + 1
      total++
    })
    // Convert to percentages
    const distribution = {}
    Object.keys(counts).forEach(k => {
      distribution[k] = Math.round((counts[k] / total) * 100)
    })
    return { distribution, total }
  } catch (e) {
    return null
  }
}
