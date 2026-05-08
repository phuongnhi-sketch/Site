import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log("Testing login with admin@system.com / 123456");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@system.com',
        password: '123456'
    });
    
    if (error) {
        console.error("Login failed:", error.message);
    } else {
        console.log("Login successful! User ID:", data.user.id);
    }
}

test();
