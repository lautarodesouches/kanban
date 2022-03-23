// DOM

const body = document.getElementsByTagName('body')[0];
const header = document.getElementsByTagName('header')[0];
const main = document.getElementsByTagName('main')[0];

// Variables

let bg = 'bg-white';
let text = 'text-dark';

// Constructor

class Tipo {

    constructor(nombre, tipo) {
        this.nombre = nombre;
        this.tipo = tipo;
    }

}

class Tarjeta {

    constructor(titulo, tipo) {
        this.titulo = titulo;
        this.tipo = tipo;
    }

}

// Array

let tarjetas = [];
let tipos = [new Tipo('Lista de tareas', 'tarea'), new Tipo('En proceso', 'proceso'), new Tipo('Terminadas', 'terminada')];

// Tareas agregadas para prueba

tarjetas.push(new Tarjeta('Primera tarea', tipos[0].tipo));
tarjetas.push(new Tarjeta('Segunda tarea', tipos[0].tipo));
tarjetas.push(new Tarjeta('Tercera tarea', tipos[0].tipo));

tarjetas.push(new Tarjeta('Primera tarea en proceso', tipos[1].tipo));
tarjetas.push(new Tarjeta('Segunda tarea en proceso', tipos[1].tipo));

tarjetas.push(new Tarjeta('Primera tarea finalizada', tipos[2].tipo));

tarjetas.forEach(element => {
    console.log(element)
});

// Funciones

function mostrar() {

    // Limpiar
    main.innerHTML = '';

    // Crear row
    main.innerHTML = `<div class="mt-5 row align-items-start justify-content-center text-center"></div>`;

    // Por cada tipo crear una columna
    tipos.forEach(tipos => {

        let div = document.createElement('div');
        div.classList = 'col-12 col-md-4 my-5 my-md-0';
        div.innerHTML = `
            <div class="p-3 bg-light border rounded">
				<h5 class="pt-2 pb-4">${tipos.nombre}</h5>
				<div></div>
				<div class="mt-5">
					<button class="btn btn-secondary btn-sm">+ Añadir tarjeta</button>
				</div>
			</div>
        `;

        let contenido = div.children[0].children[1];

        tarjetas.forEach(element => {

            if (element.tipo === tipos.tipo) {
             
                // Crear una 'tarjeta'
                let tarjeta = document.createElement('div');
                tarjeta.classList = `${bg} ${text} rounded shadow-sm p-1 position-relative my-2`;
                tarjeta.draggable = true;
                tarjeta.innerHTML = `
                    <p class="m-0">${element.titulo}</p>
                    <span class="borrar bg-danger rounded px-1 text-white">x</span>
                    <input type="text" class="d-none">
                `;

                // Al hacer click en el parrafo
                tarjeta.children[0].onclick = () => {
                    // Ocultar parrafo
                    tarjeta.children[0].classList.add('d-none');
                    // Mostrar input
                    tarjeta.children[2].classList.remove('d-none');
                    // Asignar texto en parrafo al valor input para modificar
                    tarjeta.children[2].value = tarjeta.children[0].innerText;
                }

                // Al hacer click en otro lado
                tarjeta.children[2].onblur = () => {
                    // Cambiar array
                    tarjeta.children[2].value !== '' && (element.titulo = tarjeta.children[2].value);
                    // Recargar
                    mostrar();
                }
                
                // Al hacer enter
                tarjeta.children[2].onkeyup = (e) => {
                    if (e.keyCode === 13) {
                        // Cambiar array
                        tarjeta.children[2].value !== '' && (element.titulo = tarjeta.children[2].value);
                        // Recargar
                        mostrar();
                    }
                }
        
                // Al hacer click en borrar
                tarjeta.children[1].onclick = () => {
                    // Buscar y borrar elemento del array
                    tarjetas.splice(tarjetas.indexOf(element),1);
                    // Recargar
                    mostrar();
                }

                contenido.appendChild(tarjeta);
                
            }

        });

        // Al hacer click en boton agregar
        div.children[0].children[2].children[0].onclick = () => {
                
            // Agregar nuevo
            tarjetas.push(new Tarjeta('Nueva tarjeta', tipos.tipo));
        
            // Recargar
            mostrar();
        
        };

        // Agregar div al main
        main.children[0].appendChild(div)

    });

}

// Modo oscuro

function darkMode() {

    body.classList.toggle('bg-dark');

    bg === 'bg-white' ? (bg = 'bg-dark') : (bg = 'bg-white');
    text === 'text-dark' ? (text = 'text-white') : (text = 'text-dark');

    // Cambiar relleno SVG
    header.children[0].style.fill !== 'white' ? header.children[0].style.fill = 'white' : header.children[0].style.fill = 'black';

    // Recargar
    mostrar();
}

header.children[0].onclick = () => {darkMode()}

// Ejecutar funciones

mostrar();