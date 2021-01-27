//1. Bring all elements we need from DOM

const timerEl = document.getElementById("time-left");
const resetBtn = document.getElementById("reset");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const timerLbl = document.getElementById("timer-label");
const breakDecBtn = document.getElementById("break-decrement");
const breakIncBtn = document.getElementById("break-increment");
const sessionDecBtn = document.getElementById("session-decrement");
const sessionIncBtn = document.getElementById("session-increment");
const breakLengthEl = document.getElementById("break-length");
const sessionLengthEl = document.getElementById("session-length");
const audioEl = document.getElementById("audio");

//2. create all program variables
//We create a global object that hold all program variables
let appState = {
  isReset: false,
  isRunning: false,
  sessionType: "work",
  breakLength: 5,
  sessionLength: 25,
  currMins: 25,
  currSecs: 0,
  timer: null,
};

//3. we split the program logic into multiple functions that perform a specific task
//reset() -- resets the program to the initial state
//       -- resets all the labels to their initial state
function reset() {
  appState.isReset = true;
  appState.isRunning = false;
  appState.breakLength = 5;
  appState.sessionLength = 25;
  appState.currMins = 25;
  appState.currSecs = 0;
  appState.sessionType = "work";
  if (appState.timer != null) {
    clearInterval(timer);
  }

  timerEl.innerText = "25:00";
  timerLbl.innerText = "Session";
  breakLengthEl.innerText = "5";
  sessionLengthEl.innerText = "25";
}

//updateDisplay()    --updates the display to the current values
function updateDisplay() {
  timerEl.innerText = `${
    appState.currMins < 10 ? "0" + appState.currMins : appState.currMins
  }:${appState.currSecs < 10 ? "0" + appState.currSecs : appState.currSecs}`;

  if (appState.sessionType === "work") {
    timerLbl.innerText = "Session";
  } else {
    timerLbl.innerText = "Break";
  }

  sessionLengthEl.innerText = appState.sessionLength.toString();
  breakLengthEl.innerText = appState.breakLength.toString();
}

//sessionIncrement() -- increments the session duration by one minute
//                   -- we only increment if the timer is not running
//                 -- we pass the value 1 to increment and -1 to decrement
function sessionIncrement(step) {
  if (!appState.isRunning) {
    if (appState.sessionLength <= 60 && appState.sessionLength >= 0) {
      appState.sessionLength += step;
      if (appState.sessionLength > 60) {
        appState.sessionLength = 60;
      }
      if (appState.sessionLength < 1) {
        appState.sessionLength = 1;
      }
    }
    if (appState.sessionType === "work") {
      appState.currMins = appState.sessionLength;
      appState.currSecs = 0;
    }
    updateDisplay();
  }
}

//BreakIncrement() -- increments the session duration by one minute
//                 -- we only increment if the timer is not running
//                 -- we pass the value 1 to increment and -1 to decrement
function breakIncrement(step) {
  if (!appState.isRunning) {
    if (appState.breakLength <= 60 && appState.breakLength >= 0) {
      appState.breakLength += step;
      if (appState.breakLength > 60) {
        appState.breakLength = 60;
      }
      if (appState.breakLength < 1) {
        appState.breakLength = 1;
      }
    }
    //are we in break mode?
    if (appState.sessionType === "break") {
      appState.currMins = appState.breakLength;
      appState.currSecs = 0;
    }
    updateDisplay();
  }
}

//pause()  -- pause the current timer
function pause() {
  appState.isRunning = false;
}

//toggleIsRunning   --toggles the IsRunning in app state
function toggleIsRunning() {
  if (appState.isRunning) {
    appState.isRunning = false;
    stopClock();
  } else {
    appState.isRunning = true;
    startClock();
  }
}

//startClock()   --assigns an setInterval function to timer app state
//               --starts the countdown
function startClock() {
  appState.timer = setInterval(() => {
    countdown();
    updateDisplay();
  }, 1000);
}

//stopClock()    --clears the Interval
//               --stops the countdown
function stopClock() {
  clearInterval(appState.timer);
  appState.timer = null;
}

//swapStates()  -- swap between session and break states
function swapStates() {
  if (appState.sessionType === "work") {
    appState.sessionType = "break";
    appState.currMins = appState.breakLength;
    appState.currSecs = 0;
  } else {
    appState.sessionType = "work";
    appState.currMins = appState.sessionLength;
    appState.currSecs = 0;
  }
}

//playBeep()    --plays the sound referenced by the audio tag
function playBeep() {
  audioEl.play();
}

//countdown()   --simply counts down clock-style using the values in the app state
//              --if timer gets to zero, it swaps states and plays the sound
function countdown() {
  if (appState.isRunning) {
    if (appState.currMins === 0 && appState.currSecs === 0) {
      swapStates();
      playBeep();
    }
    if (appState.currSecs == 0) {
      appState.currMins--;
      appState.currSecs = 60;
    }
    appState.currSecs--;
  }
}

//4. we set the event listeners

resetBtn.addEventListener("click", reset);
sessionIncBtn.addEventListener("click", () => {
  sessionIncrement(1);
});
sessionDecBtn.addEventListener("click", () => {
  sessionIncrement(-1);
});
breakIncBtn.addEventListener("click", () => {
  breakIncrement(1);
});
breakDecBtn.addEventListener("click", () => {
  breakIncrement(-1);
});
startBtn.addEventListener("click", () => {
  appState.isReset = false;
  toggleIsRunning();
});

pauseBtn.addEventListener("click", () => {
  if (!appState.isReset) {
    toggleIsRunning();
  }
});
