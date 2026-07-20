(function () {
  "use strict";

  var display = document.getElementById("display");

  var state = {
    current: "0",
    previous: null,
    operator: null,
    justEvaluated: false,
  };

  function updateDisplay(text) {
    display.textContent = text;
  }

  function formatNumber(n) {
    if (!isFinite(n)) return "错误";
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    var s = String(Math.round(n * 1e10) / 1e10);
    return s;
  }

  function inputDigit(d) {
    if (state.justEvaluated) {
      state.current = d;
      state.justEvaluated = false;
      return;
    }
    state.current = state.current === "0" ? d : state.current + d;
  }

  function inputDot() {
    if (state.justEvaluated) {
      state.current = "0.";
      state.justEvaluated = false;
      return;
    }
    if (state.current.indexOf(".") === -1) {
      state.current += ".";
    }
  }

  function compute(a, op, b) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        if (b === 0) return null;
        return a / b;
      default:
        return b;
    }
  }

  function applyPending() {
    if (state.operator === null || state.previous === null) return true;
    var result = compute(
      parseFloat(state.previous),
      state.operator,
      parseFloat(state.current)
    );
    if (result === null) {
      clearAll();
      updateDisplay("不能除以 0");
      return false;
    }
    state.current = formatNumber(result);
    state.previous = null;
    state.operator = null;
    return true;
  }

  function setOperator(op) {
    if (state.operator !== null && !state.justEvaluated) {
      if (!applyPending()) return;
    }
    state.previous = state.current;
    state.operator = op;
    state.current = "0";
    state.justEvaluated = false;
  }

  function equals() {
    if (!applyPending()) return;
    state.justEvaluated = true;
    updateDisplay(state.current);
  }

  function clearAll() {
    state.current = "0";
    state.previous = null;
    state.operator = null;
    state.justEvaluated = false;
  }

  function toggleSign() {
    if (state.current === "0") return;
    state.current =
      state.current.charAt(0) === "-"
        ? state.current.slice(1)
        : "-" + state.current;
  }

  function percent() {
    state.current = formatNumber(parseFloat(state.current) / 100);
  }

  document.querySelector(".keys").addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;

    if (btn.dataset.digit !== undefined) {
      inputDigit(btn.dataset.digit);
    } else if (btn.dataset.op !== undefined) {
      setOperator(btn.dataset.op);
    } else if (btn.dataset.action === "dot") {
      inputDot();
    } else if (btn.dataset.action === "equals") {
      equals();
      return;
    } else if (btn.dataset.action === "clear") {
      clearAll();
    } else if (btn.dataset.action === "sign") {
      toggleSign();
    } else if (btn.dataset.action === "percent") {
      percent();
    }
    updateDisplay(state.current);
  });

  updateDisplay(state.current);
})();
