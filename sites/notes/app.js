(function () {
  'use strict';

  var STORAGE_KEY = 'team-notes-wall';

  var input = document.getElementById('note-input');
  var addBtn = document.getElementById('add-btn');
  var list = document.getElementById('notes-list');

  var notes = loadNotes();
  var filterKeyword = '';

  var filterInput = createFilterInput();
  render();

  addBtn.addEventListener('click', addNote);
  input.addEventListener('keydown', function (e) {
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
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
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

  function createFilterInput() {
    var section = document.createElement('section');
    section.className = 'note-filter';
    section.setAttribute('aria-label', '过滤便签');

    var el = document.createElement('input');
    el.type = 'search';
    el.id = 'filter-input';
    el.className = 'note-input filter-input';
    el.placeholder = '按关键词过滤便签……';
    el.setAttribute('aria-label', '按关键词过滤便签');
    section.appendChild(el);

    var form = document.querySelector('.note-form');
    form.parentNode.insertBefore(section, form.nextSibling);
    section.style.marginBottom = '1.5rem';
    return el;
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
      text.style.margin = '0 0 0.5rem';

      var time = document.createElement('time');
      time.className = 'note-time';
      time.dateTime = new Date(note.createdAt).toISOString();
      time.textContent = formatTime(note.createdAt);
      time.style.cssText = 'display:block;font-size:0.75rem;color:var(--color-muted);margin-bottom:0.5rem;';

      var actions = document.createElement('div');
      actions.className = 'note-actions';
      actions.style.cssText = 'display:flex;gap:0.5rem;';

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

      [editBtn, delBtn].forEach(function (btn) {
        btn.style.cssText = 'padding:0.25rem 0.75rem;font-size:0.8rem;border:1px solid var(--color-border);border-radius:6px;background:var(--color-bg);cursor:pointer;';
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      li.appendChild(text);
      li.appendChild(time);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }
})();
