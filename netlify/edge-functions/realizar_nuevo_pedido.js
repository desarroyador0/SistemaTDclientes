import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.94.1/+esm";

const supabaseUrl = 'https://ycemsaofbiaucrpcxbtf.supabase.co';
const supabaseServiceRoleKey = Deno.env.get("SupabaseKey");

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export default async function realizar_nuevo_pedido(request) {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Método no permitido" }), {
            status: 405,
            headers: { "content-type": "application/json" },
        });
    }
    const { id_cliente, descripcion_pedido, tipo_v, tipo_paquete, ubi_formt} = await request.json();

    const { error } = await supabase.from("Pedido").insert([
        {
            ID_Cliente: id_cliente,
            Info_Pedido: descripcion_pedido,
            Tipo_v_solicitado: tipo_v,
            Tipo_paquete: tipo_paquete,
            Ubi_Destino: ubi_formt
        }
    ]);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
    });
};