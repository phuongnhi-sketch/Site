import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixDB() {
    console.log("Fetching users...");
    const { data: users } = await supabase.from('users').select('*');
    
    for (let u of users) {
        let finalEmail = u.email;
        if (!finalEmail || finalEmail.trim() === '') {
            finalEmail = u.username.toLowerCase() + '@system.com';
        }
        
        let finalUsername = finalEmail; // Gộp cột username thành email
        
        console.log(`Updating ${u.username} -> email: ${finalEmail}, username: ${finalUsername}`);
        
        const { error } = await supabase.from('users').update({
            email: finalEmail,
            username: finalUsername
        }).eq('id', u.id);
        
        if (error) {
            console.error("Error updating:", error);
        }
    }
    
    console.log("Deleting duplicated obsolete accounts if any...");
    // The previous API calls created duplicate user records in public.users if they didn't match the old ID.
    // Let's delete the ones that are NOT the original IDs (we know original IDs from check_db.js)
    const originalIds = ['admin-01', '1778124095396', '1778125103094', '1778125121312', '1778125196187', '1778143100815', '708f66f7-7225-4a69-ade1-5d52c282b78f'];
    for (let u of users) {
        if (!originalIds.includes(u.id)) {
            console.log("Deleting duplicate/obsolete id:", u.id);
            await supabase.from('users').delete().eq('id', u.id);
        }
    }
    
    console.log("DB Fix Complete.");
}

fixDB();
