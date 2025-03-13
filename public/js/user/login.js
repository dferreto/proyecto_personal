// Crear una variable para la base de datos local de Firestore
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Crear referencias a los elementos del formulario
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const btnLogin = document.querySelector('#btnLogin');
const rememberMe = document.querySelector('#rememberMe');

// Cargar el email guardado si existe al cargar la página
window.addEventListener('load', function () {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
        txtEmail.value = savedEmail;
        rememberMe.checked = true; // Marcar la casilla si hay un correo guardado
    }
});

// Asignar el listener al botón de inicio de sesión
btnLogin.addEventListener('click', function () {
    const email = txtEmail.value;
    const password = txtContra.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Verificar si el correo está verificado
            if (!user.emailVerified) {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, verifique su correo electrónico antes de iniciar sesión.',
                    icon: 'warning'
                });
                auth.signOut(); // Cerrar sesión si el correo no está verificado
                return;
            }

            const dt = new Date();

            // Guardar o eliminar el correo según la opción "Remember Me"
            if (rememberMe.checked) {
                localStorage.setItem('savedEmail', email);
            } else {
                localStorage.removeItem('savedEmail');
            }

            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // Guardar la URL de la foto y el usuario en el almacenamiento local
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
});

// Función para alternar la visibilidad de la contraseña
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target'); // Obtiene el ID del campo de entrada
        const targetInput = document.getElementById(targetId); // Encuentra el campo de entrada correspondiente
        const icon = this.querySelector('i'); // Obtiene el icono dentro del botón

        // Cambia el tipo de campo de "password" a "text" y viceversa
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            icon.classList.remove('fa-eye'); // Cambia el icono a "ojo abierto"
            icon.classList.add('fa-eye-slash'); // Cambia el icono a "ojo cerrado"
        } else {
            targetInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});
