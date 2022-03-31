// DOM

const body      = document.getElementsByTagName('body')[0];
const header    = document.getElementsByTagName('header')[0];
const board     = document.getElementById('board');
const details   = document.getElementById('details');
const closeDet  = details.children[0];

closeDet.onclick = () => {
    details.classList.toggle('d-flex')
}

// Variables

const tipos     = [];
let idTarjeta   = 0;

// Asignar array tarjetas del localStorage o crear array
const tarjetas  = JSON.parse(localStorage.getItem('tarjetas')) || [];

// Clases

class Tarjeta {

    constructor(titulo, tipo) {
        this.titulo         = titulo;
        this.tipo           = tipo;
        this.id             = ++idTarjeta;
        this.descripcion    = '';
        this.fecha          = '';
        this.prioridad      = '';
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
    board.innerHTML = '';

    // Crear row
    board.innerHTML = `<div class="mt-5 row justify-content-center text-center"></div>`;

    // Por cada tipo crear una columna
    tipos.forEach(tipos => {

        let div = document.createElement('div');
        div.classList = 'col-12 col-md-4 my-5 my-md-0';
        div.innerHTML = `
            <div class="p-3 bg-light border rounded">
				<h5 class="pt-2">${tipos.nombre}</h5>
				<div class="py-5 rounded" id="${tipos.id}"></div>
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
                tarjeta.classList = `row bg-white tarjeta rounded shadow-sm my-2`;
                tarjeta.draggable = true;
                tarjeta.innerHTML = `
                    <div class="col-1">
                        <i class="bi bi-list"></i>
                    </div>
                    <div class="col-10 py-1">
                        <p class="m-0">${element.titulo}</p>
                        <input type="text" class="d-none">
                    </div>
                    <div class="col-1">
                        <i class="bi bi-x-square-fill text-danger"></i>
                    </div>
                `;

                // Variables
                let det = tarjeta.children[0];
                let par = tarjeta.children[1].children[0];
                let inp = tarjeta.children[1].children[1];
                let del = tarjeta.children[2];

                det.onclick = () => {
                    details.classList.toggle('d-flex')
                }

                // Al arrastrar
                tarjeta.ondragstart = (event) => {
                    onDragStart(event);
                };

                // Al hacer click en el parrafo
                par.onclick = () => {
                    // Ocultar parrafo
                    par.classList.add('d-none');
                    // Mostrar input
                    inp.classList.remove('d-none');
                    // Asignar texto en parrafo al valor input para modificar
                    inp.value = par.innerText;
                    // Hacer foco en input
                    inp.focus();
                }
                
                // Al hacer enter
                inp.onkeyup = (e) => {
                    if (e.keyCode === 13) {
                        // Cambiar array
                        inp.value !== '' && (element.titulo = inp.value);
                        // Recargar
                        mostrar();
                    }
                }

                // Al desenfocar
                inp.onblur = () => {
                    // Cambiar array
                    inp.value !== '' && (element.titulo = inp.value);
                    // Recargar
                    mostrar();
                }
        
                // Al hacer click en la x roja
                del.onclick = () => {
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
        board.children[0].appendChild(div);

    });

    // Actualizar tarjetas
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

}

// --- Ejecutar funcion principal ---
mostrar();