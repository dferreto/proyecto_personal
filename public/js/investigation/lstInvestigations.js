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
        } else {
            esPrimerCarga = false;
        }
    }
});

// Función para cargar las categorías e investigaciones
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
                       "            <td><strong>Imágenes</strong></td>" +
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

              // Agregar un botón de texto o enlace para abrir el modal
              let imagesHTML = '';
              if (doc.data().urlImages) {
                  imagesHTML = '<button class="btn btn-warning view-images-btn" onclick="openImageModal(\'' + doc.id + '\')">Ver imágenes</button>';
              } else {
                  imagesHTML = 'No disponible';
              }
              salida += '<td>' + imagesHTML + '</td>';

              // Agregar PDF
              let pdfHTML = 'No disponible';
              if (doc.data().urlPdf && doc.data().urlPdf.trim() !== "") {
                  pdfHTML = `<a href="${doc.data().urlPdf}"> 
                                <button class="btn btn-warning view-images-btn">Ver PDF</button>
                             </a>`;
              }
              salida += '<td>' + pdfHTML + '</td>';
              salida += '<td>' + doc.data().conclusion + '</td>';
              salida += '<td>' + doc.data().recomendacion + '</td>';

              // Opciones de editar y borrar
              salida += `<td align="center"><button class="btn btn-outline-success">Editar</button></td>`;
              salida += `<td align="center"><button class="btn btn-outline-danger" onclick="deleteInvestigacion('${doc.id}')">Borrar</button></td>`;
              

              salida += '</tr>';
          });

          salida += "</tbody></table>";
          tabla.innerHTML = salida;
      });
}


// Función para abrir la modal y mostrar las imágenes
function openImageModal(docId) {
    // Obtener los datos de la investigación (como la URL de las imágenes) a partir del docId
    db.collection("datosInvestigacion").doc(docId).get().then(function(doc) {
        if (doc.exists) {
            const data = doc.data();
            const images = data.urlImages || [];

            // Obtener el contenedor para las imágenes
            const modalContent = document.getElementById("modalContent");

            // Limpiar el contenido del modal antes de agregar nuevas imágenes
            modalContent.innerHTML = '';

            // Agregar las imágenes al modal
            images.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.classList.add('modal-image-content');
                modalContent.appendChild(img);
            });

            // Mostrar el modal
            const modal = document.getElementById("modal");
            modal.style.display = "flex";
        }
    });
}

// Función para cerrar la modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de la imagen
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Cerrar la modal al hacer clic en la X
document.getElementById('closeModal').onclick = function() {
    closeModal();
}

// Función para eliminar la investigación de Firestore
function deleteInvestigacion(docId) {
    // Confirmación antes de eliminar
    if (confirm("¿Estás seguro de que deseas eliminar esta investigación?")) {
        db.collection("datosInvestigacion").doc(docId).delete()
          .then(function() {
              alert("Investigación eliminada con éxito.");
              cargarCategorias(firebase.auth().currentUser);  // Recargar la tabla después de eliminar
          })
          .catch(function(error) {
              console.error("Error al eliminar el documento: ", error);
              alert("Hubo un error al eliminar la investigación.");
          });
    }
}
