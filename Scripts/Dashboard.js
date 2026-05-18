import { logout } from "/Scripts/logout.js";
import canal_realtime from "/Scripts/conexion_realtime.js";

canal_realtime();

window.onload = () => {
    if (!localStorage.getItem("id_cliente") || !localStorage.getItem("nombre_cliente")) {
        return window.location.href = "/";
    }
}
