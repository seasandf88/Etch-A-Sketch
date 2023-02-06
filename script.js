const output = document.querySelector(".slider-value");
const slider = document.querySelector(".slider");
const color = document.querySelector("#color-picker");
const customMode = document.querySelector("#custom");

// Default Values
let res = 32;
let size = 640;

// Create Grid Function
const gridDiv = [];
const board = document.querySelector(".canvas");
const gridContainer = document.createElement("div");
gridContainer.classList.add("grid-container");
board.append(gridContainer);

function canvas() {
  gridContainer.style.height = `${size}px`;
  gridContainer.style.width = `${size}px`;
  let area = res * res;
  for (i = 1; i <= area; i++) {
    gridDiv[i] = document.createElement(`div`);
    gridContainer.append(gridDiv[i]);
    gridDiv[i].classList.add(`grid`);
    gridDiv[i].classList.add(`grid-border`);
    // gridDiv[i].setAttribute("onmousemove", "down()");
    gridDiv[i].style.height = `${size / res}px`;
  }
  gridContainer.style.gridTemplateColumns = `repeat(${res}, 1fr`;
  gridContainer.style.gridTemplateRows = `repeat(${res}, 1fr`;
}

// First Init
output.textContent = slider.value;
canvas();
draw();

// Slider Control
slider.oninput = function () {
  output.textContent = this.value;
  res = this.value;
  reset();
  canvas();
  draw();
};

function reset() {
  while (gridContainer.firstChild) {
    gridContainer.firstChild.remove();
  }
}

// Reset Button
const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", () => {
  reset();
  canvas();
  draw();
});

// Mode Selection
let method = 1;
const methodSelectors = document.querySelectorAll(".selection");

let currentColor = "#FF6A3D";

methodSelectors.forEach(function (selector) {
  selector.addEventListener("click", (e) => {
    clearBtnActive();
    if (selector.id == "custom") {
      selector.classList.add("btn-active");
      method = 1;
    } else if (selector.id == "random") {
      selector.classList.add("btn-active");

      method = 2;
    } else if (selector.id == "darken") {
      selector.classList.add("btn-active");

      method = 3;
    } else if (selector.id == "lighten") {
      selector.classList.add("btn-active");

      method = 4;
    } else if (selector.id == "eraser") {
      selector.classList.add("btn-active");

      method = 5;
    } else if (selector.id == "grid") {
      const blocks = document.querySelectorAll(".grid");
      blocks.forEach(function (block) {
        block.classList.toggle("grid-border");
      });
      customMode.classList.add("btn-active");
      method = 1;
    } else if (selector.id == "picker") {
      selector.classList.add("btn-active");
      const blocks = document.querySelectorAll(".grid");
      blocks.forEach(function (block) {
        block.addEventListener("click", () => {
          currentColor = window
            .getComputedStyle(block)
            .getPropertyValue("background-color");
          method = 1;
          clearBtnActive();
          color.value = cnvtToHex(currentColor);
          customMode.classList.add("btn-active");
        });
      });
    }
    e.preventDefault();
  });
});

color.addEventListener("input", () => {
  currentColor = color.value;
});

// Clear Buttons Active State
function clearBtnActive() {
  const btns = document.querySelectorAll(".btn");
  btns.forEach(function (btn) {
    btn.classList.remove("btn-active");
  });
}

function draw() {
  const blocks = document.querySelectorAll(".grid");
  blocks.forEach(function (block) {
    block.addEventListener("mouseenter", (e) => {
      if (e.buttons == 1) {
        // True if left mouse button is pressed
        if (method == 1) {
          block.style.backgroundColor = `${currentColor}`;
        } else if (method == 2) {
          block.style.backgroundColor = `hsl(${Math.floor(
            Math.random() * 360
          )}, 100%, 50%)`;
        } else if (method == 3) {
          let colorRGB = window
            .getComputedStyle(block)
            .getPropertyValue("background-color");
          colorValue = colorRGB.slice(4, -1).split(",");
          block.style.backgroundColor = `rgb(${parseInt(colorValue[0]) - 10}, ${
            parseInt(colorValue[1]) - 10
          }, ${parseInt(colorValue[2]) - 10})`;
        } else if (method == 4) {
          let colorRGB = window
            .getComputedStyle(block)
            .getPropertyValue("background-color");
          colorValue = colorRGB.slice(4, -1).split(",");
          block.style.backgroundColor = `rgb(${parseInt(colorValue[0]) + 10}, ${
            parseInt(colorValue[1]) + 10
          }, ${parseInt(colorValue[2]) + 10})`;
        } else if (method == 5) {
          block.style.backgroundColor = `#fff`;
        }
      }
    });
  });
}

// RGB to Hex conversion
function cnvtToHex(color) {
  let cv = color.slice(4, -1).split(", ");
  function valueToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return valueToHex(r) + valueToHex(g) + valueToHex(b);
  }
  return "#" + rgbToHex(parseInt(cv[0]), parseInt(cv[1]), parseInt(cv[2]));
}
