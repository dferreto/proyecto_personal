let inactivityTimeout;

const logout = () => {
  // Aquí iría el código para cerrar sesión
  console.log("Sesión cerrada por inactividad.");
  // Ejemplo: localStorage.removeItem('userPhotoURL');
  // Redirigir al usuario a la página de login
  window.location.href = '/login'; // Cambia la URL a la que se redirige el usuario al cerrar sesión
};

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(logout, 10 * 60 * 1000); // 10 minutos en milisegundos
};

// Escucha de eventos de actividad del usuario
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);

// Manteniendo tu funcionalidad original
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('menu-component');
  if (menu) {
    menu.updateState();
  }

  const userPhotoURL = localStorage.getItem('userPhotoURL');
  if (menu && userPhotoURL) {
    menu.updateUserPhoto(userPhotoURL);
  }

  // Inicia el temporizador de inactividad
  resetInactivityTimer();
});
