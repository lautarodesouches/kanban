// https://www.digitalocean.com/community/tutorials/js-drag-and-drop-vanilla-js-es

function onDragStart(event) {
    event
      .dataTransfer
      .setData('text/plain', event.target.id);

    console.log(event.target.id)
    console.log(event.dataTransfer)
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {

    const id = event
      .dataTransfer
      .getData('text');
    
    console.log(id)

    const draggableElement = document.getElementById(id);

    const dropzone = event.target;

    if (dropzone.id === 'drop') {
      draggableElement.innerText = 'dropped'
    }

    dropzone.appendChild(draggableElement);

    event
    .dataTransfer
    .clearData();

}

const draggable = document.getElementById('draggable');

draggable.ondragstart = (event) => {onDragStart(event)};

const drop = document.getElementById('drop');

drop.ondragover = (event) => {onDragOver(event)};

drop.ondrop = (event) => {onDrop(event)};