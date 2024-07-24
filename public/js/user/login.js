// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();


// create local from webpage inputs
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');

// create local insert button
const btnLogin = document.querySelector('#btnLogin');


// assign button listener
btnLogin.addEventListener('click', function () {
    auth.signInWithEmailAndPassword(txtEmail.value, txtContra.value)
        .then((userCredential) => {
            const user = userCredential.user;
            const dt = new Date();
            db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // Aquí se guarda la URL de la foto en el almacenamiento local
                        localStorage.setItem('userPhotoURL', doc.data().urlPhoto);
                        localStorage.setItem('userName', doc.data().usuario);
                        doc.ref.update({ultAcceso: dt}).then(function () {
                            // Redirección a 'index.html' después de guardar la URL de la foto
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




