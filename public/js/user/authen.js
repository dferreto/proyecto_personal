// Ejecuta esta función cuando se carga la página para comprobar el estado de autenticación
function comprobarEstadoDeAutenticacion() {
    auth.onAuthStateChanged((user) => {
        const botonIniciarSesion = document.querySelector('.dropdown-item[href="login.html"]');
        if (user) {
            // Usuario logueado: ocultar el botón de iniciar sesión
            if (botonIniciarSesion) botonIniciarSesion.style.display = 'none';
        } else {
            // Usuario no logueado: mostrar el botón de iniciar sesión
            if (botonIniciarSesion) botonIniciarSesion.style.display = 'block';
        }
    });
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', comprobarEstadoDeAutenticacion);
