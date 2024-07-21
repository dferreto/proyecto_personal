// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtTitulo = document.querySelector('#txtTitulo');
const txtArea = document.querySelector('#txtArea');
const txtDescription = document.querySelector('#txtDescripcion');
const txtUrlImage = document.querySelector('#txtUrlImage');
const txtUrlPdf = document.querySelector('#txtUrlPdf');
const txtConclusion = document.querySelector('#txtConclusion');
const txtRecomendacion = document.querySelector('#txtRecomendacion');
const btnLoad = document.querySelector('#btnLoad');

           

btnLoad.addEventListener('click', function() {
    let archivos = txtUrlImage.files;
    let archivoPdf = txtUrlPdf.files[0];
    let urlsSubidas = [];
    let user = firebase.auth().currentUser;

    if (!user) {
        alert('Usuario no autenticado. Por favor, inicie sesión.');
        return;
    }

    if (!archivoPdf) {
        alert('Debe seleccionar un archivo PDF.');
        return;
    } else if (archivos.length < 4) {
        alert('Debe seleccionar al menos cuatro imágenes.');
        return;
    } else if (archivos.length > 6) {
        alert('No puede seleccionar más de seis imágenes.');
        return;
    }

    let imagenDeSubida = Array.from(archivos).map(archivo => {
        const nomarch = archivo.name;
        const metadata = {
            contentType: archivo.type
        };
        return container.child('images/' + nomarch).put(archivo, metadata)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                urlsSubidas.push(url);
            });
    });

    let pdfSubido = null;
    if (archivoPdf) {
        const nomarchPdf = archivoPdf.name;
        const metadataPdf = {
            contentType: archivoPdf.type
        };
        pdfSubido = container.child('pdfs/' + nomarchPdf).put(archivoPdf, metadataPdf)
            .then(snapshot => snapshot.ref.getDownloadURL());
    }

    Promise.all([...imagenDeSubida, pdfSubido].filter(Boolean)).then(results => {
        const urlPdf = results[results.length - 1];
        db.collection("datosInvestigacion").add({
            "userId": user.uid,
            "titulo": txtTitulo.value,
            "area": txtArea.value,
            "descripcion": txtDescription.value,
            "urlImages": urlsSubidas,
            "urlPdf": urlPdf,
            "conclusion": txtConclusion.value,
            "recomendacion": txtRecomendacion.value
              // Añadir el UID del usuario aquí
            }).then(function(docRef) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'ID del registro: ' + docRef.id,
                    icon: 'success'
                });
                limpiar();
        }).catch(function(FirebaseError) {
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar la información en Firestore: ' + FirebaseError,
                icon: 'error'
            });
        });
    }).catch(function(error) {
        Swal.fire({
            title: 'Error',
            text: 'Error al subir las imágenes o el PDF: ' + error,
            icon: 'error'
        });
    });
});

function limpiar() {
    txtTitulo.value = '';
    txtArea.value = '';
    txtDescription.value = '';
    txtUrlImage.value = '';
    txtUrlPdf.value = ''
    txtConclusion.value = '';
    txtRecomendacion.value = '';
}
