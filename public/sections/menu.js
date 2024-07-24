class Menu extends HTMLElement{
    constructor(){
        super();
        this.innerHTML=`
<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
  <div class="container">
    <a class="navbar-brand fs-4" href="index.html">
    <img src="img/logo/logo.png" alt="" width="70px" height="70px" class="d-inline-block align-text-top logo">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-center flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Inicio</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Investigaciones
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Consultar investigaciones</a></li>
            <li><a class="dropdown-item" href="#">Subir investigaciones</a></li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item dropdown me-3">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Invitado
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Iniciar sesión</a></li>
            <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <img id="userPhoto" src="img/logo/perfil.png" alt="User Photo" 
               style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid black;">
        </li>
      </ul>
      </div>
    </div>
  </div>
</nav>

 <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="index.html">
      <img src="img/logo/logo2.jpeg" alt="" width="70px" height="70px" class="d-inline-block align-text-top logo">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Inicio</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Investigación
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Consultar investigaciones</a></li>
            <li><a class="dropdown-item" href="#">Subir investigaciones</a></li>
          </ul>
        </li>
      </ul>

      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item dropdown me-3">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Invitado
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Iniciar sesión</a></li>
            <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <img id="userPhoto" src="img/logo/perfil.png" alt="User Photo" 
               style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid black;">
        </li>
      </ul>
    </div>
  </div>
</nav>

 `

 

    
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
        const savedUserName = localStorage.getItem('userName'); // Agregado para recuperar el nombre del usuario
        
        if (savedUserPhotoURL) {
            this.updateUserPhoto(savedUserPhotoURL);
        }
        if (savedUserName) { // Verifica si existe un nombre de usuario guardado y lo actualiza
            this.updateUserName(savedUserName);
        }
    }
    // connectedCallback se llama cuando el elemento se conecta al DOM
    connectedCallback() {
        this.updateState();
    }

    updateUserName(name) {
        const userNameElement = this.querySelector('#userName');
        if (userNameElement) {
            userNameElement.textContent = name;
        }
    }

    connectedCallback() {
        this.updateState();
    }
}




customElements.define('menu-component', Menu);

