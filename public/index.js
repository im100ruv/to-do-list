// json data format
let toDoJson = {
  "users": {
    "u1": []
  }
}

let user = toDoJson.users["u1"];
let sourceId = null;
let sourceElem = null;
let destinationId = null;

$('.task-list').on('click', 'span.cross', function () {
  const idNum = this.parentNode.id;
  if (verifyTask(idNum)) {
    let temparr = user.concat();
    let part2 = temparr.splice(parseInt(idNum) + 1, user.length);
    let part1 = temparr.splice(0, idNum);
    user = part1.concat(part2);

    updateData();
  };
});

$('.task-list').on('change', 'input', function () {
  const idNum = this.parentNode.id;
  (user[idNum]["checked"] == 1) ? user[idNum]["checked"] = 0 : user[idNum]["checked"] = 1;
  updateData();
});

$('.task-list').on('keydown', "[contenteditable='true']", function (event) {
  if (event.key === 'Enter') {
    const idNum = this.parentNode.id;
    user[idNum]["task"] = $(this).text();
    updateData();
  }
});

// adding new task
$('#new-task').keydown(function (event) {
  if (event.key === 'Enter') {
    let count = user.length;
    const newTask = $("#new-task").val();   //or use   $("input:text").val("");
    if (newTask != "") {
      let newElem = {
        "sn": count,
        "task": newTask,
        "checked": 0
      };
      user.push(newElem);
      $("#new-task").val("");    //or use   $("input:text").val("");
      updateData();
      $('.task-list').scrollTop($('.task-list')[0].scrollHeight - $('.task-list').height());
    } else {
      window.alert("Enter a task.");
    }
  }
});

$('#clear-session').click(function () {
  user = [];
  toDoJson.users['u1'] = user;
  $.post("/demotest", { "data": "remove" }, function (result) {
    if (Object.keys(result).length != 0) {
      toDoJson.users = result[0];
      user = toDoJson.users["u1"];
    }
  });
  displayTasks();
});

$('#mark-all').click(function () {
  // document.getElementById('task-list').getElementsByClassName('task-item').forEach.getElementsByTagName('input')[0].checked;
  if ($('#mark-all').val() === "Mark All") {
    user.forEach(elem => {
      elem["checked"] = 1;
    });
    $('#mark-all').val("Unmark All");
  } else if ($('#mark-all').val() === "Unmark All") {
    user.forEach(elem => {
      elem["checked"] = 0;
    });
    $('#mark-all').val("Mark All");
  }
  updateData();
});

$('body').on('click', '#remove-completed', function () {
  let newArr = [];
  user.forEach(elem => {
    if (elem["checked"] == 0) {
      newArr.push(elem);
    }
  });
  user = newArr;
  updateData();
});

function updateData() {
  toDoJson.users['u1'] = user;
  $.post("/demotest", toDoJson.users, function (result) {
    if (Object.keys(result).length != 0) {
      toDoJson.users = result[0];
      user = toDoJson.users["u1"];
    }
  });
  displayTasks();
}

function displayTasks() {
  let count = user.length;
  let completed = 0;

  count ? $('#mark-all').removeAttr('hidden') : $('#mark-all').attr("hidden", "");

  $('#task-list').empty();

  for (let i = 0; i < count; i++) {
    user[i]["sn"] = i;

    const newItem = document.createElement("div");
    newItem.setAttribute("id", i);
    newItem.setAttribute("class", "task-item");
    newItem.setAttribute("draggable", "true");
    newItem.innerHTML = `<input type="checkbox" value="${user[i]["task"]}" ${user[i]["checked"] ? "checked" : ""}> <label contenteditable="true"> ${user[i]["task"]} </label><span class="cross">&times;</span> <br>`;

    $('#task-list').append(newItem);

    decorateCompletedTask(i, user[i]["checked"]);
    if (user[i]["checked"]) {
      completed++;
    }
  }

  const tempTask = completed ? `${count} tasks &nbsp;  ${completed} completed 
  <input id="remove-completed" type="button" value="Remove Completed">` : `${count} tasks`;

  $('#info').html(count ? tempTask : "");
}

function verifyTask(idNum) {
  if (user[idNum]["checked"] == 0) {
    return (window.confirm("This task is not completed yet. Are you sure to remove this task? Press OK to delete."));
  }
  return true;
}

function decorateCompletedTask(idNum, state) {
  const items = $('#' + idNum);
  if (state == 1) {
    items.children('label').css('textDecoration', 'line-through');
    items.children('label').css('color', 'gray');
  } else {
    items.children('label').css('textDecoration', 'none');
    items.children('label').css('color', 'black');
  }
}

function handleDragStart(e) {
  sourceElem = this;
  sourceId = this.id;
  this.classList.add('dragElem');
}
function handleDragOver(e) {
  e.preventDefault(); // Necessary. Allows us to drop.
  this.classList.add('over');
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
  e.stopPropagation(); // Stops some browsers from redirecting.
  // Don't do anything if dropping the same column we're dragging.
  if (sourceElem != this) {
    destinationId = this.id;
  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  this.classList.remove('over');
  manageAfterDragDrop();
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

function makeDrag() {
  let cols = document.querySelectorAll('#task-list .task-item');
  [].forEach.call(cols, addDnDHandlers);
}

function manageAfterDragDrop() {
  // first remove source
  let tempTask = user[sourceId];
  let temparr = user.concat();
  let part2 = temparr.splice(parseInt(sourceId) + 1, user.length);
  let part1 = temparr.splice(0, sourceId);
  user = part1.concat(part2);
  updateData();

  // then add source at destination
  user.splice(destinationId, 0, tempTask);
  updateData();
}

$.post("/demotest", toDoJson.users, function (result) {
  if (Object.keys(result).length != 0) {
    toDoJson.users = result[0];
    user = toDoJson.users["u1"];
  }
  displayTasks();
  $('.task-list').scrollTop($('.task-list')[0].scrollHeight - $('.task-list').height());
});


// $.ajax({
//   method: "GET",
//   url: '/demotest',
//   data: toDoJson,
//   success: function(result){
//     console.log(result)
//   }
// })
