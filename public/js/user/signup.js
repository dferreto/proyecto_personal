// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();
var container = firebase.apps[0].storage().ref();

// create local from webpage inputs
const txtNombre = document.querySelector('#txtNombre');
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const txtUrlPhoto = document.querySelector('#txtUrlPhoto');
const txtGradoAcademico = document.querySelector('#txtGradoAcademico');
const txtDescripcion = document.querySelector('#txtDescripcion');

// create local insert button
const btnInsUser = document.querySelector('#btnInsUser');

// assign button listener
btnInsUser.addEventListener('click', function () {
    const archivo = txtUrlPhoto.files[0];
    const nomarch = archivo.name;
    if (archivo == null) {
        alert('Debe seleccionar una imagen');
    } else {
        const metadata = {
            contentType: archivo.type
        };
        const subir = container.child('userPhotos/' + nomarch).put(archivo, metadata);
        subir.then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                // Crear usuario con email y contraseña
                auth.createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        // Guardar datos del usuario en Firestore
                        db.collection("datosUsuarios").add({
                            "idemp": user.uid,
                            "usuario": txtNombre.value,
                            "email": user.email,
                            "gradoAcademico": txtGradoAcademico.value,
                            "descripcion": txtDescripcion.value,
                            "urlPhoto": url
                        }).then(function (docRef) {
                            Swal.fire({
                                title: '¡Registro Completo!',
                                text: 'ID del registro: ' + docRef.id,
                                icon: 'success',
                                confirmButtonText: 'Ok'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    limpiar();
                                    window.location.href = 'login.html';
                                }
                            });
                        }).catch(function (FirebaseError) {
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al guardar los datos del usuario: ' + FirebaseError,
                                icon: 'error'
                            });
                        });
                    }).catch((error) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al crear el nuevo usuario:  ' + error.message,
                            icon: 'error'
                        });
                    });
            }).catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al subir la imagen: ' + error.message,
                    icon: 'error'
                });
            });
    }
});

function limpiar() {
    txtNombre.value= '';
    txtEmail.value= '';
    txtContra.value= '';
    txtGradoAcademico.value = '';
    txtDescripcion.value = '';
    txtUrlPhoto.value = '';
}
