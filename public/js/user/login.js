// JavaScript Document
// Crear una variable para la base de datos local de Firestore
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Crear referencias locales desde los inputs de la página
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const txtVerification = document.querySelector('#txtVerification');

// Crear referencia local para el botón de inicio de sesión
const btnLogin = document.querySelector('#btnLogin');

// Asignar el listener al botón de inicio de sesión
btnLogin.addEventListener('click', function () {
    auth.signInWithEmailAndPassword(txtEmail.value, txtContra.value)
        .then((userCredential) => {
            const user = userCredential.user;
            const dt = new Date();
            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // Guardar la URL de la foto en el almacenamiento local
                        localStorage.setItem('userPhotoURL', doc.data().urlPhoto);
                        localStorage.setItem('userName', doc.data().usuario);
                        doc.ref.update({
                            ultAcceso: dt
                        }).then(function () {
                            // Redirigir a 'index.html' después de guardar los datos
                            document.location.href = 'index.html';
                        });
                    });
                })
                .catch(function (FirebaseError) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar datos del usuario: ' + FirebaseError,
                        icon: 'error'
                    });
                });
        })
        .catch((error) => {
            Swal.fire({
                title: 'Error',
                text: 'Error de acceso al usuario: ' + error.message,
                icon: 'error'
            });
        });

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target'); // Obtiene el ID del campo de entrada
            const targetInput = document.getElementById(targetId); // Encuentra el campo de entrada correspondiente
            const icon = this.querySelector('i'); // Obtiene el icono dentro del botón

            // Cambia el tipo de campo de "password" a "text" y viceversa
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye'); // Cambia el icono a "ojo cerrado"
                icon.classList.add('fa-eye-slash'); // Cambia el icono a "ojo abierto"
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });


});

// Función para alternar la visibilidad de la contraseña