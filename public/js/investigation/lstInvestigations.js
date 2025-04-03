// Referencia a Firestore
var db = firebase.apps[0].firestore();
const tabla = document.querySelector("#tablaCateg");
let user = firebase.auth().currentUser;

let esPrimerCarga = true;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // Usuario está autenticado, ejecutar la consulta
    cargarCategorias(user);
    esPrimerCarga = false;
  } else {
    if (!esPrimerCarga) {
      console.log("Usuario ha cerrado sesión.");
    } else {
      esPrimerCarga = false;
    }
  }
});

// Función para cargar las categorías e investigaciones
function cargarCategorias(user) {
  db.collection("datosInvestigacion")
    .where("userId", "==", user.uid)
    .get()
    .then((querySnapshot) => {
      // Limpiar contenido anterior
      tabla.innerHTML = "";

      // Nueva tabla con diseño mejorado
      const tableHTML = `
        <div class="table-responsive table-container">
          <table class="table table-hover table-bordered shadow-sm">
            <thead class="table-dark text-center">
              <tr>
                <th>Título</th>
                <th>Área</th>
                <th>Descripción</th>
                <th>Imágenes</th>
                <th>PDF</th>
                <th>Conclusión</th>
                <th>Recomendación</th>
                <th>Visibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      `;
      tabla.innerHTML = tableHTML;

      // Obtener el cuerpo de la tabla
      const tbody = document.querySelector('#tablaCateg tbody');

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const isPrivate = data.visible; // Si visible es true, la investigación es privada
        const rowClass = isPrivate ? 'hidden' : ''; // Clase para ocultar la fila si está privada

        const row = `
          <tr id="row-${doc.id}" class="${rowClass}">
            <td data-label="Título">${data.titulo}</td>
            <td data-label="Área">${data.area}</td>
            <td data-label="Descripción">${data.descripcion}</td>
            <td data-label="Imágenes">
              ${
                data.urlImages
                  ? `<button class="btn btn-warning view-images-btn" data-doc-id="${doc.id}"> <i class="fas fa-images"></i></button>`
                  : 'No disponible'
              }
            </td>
            <td data-label="PDF">
              ${
                data.urlPdf && data.urlPdf.trim() !== ""
                  ? `<a href="${data.urlPdf}" target="_blank"><button class="btn btn-warning">Ver PDF</button></a>`
                  : 'No disponible'
              }
            </td>
            <td data-label="Conclusión">${data.conclusion}</td>
            <td data-label="Recomendación">${data.recomendacion}</td>
            <td data-label="Estado">
              <label class="visibility-label ${isPrivate ? 'private' : ''}" data-doc-id="${doc.id}">
                <i class="fas fa-eye ${isPrivate ? 'hidden' : ''}"></i>
                <i class="fas fa-eye-slash ${isPrivate ? '' : 'hidden'}"></i>
              </label>
            </td>
            <td data-label="Acciones">
              <button class="btn btn-outline-success edit-btn" data-doc-id="${doc.id}">Editar</button>
              <button class="btn btn-outline-danger delete-btn" data-doc-id="${doc.id}">Borrar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });

      // Delegación de eventos para botones dinámicos
      tbody.addEventListener('click', handleTableActions);
    })
    .catch((error) => {
      console.error("Error al cargar las categorías: ", error);
    });
}

// Manejador de acciones en la tabla
function handleTableActions(event) {
  const target = event.target;

  // Abrir modal de imágenes
  if (target.classList.contains('view-images-btn')) {
    const docId = target.dataset.docId;
    openImageModal(docId);
  }

  // Cambiar visibilidad
  if (target.closest('.visibility-label')) {
    const label = target.closest('.visibility-label');
    const docId = label.dataset.docId;
    toggleVisibility(label, docId);
  }

  // Eliminar investigación
  if (target.classList.contains('delete-btn')) {
    const docId = target.dataset.docId;
    deleteInvestigacion(docId);
  }

  // Editar investigación (puedes implementar esta función según tus necesidades)
  if (target.classList.contains('edit-btn')) {
    const docId = target.dataset.docId;
    console.log(`Editar investigación con ID: ${docId}`);
  }
}

// Función para abrir el modal de imágenes
function openImageModal(docId) {
  db.collection("datosInvestigacion")
    .doc(docId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const images = doc.data().urlImages || [];

        if (images.length === 0) {
          alert("No hay imágenes disponibles.");
          return;
        }

        // Generar carrusel de imágenes
        const carouselItems = images
          .map(
            (url, index) => `
              <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${url}" class="d-block w-100 modal-image-content">
              </div>
            `
          )
          .join("");

        // Inyectar HTML en el modal
        document.getElementById("modalContent").innerHTML = `
          <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">${carouselItems}</div>
            <a class="carousel-control-prev" href="#imageCarousel" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </a>
            <a class="carousel-control-next" href="#imageCarousel" role="button" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </a>
          </div>
        `;

        // Mostrar modal
        document.getElementById("modal").style.display = "flex";
      }
    })
    .catch((error) => {
      console.error("Error al cargar imágenes: ", error);
    });
}

// Función para cerrar el modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Cerrar el modal si se hace clic fuera de la imagen
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
};

// Función para eliminar una investigación
function deleteInvestigacion(docId) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará la investigación de forma permanente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection("datosInvestigacion")
        .doc(docId)
        .delete()
        .then(() => {
          Swal.fire("Eliminado", "La investigación ha sido eliminada.", "success");
          document.getElementById(`row-${docId}`).remove(); // Eliminar la fila directamente
        })
        .catch((error) => {
          Swal.fire("Error", "No se pudo eliminar.", "error");
        });
    }
  });
}

// Función para cambiar la visibilidad
function toggleVisibility(label, docId) {
  const isCurrentlyVisible = label.classList.contains('private'); // Si tiene la clase 'private', está privado
  const newVisibility = !isCurrentlyVisible; // Cambiar el estado

  // Actualizar la base de datos
  db.collection("datosInvestigacion")
    .doc(docId)
    .update({ visible: newVisibility })
    .then(() => {
      // Actualizar solo la fila afectada
      label.classList.toggle('private');
      label.querySelector('.fa-eye').classList.toggle('hidden');
      label.querySelector('.fa-eye-slash').classList.toggle('hidden');
    })
    .catch((error) => {
      console.error("Error al actualizar la visibilidad: ", error);
    });
}