// DOM

const body                  = document.getElementsByTagName('body')[0];
const header                = document.getElementsByTagName('header')[0];
const board                 = document.getElementById('board');
const details               = document.getElementById('details');
const closeDet              = document.getElementById('closeDet');
const cardForm              = document.getElementById('cardForm');
const domCardType           = document.getElementById('cardType');
const domCardId             = document.getElementById('cardId');
const domCardDate           = document.getElementById('cardDate');
const domCardTitle          = document.getElementById('cardTitle');
const domCardDescription    = document.getElementById('cardDescription');
const domCardPriority       = document.getElementById('cardPriority');
const hiddenInput           = document.getElementById('hiddenInput');

// Variables

const type = [];
let cardID = 0;

// Asignar array tarjetas del localStorage o crear array
const cards  = JSON.parse(localStorage.getItem('cards')) || [];

// Clases

class Card {

    constructor(title, type) {
        this.title          = title;
        this.type           = type;
        this.id             = ++cardID;
        this.description    = '';
        this.date           = '';
        this.priority       = 3;
    }

}

class Type {

    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

}

// Agregar tipos o columnas
type.push(new Type('Lista de tareas', 'tarea'), new Type('En proceso', 'proceso'), new Type('Terminadas', 'terminada'));

// Si hay ya hay tarjetas
if (cards.length > 0) {
    // Almacenar ids tarjetas
    const ids = cards.map(obj => {return obj.id});
    // Buscar id maximo
    cardID = Math.max(...ids);
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
        const res = cards.find((el) => el.id === parseInt(id));
        // Si encuentra un resultado, cambiar tipo de tarjeta
        res !== undefined && (cards[cards.indexOf(res)].type =  dropzone.id);
    }

    // Recargar
    showCards();

}

function showCards() {

    // Limpiar
    board.innerHTML = '';

    // Crear row
    board.innerHTML = `<div class="mt-5 row justify-content-center text-center"></div>`;

    // Ordenar tarjetas por prioridad
    cards.sort((a, b) => {
        if (a.priority > b.priority) {
            return 1;
        }
        if (a.priority < b.priority) {
            return -1;
        }
        // a es igual a b
        return 0;
    })    

    console.log(cards);

    cards.forEach((e) => console.log(e.priority, e.title))

    // Por cada tipo crear una columna
    type.forEach(type => {

        let div = document.createElement('div');
        div.classList = 'col-12 col-md-4 my-5 my-md-0';
        div.innerHTML = `
            <div class="p-3 bg-light border rounded">
				<h5 class="pt-2">${type.name}</h5>
				<div class="py-5 rounded" id="${type.id}"></div>
				<div class="mt-2">
					<button class="btn btn-secondary btn-sm">+ Añadir tarjeta</button>
				</div>
			</div>
        `;

        // DOM
        const contenido     = div.children[0].children[1];
        const addCardBtn    = div.children[0].children[2].children[0];

        // Por cada tarjeta en array tarjetas
        cards.forEach(element => {

            // Si el tipo de tarjeta corresponde a la columna
            if (element.type === type.id) {
             
                // Mostrar tarjeta
                let card = document.createElement('div');
                card.id = element.id;
                card.classList = `row bg-white tarjeta rounded shadow-sm my-2`;
                card.draggable = true;
                card.innerHTML = `
                    <div class="col-1">
                        <i class="bi bi-list"></i>
                    </div>
                    <div class="col-10 py-1">
                        <p class="m-0">${element.title}</p>
                        <input type="text" class="d-none">
                    </div>
                    <div class="col-1">
                        <i class="bi bi-x-square-fill text-danger"></i>
                    </div>
                `;

                // DOM
                const detailsBtn  = card.children[0];
                const paragraph   = card.children[1].children[0];
                const input       = card.children[1].children[1];
                const deleteBtn   = card.children[2];

                detailsBtn.onclick = () => {
                    showDetails(element);
                    details.classList.toggle('d-flex');
                }

                // Al arrastrar
                card.ondragstart = (event) => {
                    onDragStart(event);
                };

                // Al hacer click en el parrafo
                paragraph.onclick = () => {
                    // Ocultar parrafo
                    paragraph.classList.add('d-none');
                    // Mostrar input
                    input.classList.remove('d-none');
                    // Asignar texto en parrafo al valor input para modificar
                    input.value = paragraph.innerText;
                    // Hacer foco en input
                    input.focus();
                }
                
                // Al hacer enter
                input.onkeyup = (e) => {
                    if (e.keyCode === 13) {
                        // Cambiar array
                        input.value !== '' && (element.title = input.value);
                        // Recargar
                        showCards();
                    }
                }

                // Al desenfocar
                input.onblur = () => {
                    // Cambiar array
                    input.value !== '' && (element.title = input.value);
                    // Recargar
                    showCards();
                }
        
                // Al hacer click en la x roja
                deleteBtn.onclick = () => {
                    // Buscar y borrar elemento del array
                    cards.splice(cards.indexOf(element),1);
                    // Recargar
                    showCards();
                }

                contenido.appendChild(card);

            }

        });

        // Al hacer click en boton agregar
        addCardBtn.onclick = () => {
            // Agregar nueva tarjeta con el tipo correspondiente
            cards.push(new Card('Nueva tarjeta', type.id));
            // Recargar
            showCards();
        };

        // Cuando un elemento se esta arrastrando por encima
        div.ondragover = (event) => {onDragOver(event)};

        // Cuando cae un elemento
        div.ondrop = (event) => {onDrop(event)};

        // Agregar div al main
        board.children[0].appendChild(div);

    });

    // Actualizar tarjetas
    localStorage.setItem('cards', JSON.stringify(cards));

}

