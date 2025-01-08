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
const txtVerification = document.querySelector('#txtVerification')

// create local insert button
const btnInsUser = document.querySelector('#btnInsUser');

// List of allowed email domains
const allowedDomains = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'protonmail.com',
    'icloud.com',
    'est.utn.ac.cr'
];

// Function to validate email domain
function isValidEmailDomain(email) {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
}

function isValidPassword(password) {
    const passwordReq = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return passwordReq.test(password)
}



// assign button listener
btnInsUser.addEventListener('click', function () {
    const email = txtEmail.value;
    const password = txtContra.value;
    const passwordVerification = txtVerification.value;
    const nombre = txtNombre.value;
    const gradoAcademico = txtGradoAcademico.value;

    if (nombre === '' || email === '' || password === '' || passwordVerification === '' || passwordVerification === '' || gradoAcademico === 'Selecciona grado académico') {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios. Por favor, completa todos los campos.',
            icon: 'error'
        });
        return;
    }

    if (!isValidEmailDomain(email)) {
        Swal.fire({
            title: 'Error',
            text: 'El dominio del correo electrónico no está permitido. Solo se permiten dominios específicos.',
            icon: 'error'
        });
        return;
    }

    if (password !== passwordVerification) {
        Swal.fire({
            title: 'Error',
            text: 'Las contraseñas no coinciden. Por favor, verifica que las contraseñas son iguales.',
            icon: 'error'
        });
        return;
    }

    if (!isValidPassword(password)) {
        Swal.fire({
            title: 'Error',
            text: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y al menos una letra mayúscula.',
            icon: 'error'
        });
        return;
    }

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
                auth.createUserWithEmailAndPassword(email, txtContra.value)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        // Guardar datos del usuario en Firestore
                        db.collection("datosUsuarios").add({
                            "idemp": user.uid,
                            "usuario": txtNombre.value,
                            "email": user.email,
                            "gradoAcademico": txtGradoAcademico.value,
                            "urlPhoto": url
                        }).then(function (docRef) {
                            Swal.fire({
                                title: '¡Registro Exitoso!',
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
    txtVerification.value= '';
    txtContra.value= '';
    txtGradoAcademico.value = '';
    txtUrlPhoto.value = '';
}
