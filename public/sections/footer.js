class Footer extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
<footer class="bg-dark text-light py-4 mt-auto fondo-footer pie">
  <div class="container">
    <div class="row text-center text-md-left">
      <div class="col-md-4 mb-3 div_pi">
        <h5 class="text-left">Contactos</h5>
        <p class="text-left">
          <strong>Costa Rica, Puntarenas.</strong><br/>
          <strong>Email:</strong> <a href="mailto:ferretomoraga22@outlook.com?subject=Solicito información" class="text-light">ferretomoraga22@outlook.com</a><br />
          <strong>Teléfono:</strong> 7181-7325
        </p>
      </div>
      <div class="col-md-4 mb-3 div_pc">
        <h5>Información</h5>
        <p>
       
          Desarrollado completamente a mano por expertos en<br/>
             Tecnologías de la Información
        </p>
      </div>
      <div class="col-md-4 mb-3 text-center redes-containar">
        <h5>Redes Sociales</h5>
        <ul class="list-unstyled d-flex justify-content-center">
          <li class="me-3">
            <a href="https://www.facebook.com/dinier.ferreto" class="facebook" aria-label="Facebook"><i class="fa fa-facebook"></i></a>
          </li>
          <li class="me-3">
            <a href="https://www.linkedin.com/in/dinier-ferreto-5a979027a/" class="linkedin" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
          </li>
          <li>
            <a href="https://www.instagram.com/dinno_30/" class="instagram" aria-label="Instagram"><i class="fa fa-instagram"></i></a>
          </li>
        </ul>
      </div>
    </div>
    <hr class="my-4">
    <div class="text-center">
      <p class="mb-0">&copy; 2024 LaToñita. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>

`;
    }
}

customElements.define('footer-component', Footer);