// InvestigationDetails.js
document.addEventListener("DOMContentLoaded", function () {
  const idInvestigacion = obtenerIdDesdeURL();
  if (idInvestigacion) {
    cargarDetallesInvestigacion(idInvestigacion);
  } else {
    document.getElementById("detalleInvestigacion").innerHTML =
      "<p>No se ha proporcionado ID de investigación.</p>";
  }
});

function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // Esto obtiene el ID de la URL.
}

function cargarDetallesInvestigacion(id) {
  const detallesContainer = document.getElementById("detalleInvestigacion");
  var db = firebase.firestore(); // Asegúrate de que firebase está inicializado antes de este script

  db.collection("datosInvestigacion")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const datosInvestigacion = doc.data();
        if (datosInvestigacion.userId) {
          // Ahora buscamos los datos del usuario asociado con la investigación
          db.collection("datosUsuarios")
            .where("idemp", "==", datosInvestigacion.userId)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const datosUsuario = querySnapshot.docs[0].data();
                detallesContainer.innerHTML = construirDetallesInvestigacion(
                  datosInvestigacion,
                  datosUsuario.gradoAcademico,
                  datosUsuario.email,
                  datosUsuario.usuario
                );
              } else {
                detallesContainer.innerHTML =
                  "<p>Detalles del usuario no encontrados para la investigación con ID: " +
                  id +
                  ".</p>";
              }
            })
            .catch((error) => {
              console.error("Error al obtener detalles del usuario: ", error);
              detallesContainer.innerHTML =
                "<p>Error al cargar los detalles del usuario.</p>";
            });
        } else {
          detallesContainer.innerHTML =
            "<p>La investigación no tiene un userId asociado.</p>";
        }
      } else {
        detallesContainer.innerHTML = "<p>Investigación no encontrada.</p>";
      }
    })
    .catch((error) => {
      console.error("Error al obtener detalles de la investigación: ", error);
      detallesContainer.innerHTML =
        "<p>Error al cargar los detalles de la investigación.</p>";
    });
}

function construirDetallesInvestigacion(
  datosInvestigacion,
  gradoAcademico,
  email,
  usuario
) {

  let imagenesHTML = '<div class="contenedor-imagenes">';
  datosInvestigacion.urlImages.forEach((url, index) => {
    // Alternar la clase para la alineación izquierda/derecha basada en el índice
    let claseAlineacion = index % 2 === 0 ? 'imagen-izquierda' : 'imagen-derecha';
    imagenesHTML += `
      <div class="${claseAlineacion}">
        <img src="${url}" class="imagen-investigacion" alt="Imagen de investigación">
      </div>`;
  });
  imagenesHTML += '</div>';

  let urlPdf = datosInvestigacion.urlPdf;

  // Ahora construimos el elemento de imagen que también es un enlace de descarga
  let pdfDownloadHTML = urlPdf ? 
    `<a href="${urlPdf}" download>
       <img src="img/listInvest/pdf.png" alt="Descargar PDF" class="categoria-imagen">
     </a>` : '<p>No hay PDF disponible para descargar.</p>';


  return `
  <div class="container-fluid mt-4">
  <div class="row">
    <div class="col-12 text-center"> <!-- Agrega una columna que ocupe todo el ancho y centra el texto -->
      <h2>${datosInvestigacion.titulo}</h2>
      <h4>${usuario}</h4>
    </div>
    
</div>
      <style>
        /* IZQUIERDA */
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateX(-50px); /* La tarjeta comienza 50px a la izquierda de su posición final */
        }
          to { opacity: 1; }
          transform: translateX(0);
        }
        .fade-in-card {
          animation: fadeIn 1s ease-in-out;
        }


         /* DERECHA*/
         @keyframes fadeInRight {
          from { 
            opacity: 0; 
            transform: translateX(100px); /* La tarjeta comienza 50px a la izquierda de su posición final */
        }
          to { opacity: 1; }
          transform: translateX(0);
        }
        .fade-in-cardRight {
          animation: fadeInRight 1s ease-in-out;
        }

        /* CENTRO */
        @keyframes fadeInMiddle {
          from { 
            opacity: 0; 
            transform: scale(0.10); /* La tarjeta comienza 50px a la izquierda de su posición final */
        }
          to { opacity: 1; }
          transform: scale(0);
        }
        .fade-in-cardMiddle {
          animation: fadeInMiddle 1s ease-in-out;
        }
      </style>
      <div class="container-fluid mt-4">
      <div class="row">
        <!-- DISCIPLINA Column -->
        <div class="col-md-3 d-flex flex-column fade-in-card ">
          <div class="card shadow">
            <div class="card-header alert-link ">INFORMACIÓN GENERAL</div>
            <div class="card-body">
              <p>Área de interés: ${datosInvestigacion.area}</p>
              <p>Grado académico: ${
                gradoAcademico || "Información no disponible"
              }</p>
            </div>
          </div>
          <div class="card flex mt-4 shadow fade-in-card">
          <div class="card-header alert-link">INVESTIGACIÓN</div>
          <div class="card-body">
            ${pdfDownloadHTML} <!-- Elemento de imagen como enlace de descarga aquí -->
            <!-- Más contenido puede ser agregado aquí -->
            </div>
          </div>
          <div class="card flex-fill mt-4 shadow fade-in-card">
              <div class="card-header alert-link">DESCRIPCIÓN</div>
              <div class="card-body">
              <p>${datosInvestigacion.descripcion}</p>
                
              </div>
          </div>
          <div class="card flex mt-4 shadow fade-in-card">
              <div class="card-header alert-link">INFORMACIÓN DE CONTACTO:</div>
              <div class="card-body">
              <p>Email: ${email || "Información no disponible"}</p>
              </div>
          </div>
        </div>
        
        <!-- MAIN CONTENT Middle Column, ajustado a col-md-6 para totalizar 12 columnas en la fila -->
        <div class="col-md-6 d-flex-fill flex-column fade-in-cardMiddle">
          <!-- Existing Card -->
          <div class="card mb-3 shadow">
            ${imagenesHTML}
          </div>
        </div>
        
        <!-- Right Column, ajustado a col-md-3 para igualar al de la DISCIPLINA Column -->
<div class="col-md-3">
<div class="d-flex flex-column h-100 fade-in-cardRight">
<!-- CONCLUSIÓN Card -->
<div class="card shadow mb-2 flex-fill"> <!-- mb-2 para un pequeño margen entre los cards -->
  <div class="card-header alert-link">CONCLUSIÓN:
  </div>
  <div class="card-body">
  <p> ${datosInvestigacion.conclusion}</p>
  </div>
</div>
<!-- RECOMENDACIÓN Card -->
<div class="card shadow flex-fill mt-3 fade-in-cardRight">
  <div class="card-header alert-link">RECOMENDACIÓN:</div>
  <div class="card-body">
  <p> ${datosInvestigacion.recomendacion}</p>
  </div>
</div>
</div>
</div>

        
      </div>
    </div>
  `;
}
