/* ============================================================
   portfolio-db.js — Supabase Database Layer
   Works as a drop-in replacement for localStorage.
   Falls back to localStorage if Supabase is not yet configured.
   ============================================================ */

const DB_TABLE   = 'portfolio_config';
const LOCAL_KEY  = 'portfolio_data';
const IS_CONFIGURED = (
  typeof SUPABASE_URL !== 'undefined' &&
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
  typeof SUPABASE_ANON_KEY !== 'undefined' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
);

/* ─── Supabase client (CDN loaded) ─── */
function getClient() {
  if (!IS_CONFIGURED) return null;
  if (window._sbClient) return window._sbClient;
  try {
    window._sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return window._sbClient;
  } catch (e) { return null; }
}

/* ─── READ ─── */
async function dbLoad() {
  const sb = getClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from(DB_TABLE)
        .select('data')
        .eq('id', 1)
        .single();
      if (error) throw error;
      return data?.data || {};
    } catch (e) {
      console.warn('[portfolio-db] Supabase read failed, using localStorage:', e.message);
    }
  }
  // Fallback
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; }
  catch(e) { return {}; }
}

/* ─── WRITE ─── */
async function dbSave(dataObj) {
  // Always mirror to localStorage as a fallback
  localStorage.setItem(LOCAL_KEY, JSON.stringify(dataObj));

  const sb = getClient();
  if (sb) {
    try {
      const { error } = await sb
        .from(DB_TABLE)
        .upsert({ id: 1, data: dataObj, updated_at: new Date().toISOString() });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('[portfolio-db] Supabase write failed:', e.message);
      return false;
    }
  }
  return false; // saved to localStorage only
}

/* ─── MERGE with defaults then save ─── */
async function dbMerge(partialUpdate) {
  const current = await dbLoad();
  const merged  = deepMergeDb(current, partialUpdate);
  await dbSave(merged);
  return merged;
}

function deepMergeDb(target, source) {
  const result = Object.assign({}, target);
  for (const key of Object.keys(source || {})) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMergeDb(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/* Export */
window.portfolioDB = { load: dbLoad, save: dbSave, merge: dbMerge, isCloud: () => IS_CONFIGURED };
