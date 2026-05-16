import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.94.1/+esm";
const Url = 'https://ycemsaofbiaucrpcxbtf.supabase.co'
const Key_pub = 'sb_publishable_NCaI6_lkuU8Wf3CNTu-BHw_XG7kTBzf'
const supabase = createClient(Url, Key_pub, {auth: {persistSession: true,autoRefreshToken: false, storage: localStorage}});
export default supabase;