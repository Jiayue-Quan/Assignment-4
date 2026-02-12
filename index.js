const API = "http://localhost:3000";


function getCookie(name) {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();

    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

const title = document.getElementById("title");
title.textContent = `${getCookie("username")}'s To-Do List`;



const authHeaders = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getCookie("token")
};


document.addEventListener("DOMContentLoaded", function () {
  loadTodos();
});

async function loadTodos() {
  try {
    var response = await fetch(API + "/todos", {
      headers: authHeaders
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    var todos = await response.json();
    renderTodos(todos);

  } catch (err) {
    console.error("Failed to load todos", err);
  }
}

function startEditing(todo, spanElement) {
  // Create an input
  var input = document.createElement("input");
  input.type = "text";
  input.value = todo.title;
  input.style.width = "70%";

  // Replace the span with the input
  spanElement.replaceWith(input);
  input.focus();

  // Submit edit on Enter
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      finishEditing(todo.id, input.value, input);
    }
  });

  // Submit edit on losing focus
  input.addEventListener("blur", function () {
    finishEditing(todo.id, input.value, input);
  });
}

async function finishEditing(todoId, newTitle, inputElement) {
  newTitle = newTitle.trim();
  if (!newTitle) {
    // If empty, do not update
    loadTodos();
    return;
  }

  try {
    await fetch(API + "/todos/" + todoId, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ title: newTitle })
    });

    // Reload the todos
    loadTodos();

  } catch (err) {
    console.error("Failed to update todo", err);
    loadTodos();
  }
}


function renderTodos(todos) {
  var list = document.querySelector(".todo-list");
  list.innerHTML = "";

  todos.forEach(function (todo) {
    var li = document.createElement("li");
    li.className = "todo-item";

    // Checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", function () {
      toggleTodo(todo.id, checkbox.checked);
    });

    // Title span (or editable input)
    var span = document.createElement("span");
    span.textContent = todo.title;

    span.addEventListener("click", function () {
      checkbox.checked = !checkbox.checked;
      toggleTodo(todo.id, checkbox.checked);
    });

    // Edit button
    var editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", function () {
      startEditing(todo, span);
    });

    // Delete button
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}


async function newTodo(value) {
  event.preventDefault();
  var input = document.querySelector(".todo-input input");
  var title = input.value.trim();

  if (!title) return;

  try {
    var response = await fetch(API + "/todos", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ title: title })
    });

    if (!response.ok) throw new Error("Failed to create todo");

    input.value = "";
    loadTodos();

  } catch (err) {
    console.error(err);
  }
}


async function toggleTodo(id, completed) {
  try {
    await fetch(API + "/todos/" + id, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ completed: completed })
    });
    
  } catch (err) {
    console.error(err);
  }
}


async function deleteTodo(id) {
  try {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
      headers: authHeaders
    });

    loadTodos();

  } catch (err) {
    console.error(err);
  }
}

async function logOut() {
    try {
        await fetch(API + "/logout", {
            method: "POST",
            headers: authHeaders
        });
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "username=; path=/; max-age=0";

        // Redirect to login page
        window.location.href = "login.html";
    }
    catch (err) {
        console.error(err);
    }
}
window.logout = logOut;