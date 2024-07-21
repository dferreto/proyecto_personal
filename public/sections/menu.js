class Menu extends HTMLElement{
    constructor(){
        super();
        this.innerHTML=` <nav class="navbar navbar-expand-lg navbar-light fondo-menu fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html">
                <img src="img/logo/logo-oficial.png" alt="" width="65%" class="d-inline-block align-text-top">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="fw-bold collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="index.html">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"  href="allInvestigation.html">Investigaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="investigation.html">Subir investigaciones</a>
                    </li>
                </ul>
                <ul class="nav-item dropdown active posicion-menu">
									<a id="userName" class="nav-link dropdown-toggle invitado" href="#" role="button" data-bs-toggle="dropdown"
									   aria-expanded="false">
										Invitado
									</a>
									<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink_01">
										<li><a class="dropdown-item" href="login.html">Iniciar sesión</a></li>
										<li><a class="dropdown-item" href="#" onclick="salir()">Cerrar sesión</a></li>
									</ul>
								</ul>
                <ul class="navbar-nav">
                <li class="nav-item text-center">
    <img id="userPhoto" src="img/logo/perfil.png" alt="User Photo" 
    style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid black;">
        </li>
            </ul>
            </div>
        </div>
    </nav>`
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

