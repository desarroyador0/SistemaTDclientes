import { logout } from "/Scripts/logout.js";
import canal_realtime from "/Scripts/conexion_realtime.js";
const id_cliente = localStorage.getItem("id_cliente");
const nombre_cliente = localStorage.getItem("nombre_cliente");
const telefono_cliente = localStorage.getItem("telefono_cliente");
const ubicacion_cliente = localStorage.getItem("ubicacion_cliente");
const fecha_union_cliente = localStorage.getItem("fecha_union_cliente");
canal_realtime();


// FUNCION PARA FORMATEAR LA UBICACION EN WKT PARA ENVIAR AL BACKEND - IMPORTANTE
function obtener_ubi(lat, lon) {
    if (lat === undefined || lon === undefined || lat === null || lon === null) {
        throw new Error("No hay una ubicación seleccionada en el mapa.");
    }

    return `SRID=4326;POINT(${lon} ${lat})`;
}

// FUNCION PARA ENVIAR EL PEDIDO AL BACKEND - IMPORTANTE - AÑADIRLE EL MAPA
form_pedido.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const id_cliente = localStorage.getItem("id_cliente");
    const descripcion_pedido = document.getElementById("info_pedido").value;
    const tipo_v = document.getElementById("tipo_vehiculo").value;
    const tipo_paquete = document.getElementById("tipo_paquete").value;

    let ubi_reco_formt;
    let ubi_dest_formt;
    try {
        ubi_reco_formt = obtener_ubi(coordenadasRecogida?.latitud, coordenadasRecogida?.longitud);
        ubi_dest_formt = obtener_ubi(coordenadasDestino?.latitud, coordenadasDestino?.longitud);
    } catch (error) {
        alert(error.message);
        return;
    }

    fetch("/realizar_nuevo_pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_cliente,
            descripcion_pedido,
            tipo_v,
            tipo_paquete,
            ubi_reco_formt,
            ubi_dest_formt
        }),
    });
});

window.onload = async () => {
    if (!id_cliente) {
        window.location.href = "/";
        return;
    }

    inicializarMapa();
};

document.getElementById("boton_deslogueo").addEventListener("click", () => {
    logout();
});