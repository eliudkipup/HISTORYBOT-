
// =====================================
// HISTORYBOT SUPABASE CONNECTION
// =====================================

const SUPABASE_URL = "https://axldothhxyxcsciyhckz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1cBMgR06z2fRiEFgWijd-w_xtlG07_9";

// Connect HISTORYBOT to Supabase
window.historybotSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("HISTORYBOT database connection initialized!");
