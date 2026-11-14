
// =====================================
// HISTORYBOT SUPABASE CONNECTION
// =====================================

const SUPABASE_URL = "https://axldothhxyxcsciyhckz.supabase.co/rest/v1/";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1cBMgR06z2fRiEFgWijd-w_xtlG07_9";

window.historybotSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("HISTORYBOT database connected!");
window.historybotSupabase
    .from("history_articles")
    .select("title, topic")
    .then(function (result) {
        if (result.error) {
            alert("Database error: " + result.error.message);
        } else {
            alert(
                "Articles retrieved: " + result.data.length +
                "\nFirst article: " +
                (result.data[0]?.title || "No articles found")
            );
        }
    });

window.historybotSupabase
    .from("history_articles")
    .select("id")
    .limit(1)
    .then(function ({ data, error }) {

        if (error) {
            alert("Database error: " + error.message);
        } else {
            alert("HISTORYBOT database connected successfully!");
        }

    });