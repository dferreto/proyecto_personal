var db = firebase.apps[0].firestore();
const tabla = document.querySelector("#tablaCateg");
let user = firebase.auth().currentUser;
let esPrimerCarga = true;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
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

function cargarCategorias(user) {
  db.collection("datosInvestigacion")
    .get()
    .then(function (query) {
      tabla.innerHTML = ""; // Limpiar el contenedor
      query.forEach(function (doc) {
        const isVisible = doc.data().visible; // Estado de visibilidad
        const cardClass = ''; // No ocultar cards aquí

        const truncateText = (text, maxLength) => {
          if (!text) return 'No disponible';
          return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
        };
        const descripcionResumida = truncateText(doc.data().descripcion, 50);
        const recomendacionResumida = truncateText(doc.data().recomendacion, 50);

        const card = `
        <div class="card ${cardClass}" id="card-${doc.id}">
          <div class="card-body">
            <h5 class="card-title">${doc.data().titulo}</h5>
            <p class="card-text"><strong>Área:</strong> ${doc.data().area}</p>
            <p class="card-text"><strong>Descripción:</strong> ${descripcionResumida}</p>
            <p class="card-text"><strong>Imágenes:</strong> 
              ${doc.data().urlImages ? `<button class="btn btn-success btn-sm view-images-btn" onclick="openImageModal('${doc.id}')"><i class="fas fa-images"></i></button>` : 'No disponible'}
            </p>
            <p class="card-text"><strong>Documento:</strong> 
              ${doc.data().urlArchivo && doc.data().urlArchivo.trim() !== "" 
                ? `<a href="${doc.data().urlArchivo}" download><button class="btn btn-success btn-sm"><i class="fas fa-download"></i> Obtener</button></a>`
                : 'No disponible'}
            </p>
            <p class="card-text"><strong>Recomendación:</strong> ${recomendacionResumida}</p>
            <p class="card-text"><strong>Visibilidad:</strong> 
              <label class="visibility-label ${isVisible ? 'private' : ''}" onclick="toggleVisibility(event, '${doc.id}')">
                <i class="fas fa-eye ${isVisible ? 'hidden' : ''}" style="color: blue;"></i>
                <i class="fas fa-eye-slash ${isVisible ? '' : 'hidden'}" style="color: red;"></i>
              </label>
            </p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn-primary" data-id="${doc.id}" onclick="showInvestigation(this)">Mostrar</button>
              <button class="btn btn-outline-success btn-sm" onclick="openEditModal('${doc.id}')">Editar</button>
              <button class="btn btn-outline-danger btn-sm" onclick="deleteInvestigacion('${doc.id}')">Borrar</button>
            </div>
          </div>
        </div>
    `;
        tabla.innerHTML += card;
      });
    });
}

// Función para abrir el modal de imágenes
function openImageModal(docId) {
  db.collection("datosInvestigacion")
    .doc(docId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const images = data.urlImages || [];
        if (images.length === 0) {
          alert("No hay imágenes disponibles.");
          return;
        }

        // Creación de los elementos del carrusel
        const carouselItems = images
          .map(
            (url, index) => `  
              <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${url}" class="d-block w-100 modal-image-content" alt="Imagen de investigación">
              </div>`
          )
          .join("");

        // Contenido del modal con el carrusel
        document.getElementById("modalContent").innerHTML = ` 
          <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">${carouselItems}</div>
            <a class="carousel-control-prev" href="#imageCarousel" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </a>
            <a class="carousel-control-next" href="#imageCarousel" role="button" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </a>
          </div>`;
        
        // Abrir el modal utilizando Bootstrap
        const modalElement = new bootstrap.Modal(document.getElementById('modal'));
        modalElement.show();
      }
    })
    .catch((error) => {
      console.error("Error al cargar imágenes: ", error);
    });
}



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
          cargarCategorias(firebase.auth().currentUser);
        })
        .catch((error) => {
          Swal.fire("Error", "No se pudo eliminar.", "error");
        });
    }
  });
}

function toggleVisibility(event, docId) {
  const label = event.target.closest('.visibility-label'); // Contenedor del ícono
  const isCurrentlyVisible = label.classList.contains('private'); // Estado actual (invertido)
  const newVisibility = !isCurrentlyVisible; // Invertir el estado

  // Alternar la clase 'private' para cambiar el ícono
  label.classList.toggle('private');

  // Actualizar los íconos directamente en el DOM
  const eyeIcon = label.querySelector('.fa-eye');
  const eyeSlashIcon = label.querySelector('.fa-eye-slash');
  if (eyeIcon && eyeSlashIcon) {
    eyeIcon.classList.toggle('hidden', newVisibility); // Mostrar/ocultar fa-eye
    eyeSlashIcon.classList.toggle('hidden', !newVisibility); // Mostrar/ocultar fa-eye-slash
  }

  // Actualizar el estado de visibilidad en Firestore
  db.collection("datosInvestigacion")
    .doc(docId)
    .update({ visible: newVisibility })
    .then(() => {
      console.log("Visibilidad actualizada correctamente.");
    })
    .catch((error) => {
      console.error("Error al actualizar la visibilidad: ", error);
    });
}


