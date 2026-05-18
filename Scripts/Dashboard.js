import { logout } from "/Scripts/logout.js";
import canal_realtime from "/Scripts/conexion_realtime.js";

canal_realtime();

window.onload = () => {
    if (!localStorage.getItem("id_cliente") || !localStorage.getItem("nombre_cliente")) {
        return window.location.href = "/";
    }
}

// Si hay un registro temporal (nuevo usuario), comprobar teléfono y registrar sólo si falta
async function registerPhoneIfMissing(){
    const idTemp = sessionStorage.getItem("id_cliente_temp");
    const nombreTemp = sessionStorage.getItem("nombre_cliente_temp");
    if (!idTemp || !nombreTemp) return; // No hay proceso de registro

    // Si ya existe teléfono en localStorage, no hacemos la petición
    const existingPhone = localStorage.getItem("telefono_cliente");
    if (existingPhone && existingPhone.trim() !== "") {
        // Limpiar temporales y redirigir al inicio
        sessionStorage.removeItem("id_cliente_temp");
        sessionStorage.removeItem("nombre_cliente_temp");
        return window.location.href = "/";
    }

    // Pedir sólo el teléfono al usuario
    let telefono = null;
    while (!telefono) {
        telefono = prompt("Por favor, introduce tu teléfono (solo números):");
        if (telefono === null) {
            // Usuario canceló -> salir sin registrar
            return;
        }
        telefono = telefono.trim();
        if (!/^[0-9+\- ]{6,20}$/.test(telefono)) {
            alert('Número no válido. Introduce al menos 6 caracteres numéricos.');
            telefono = null;
        }
    }

    // Usar ubicación si ya existe, o marcar como 'No especificada' para cumplir con el endpoint
    const ubicacion = localStorage.getItem("ubicacion_cliente") || "No especificada";

    const locationStatus = document.getElementById('locationStatus');
    try{
        const resp = await fetch('/registrar_nuevo_usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_cliente: idTemp,
                nombre_cliente: nombreTemp,
                telefono_cliente: telefono,
                ubicacion_cliente: ubicacion
            })
        });

        const data = await resp.json().catch(()=>({}));
        if (!resp.ok) throw new Error(data.error || 'No se pudo registrar el usuario');

        // Guardar el teléfono y posible ubicación en localStorage
        localStorage.setItem('telefono_cliente', telefono);
        localStorage.setItem('ubicacion_cliente', ubicacion);

        if (locationStatus) locationStatus.textContent = 'Usuario registrado correctamente.';

        sessionStorage.removeItem("id_cliente_temp");
        sessionStorage.removeItem("nombre_cliente_temp");

        window.location.href = "/";
    }catch(err){
        if (locationStatus) locationStatus.textContent = err.message;
        else console.error(err);
    }
}

// Ejecutar al cargar el script
registerPhoneIfMissing();