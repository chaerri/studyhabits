const stretchNotif = new Audio('beep.mp3');
const waterNotif = new Audio('boop.mp3')

let stretchInterval = 30 * 60; // 30 minutes in seconds
let waterInterval = 10 * 60;   // 10 minutes in seconds
let stretchRemaining = 0;
let waterRemaining = 0;



function updateCountdowns() {
  if (stretchRemaining > 0) {
    stretchRemaining--;
    updateDisplay('stretch', stretchRemaining);
    if (stretchRemaining === 0) {
      enableButton('stretch');
      stretchNotif.play();
    }
  }

  if (waterRemaining > 0) {
    waterRemaining--;
    updateDisplay('water', waterRemaining);
    if (waterRemaining === 0) {
      enableButton('water');
      waterNotif.play();
    }
  }
}

function formatTime(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateDisplay(type, secondsLeft) {
  const display = document.getElementById(`${type}-countdown`);
  const button = document.querySelector(`#${type}-button`);

  if (secondsLeft > 0) {
    display.innerText = `${formatTime(secondsLeft)} till next ${type} break`;
    button.disabled = true;
    button.classList.add('disabled');
  } else {
    display.innerText = `Time to ${type === 'stretch' ? 'stretch' : 'drink'}!`;
    button.disabled = false;
    button.classList.remove('disabled');
  }
}

function startTimer(type) {
  if (type === 'stretch') {
    stretchRemaining = stretchInterval;
    updateDisplay('stretch', stretchRemaining);
  } else {
    waterRemaining = waterInterval;
    updateDisplay('water', waterRemaining);
  }
}

function setIntervalTime(type) {
  const value = parseInt(document.getElementById(`${type}-interval`).value);
  if (type === 'stretch') {
    stretchInterval = value * 60; // Convert minutes to seconds
  } else {
    waterInterval = value * 60;
  }
}

function enableButton(type) {
  const button = document.querySelector(`#${type}-button`);
  button.disabled = false;
  button.classList.remove('disabled');
}

function showPage(page) {
  document.getElementById("home").style.display = page === "home" ? "block" : "none";
  document.getElementById("settings").style.display = page === "settings" ? "block" : "none";
}

function populateDropdowns() {
  const stretchSelect = document.getElementById("stretch-interval");
  const waterSelect = document.getElementById("water-interval");
  for (let i = 1; i <= 60; i++) {
    const opt1 = document.createElement("option");
    const opt2 = document.createElement("option");
    opt1.value = opt1.text = i;
    opt2.value = opt2.text = i;
    if (i === 30) opt1.selected = true;
    if (i === 10) opt2.selected = true;
    stretchSelect.add(opt1);
    waterSelect.add(opt2);
  }

  updateDisplay('stretch', 0);
  updateDisplay('water', 0);
}

// Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
});

// Toggle theme and save preference
const toggleBtn = document.getElementById("toggle-theme");
toggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

// NOTIF SETTINGS
    // Apply saved button text and audio source on page load
    function applySavedText(buttonId, defaultText) {
      const savedText = localStorage.getItem(buttonId) || defaultText;
      const btn = document.getElementById(buttonId);
      btn.textContent = savedText;

      if (buttonId === "toggle-stretch") {
        stretchNotif.src = savedText.toLowerCase() + '.mp3';
        stretchNotif.load();
      } else if (buttonId === "toggle-water") {
        waterNotif.src = savedText.toLowerCase() + '.mp3';
        waterNotif.load();
      }
    }

    // Setup toggle button with text, audio swap, and play sound on click
    function setupToggleButton(buttonId, textA, textB) {
      const btn = document.getElementById(buttonId);
      btn.addEventListener("click", () => {
        const currentText = btn.textContent;
        const newText = currentText === textA ? textB : textA;

        btn.textContent = newText;
        localStorage.setItem(buttonId, newText);

        let audioToPlay;
        if (buttonId === "toggle-stretch") {
          stretchNotif.src = newText.toLowerCase() + '.mp3';
          stretchNotif.load();
          audioToPlay = stretchNotif;
        } else if (buttonId === "toggle-water") {
          waterNotif.src = newText.toLowerCase() + '.mp3';
          waterNotif.load();
          audioToPlay = waterNotif;
        }

        if (audioToPlay) {
          audioToPlay.play().catch(err => {
            // Handle autoplay restrictions gracefully
            console.warn("Audio play failed:", err);
          });
        }
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      applySavedText("toggle-stretch", "Beep");
      applySavedText("toggle-water", "Boop");

      setupToggleButton("toggle-stretch", "Beep", "Boop");
      setupToggleButton("toggle-water", "Boop", "Beep");
    });


window.onload = populateDropdowns;
setInterval(updateCountdowns, 1000);
