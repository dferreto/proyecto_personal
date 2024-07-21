// Asegúrate de que firebase está inicializado antes de este script

// Función que carga las categorías/investigaciones
function cargarCategorias() {
    var db = firebase.firestore();
    const tabla = document.querySelector('#tablaAllInvestigation');
    tabla.innerHTML = "";
    let investigaciones = [];

    const filtroArea = document.querySelector('#filtroArea').value;
    const filtroGrado = document.querySelector('#filtroGrado').value;

    db.collection("datosInvestigacion").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let datosInvestigacion = doc.data();
            let idInvestigacion = doc.id;

            if (datosInvestigacion.userId) {
                let promesaUsuario = db.collection("datosUsuarios").where("idemp", "==", datosInvestigacion.userId).get();
                investigaciones.push(promesaUsuario.then(querySnapshotUsuario => {
                    let gradoAcademico = 'Grado no especificado';
                    if (!querySnapshotUsuario.empty) {
                        let datosUsuario = querySnapshotUsuario.docs[0].data();
                        gradoAcademico = datosUsuario.gradoAcademico || 'Grado no especificado';
                    }
                    if ((filtroArea === 'Selecciona un área' || datosInvestigacion.area === filtroArea) &&
                        (filtroGrado === 'Selecciona un grado' || gradoAcademico === filtroGrado)) {
                        return construirTarjetaInvestigacion(datosInvestigacion, idInvestigacion, gradoAcademico);
                    }
                }));
            } else {
                console.error(`La investigación con ID: ${idInvestigacion} no tiene userId asociado.`);
            
            }
        });

        Promise.all(investigaciones).then(investigacionesHtml => {
            tabla.innerHTML = `<div class="row">${investigacionesHtml.join('')}</div>`;
        }).catch(error => {
            console.error("Error al cargar las investigaciones: ", error);
            tabla.innerHTML = '<p>Error al cargar las investigaciones.</p>';
        });
    }).catch(error => {
        console.error("Error al obtener investigaciones: ", error);
        tabla.innerHTML = '<p>Error al cargar las investigaciones.</p>';
    });
}

// Añade eventos de cambio a los filtros
document.querySelector('#filtroArea').addEventListener('change', cargarCategorias);
document.querySelector('#filtroGrado').addEventListener('change', cargarCategorias);

function construirTarjetaInvestigacion(datosInvestigacion, idInvestigacion, gradoAcademico) {
    if (!idInvestigacion) {
        console.error('ID no encontrado para la investigación', datosInvestigacion);
        return ''; // Salir si no hay ID
    }
    var urlComment = 'commentInvestigation.html?id=' + idInvestigacion;

    // Aquí construyes el HTML de la tarjeta usando los datos de la investigación y el ID
    return `
    <div class="col-md-2 ">
    <div class="card mb-4 shadow-sm clickable-card" data-id="${idInvestigacion}">
        <div class="card-header-custom">
            <h5 class="card-title"><a href="${urlComment}">${datosInvestigacion.titulo}</a></h5>
        </div>
        <div class="card-body-custom">
            <h6 class="card-subtitle mb-4 text-muted">Grado académico: ${gradoAcademico}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Área de interés: ${datosInvestigacion.area}</h6>
            <p class="card-text">${datosInvestigacion.descripcion}</p>
        </div>
    </div>
</div>
`;
}

// Agregamos un evento para cargar las investigaciones cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarCategorias);
