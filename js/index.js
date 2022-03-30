// DOM

const body      = document.getElementsByTagName('body')[0];
const header    = document.getElementsByTagName('header')[0];
const tablero   = document.getElementById('tablero');

// Variables

const tipos     = [];
let idTarjeta   = 0;

// Asignar array tarjetas del localStorage o crear array
const tarjetas  = JSON.parse(localStorage.getItem('tarjetas')) || [];

// Clases

class Tarjeta {

    constructor(titulo, tipo) {
        this.titulo = titulo;
        this.tipo = tipo;
        this.id = ++idTarjeta;
    }

}

class Tipo {

    constructor(nombre, id) {
        this.nombre = nombre;
        this.id = id;
    }

}

// Agregar tipos o columnas
tipos.push(new Tipo('Lista de tareas', 'tarea'), new Tipo('En proceso', 'proceso'), new Tipo('Terminadas', 'terminada'));

// Si hay ya hay tarjetas
if (tarjetas.length > 0) {
    // Almacenar ids tarjetas
    const ids = tarjetas.map(obj => {return obj.id});
    // Buscar id maximo
    idTarjeta = Math.max(...ids);
}

// Funciones

function onDragStart(event) {
    // Pasar el id
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {

    // Obtener id
    const id = event
        .dataTransfer
        .getData('text');

    // Ver donde se soltó
    const dropzone = event.target;

    // Si el lugar donde cae tiene un id que es igual a tarea, proceso o terminada
    if (dropzone.id === 'tarea' || dropzone.id === 'proceso' || dropzone.id === 'terminada') {
        // Buscar tarjeta por id
        const resultado = tarjetas.find((el) => el.id === parseInt(id));
        console.log(resultado)
        // Si encuentra un resultado, cambiar tipo de tarjeta
        resultado !== undefined && (tarjetas[tarjetas.indexOf(resultado)].tipo =  dropzone.id);
    }

    // Recargar
    mostrar();

}

function mostrar() {

    // Limpiar
    tablero.innerHTML = '';

    // Crear row
    tablero.innerHTML = `<div class="mt-5 row justify-content-center text-center"></div>`;

    // Por cada tipo crear una columna
    tipos.forEach(tipos => {

        let div = document.createElement('div');
        div.classList = 'col-12 col-md-4 my-5 my-md-0';
        div.innerHTML = `
            <div class="p-3 bg-light border rounded">
				<h5 class="pt-2">${tipos.nombre}</h5>
				<div class="py-5 border rounded" id="${tipos.id}"></div>
				<div class="mt-2">
					<button class="btn btn-secondary btn-sm">+ Añadir tarjeta</button>
				</div>
			</div>
        `;

        // Donde van a ir las tarjetas
        const contenido = div.children[0].children[1];

        // Por cada tarjeta en array tarjetas
        tarjetas.forEach(element => {

            // Si el tipo de tarjeta corresponde a la columna
            if (element.tipo === tipos.id) {
             
                // Mostrar tarjeta
                let tarjeta = document.createElement('div');
                tarjeta.id = element.id;
                tarjeta.classList = `tarjeta rounded shadow-sm p-1 position-relative my-2`;
                tarjeta.draggable = true;
                tarjeta.innerHTML = `
                    <p class="m-0">${element.titulo}</p>
                    <span class="borrar bg-danger rounded-end px-1 text-white">x</span>
                    <input type="text" class="d-none">
                `;

                // Al arrastrar
                tarjeta.ondragstart = (event) => {
                    onDragStart(event);
                };

                // Al hacer click en el parrafo
                tarjeta.children[0].onclick = () => {
                    // Ocultar parrafo
                    tarjeta.children[0].classList.add('d-none');
                    // Mostrar input
                    tarjeta.children[2].classList.remove('d-none');
                    // Asignar texto en parrafo al valor input para modificar
                    tarjeta.children[2].value = tarjeta.children[0].innerText;
                    // Hacer foco en input
                    tarjeta.children[2].focus();
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

                // Al desenfocar
                tarjeta.children[2].onblur = () => {
                    // Cambiar array
                    tarjeta.children[2].value !== '' && (element.titulo = tarjeta.children[2].value);
                    // Recargar
                    mostrar();
                }
        
                // Al hacer click en la x roja
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
            // Agregar nueva tarjeta con el tipo correspondiente
            tarjetas.push(new Tarjeta('Nueva tarjeta', tipos.id));
            // Recargar
            mostrar();
        };

        // Cuando un elemento se esta arrastrando por encima
        div.ondragover = (event) => {onDragOver(event)};

        // Cuando cae un elemento
        div.ondrop = (event) => {onDrop(event)};

        // Agregar div al main
        tablero.children[0].appendChild(div);

    });

    // Actualizar tarjetas
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

}

// --- Ejecutar funcion principal ---
mostrar();