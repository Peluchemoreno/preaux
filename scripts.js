// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// const undoBtn = document.querySelector(".undo-button");
// const clearButton = document.querySelector("#clear-button");
// const colorPicker = document.querySelector("#color");
// const gridSizeInput = document.querySelector("#grid-size");
// const tool = document.querySelector("#tool-select");
// const textInputEl = document.querySelector(".container__input");
// const cancelBtn = document.querySelector(".button_cancel");
// const confirmBtn = document.querySelector(".button_confirm");
// const modal = document.querySelector(".modal");

// let isDrawing = false;
// let startX, startY, currentX, currentY;
// let paths = [];
// let index = -1;
// let rubberLinePath = null;

// // Initialize Canvas
// function startup() {
//   canvas.width = 500;
//   canvas.height = 500;
//   drawGrid();
//   updateUndoButton();
// }

// // Draw the grid on the canvas
// function drawGrid() {
//   const gridSize = parseInt(gridSizeInput.value);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.strokeStyle = "lightgray";
//   for (let x = 0; x < canvas.width; x += gridSize) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.height);
//     ctx.stroke();
//   }
//   for (let y = 0; y < canvas.height; y += gridSize) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }
// }

// // Snap coordinates to the nearest grid point
// function snapToGrid(value) {
//   const gridSize = parseInt(gridSizeInput.value);
//   return Math.round(value / gridSize) * gridSize;
// }

// // Get coordinates from event (supports both mouse and touch)
// function getCoordinates(event) {
//   const rect = canvas.getBoundingClientRect();
//   const x = event.touches ? event.touches[0].clientX : event.clientX;
//   const y = event.touches ? event.touches[0].clientY : event.clientY;
//   return {
//     x: snapToGrid(x - rect.left),
//     y: snapToGrid(y - rect.top),
//   };
// }

// // Update the color based on user selection
// function updateColor() {
//   ctx.strokeStyle = colorPicker.value;
//   ctx.fillStyle = colorPicker.value;
// }

// function addToUndoStack() {
//   paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
//   index++;
//   updateUndoButton();
// }

// // Start drawing
// function startDrawing(event) {
//   isDrawing = true;
//   const { x, y } = getCoordinates(event);
//   startX = x;
//   startY = y;
//   updateColor();
//   if (tool.value === "gutter") {
//     ctx.setLineDash([]);
//   } else if (tool.value === "existing-gutter") {
//     ctx.setLineDash([2, 2]);
//   } else if (tool.value === "downspout" || tool.value === "drop") {
//     ctx.setLineDash([]);
//   }
// }

// // Draw a rubber line
// function drawRubberLine(event) {
//   if (
//     !isDrawing ||
//     tool.value === "downspout" ||
//     tool.value === "drop" ||
//     tool.value === "valley-shield" ||
//     tool.value === "free-text"
//   )
//     return;
//   const { x, y } = getCoordinates(event);
//   currentX = x;
//   currentY = y;

//   if (rubberLinePath) {
//     ctx.putImageData(rubberLinePath, 0, 0); // Clear temporary line
//   } else {
//     rubberLinePath = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   }

//   ctx.beginPath();
//   ctx.moveTo(startX, startY);
//   ctx.lineTo(currentX, currentY);
//   ctx.lineWidth = 2;
//   ctx.stroke();
// }

// // Finalize the line on pointer up
// function stopDrawing() {
//   if (isDrawing) {
//     isDrawing = false;
//     rubberLinePath = null; // Clear rubber band

