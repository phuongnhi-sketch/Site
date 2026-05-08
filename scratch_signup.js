import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signUpUser() {
    console.log("Attempting to sign up testuser@sitemanagement.app...");
    const { data, error } = await supabase.auth.signUp({
        email: 'testuser@sitemanagement.app',
        password: '123456',
        options: {
            data: { username: 'testuser', role: 'MB' }
        }
    });

    if (error) {
        console.error("SignUp Error:", error);
    } else {
        console.log("SignUp Success! User ID:", data.user?.id);
        
        // Let's test sign in immediately
        const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
            email: 'testuser@sitemanagement.app',
            password: '123456'
        });
        if (signError) console.error("SignIn Error:", signError.message);
        else console.log("SignIn Success!");
    }
}

signUpUser();