function showDetails(card) {
    manageDetails(domCardType       , card.type         , cards.indexOf(card));
    manageDetails(domCardId         , card.id           , cards.indexOf(card));
    manageDetails(domCardDate       , card.date         , cards.indexOf(card));
    manageDetails(domCardTitle      , card.title        , cards.indexOf(card));
    manageDetails(domCardDescription, card.description  , cards.indexOf(card));
    manageDetails(domCardPriority   , card.priority     , cards.indexOf(card));
}

function manageDetails(dom, text, card) {

    // Variables
    let valorAcual  = dom.children[0];
    let input       = dom.children[1];

    hiddenInput.value = card;

    // Mostrar valor actual
    valorAcual.children[1].innerText = text;
    // Cambiar valores input
    input.value = text;

    // Al hacer click
    valorAcual.onclick = () => {
        // Ocultar datos actuales
        valorAcual.classList.toggle('d-none');
        // Mostrar input
        input.classList.toggle('d-none');
        // Hacer foco en input
        input.focus();
    }

    // Al desenfocar del input
    input.onblur = () => {
        // Ocultar input
        input.classList.toggle('d-none');
        // Cambiar valor actual
        valorAcual.children[1].innerText = input.value;
        // Mostrar valor actual
        valorAcual.classList.toggle('d-none');
    }

}

// Eventos

closeDet.onclick = () => {
    details.classList.toggle('d-flex');
}

body.onkeyup = (e) => {
    ( e.key == "Escape" && details.classList.contains('d-flex') ) && details.classList.remove('d-flex');
}

cardForm.onsubmit = (e) => {
    // Prevenir recarga
    e.preventDefault();
    // Buscar tarjeta editada
    let cardSelected = cards[e.target[6].value];
    // Asignar valores
    cardSelected.type           = e.target[0].value;
    cardSelected.id             = parseInt(e.target[1].value);
    cardSelected.date           = e.target[2].value;
    cardSelected.title          = e.target[3].value;
    cardSelected.description    = e.target[4].value;
    cardSelected.priority       = parseInt(e.target[5].value);
    // Actualizar tarjetas
    localStorage.setItem('cards', JSON.stringify(cards));
    // Recargar
    showCards();
    // Notificar
    Toastify({
        text: "Cambios guardados",
        style: {
          background: "#0d6efd",
        }
    }).showToast();
}

// --- Ejecutar funcion principal ---
showCards();