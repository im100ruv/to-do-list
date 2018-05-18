let total = 0;
let count = 0;
let completed = 0;

function addTask() {
  const newTask = document.getElementById('new-task').value;
  if (newTask != "") {
    const newItem = document.createElement("div");
    newItem.setAttribute("id", total);
    newItem.setAttribute("class", "task-item");
    newItem.setAttribute("draggable", "true");
    newItem.innerHTML = `<input type="checkbox" value="${newTask}" onchange="markItem(${total})"> <label> ${newTask} </label><span class="cross" onclick="removeTask(${total})">&times;</span> <br>`;

    document.getElementById('task-list').appendChild(newItem);
    total++;
    count++;

    document.getElementById('info').innerHTML = `${count} tasks &nbsp;  ${completed} completed`;
    document.getElementById('new-task').value = "";
  } else {
    window.alert("Enter a task.");
  }
}

function verifyTask(idNum) {
  if (document.getElementById(idNum).getElementsByTagName("label")[0].style.textDecoration != "line-through") {
    return (window.confirm("This task is not completed yet. Are you sure to remove this task? Press OK to delete."));
  }
  return true;
}

function removeTask(idNum) {
  if (verifyTask(idNum)) {
    document.getElementById(idNum).remove();
    count--;
    const tasks = document.getElementById("task-list");
    let temp = 0;
    let i = 0;
    while (i < count) {
      if (tasks.getElementsByTagName("div")[i].getElementsByTagName("input")[0].checked) {
        temp++;
      }
      i++;
    }
    completed = temp;
    document.getElementById('info').innerHTML = `${count} tasks &nbsp; ${completed} completed`;
  };
}

function markItem(idNum) {
  const item = document.getElementById(idNum);
  if (item.getElementsByTagName("input")[0].checked) {
    item.getElementsByTagName("label")[0].style.textDecoration = "line-through";
    completed++;
    document.getElementById('info').innerHTML = `${count} tasks &nbsp; ${completed} completed`;
  } else {
    item.getElementsByTagName("label")[0].style.textDecoration = "none";
    completed--;
    document.getElementById('info').innerHTML = `${count} tasks &nbsp;  ${completed} completed`;
  }
}


// draggable---------------------------------------------
var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    //alert(this.outerHTML);
    //dragSrcEl.innerHTML = this.innerHTML;
    //this.innerHTML = e.dataTransfer.getData('text/html');
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin', dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);

  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  this.classList.remove('over');

  /*[].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });*/
  refreshMarks(elemListening);
}

let elemListening;

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);

  elemListening = elem;
}

// var cols = document.querySelectorAll('#task-list .task-item');
// [].forEach.call(cols, addDnDHandlers);
// console.log("asdf" + cols);

function makeDrag() {
  var cols = document.querySelectorAll('#task-list .task-item');
  [].forEach.call(cols, addDnDHandlers);
}

function refreshMarks(elemListening) {
  // refactor check boxes
  if (elemListening.getElementsByTagName("label")[0].style.textDecoration == "line-through") {
    elemListening.getElementsByTagName("input")[0].setAttribute("checked", true);
  }
}
