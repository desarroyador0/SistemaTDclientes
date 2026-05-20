import { logout } from "/Scripts/logout.js";
window.onload = () => {
    const fotoPerfil = document.getElementById('foto_perfil');
    const nombrePerfil = document.getElementById('nombre_perfil');
    const telefonoPerfil = document.getElementById('telefono_perfil');
    const fechaUnionPerfil = document.getElementById('fecha_union_perfil');

    const fotoCliente = localStorage.getItem('foto_cliente') || localStorage.getItem('foto_usuario');
    const nombreCliente = localStorage.getItem('nombre_cliente');
    const telefonoCliente = localStorage.getItem('telefono_cliente');
    const fechaUnionCliente = localStorage.getItem('fecha_union_cliente');

    if (fotoCliente) {
        fotoPerfil.src = fotoCliente;
        fotoPerfil.alt = `Foto de perfil de ${nombreCliente}`;
    } else {
        fotoPerfil.src = 'https://via.placeholder.com/150';
        fotoPerfil.alt = 'Foto de perfil por defecto';
    }

    nombrePerfil.textContent = nombreCliente || 'Nombre no disponible';
    telefonoPerfil.textContent = `Teléfono: ${telefonoCliente || 'No disponible'}`;
    fechaUnionPerfil.textContent = `Fecha de unión: ${fechaUnionCliente ? new Date(fechaUnionCliente).toLocaleDateString() : 'No disponible'}`;
}
document.getElementById("boton_deslogueo").addEventListener("click", () => {
    logout();
});
document.getElementById("boton_eliminar_c").addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta?")) {
        await fetch("/eliminar_cuenta_cliente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cliente: localStorage.getItem('id_cliente') })
        }).then(resp => {
            if (!resp.ok) {
                return resp.json().then(data => { throw new Error(data.error || 'Error al eliminar la cuenta'); });
            }
            else {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
            }
        }).catch(error => {
            alert("Error al eliminar la cuenta: " + error.message);
        });
    }
});
