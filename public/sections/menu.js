class Menu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div class="container">
          <!-- Logo -->
          <a class="navbar-brand fs-4" href="index.html">
            <img src="img/logo/logo.png" alt="" width="70px" height="70px" class="d-inline-block align-text-top logo">
          </a>
          <!-- Toggle Btn -->
          <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- SideBar -->
          <div class="sidebar offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <!-- SideBar Header -->
            <div class="offcanvas-header text-white border-bottom">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Repositorio de Costa Rica</h5>
              <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <!-- SideBar Body-->
            <div class="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
              <ul class="navbar-nav justify-content-center fs-5 flex-grow-1 pe-3">
                <li class="nav-item mx-2">
                  <a class="nav-link active" aria-current="page" href="index.html">Inicio</a>
                </li>
                <li class="nav-item dropdown mx-2">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Investigaciones
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="allInvestigation.html">Consultar investigaciones</a></li>
                    <li><a class="dropdown-item" href="investigation.html">Subir investigaciones</a></li>
                  </ul>
                </li>
              </ul>
              <!-- Login / Sign up-->
              <div id="authButtons" class="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
                <a id="loginLink" href="login.html" class="text-white text-decoration-none">Login</a>
                <a id="signupLink" href="signup.html" class="text-white text-decoration-none p-3 py-1 rounded-4 signupButton">Sign Up</a>
              </div>
              <!-- User Profile Photo and Dropdown -->
              <div class="nav-item dropdown" id="userDropdown" style="display: none;">
                <img id="userPhoto" src="img/logo/perfil.png" alt="User Photo" 
                     style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid white;">
                <button class="btn btn-white dropdown-toggle" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></button>
                 <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
    <li><a class="dropdown-item" href="profile.html">Perfil</a></li>
    <li><a class="dropdown-item" href="#" id="logout">Cerrar sesión</a></li>
  </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  updateUserPhoto(url) {
    const userPhotoElement = this.querySelector('#userPhoto');
    if (userPhotoElement) {
      userPhotoElement.src = url;
      userPhotoElement.hidden = false; // Asegúrate de mostrar la imagen
      // Asegúrate de que el estilo display sea el apropiado para tu diseño
      userPhotoElement.style.display = 'inline-block';
    }
  }

  updateState() {
    const savedUserPhotoURL = localStorage.getItem('userPhotoURL');

    if (savedUserPhotoURL) {
      this.updateUserPhoto(savedUserPhotoURL);
      this.querySelector('#userDropdown').style.display = 'flex';
    }

    // Ocultar login y signup si el usuario está autenticado
    if (savedUserPhotoURL) {
      const loginLink = this.querySelector('#loginLink');
      const signupLink = this.querySelector('#signupLink');
      if (loginLink) loginLink.style.display = 'none';
      if (signupLink) signupLink.style.display = 'none';
    }
  }

  // connectedCallback se llama cuando el elemento se conecta al DOM
  connectedCallback() {
    this.updateState();
    this.querySelector('#logout').addEventListener('click', this.logout);
    
    const userMenuButton = this.querySelector('#userMenuButton');
  if (userMenuButton) {
    userMenuButton.style.color = 'white';
    userMenuButton.style.border = 'none'; 
  }
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // Limpiar datos del usuario almacenados localmente
      localStorage.removeItem('userPhotoURL');
      localStorage.removeItem('userName');
      // Redireccionar a la página de inicio de sesión
      window.location.href = 'login.html';
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  
}

customElements.define('menu-component', Menu);
