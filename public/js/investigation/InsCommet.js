function cargarComentarios() {
    // Suponiendo que usas Firestore
    firebase.firestore().collection('comentarios').get().then((querySnapshot) => {
        const commentsContainer = document.getElementById('comments-container');
        querySnapshot.forEach((doc) => {
            const comment = doc.data().texto;
            const commentElement = document.createElement('p');
            commentElement.textContent = comment;
            commentsContainer.prepend(commentElement); // Esto los añade al principio
        });
    });
}

// Llamar a cargarComentarios al cargar la página
document.addEventListener('DOMContentLoaded', cargarComentarios);
