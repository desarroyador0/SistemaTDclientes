import supabase from "./supab_publico.js";
 export default function canal_realtime() {
    const idCliente = localStorage.getItem("id_cliente");

    if (!idCliente) {
      console.warn("No hay id_cliente en localStorage; no se inicializa canal realtime.");
      return null;
    }

    const channel = supabase
      .channel('Recibo_Pedidos_Asingnados')
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
        schema: 'public', 
        table: 'Pedido',
        filter: `ID_Cliente=eq.${idCliente}`
      }, 
      (payload) => {
        console.log('¡Llegó el UPDATE de la base de datos!', payload);
      }
    )
    .subscribe((status) => {
      // Esto te va a ayudar a saber si se conectó bien al websocket
      console.log('Estado de la suscripción:', status); 
    });

  console.log('Canal inicializado:', channel);
 }