function openEditModal(docId) {
  db.collection("datosInvestigacion")
    .doc(docId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("editTitulo").value = data.titulo || "";
        document.getElementById("editArea").value = data.area || "";
        document.getElementById("editDescripcion").value = data.descripcion || "";
        document.getElementById("editRecomendacion").value = data.recomendacion || "";
        document.getElementById("editForm").dataset.docId = doc.id;
        
        // Usamos la funcionalidad de Bootstrap para abrir el modal
        const modal = new bootstrap.Modal(document.getElementById("editModal"));
        modal.show();
      }
    })
    .catch((error) => {
      console.error("Error al cargar los datos para editar:", error);
    });
}

document.getElementById("editForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  const titulo = document.getElementById("editTitulo").value.trim();
  const area = document.getElementById("editArea").value.trim();
  const descripcion = document.getElementById("editDescripcion").value.trim();
  const recomendacion = document.getElementById("editRecomendacion").value.trim();
  const archivo = document.getElementById("editArchivo").files[0];
  const imageFiles = Array.from(document.getElementById("editImages").files);
  const docId = this.dataset.docId;

  try {
    const updatedData = { titulo, area, descripcion, recomendacion };
    if (archivo) {
      const archivoUrl = await uploadFile(archivo, "archivos");
      updatedData.urlArchivo = archivoUrl;
    }
    if (imageFiles.length > 0) {
      const imageUrls = await Promise.all(imageFiles.map((file) => uploadFile(file, "images")));
      updatedData.urlImages = imageUrls;
    }
    await db.collection("datosInvestigacion").doc(docId).update(updatedData);
    Swal.fire("¡Actualizado!", "Los cambios han sido guardados correctamente.", "success");
    closeEditModal();
    cargarCategorias(firebase.auth().currentUser);
  } catch (error) {
    console.error("Error al actualizar los datos:", error);
    Swal.fire("Error", "No se pudo actualizar: " + error.message, "error");
  }
});

async function uploadFile(file, folderPath) {
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(`${folderPath}/${file.name}`);
  await fileRef.put(file);
  return fileRef.getDownloadURL();
}

function closeEditModal() {
  const modalElement = document.getElementById("editModal");
  const modal = bootstrap.Modal.getInstance(modalElement); // ✅ esta es la clave
  if (modal) modal.hide(); // Solo si existe la instancia activa

  const form = document.getElementById("editForm");
  form.reset(); // Restablecer el formulario
  form.dataset.docId = ""; // Limpiar el docId
}


// Evento para cerrar el modal al hacer clic en la "X"
document.getElementById("closeEditModal").addEventListener("click", () => {
  closeEditModal();
});

// Evento para el botón de cancelar en el modal de edición
document.getElementById("cancelEdit").addEventListener("click", () => {
  closeEditModal();
});


// Eventos para cerrar modales
document.getElementById("closeModal").addEventListener("click", closeModal);

window.addEventListener("click", function(event) {
  const modal = document.getElementById("modal"); // Modal de imágenes
  const editModal = document.getElementById("editModal"); // Modal de edición
  if (event.target === modal) {
    closeModal(); // Cerrar el modal de imágenes
  }
  if (event.target === editModal) {
    closeEditModal(); // Cerrar el modal de edición
  }
});

document.getElementById("closeModal").addEventListener("click", function() {
  document.getElementById("modal").style.display = "none"; // Ocultar modal al hacer clic en la "X"
});

document.addEventListener("DOMContentLoaded", () => {
  const editModalEl = document.getElementById('editModal');

  if (editModalEl) {
    editModalEl.addEventListener('hidden.bs.modal', () => {
      console.log('Modal de edición cerrado');
    });
  }
});


function descargarArchivo(nombre, url) {
  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        throw new Error("No se pudo descargar el archivo.");
      }
      return resp.blob();
    })
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch(err => {
      console.error("Error al descargar:", err);
      Swal.fire("Error", "No se pudo descargar el archivo.", "error");
    });
}

function getExtensionFromUrl(url) {
  const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
  return match ? match[1] : "file";
}


function showInvestigation(button) {
  // Obtener el ID de la investigación desde el atributo data-id del botón
  var idInvestigacion = button.getAttribute('data-id');
  
  // Construir la URL de la página de comentarios, añadiendo el ID de la investigación
  var urlComment = 'commentInvestigation.html?id=' + idInvestigacion;
  
  // Redirigir a la página correspondiente
  window.location.href = urlComment;
}

