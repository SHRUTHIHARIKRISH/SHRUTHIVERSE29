/* ============================================
   AUTH.JS — Supabase + Google OAuth
   ============================================ */

// ===========================================
// CONFIGURATION — Replace with your Supabase credentials
// ===========================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabaseClient = null;

try {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        initAuthListener();
    } else {
        console.log(
            '%c⚡ ShruthiVerse: Supabase not configured. Auth features are disabled.\n' +
            'To enable, replace SUPABASE_URL and SUPABASE_ANON_KEY in js/auth.js',
            'color: #a855f7; font-weight: bold;'
        );
    }
} catch (err) {
    console.warn('Supabase initialization failed:', err);
}

// ===========================================
// AUTH STATE LISTENER
// ===========================================
function initAuthListener() {
    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange((event, session) => {
        updateAuthUI(session?.user || null);
    });

    // Check initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        updateAuthUI(session?.user || null);
    });
}

// ===========================================
// GOOGLE SIGN-IN / SIGN-OUT
// ===========================================
async function handleAuth() {
    if (!supabaseClient) {
        console.log('Supabase not configured. Please add your credentials to js/auth.js');
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        // Sign out
        await supabaseClient.auth.signOut();
        updateAuthUI(null);
    } else {
        // Sign in with Google
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            console.error('Auth error:', error.message);
        }
    }
}

// ===========================================
// UPDATE UI BASED ON AUTH STATE
// ===========================================
function updateAuthUI(user) {
    const authBtn = document.getElementById('authBtn');
    if (!authBtn) return;

    if (user) {
        const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        authBtn.textContent = `Hi, ${displayName}`;
        authBtn.title = 'Click to sign out';
    } else {
        authBtn.textContent = 'Sign In';
        authBtn.title = 'Sign in with Google';
    }
}
