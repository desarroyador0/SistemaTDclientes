import supabase from "./supab_publico.js";
const channel = supabase
  .channel('Recibo_Pedidos_Asingnados')
  .on(
    'postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'Pedido',
      filter: ''  //aca poner el filtro para que solo se suscriba a pedidos asignados al cliente logueado
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