const translations = {
  es: {
    menu_inicio: "Inicio",
    spanish: "Esapñol",
    menu_investigaciones: "Investigaciones",
    menu_consultar_investigaciones: "Consultar investigaciones",
    menu_subir_investigaciones: "Subir investigaciones",
    login: "Iniciar sesión",
    have_account: "¿Tienes una cuenta?",
    signup: "Registrarse",
    profile: "Perfil",
    logout: "Cerrar sesión",
    about_us: "Nosotros",
    full_name: "Nombre Completo",
    email: "Correo electrónico",
    academic_degree: "Selecciona grado académico",
    diploma: "Diplomado",
    bachelor: "Bachiller",
    bachelor_degree: "Licenciatura",
    password: "Contraseña",
    repeat_password: "Repetir Contraseña",
    remember_me: "Recuérdame",
    forgot_password: "¿Olvidaste tu contraseña?",
    dont_have_account: "¿No tienes una cuenta?",
    register: "Registrarse",
    login_title: "Iniciar sesión",
    remember_me_label: "Recuérdame",
    forgot_password_label: "¿Olvidaste tu contraseña?",
    register_link: "Registrarse",
    bio_welcome_message:
      "Bienvenidos a nuestra biblioteca destinada al mundo de la tecnología, una iniciativa educativa impulsada por un equipo dedicado de estudiantes de la Universidad Técnica Nacional: Melanie Rodríguez Jiménez, Dinnier Ferreto Moraga. Unidos por nuestra pasión, hemos creado esta plataforma para ofrecer un acceso interactivo y comprensible al estudio de la informática. Nuestro objetivo es trascender los límites tradicionales del aprendizaje, proporcionando recursos educativos innovadores, herramientas interactivas y contenido actualizado que inspire y eduque a estudiantes, profesionales y entusiastas de la informática por igual.",
    exploring_computing: "Explorando la informática",
    about_us_section: "Nosotros",
  },
  en: {
    spanish: "Spanish",
    menu_inicio: "Home",
    menu_investigaciones: "Research",
    menu_consultar_investigaciones: "Consult research",
    menu_subir_investigaciones: "Upload research",
    login: "Login",
    have_account: "Do you have an account?",
    signup: "Sign Up",
    profile: "Profile",
    logout: "Logout",
    about_us: "About Us",
    full_name: "Full name",
    email: "Email",
    academic_degree: "Select academic degree", 
    diploma: "Diploma",
    bachelor: "Bachelor",
    bachelor_degree: "Bachelor’s degree",
    file_select: "",
    password: "Password",
    repeat_password: "Repeat password",
    remember_me: "Remember me",
    forgot_password: "Forgot your password?",
    dont_have_account: "Don't have an account?",
    register: "Register",
    login_title: "Login",
    remember_me_label: "Remember me",
    forgot_password_label: "Forgot your password?",
    register_link: "Register",
    bio_welcome_message:
      "Welcome to our library dedicated to the world of technology, an educational initiative driven by a dedicated team of students from the Universidad Técnica Nacional: Melanie Rodríguez Jiménez, Dinnier Ferreto Moraga. United by our passion, we have created this platform to offer interactive and understandable access to the study of computing. Our goal is to transcend the traditional limits of learning, providing innovative educational resources, interactive tools, and up-to-date content that inspires and educates students, professionals, and technology enthusiasts alike.",
    exploring_computing: "Exploring computing",
    about_us_section: "About Us",
  },
};

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
                    <li><a class="dropdown-item" href="investigation.html" id="menu_subir_investigaciones">Subir investigaciones</a></li>
                  </ul>
                </li>
              </ul>
              <!-- Login / Sign up / Language -->
              <div id="authButtons" class="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
                <a href="login.html" class="text-white text-decoration-none" id="login">Iniciar sesión</a>
                <a href="signup.html" class="text-white text-decoration-none p-3 py-1 rounded-4 signupButton" id="signup">Registrarse</a>

                <!-- Botón de cambio de idioma con menú desplegable -->
                <div class="dropdown ms-auto"> <!-- Aquí se agrega ms-auto para moverlo a la derecha -->
                  <button class="btn dropdown-toggle p-0 border-0" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img id="languageIcon" src="img/lenguaje/espana.png" alt="Idioma" style="width: 50px; height: 50px;">
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                    <li>
                      <a class="dropdown-item" href="#" onclick="changeLanguage('es')">
                        <img src="img/lenguaje/espana.png" alt="Español" style="width: 20px; height: 20px;"> Español
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" onclick="changeLanguage('en')">
                        <img src="img/lenguaje/reino-unido.png" alt="English" style="width: 20px; height: 20px;"> English
                      </a>
                    </li>
                  </ul>
                </div>

              </div>

              <!-- User Profile Photo and Dropdown -->
              <div class="nav-item dropdown" id="userDropdown" style="display: none;">
                <img id="userPhoto" src="img/logo/perfil.png" alt="User Photo" 
                     style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid white;">
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




    // Llamar a la función para actualizar el idioma almacenado
    this.updateLanguage();
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

    if (savedUserPhotoURL) {
      this.updateUserPhoto(savedUserPhotoURL);
      this.querySelector("#userDropdown").style.display = "flex";
    }

    if (savedUserPhotoURL) {
      const loginLink = this.querySelector("#loginLink");
      const signupLink = this.querySelector("#signupLink");
      if (loginLink) loginLink.style.display = "none";
      if (signupLink) signupLink.style.display = "none";
    }
  }

  updateLanguage() {
    const currentLang = localStorage.getItem("language") || "es";
    const languageIcon = this.querySelector("#languageIcon");

    // Actualizar la bandera
    if (currentLang === "es") {
      languageIcon.src = "img/lenguaje/espana.png";
    } else {
      languageIcon.src = "img/lenguaje/reino-unido.png";
    }

    // Actualizar los textos de la página
    const texts = translations[currentLang];
    for (const key in texts) {
      const element = this.querySelector(`#${key}`);
      if (element) {
        element.textContent = texts[key];
      }
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

// Función global para cambiar el idioma y actualizar la bandera
function changeLanguage(lang) {
  localStorage.setItem("language", lang);
  location.reload();
}

customElements.define("menu-component", Menu);

function updateTranslations() {
  const currentLang = localStorage.getItem("language") || "es";
  const texts = translations[currentLang];

  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (texts[key]) {
      // Actualizar el texto del elemento
      element.textContent = texts[key];
    }
  });

  // Actualizar los placeholders
  document
    .querySelectorAll("[data-translate-placeholder]")
    .forEach((element) => {
      const key = element.getAttribute("data-translate-placeholder");
      if (texts[key]) {
        element.setAttribute("placeholder", texts[key]);
      }
    });
}

// Llamar la función después de cambiar el idioma
document.addEventListener("DOMContentLoaded", updateTranslations);