//     if (tool.value === "downspout") {
//       ctx.beginPath();
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(
//         startX + gridSizeInput.value / 2.75,
//         startY + gridSizeInput.value / 2.75
//       );
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(
//         startX - gridSizeInput.value / 2.75,
//         startY + gridSizeInput.value / 2.75
//       );
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(
//         startX - gridSizeInput.value / 2.75,
//         startY - gridSizeInput.value / 2.75
//       );
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(
//         startX + gridSizeInput.value / 2.75,
//         startY - gridSizeInput.value / 2.75
//       );
//       ctx.stroke();
//       addToUndoStack();
//     } else if (tool.value === "drop") {
//       ctx.beginPath();
//       ctx.arc(startX, startY, gridSizeInput.value / 4, 0, 2 * Math.PI);
//       ctx.stroke();
//       addToUndoStack();
//     } else if (tool.value === "valley-shield") {
//       ctx.beginPath();
//       ctx.arc(startX, startY, gridSizeInput.value / 4, 0, 2 * Math.PI);
//       ctx.fill();
//       addToUndoStack();
//     } else if (tool.value === "free-text") {
//       modal.classList.add("modal_visible");
//       // let userInput = prompt(
//       //   'Type in the elbow sequence or the length of the piece. (ex: AABA, 57")'
//       // );
//     } else {
//       ctx.beginPath();
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(currentX, currentY);
//       ctx.lineWidth = 2;
//       ctx.stroke();

//       // Save the path state
//       addToUndoStack();
//     }
//   }
// }

// // Undo the last action
// undoBtn.addEventListener("click", () => {
//   undo();
// });

// function undo() {
//   if (index <= 0) {
//     clearCanvas();
//   } else {
//     index--;
//     paths.pop();
//     ctx.putImageData(
//       paths[index] || ctx.getImageData(0, 0, canvas.width, canvas.height),
//       0,
//       0
//     );
//     updateUndoButton();
//   }
// }

// // Clear the canvas
// function clearCanvas() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   drawGrid();
//   paths = [];
//   index = -1;
//   updateUndoButton();
// }

// clearButton.addEventListener("click", clearCanvas);

// // Update the undo button
// function updateUndoButton() {
//   undoBtn.innerText = paths.length > 0 ? "Undo" : "Update Grid";
//   undoBtn.style.backgroundColor = paths.length > 0 ? "silver" : "#d9f170";
// }

// function placeText(x, y) {
//   const userInput = textInputEl.value;
//   ctx.font = "1000 12px Arial";
//   ctx.fillStyle = "black";
//   ctx.textAlign = "center";
//   if (!userInput) {
//     return;
//   } else {
//     ctx.fillText(`${userInput}`, x, y);
//     addToUndoStack();
//   }
//   textInputEl.value = "";
//   modal.classList.remove("modal_visible");
// }

// // Add event listeners
// canvas.addEventListener("pointerdown", startDrawing);
// canvas.addEventListener("pointermove", drawRubberLine);
// canvas.addEventListener("pointerup", stopDrawing);
// canvas.addEventListener("pointerout", stopDrawing);

// cancelBtn.addEventListener("click", (e) => {
//   modal.classList.remove("modal_visible");
//   textInputEl.value = "";
// });

// confirmBtn.addEventListener("click", (e) => {
//   placeText(startX, startY);
// });

// // Add touch events for mobile and tablets
// canvas.addEventListener("touchstart", (event) => {
//   event.preventDefault();
//   startDrawing(event);
// });
// canvas.addEventListener("touchmove", (event) => {
//   event.preventDefault();
//   drawRubberLine(event);
// });
// canvas.addEventListener("touchend", (event) => {
//   event.preventDefault();
//   stopDrawing();
// });
// canvas.addEventListener("touchcancel", stopDrawing);

// // Initialize on DOMContentLoaded
// document.addEventListener("DOMContentLoaded", startup);
// document.addEventListener("keydown", (e) => {
//   if (e.key === "Escape") {
//     undo();
//   }
// });

function finish() {
  window.onbeforeprint = (event) => {
    toolsBar = document.querySelector(".tools-bar");
    toolsBar.style.display = "none";
    legendPic = document.querySelector(".legend-pic");
  };
  window.print();
}

window.onafterprint = (event) => {
  toolsBar = document.querySelector(".tools-bar");
  toolsBar.style.display = "flex";
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const undoBtn = document.querySelector(".undo-button");
const clearButton = document.querySelector("#clear-button");
const colorPicker = document.querySelector("#color");
const gridSizeInput = document.querySelector("#grid-size");
const tool = document.querySelector("#tool-select");
const textInputEl = document.querySelector(".container__input");
const cancelBtn = document.querySelector(".button_cancel");
const confirmBtn = document.querySelector(".button_confirm");
const modal = document.querySelector(".modal");

let isDrawing = false;
let startX, startY, currentX, currentY;
let lines = []; // Store start and end coordinates for lines
let index = -1;
let rubberLinePath = null;
let history = []; // History to store previous states of the canvas

// Initialize Canvas
function startup() {
  canvas.width = 500;
  canvas.height = 500;
  drawGrid();
  updateUndoButton();
}

// Draw the grid on the canvas
function drawGrid() {
  ctx.setLineDash([]);
  const gridSize = parseInt(gridSizeInput.value);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "lightgray";
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Snap coordinates to the nearest grid point
function snapToGrid(value) {
  const gridSize = parseInt(gridSizeInput.value);
  return Math.round(value / gridSize) * gridSize;
}

// Get coordinates from event (supports both mouse and touch)
function getCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.touches ? event.touches[0].clientX : event.clientX;
  const y = event.touches ? event.touches[0].clientY : event.clientY;
  return {
    x: snapToGrid(x - rect.left),
    y: snapToGrid(y - rect.top),
  };
}

// Update the color based on user selection
function updateColor() {
  ctx.strokeStyle = colorPicker.value;
  ctx.fillStyle = colorPicker.value;
}

// Start drawing
function startDrawing(event) {
  isDrawing = true;
  const { x, y } = getCoordinates(event);
  startX = x;
  startY = y;
  ctx.lineWidth = 2;
  updateColor();

  if (tool.value === "gutter") {
    ctx.setLineDash([]);
  } else if (tool.value === "existing-gutter") {
    ctx.setLineDash([2, 2]);
  } else if (tool.value === "downspout" || tool.value === "drop") {
    ctx.setLineDash([]);
  }

  if (tool.value === "eraser") {
    // Additional eraser logic if needed
    return;
  }
}

// Draw a rubber line (for both drawing and erasing)
function drawRubberLine(event) {
  if (
    !isDrawing ||
    tool.value === "downspout" ||
    tool.value === "free-text" ||
    tool.value === "drop" ||
    tool.value === "valley-shield" ||
    tool.value === "eraser"
  )
    return;

  const { x, y } = getCoordinates(event);
  currentX = x;
  currentY = y;

  if (rubberLinePath) {
    ctx.putImageData(rubberLinePath, 0, 0); // Clear temporary line
  } else {
    rubberLinePath = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Finalize the line on pointer up
function stopDrawing(event) {
  if (isDrawing) {
    isDrawing = false;
    rubberLinePath = null; // Clear rubber band

    if (tool.value === "downspout") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + gridSizeInput.value / 2.75,
        startY + gridSizeInput.value / 2.75
      );
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX - gridSizeInput.value / 2.75,
        startY + gridSizeInput.value / 2.75
      );
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX - gridSizeInput.value / 2.75,
        startY - gridSizeInput.value / 2.75
      );
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + gridSizeInput.value / 2.75,
        startY - gridSizeInput.value / 2.75
      );
      ctx.stroke();
      // Add line coordinates instead of ImageData
      lines.push({
        startX,
        startY,
        endX: startX,
        endY: startY,
        tool: tool.value,
        color: colorPicker.value,
      });
      updateUndoButton();
    } else if (tool.value === "drop") {
      ctx.beginPath();
      ctx.arc(startX, startY, gridSizeInput.value / 4, 0, 2 * Math.PI);
      ctx.stroke();
      // Add line coordinates instead of ImageData
      lines.push({
        startX,
        startY,
        endX: startX,
        endY: startY,
        tool: tool.value,
        color: colorPicker.value,
      });
      updateUndoButton();
    } else if (tool.value === "valley-shield") {
      ctx.beginPath();
      ctx.arc(startX, startY, gridSizeInput.value / 4, 0, 2 * Math.PI);
      ctx.fill();
      // Add line coordinates instead of ImageData
      lines.push({
        startX,
        startY,
        endX: startX,
        endY: startY,
        tool: tool.value,
        color: colorPicker.value,
      });
      updateUndoButton();
    } else if (tool.value === "free-text") {
      modal.classList.add("modal_visible");
    } else if (tool.value === "eraser") {
      console.log(startX, startY);
      eraseNearestLine(); // Call the erase function to remove entire lines
    } else {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.lineWidth = 2;
      ctx.stroke();
      // Add line coordinates instead of ImageData
      lines.push({
        startX,
        startY,
        endX: currentX,
        endY: currentY,
        tool: tool.value,
        color: colorPicker.value,
      });
      updateUndoButton();
    }
    if (tool.value !== "free-text") {
      saveState();
    }
  }
}

function placeText(x, y) {
  const userInput = textInputEl.value;
  ctx.font = "1000 12px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  if (!userInput) {
    return;
  } else {
    ctx.fillText(`${userInput}`, x, y);
    // addToUndoStack();
    lines.push({
      startX,
      startY,
      endX: startX,
      endY: startY,
      tool: tool.value,
      content: userInput,
      color: colorPicker.value,
    });
    saveState();
  }
  textInputEl.value = "";
  modal.classList.remove("modal_visible");
}

function eraseNearestLine() {
  const tolerance = 10; // Tolerance in pixels for erasing (you can adjust this)

  // Loop through the stored lines and check if they intersect with the eraser area
  for (let i = lines.length - 1; i >= 0; i--) {
    let line = lines[i];

    // Check if the line is within the eraser's tolerance
    if (
      isLineCloseToCursor(
        line.startX,
        line.startY,
        line.endX,
        line.endY,
        startX,
        startY,
        tolerance
      )
    ) {
      lines.splice(i, 1); // Remove the line from lines
      redrawCanvas(); // Redraw canvas with updated lines
      break;
    }
    if (
      line.tool === "downspout" ||
      line.tool === "drop" ||
      line.tool === "valley-shield" ||
      line.tool === "free-text"
    ) {
      if (
        distanceBetweenPoints(line.startX, line.startY, startX, startY) < 10
      ) {
        lines.splice(i, 1); // Remove the line from lines
        redrawCanvas(); // Redraw canvas with updated lines
        break;
      }
    }
  }
  updateUndoButton(); // Keep track of the undo stack after erasing a line
}

// Function to check if a line intersects with the eraser's area
// function lineIntersects(x1, y1, x2, y2, line, tolerance) {
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const dist =
//     Math.abs(dy * line.startX - dx * line.startY + x2 * y1 - y2 * x1) /
//     Math.sqrt(dx * dx + dy * dy);
//   return dist <= tolerance;
// }

// Function to calculate the distance from a point to a line
// Function to check if a line intersects with the eraser's area
function isLineCloseToCursor(x1, y1, x2, y2, mouseX, mouseY, radius) {
  // Calculate the perpendicular distance from the mouse to the line
  const distance = pointToLineDistance(x1, y1, x2, y2, mouseX, mouseY);

  // Check if the distance is within the given radius
  return distance <= radius;
}

// Function to calculate the perpendicular distance from a point to a line
function pointToLineDistance(x1, y1, x2, y2, px, py) {
  // Calculate the distance using the point-to-line distance formula
  const numerator = Math.abs(
    (y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1
  );
  const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return numerator / denominator;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  const dx = x2 - x1; // Difference in x coordinates
  const dy = y2 - y1; // Difference in y coordinates

  // Apply the distance formula
  return Math.sqrt(dx * dx + dy * dy);
}

// Redraw the entire canvas based on stored lines
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setLineDash([]);
  drawGrid();
  updateColor();
  lines.forEach((line) => {
    console.log(line.color);
    ctx.strokeStyle = line.color;
    ctx.fillStyle = line.color;
    if (line.tool === "downspout") {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(
        line.startX + gridSizeInput.value / 2.75,
        line.startY + gridSizeInput.value / 2.75
      );
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(
        line.startX - gridSizeInput.value / 2.75,
        line.startY + gridSizeInput.value / 2.75
      );
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(
        line.startX - gridSizeInput.value / 2.75,
        line.startY - gridSizeInput.value / 2.75
      );
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(
        line.startX + gridSizeInput.value / 2.75,
        line.startY - gridSizeInput.value / 2.75
      );
      ctx.setLineDash([]);
      ctx.stroke();
    } else if (line.tool === "drop") {
      ctx.beginPath();
      ctx.arc(
        line.startX,
        line.startY,
        gridSizeInput.value / 4,
        0,
        2 * Math.PI
      );
      ctx.setLineDash([]);
      ctx.stroke();
    } else if (line.tool === "valley-shield") {
      ctx.beginPath();
      ctx.arc(
        line.startX,
        line.startY,
        gridSizeInput.value / 4,
        0,
        2 * Math.PI
      );
      ctx.setLineDash([]);
      ctx.fill();
    } else if (line.tool === "existing-gutter") {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
    } else if (line.tool === "free-text") {
      ctx.font = "1000 12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(line.content, line.startX, line.startY);
    } else {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
    }
  });
}

// Undo the last action
undoBtn.addEventListener("click", () => {
  undo();
});

function undo() {
  // debugger;
  if (history.length > 0) {
    // Pop the last saved state and restore the lines array
    history.pop();
    lines = history[history.length - 1];
    redrawCanvas(); // Redraw canvas with the previous state
    updateUndoButton(); // Update undo button state
  } else {
    clearCanvas(); // If no history, clear the canvas
  }
  updateUndoButton();
  console.log(lines, history);
}

function saveState() {
  history.push([...lines]); // Copy the current lines array to preserve the state
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  lines = []; // Clear current lines
  history = []; // Clear history
  index = -1; // Reset the index (this is unnecessary)
  updateUndoButton(); // Update the undo button state
}

clearButton.addEventListener("click", clearCanvas);

// Update the undo button
function updateUndoButton() {
  if (lines && history) {
    undoBtn.innerText =
      lines.length > 0 && history.length > 0 ? "Undo" : "Update Grid";
    undoBtn.style.backgroundColor =
      lines.length > 0 && history.length > 0 ? "silver" : "#d9f170";
  } else {
    return;
  }
}

// Add event listeners
canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", drawRubberLine);
canvas.addEventListener("pointerup", () => {
  stopDrawing();
});
canvas.addEventListener("pointerout", stopDrawing);

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("modal_visible");
  textInputEl.value = "";
});

confirmBtn.addEventListener("click", () => {
  placeText(startX, startY);
  console.log(lines, history);
});

// Add touch events for mobile and tablets
canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  startDrawing(event);
});
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  drawRubberLine(event);
});
canvas.addEventListener("touchend", (event) => {
  event.preventDefault();
  stopDrawing();
});
canvas.addEventListener("touchcancel", stopDrawing);

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", startup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    undo();
  }
});
