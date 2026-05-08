import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("Checking sites...");
    const { data: sites } = await supabase.from('sites').select('id, owner_id, name');
    console.log(sites);
    
    console.log("Checking users...");
    const { data: users } = await supabase.from('users').select('id, username, email');
    console.log(users);
}
check();
