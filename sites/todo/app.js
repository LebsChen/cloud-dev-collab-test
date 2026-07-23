(function () {
  "use strict";

  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  var list = document.getElementById("todo-list");
  var emptyTip = document.getElementById("empty-tip");

  function updateEmptyTip() {
    emptyTip.classList.toggle("hidden", list.children.length > 0);
  }

  function createTodoItem(text) {
    var li = document.createElement("li");
    li.className = "todo-item";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", "标记完成");
    checkbox.addEventListener("change", function () {
      li.classList.toggle("completed", checkbox.checked);
    });

    var span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = text;

    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "删除";
    deleteBtn.addEventListener("click", function () {
      li.remove();
      updateEmptyTip();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) {
      return;
    }
    list.appendChild(createTodoItem(text));
    input.value = "";
    input.focus();
    updateEmptyTip();
  });

  updateEmptyTip();
})();
