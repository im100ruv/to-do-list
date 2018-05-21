if (localStorage.getItem("u2") === null) {
  // json data format
  let toDoJson = {
    "users": {
      "u1": [{}, {}],

      "u2": []
    }
  }
  const thisUser = toDoJson.users["u2"];
  localStorage.setItem('u2', JSON.stringify(thisUser));
}


let user = JSON.parse(localStorage.getItem('u2'));
displayTasks();

function updateData() {
  localStorage.setItem('u2', JSON.stringify(user));
  user = JSON.parse(localStorage.getItem('u2'));
  displayTasks();
}

function displayTasks() {
  let count = user.length;
  let completed = 0;
  while (document.getElementById('task-list').firstChild) {
    document.getElementById('task-list').removeChild(document.getElementById('task-list').firstChild);
  }
  for (let i = 0; i < count; i++) {
    const newItem = document.createElement("div");
    newItem.setAttribute("id", i);
    user[i]["sn"] = i;
    newItem.setAttribute("class", "task-item");
    newItem.setAttribute("draggable", "true");
    newItem.innerHTML = `<input type="checkbox" value="${user[i]["task"]}" onchange="markItem(${i})" ${user[i]["checked"] ? "checked" : ""}> <label> ${user[i]["task"]} </label><span class="cross" onclick="removeTask(${i})">&times;</span> <br>`;

    document.getElementById('task-list').appendChild(newItem);

    decorateCompletedTask(i, user[i]["checked"]);
    if (user[i]["checked"]) {
      completed++;
    }
  }

  document.getElementById('info').innerHTML = `${count} tasks &nbsp;  ${completed} completed`;
  document.getElementById('new-task').value = "";
}

function addTask(key) {
  if (event.key === 'Enter') {
    let count = user.length;
    const newTask = document.getElementById('new-task').value;
    if (newTask != "") {
      let newElem = {
        "sn": count,
        "task": newTask,
        "checked": 0
      };
      user.push(newElem);
      updateData();
    } else {
      window.alert("Enter a task.");
    }
  }
}

function verifyTask(idNum) {
  if (user[idNum]["checked"] == 0) {
    return (window.confirm("This task is not completed yet. Are you sure to remove this task? Press OK to delete."));
  }
  return true;
}

function removeTask(idNum) {
  if (verifyTask(idNum)) {
    let temparr = user.concat();
    let part2 = temparr.splice(idNum + 1, user.length);
    let part1 = temparr.splice(0, idNum);
    user = part1.concat(part2);

    updateData();
  };
}

function markItem(idNum) {
  (user[idNum]["checked"] == 1) ? user[idNum]["checked"] = 0 : user[idNum]["checked"] = 1;
  updateData();
}

function decorateCompletedTask(idNum, state) {
  const items = document.getElementById(idNum);
  if (state == 1) {
    items.getElementsByTagName("label")[0].style.textDecoration = "line-through";
  } else {
    items.getElementsByTagName("label")[0].style.textDecoration = "none";
  }
}

function clearData() {
  user = [];
  updateData();
}

// =============================================================
// =============================================
// ===============================================================

// draggable---------------------------------------------
let sourceId = null;
let destinationId = null;

let dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;
  sourceId = this.id;
  // console.log("start "+sourceId)
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
    destinationId = this.id;
    // console.log("end "+ destinationId);
    this.parentNode.removeChild(dragSrcEl);
    let dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin', dropHTML);
    let dropElem = this.previousSibling;
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
  manageAfterDragDrop();

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

function makeDrag() {
  let cols = document.querySelectorAll('#task-list .task-item');
  [].forEach.call(cols, addDnDHandlers);
}

function refreshMarks(elemListening) {
  // refactor check boxes
  if (elemListening.getElementsByTagName("label")[0].style.textDecoration == "line-through") {
    elemListening.getElementsByTagName("input")[0].setAttribute("checked", true);
  }
}

function manageAfterDragDrop() {
  console.log(sourceId);
  console.log(destinationId);

  // first remove source
  let tempTask = user[sourceId];
  let temparr = user.concat();
  let part2 = temparr.splice(sourceId + 1, user.length);
  let part1 = temparr.splice(0, sourceId);
  user = part1.concat(part2);
  updateData();

  // then add source at destination
  user.splice(destinationId, 0, tempTask);
  console.log(JSON.stringify(user));

  updateData();
  console.log(JSON.stringify(user));
}
