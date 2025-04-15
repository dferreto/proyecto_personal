
document.getElementById("addInvestForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Mostrar el spinner
  toggleSpinner(true);

  try {
    // Obtener los datos del formulario
    const titulo = document.getElementById("newTitulo").value.trim();
    const area = document.getElementById("newArea").value.trim();
    const descripcion = document.getElementById("newDescripcion").value.trim();
    const recomendacion = document.getElementById("newRecomendacion").value.trim();
    const archivoFile = document.getElementById("newUrlArchivo").files[0];
    const imageFiles = Array.from(document.getElementById("newUrlImage").files);

    // Validar tipo de archivo
    const tiposPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];

    if (archivoFile && !tiposPermitidos.includes(archivoFile.type)) {
      Swal.fire({
        title: "Archivo no válido",
        text: "El archivo debe ser PDF, Word o TXT.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      toggleSpinner(false); // Ocultar spinner en caso de error
      return;
    }

    // Guardar en Firebase
    const newData = {
      titulo,
      area,
      descripcion,
      recomendacion,
      userId: firebase.auth().currentUser.uid, // Guardar el ID del usuario
      visible: true, // Por defecto, visible
    };

    // Crear una alerta con barra de carga
    let swalInstance;
    if (archivoFile || imageFiles.length > 0) {
      swalInstance = Swal.fire({
        title: "Cargando...",
        html: `
          <div class="custom-progress-container">
            <div id="swalProgressBar" class="custom-progress-bar"></div>
          </div>
          <p class="mt-3 custom-loading-text">Subiendo archivos...</p>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          const progressBar = document.querySelector("#swalProgressBar");
          if (progressBar) {
            progressBar.style.width = "0%";
          }
        },
      });
    }

    if (archivoFile) {
      const archivoUrl = await uploadFileWithProgress(archivoFile, "archivos", swalInstance);
      newData.urlArchivo = archivoUrl;
    }

    if (imageFiles.length > 0) {
      const imageUrls = await Promise.all(
        imageFiles.map(file => uploadFileWithProgress(file, "images", swalInstance))
      );
      newData.urlImages = imageUrls;
    }

    // Guardar los datos en Firestore
    await db.collection("datosInvestigacion").add(newData);

    // Cerrar la barra de carga y mostrar mensaje de éxito
    if (swalInstance) {
      swalInstance.close();
    }
    Swal.fire("¡Agregado!", "La investigación se ha agregado correctamente.", "success");

    // Cerrar el modal y limpiar el formulario
    closeAddInvestModal();

    // Recargar las categorías
    cargarCategorias(firebase.auth().currentUser);
  } catch (error) {
    console.error("Error al agregar investigación: ", error);
    Swal.fire("Error", "No se pudo agregar la investigación. Intenta de nuevo.", "error");
  } finally {
    // Ocultar el spinner al finalizar
    toggleSpinner(false);
  }
});

// Función para subir archivos con barra de progreso
async function uploadFileWithProgress(file, folderPath, swalInstance) {
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(`${folderPath}/${file.name}`);
  const uploadTask = fileRef.put(file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (swalInstance) {
          const progressBar = document.querySelector("#swalProgressBar");
          if (progressBar) {
            progressBar.style.width = `${progress}%`;
          }
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url);
        });
      }
    );
  });
}

// Función para cerrar el modal de agregar investigación
function closeAddInvestModal() {
  const modalElement = document.getElementById("addInvestModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide(); // Cerrar el modal

  // Limpiar el formulario
  const form = document.getElementById("addInvestForm");
  form.reset();
}

function toggleSpinner(show = true) {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.classList.toggle("d-none", !show);
  }
}