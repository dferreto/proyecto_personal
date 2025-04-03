class Menu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div class="container">
          <!-- Logo -->
          <a class="navbar-brand fs-4" href="index.html">
            <img src="img/logo/logo.png" alt="" width="100px" height="100px" class="d-inline-block align-text-top logo">
          </a>
          <!-- Toggle Btn -->
          <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- SideBar -->
          <div class="sidebar offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <!-- SideBar Header -->
            <div class="offcanvas-header text-white border-bottom">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel" id="repositorio">Repositorio de Costa Rica</h5>
              <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <!-- SideBar Body-->
            <div class="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
              <ul class="navbar-nav justify-content-center fs-5 flex-grow-1 pe-3">
                <li class="nav-item mx-2">
                  <a class="nav-link active" aria-current="page" href="index.html" id="menu_inicio">Inicio</a>
                </li>
                <li class="nav-item dropdown mx-2">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" id="menu_investigaciones">Investigaciones</a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="allInvestigation.html" id="menu_consultar_investigaciones">Consultar investigaciones</a></li>
                    <li><a class="dropdown-item" href="investigation.html" id="menu_subir_investigaciones">Mis investigaciones</a></li>
                  </ul>
                </li>
              </ul>
              <!-- Login / Sign up -->
        <div id="authButtons" class="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
  <!-- Botón Iniciar Sesión -->
  <a href="login.html" 
     class="btn btn-outline-light rounded-pill px-4 py-2 shadow-sm transition-all hover:shadow-lg hover:bg-white hover:text-dark border-2 border-white text-decoration-none" 
     id="login">Iniciar sesión</a>
  
  <!-- Botón Registrarse (contraste) -->
  <a href="signup.html" 
     class="custom-signup-button text-decoration-none" 
     id="signup">Registrarse</a>
</div>

              <!-- User Profile Photo and Dropdown -->
              <div class="nav-item dropdown" id="userDropdown" style="display: none; margin-right: 30px;">
                <img id="userPhoto" src="img/logo/perfil.png" alt="User Photo" 
     style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid white; margin-right: 10px;">

                <button class="btn btn-white dropdown-toggle" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                  <li><a class="dropdown-item" href="profile.html" id="profile">Perfil</a></li>
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
    const userPhotoElement = this.querySelector("#userPhoto");
    if (userPhotoElement) {
      userPhotoElement.src = url;
      userPhotoElement.hidden = false;
      userPhotoElement.style.display = "inline-block";
    }
  }

  updateState() {
    const savedUserPhotoURL = localStorage.getItem("userPhotoURL");
    const savedUserName = localStorage.getItem("userName");
  
    // Verificar si el usuario está logueado
    if (savedUserPhotoURL && savedUserName) {
      this.updateUserPhoto(savedUserPhotoURL);
      this.querySelector("#userDropdown").style.display = "flex";
  
      // Ocultar los enlaces de inicio de sesión y registro
      const loginLink = this.querySelector("#login");
      const signupLink = this.querySelector("#signup");
      if (loginLink) loginLink.style.display = "none";
      if (signupLink) signupLink.style.display = "none";
    } else {
      // Mostrar los enlaces de inicio de sesión y registro si no hay usuario logueado
      const loginLink = this.querySelector("#login");
      const signupLink = this.querySelector("#signup");
      if (loginLink) loginLink.style.display = "inline-block";
      if (signupLink) signupLink.style.display = "inline-block";
  
      // Ocultar el perfil del usuario
      this.querySelector("#userDropdown").style.display = "none";
    }
  }
  

  connectedCallback() {
    this.updateState();
    this.querySelector("#logout").addEventListener("click", this.logout);
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("userPhotoURL");
        localStorage.removeItem("userName");
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }
}


customElements.define("menu-component", Menu);
