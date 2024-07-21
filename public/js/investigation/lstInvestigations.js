var db = firebase.apps[0].firestore();
const tabla = document.querySelector('#tablaCateg');
let user = firebase.auth().currentUser;

let esPrimerCarga = true;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Usuario está autenticado, ejecutar la consulta
        cargarCategorias(user);
        esPrimerCarga = false;
    } else {
        if (!esPrimerCarga) {
            // Si no es la primera carga, significa que el usuario cerró sesión
            console.log("Usuario ha cerrado sesión.");
            // Aquí puedes redirigir al usuario a la página de inicio de sesión o manejar este caso como prefieras
        } else {
            esPrimerCarga = false;
        }
    }
});

function cargarCategorias(user) { 
    db.collection("datosInvestigacion")
      .where("userId", "==", user.uid)  // Filtrar por el UID del usuario autenticado
      .get()
      .then(function(query){
          tabla.innerHTML = "";
          var salida = "<table class=\"table table-striped\">" +
                       "    <thead>" +
                       "        <tr>" +
                       "            <td><strong>Titulo de la investigación</strong></td>" +
                       "            <td><strong>Área de interés</strong></td>" +
                       "            <td><strong>Descripción</strong></td>" +
                       "            <td><strong>Imagenes</strong></td>" +
                       "            <td><strong>PDF</strong></td>" +
                       "            <td><strong>Conclusión</strong></td>" +
                       "            <td><strong>Recomendación</strong></td>" +
                       "            <td colspan='2' align='center'><strong>Modificar</strong></td>" +
                       "        </tr>" +
                       "    </thead><tbody>";

          query.forEach(function(doc){
              salida += '<tr>';
              salida += '<td>' + doc.data().titulo + '</td>';
              salida += '<td>' + doc.data().area + '</td>';
              salida += '<td>' + doc.data().descripcion + '</td>';

              // Agregar imágenes
              let imagesHTML = '';
              if (doc.data().urlImages) {
                  doc.data().urlImages.forEach(url => {
                      imagesHTML += '<img src="' + url + '" class="categoria-imagen">';
                  });
              } else {
                  imagesHTML = 'No disponible';
              }
              salida += '<td>' + imagesHTML + '</td>';

              // Agregar PDF
              let pdfHTML = 'No disponible';
              if (doc.data().urlPdf && doc.data().urlPdf.trim() !== "") {
                  pdfHTML = `<a href="${doc.data().urlPdf}" target="_blank">
                                <img src="img/listInvest/pdf.png" alt="PDF" class="categoria-imagen"> 
                                <div>Ver PDF</div>
                             </a>`;
              }
              salida += '<td>' + pdfHTML + '</td>';
              salida += '<td>' + doc.data().conclusion + '</td>';
              salida += '<td>' + doc.data().recomendacion + '</td>';

              // Opciones de editar y borrar
              salida += '<td align="center"><a href="modcateg.html?cod=' + doc.id + '">Editar</a></td>';
              salida += '<td align="center"><a href="borcateg.html?cod=' + doc.id + '">Borrar</a></td>';

             
              salida += '</tr>';
          });

          salida += "</tbody></table>";
          tabla.innerHTML = salida;
      });
    }