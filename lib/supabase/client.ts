import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

export async function signInWithGoogle() {
  const supabase = createClient();
  if (!supabase) {
    return { error: "SUPABASE_NOT_CONFIGURED" };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  return { data, error };
}
