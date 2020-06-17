//VARIABLES
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

//EVENTLISTENER
cargarEventListener();

function cargarEventListener(){
//Dispara cuando se preciona "Agregar carrito"
cursos.addEventListener('click', comprarCursos);

//Cuando se elinina un curso del carrito
carrito.addEventListener('click', eliminarCurso);

//Al vaciar el carrito totalmente
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

//AL cargar doc., mostrar el el localstorge
    document.addEventListener('DOMContentLoaded', leerLocalStorage);
}


//FUNCIONES
//funcion que añade el curso al carrito
function comprarCursos(e){
    e.preventDefault();

//Delegation para agregar-carrito
    if(e.target.classList.contains('agregar-carrito')){
        const curso = e.target.parentElement.parentElement;
        
//Enviar cursos seleccionados para tonar los datos
        leerDatosCursos(curso);
    }
}

//Leer datos del curso

function leerDatosCursos(curso){
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent, //textContent para acceder a ese texto
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')

    }

    insertarCarrito(infoCurso);
}

//muestra el curso seleccionado en el carrito
function insertarCarrito(curso){
    const row = document.createElement('tr');

    row.innerHTML=`
        <td>
            <img src='${curso.imagen}' width=100>
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td> 
    `;

    listaCursos.appendChild(row);
    guardarCursoLocalStorage(curso);
}


//Elinina el curso del carrito en el DOM
function eliminarCurso(e){
    e.preventDefault();

    let curso,
        cursoId;
    if(e.target.classList.contains('borrar-curso')){
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        cursoId = curso.querySelector('a').getAttribute('data-id');

        eliminarCursoLocalStorage(cursoId);
    }
}


//Vacia el carrito
function vaciarCarrito(){
    //forma corta
    //listaCursos.innerHTML='';

    //forma larga pero recomendada
    while(listaCursos.firstChild){ //comprobar si hay elemento
        listaCursos.removeChild(listaCursos.firstChild); //esto hace que elimine el primer elemento dentro del carrito. Y como es eliminado, el que estaba en segundo lugar detro del carrito pasa a ser primero. Entonces la funcion se va a seguir ejecutando hasta que ya no exista ninguno en el primer lugar (los elimina a todos)
    }
    //Vaciar Local Storage
    vaciarLocalStorage();

    return false;
}

//Almacena cursos en el carrito al local storage
function guardarCursoLocalStorage(curso){
    let cursos;
//Toma ell valor de un arreglo del LS o vacio
    cursos = obtenerCursoLocalStorage();

    cursos.push(curso);//El curso seleccionado se agrega al arreglo

    localStorage.setItem('cursos', JSON.stringify(cursos));
}

function obtenerCursoLocalStorage(){
    let cursosLS;

    //Comprobar si hay algo en local storage
    if(localStorage.getItem('cursos') === null){
        cursosLS = []; //si al retornarlo no hay valor, que muestre un arreglo vacio
    }else{
        cursosLS = JSON.parse(localStorage.getItem('cursos')); //json.parse que convierta los valores en un arreglo
    }

    return cursosLS;
}

//Imprime los cursos de LS en el carrito
function leerLocalStorage(){
    let cursosLS;

    cursosLS = obtenerCursoLocalStorage();

    cursosLS.forEach(function(curso){
        //construir el tenplate
        const row = document.createElement('tr');

    row.innerHTML=`
        <td>
            <img src='${curso.imagen}' width=100>
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td> 
    `;

    listaCursos.appendChild(row);
    });
}

//Elimina el curso por el ID en localStorage
function eliminarCursoLocalStorage(curso){
    let cursosLS;
//Obtener el arreglo de cursos
    cursosLS = obtenerCursoLocalStorage();
//Iterar comparando el Id del curso borrado con los del LocalStorage
    cursosLS.forEach(function(cursoLS, index){
        if(cursoLS.id === curso){
            cursosLS.splice(index, 1);
        }
    });
    //Añadir el arreglo actual al storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

//Vaciar localStorage
function vaciarLocalStorage(){
    localStorage.clear();
}