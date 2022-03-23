// DOM

const main = document.getElementsByTagName('main')[0];

const mostrarTarea        = document.getElementById('tareas').children[1];
const mostrarProceso      = document.getElementById('proceso').children[1];
const mostrarTerminadas   = document.getElementById('terminadas').children[1];

const agregarTarea        = document.getElementById('tareas').children[2].children[0];
const agregarProceso      = document.getElementById('proceso').children[2].children[0];
const agregarTerminadas   = document.getElementById('terminadas').children[2].children[0];

// Variables

let tarea       = [];
let proceso     = [];
let terminadas  = [];

// Constructor

class Tarjeta {

    constructor(titulo, tipo) {
        this.titulo = titulo;
        this.tipo = tipo;
    }

}

tarea.push(new Tarjeta('Primera tarea'));
tarea.push(new Tarjeta('Segunda tarea'));

agregarTarea.onclick = () => {

    // Agregar nuevo
    tarea.push(new Tarjeta('Nueva tarjeta'));

    // Recargar
    mostrarTarjetas('tarea', tarea);

}

agregarProceso.onclick = () => {

    // Agregar nuevo
    proceso.push(new Tarjeta('Nueva tarjeta'));

    // Recargar
    mostrarTarjetas('proceso', proceso);

}

agregarTerminadas.onclick = () => {

    // Agregar nuevo
    terminadas.push(new Tarjeta('Nueva tarjeta'));

    // Recargar
    mostrarTarjetas('terminadas', terminadas);

}

// Funciones

function mostrarTarjetas(estado, array) {
    
    // Asignar lugar a mostrar
    let lugarAMostrar;

    if (estado === 'tarea') {

        lugarAMostrar = mostrarTarea;

    } else if(estado === 'proceso'){

        lugarAMostrar = mostrarProceso;

    } else {
        
        lugarAMostrar = mostrarTerminadas;

    }

    // Limpiar lugar
    lugarAMostrar.innerHTML = '';

    // Por cada elemento en el array
    array.forEach(element => {

        // Crear una 'tarjeta'
        let div = document.createElement('div');
        div.classList = 'bg-white rounded shadow-sm p-1 position-relative my-2';
        div.draggable = true;
        div.innerHTML = `
            <p class="m-0">${element.titulo}</p>
            <span class="borrar bg-danger rounded px-1 text-white">x</span>
            <input type="text" class="d-none">
        `;

        // Al hacer click en el parrafo
        div.children[0].onclick = () => {
            // Ocultar parrafo
            div.children[0].classList.add('d-none');
            // Mostrar input
            div.children[2].classList.remove('d-none');
            // Asignar texto en parrafo al valor input para modificar
            div.children[2].value = div.children[0].innerText;
        }

        div.children[2].onblur = () => {
            // Cambiar array
            div.children[2].value !== '' && (element.titulo = div.children[2].value);
            // Recargar
            mostrarTarjetas(estado, array);
        }

        div.children[2].onkeyup = (e) => {
            // Si preciona enter
            if (e.keyCode === 13) {
                // Cambiar array
                div.children[2].value !== '' && (element.titulo = div.children[2].value);
                // Recargar
                mostrarTarjetas(estado, array);
            }
        }

        // Al hacer click en borrar
        div.children[1].onclick = () => {
            // Buscar y borrar elemento del array
            array.splice(array.indexOf(element),1);
            // Recargar
            mostrarTarjetas(estado, array);
        }

        // Agregar div a lugar
        lugarAMostrar.appendChild(div);

    });

}

// Llamar funciones

mostrarTarjetas('tarea', tarea);
mostrarTarjetas('proceso', proceso);
mostrarTarjetas('terminadas', terminadas);