document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('menu-component');
    if (menu) {
      menu.updateState();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('menu-component');
    const userPhotoURL = localStorage.getItem('userPhotoURL');
    if (menu && userPhotoURL) {
        // Llama a la función updateUserPhoto en tu menú para actualizar la imagen
        menu.updateUserPhoto(userPhotoURL);
    }
});
  