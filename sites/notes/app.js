(function () {
  'use strict';

  var STORAGE_KEY = 'team-notes-wall';

  var input = document.getElementById('note-input');
  var addBtn = document.getElementById('add-btn');
  var list = document.getElementById('notes-list');

  var filterInput = document.getElementById('filter-input');

  var notes = loadNotes();
  var filterKeyword = '';

  render();

  addBtn.addEventListener('click', addNote);
  input.addEventListener('keydown', function (e) {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter') addNote();
  });
  filterInput.addEventListener('input', function () {
    filterKeyword = filterInput.value.trim().toLowerCase();
    render();
  });

  function loadNotes() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (n) {
        return n && typeof n.text === 'string';
      });
    } catch (e) {
      return [];
    }
  }

  function saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      window.alert('保存失败：浏览器存储不可用或已满，便签将无法持久化。');
    }
  }

  function addNote() {
    var text = input.value.trim();
    if (!text) return;
    notes.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      text: text,
      createdAt: Date.now()
    });
    input.value = '';
    saveNotes();
    render();
    input.focus();
  }

  function deleteNote(id) {
    if (!window.confirm('确定删除这条便签吗？')) return;
    notes = notes.filter(function (n) { return n.id !== id; });
    saveNotes();
    render();
  }

  function editNote(id) {
    var note = notes.find(function (n) { return n.id === id; });
    if (!note) return;
    var next = window.prompt('编辑便签内容：', note.text);
    if (next === null) return;
    next = next.trim();
    if (!next) return;
    note.text = next;
    saveNotes();
    render();
  }

  function formatTime(ts) {
    var d = new Date(ts);
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function render() {
    list.innerHTML = '';

    var visible = filterKeyword
      ? notes.filter(function (n) {
          return n.text.toLowerCase().indexOf(filterKeyword) !== -1;
        })
      : notes;

    if (visible.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'note-card note-empty';
      empty.textContent = filterKeyword ? '没有匹配的便签' : '暂无便签，添加一条吧！';
      list.appendChild(empty);
      return;
    }

    visible.forEach(function (note) {
      var li = document.createElement('li');
      li.className = 'note-card';
      li.dataset.id = note.id;

      var text = document.createElement('p');
      text.className = 'note-text';
      text.textContent = note.text;

      var time = document.createElement('time');
      time.className = 'note-time';
      time.dateTime = new Date(note.createdAt).toISOString();
      time.textContent = formatTime(note.createdAt);

      var actions = document.createElement('div');
      actions.className = 'note-actions';

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'edit-btn';
      editBtn.textContent = '编辑';
      editBtn.addEventListener('click', function () { editNote(note.id); });

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'delete-btn';
      delBtn.textContent = '删除';
      delBtn.addEventListener('click', function () { deleteNote(note.id); });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      li.appendChild(text);
      li.appendChild(time);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }
})();
