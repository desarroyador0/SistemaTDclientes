import supabase from "./supab_publico";

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("Error al cerrar sesión: " + error.message);
    } else {
        localStorage.removeItem("supabase.auth.token");
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/"; 
    }
}
document.querySelector("button[aria-label='Desloguear']").addEventListener("click", async () => {
    await logout();
});