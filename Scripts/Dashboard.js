import { logout } from "/Scripts/logout.js";
window.onload = () => {
    if (!localStorage.getItem("id_cliente") || !localStorage.getItem("nombre_cliente")) {
        return window.location.href = "/";
    }
}