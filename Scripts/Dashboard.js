import { logout } from "/Scripts/logout.js";
import canal_realtime from "/Scripts/conexion_realtime.js";
const id_cliente = localStorage.getItem("id_cliente");
const nombre_cliente = localStorage.getItem("nombre_cliente");
const telefono_cliente = localStorage.getItem("telefono_cliente");
const ubicacion_cliente = localStorage.getItem("ubicacion_cliente");
const fecha_union_cliente = localStorage.getItem("fecha_union_cliente");
canal_realtime();

let mapa;
let marcador;
let coordenadasSeleccionadas = null;

// FUNCION PARA FORMATEAR LA UBICACION EN WKT PARA ENVIAR AL BACKEND - IMPORTANTE
function obtener_ubi(lat, lon) {
    if (lat === undefined || lon === undefined || lat === null || lon === null) {
        throw new Error("No hay una ubicación seleccionada en el mapa.");
    }

    return `SRID=4326;POINT(${lon} ${lat})`;
}

// FUNCION PARA ACTUALIZAR LOS CAMPOS DE LATITUD Y LONGITUD EN EL FORMULARIO CUANDO SE MARCA UN DESTINO EN EL MAPA
function actualizarDestino(latitud, longitud) {
    const latitudRedondeada = latitud.toFixed(6);
    const longitudRedondeada = longitud.toFixed(6);

    coordenadasSeleccionadas = { latitud, longitud };

    latitud_destino.value = latitudRedondeada;
    longitud_destino.value = longitudRedondeada;
    texto_ubicacion.textContent = "Destino marcado en el mapa.";
    coordenadas_destino.textContent = `Lat: ${latitudRedondeada}, Lng: ${longitudRedondeada}`;
}

// FUNCION PARA COLOCAR UN MARCADOR EN EL MAPA CUANDO EL USUARIO HAGA CLICK O CUANDO SE OBTENGA SU UBICACION ACTUAL
function colocarMarcador(latitud, longitud) {
    const coordenadas = [latitud, longitud];

    if (marcador) {
        marcador.setLatLng(coordenadas);
        return;
    }

    marcador = L.marker(coordenadas, { draggable: true }).addTo(mapa);
    marcador.on("dragend", (evento) => {
        const posicion = evento.target.getLatLng();
        actualizarDestino(posicion.lat, posicion.lng);
    });
}

// FUNCION PARA INICIALIZAR EL MAPA Y CONFIGURAR LOS EVENTOS DE CLICK Y GEOLOCALIZACION
function inicializarMapa() {
    const contenedorMapa = document.getElementById("mapa");

    if (!contenedorMapa || typeof L === "undefined") {
        return;
    }

    mapa = L.map("mapa").setView([4.7110, -74.0721], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa);

    mapa.on("click", (evento) => {
        const { lat, lng } = evento.latlng;
        colocarMarcador(lat, lng);
        actualizarDestino(lat, lng);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;

                mapa.setView([latitud, longitud], 15);
                colocarMarcador(latitud, longitud);
                actualizarDestino(latitud, longitud);
            },
            () => {
                texto_ubicacion.textContent = "Toca el mapa para marcar el destino.";
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }
}

// FUNCION PARA ENVIAR EL PEDIDO AL BACKEND - IMPORTANTE
form_pedido.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const id_cliente = localStorage.getItem("id_cliente");
    const descripcion_pedido = document.getElementById("info_pedido").value;
    const tipo_v = document.getElementById("tipo_vehiculo").value;
    const tipo_paquete = document.getElementById("tipo_paquete").value;

    let ubi_formt;
    try {
        ubi_formt = obtener_ubi(coordenadasSeleccionadas?.latitud, coordenadasSeleccionadas?.longitud);
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
            ubi_formt,
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