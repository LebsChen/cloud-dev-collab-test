(function () {
  "use strict";

  var STORAGE_KEY = "contacts";

  var form = document.getElementById("contact-form");
  var nameInput = document.getElementById("name-input");
  var phoneInput = document.getElementById("phone-input");
  var addBtn = document.getElementById("add-btn");
  var searchInput = document.getElementById("search-input");
  var list = document.getElementById("contact-list");
  var emptyTip = document.getElementById("empty-tip");

  var PHONE_RE = /^[+]?[0-9][0-9\- ]{4,19}$/;

  var formError = document.createElement("p");
  formError.className = "form-error";
  formError.style.color = "#dc2626";
  formError.style.display = "none";
  form.appendChild(formError);

  var cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.id = "cancel-btn";
  cancelBtn.textContent = "取消";
  cancelBtn.style.display = "none";
  addBtn.insertAdjacentElement("afterend", cancelBtn);

  var contacts = load();
  var editingId = null;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data)) return [];
      return data.filter(function (c) {
        return (
          c &&
          typeof c.id === "string" &&
          typeof c.name === "string" &&
          typeof c.phone === "string"
        );
      });
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      showError("保存失败，数据仅本次会话有效");
    }
  }

  function showError(msg) {
    formError.textContent = msg;
    formError.style.display = "";
  }

  function clearError() {
    formError.textContent = "";
    formError.style.display = "none";
  }

  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function filtered() {
    var q = searchInput.value.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(function (c) {
      return (
        c.name.toLowerCase().indexOf(q) !== -1 ||
        c.phone.toLowerCase().indexOf(q) !== -1
      );
    });
  }

  function render() {
    var items = filtered();
    list.innerHTML = "";
    items.forEach(function (c) {
      var li = document.createElement("li");
      li.className = "contact-item" + (c.id === editingId ? " editing" : "");
      if (c.id === editingId) li.style.outline = "2px solid #f59e0b";
      li.dataset.id = c.id;

      var info = document.createElement("div");
      info.className = "contact-info";
      var name = document.createElement("span");
      name.className = "contact-name";
      name.textContent = c.name;
      var phone = document.createElement("span");
      phone.className = "contact-phone";
      phone.textContent = c.phone;
      info.appendChild(name);
      info.appendChild(phone);

      var actions = document.createElement("div");
      actions.className = "contact-actions";
      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "编辑";
      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "delete-btn danger";
      delBtn.textContent = "删除";
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(info);
      li.appendChild(actions);
      list.appendChild(li);
    });
    emptyTip.style.display = items.length ? "none" : "";
    emptyTip.textContent = contacts.length
      ? items.length
        ? ""
        : "没有匹配的联系人"
      : "暂无联系人";
  }

  function resetForm() {
    editingId = null;
    form.reset();
    addBtn.textContent = "新增";
    cancelBtn.style.display = "none";
    clearError();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    if (!name) {
      showError("请输入姓名");
      nameInput.focus();
      return;
    }
    if (!PHONE_RE.test(phone)) {
      showError("电话格式不正确（5-20 位数字，可含 +、-、空格）");
      phoneInput.focus();
      return;
    }
    var duplicate = contacts.some(function (c) {
      return c.phone === phone && c.id !== editingId;
    });
    if (duplicate) {
      showError("该电话已存在，不能重复添加");
      phoneInput.focus();
      return;
    }
    clearError();

    if (editingId !== null) {
      var target = contacts.find(function (c) {
        return c.id === editingId;
      });
      if (target) {
        target.name = name;
        target.phone = phone;
      }
    } else {
      contacts.push({ id: genId(), name: name, phone: phone });
    }
    save();
    resetForm();
    render();
  });

  list.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    var li = btn.closest(".contact-item");
    if (!li) return;
    var id = li.dataset.id;
    var contact = contacts.find(function (c) {
      return c.id === id;
    });
    if (!contact) return;

    if (btn.classList.contains("edit-btn")) {
      editingId = id;
      nameInput.value = contact.name;
      phoneInput.value = contact.phone;
      addBtn.textContent = "保存";
      cancelBtn.style.display = "";
      clearError();
      render();
      nameInput.focus();
    } else if (btn.classList.contains("delete-btn")) {
      if (window.confirm("确定删除联系人「" + contact.name + "」吗？")) {
        contacts = contacts.filter(function (c) {
          return c.id !== id;
        });
        if (editingId === id) resetForm();
        save();
        render();
      }
    }
  });

  cancelBtn.addEventListener("click", function () {
    resetForm();
    render();
  });

  searchInput.addEventListener("input", render);

  render();
})();
