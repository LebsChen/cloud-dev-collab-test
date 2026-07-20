(function () {
  const form = document.getElementById("guess-form");
  const input = document.getElementById("guess-input");
  const button = document.getElementById("guess-btn");
  const feedback = document.getElementById("feedback");
  const countEl = document.getElementById("count");
  const restartBtn = document.getElementById("restart-btn");

  let secret;
  let count;

  function reset() {
    secret = Math.floor(Math.random() * 100) + 1;
    count = 0;
    countEl.textContent = "0";
    feedback.textContent = "";
    feedback.className = "feedback";
    input.value = "";
    input.disabled = false;
    button.disabled = false;
    restartBtn.hidden = true;
    input.focus();
  }

  function setFeedback(text, kind) {
    feedback.textContent = text;
    feedback.className = "feedback " + kind;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const guess = Number(input.value);
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      setFeedback("请输入 1 到 100 之间的整数", "invalid");
      return;
    }
    count += 1;
    countEl.textContent = String(count);
    if (guess > secret) {
      setFeedback("猜大了，再小一点！", "high");
    } else if (guess < secret) {
      setFeedback("猜小了，再大一点！", "low");
    } else {
      setFeedback("恭喜你，猜对了！答案就是 " + secret + "，共猜了 " + count + " 次。", "correct");
      input.disabled = true;
      button.disabled = true;
      restartBtn.hidden = false;
    }
    input.select();
  });

  restartBtn.addEventListener("click", reset);

  reset();
})();
