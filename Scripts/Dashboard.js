import { logout } from "/Scripts/logout.js";
import canal_realtime from "/Scripts/conexion_realtime.js";
const id_cliente = localStorage.getItem("id_cliente");
const nombre_cliente = localStorage.getItem("nombre_cliente");
const telefono_cliente = localStorage.getItem("telefono_cliente");
const ubicacion_cliente = localStorage.getItem("ubicacion_cliente");
const fecha_union_cliente = localStorage.getItem("fecha_union_cliente");

canal_realtime();

window.onload = async () => {
    if (!id_cliente){window.location.href = "/"; return;}
}