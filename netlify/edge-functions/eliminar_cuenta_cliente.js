import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.94.1/+esm";

const supabaseUrl = 'https://ycemsaofbiaucrpcxbtf.supabase.co';
const supabaseServiceRoleKey = Deno.env.get("SupabaseKey");

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
}

// Admin client con service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});


export default async function eliminar_cuenta_cliente(request) {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Método no permitido" }), {
            status: 405,
            headers: { "content-type": "application/json" },
        });
    }

    const { id_cliente } = await request.json();
    const { error } = await supabase.from("Cliente").delete().eq("ID_Cliente", id_cliente);
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
        });
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(id_cliente);
    if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
    });
};