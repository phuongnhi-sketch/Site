import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixDB2() {
    // Force Nam to nam@system.com
    await supabase.from('users').update({ email: 'nam@system.com', username: 'nam@system.com' }).eq('id', '1778125103094');
    
    // Force hang to mac15anh02@gmail.com
    await supabase.from('users').update({ email: 'mac15anh02@gmail.com', username: 'mac15anh02@gmail.com' }).eq('id', '708f66f7-7225-4a69-ade1-5d52c282b78f');
    
    console.log("DB Fix 2 Complete.");
}

fixDB2();
