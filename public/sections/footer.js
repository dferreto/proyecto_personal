class Footer extends HTMLElement{
    constructor(){
        super();
        this.innerHTML=`<div class="">
        <br><hr>
<div class="div_pi">
    <strong>Ubicados: </strong>Costa Rica, Puntarenas.<br/>
    <strong>eMail:    </strong> <a href="mailto:mcgyverweb@gmail.com?subject=Solicito información">mcgyverweb@gmail.com</a><br />
    <strong>Teléfono: </strong>7181-7325
</div>
<div class="div_pc">
    Carrera de Tecnologías de la información<br/>
    Curso de Tecnologías y Sistemas Web 3<br/>
    Desarrollado completamente a mano de expertos
</div>
<div class="redes-containar">
    <ul>
    <li><a href="https://www.facebook.com/" class="facebook"><i class="fa fa-facebook"></i></a></li>
    <li><a href="https://x.com/" class="twitter"><i class="fa-brands fa-x-twitter"></i></a></li>
    <li><a href="https://instagram.com/" class="instagram"><i class="fa fa-instagram"></i></a></li>
    </ul>
</div>
</div>` 
    }     
}

customElements.define('footer-component', Footer);

