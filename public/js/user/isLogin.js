// JavaScript Document
// validate that user is log-in
var auth = firebase.apps[0].auth();

function validar() {
    var uid = -1
    auth.onAuthStateChanged((user) => {
        if (user) {
            uid = user.uid;
        } else {
      
            document.location.href = 'login.html';
        }
    });
    return uid;
}

function salir(){
   
    localStorage.removeItem('userPhotoURL');
    localStorage.removeItem('userName');


  
    auth.signOut().then(() => {
        
        document.location.href ='index.html';
    }).catch((error)=>{
      
        Swal.fire(
            '¡Error!',
            'Error al cerrar sesión: ' + error.message,
            'error'
        );
    });
}



