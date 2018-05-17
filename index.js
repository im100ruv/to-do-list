let total = 0;
let count = 0;
let completed = 0;

function addTask() {
  const newTask = document.getElementById('new-task').value;

  const newItem = document.createElement("div");
  newItem.setAttribute("id", total);
  newItem.setAttribute("class", "task-item");
  newItem.innerHTML = `<input type="checkbox" value="${newTask}" onchange="markItem(${total})"> <label> ${newTask} </label><span class="cross" onclick="removeTask(${total})">&times;</span> <br>`;

  document.getElementById('task-list').appendChild(newItem);
  total++;
  count++;

  document.getElementById('info').innerHTML = `${count} tasks &nbsp;  ${completed} completed`;
  document.getElementById('new-task').value = "";
}

function removeTask(idNum) {
  // item.removeChild(item.childNodes[idNum]);
  document.getElementById(idNum).remove();
  count--;
  document.getElementById('info').innerHTML = `${count} tasks &nbsp; ${completed} completed`;
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