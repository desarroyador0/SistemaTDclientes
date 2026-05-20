const id_cliente = localStorage.getItem("id_cliente");
const nombre_cliente = localStorage.getItem("nombre_cliente");
const telefono_cliente = localStorage.getItem("telefono_cliente");
const ubicacion_cliente = localStorage.getItem("ubicacion_cliente");
const fecha_union_cliente = localStorage.getItem("fecha_union_cliente");

// Variables globales para almacenar coordenadas
let mapa;
let marcadorRecogida;
let marcadorDestino;
let coordenadasRecogida = null;
let coordenadasDestino = null;

inicializarMapa();

// FUNCION PARA INICIALIZAR EL MAPA
function inicializarMapa() {
    const latitudInicial = 4.7110;
    const longitudInicial = -74.0721;

    mapa = L.map("mapa").setView([latitudInicial, longitudInicial], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(mapa);

    // Crear marcador de recogida en ubicación inicial
    marcadorRecogida = L.marker([latitudInicial, longitudInicial], {
        draggable: true,
        title: "Punto de recogida",
        icon: L.icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        }),
    })
        .addTo(mapa)
        .bindPopup("Punto de recogida");

    coordenadasRecogida = {
        latitud: latitudInicial,
        longitud: longitudInicial,
    };

    // Evento al arrastrar el marcador de recogida
    marcadorRecogida.on("dragend", () => {
        const pos = marcadorRecogida.getLatLng();
        coordenadasRecogida.latitud = pos.lat;
        coordenadasRecogida.longitud = pos.lng;
        actualizarTextoUbicacion();
    });

    // Evento al hacer clic en el mapa para crear marcador de destino
    mapa.on("click", (evento) => {
        if (!marcadorDestino) {
            const lat = evento.latlng.lat;
            const lng = evento.latlng.lng;

            marcadorDestino = L.marker([lat, lng], {
                draggable: true,
                title: "Punto de destino",
                icon: L.icon({
                    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                }),
            })
                .addTo(mapa)
                .bindPopup("Punto de destino");

            coordenadasDestino = {
                latitud: lat,
                longitud: lng,
            };

            // Evento al arrastrar el marcador de destino
            marcadorDestino.on("dragend", () => {
                const pos = marcadorDestino.getLatLng();
                coordenadasDestino.latitud = pos.lat;
                coordenadasDestino.longitud = pos.lng;
                actualizarTextoUbicacion();
            });

            actualizarTextoUbicacion();
        }
    });
}

// FUNCION PARA ACTUALIZAR EL TEXTO DE UBICACION
function actualizarTextoUbicacion() {
    const elemento = document.getElementById("coordenadas_destino");
    if (coordenadasDestino) {
        elemento.textContent = `Destino: ${coordenadasDestino.latitud.toFixed(4)}, ${coordenadasDestino.longitud.toFixed(4)}`;
    } else {
        elemento.textContent = "Toca el mapa para seleccionar destino";
    }
}

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