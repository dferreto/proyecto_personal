// Inicializar Firebase
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Referencias a los elementos del formulario
const txtEmail = document.querySelector('#txtEmail');
const btnReset = document.querySelector('#btnReset');

// Evento de clic para verificar si el correo existe antes de enviar el reset
btnReset.addEventListener('click', function () {
    const email = txtEmail.value;
    if (!email) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un correo electrónico.',
            icon: 'warning'
        });
        return;
    }

    // Verificar si el correo existe en la autenticación de Firebase
    db.collection("datosUsuarios").where("email", "==", email).get()
        .then(snapshot => {
            if (snapshot.empty) {
                Swal.fire({
                    title: 'Error',
                    text: 'El correo ingresado no está registrado.',
                    icon: 'error'
                });
                return;
            }

            // Si el correo existe, enviar el email de restablecimiento
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    Swal.fire({
                        title: 'Correo enviado',
                        text: 'Se ha enviado un enlace para restablecer la contraseña a su correo electrónico. Recuerde verificar su correo antes de iniciar sesión.',
                        icon: 'success'
                    }).then(() => {
                        // Redirigir a la página de inicio de sesión después de 2 segundos
                        setTimeout(() => {
                            window.location.href = 'login.html'; // Redirige a login.html
                        }, 2000);
                    });
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo enviar el correo de restablecimiento: ' + error.message,
                        icon: 'error'
                    });
                });
        })
        .catch(error => {
            Swal.fire({
                title: 'Error',
                text: 'Error al verificar el correo: ' + error.message,
                icon: 'error'
            });
        });
});
