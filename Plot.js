/**
 * 
 */

// TODO add reactivity to boundary value edits

const PLOT_COLOR = "red";
const PLOT_LINEWIDTH = 3;
const AXES_COLOR = "black";
const AXES_LINEWIDTH = 1;
const GRID_COLOR = "black";
const GRID_LINEWIDTH = 1;
const GRID_LINEDASH = [2, 4];

const TICK = 10;
const HALF_TICK = 5;

// Canvas dimensions, specified in the html.
var wStr;
var hStr;
var wI;
var hI;
var wF;
var hF;

var plotCanvas;
var plotContext;
var axesCanvas;
var axesContext;
var gridCanvas;
var gridContext;

var axesCheckbox;
var gridCheckbox;

window.onload = init;

function init() {

	plotCanvas = document.getElementById("thePlotCanvas");
	wStr = plotCanvas.width;
	hStr = plotCanvas.height;
	wI = parseInt(wStr);
	hI = parseInt(hStr);
	wF = parseFloat(wStr);
	hF = parseFloat(hStr);
	plotContext = plotCanvas.getContext("2d");
	plotContext.strokeStyle = PLOT_COLOR;
	plotContext.lineWidth = PLOT_LINEWIDTH;

	axesCanvas = document.getElementById("theAxesCanvas");
	axesContext = axesCanvas.getContext("2d");
	axesContext.strokeStyle = AXES_COLOR;
	axesContext.lineWidth = AXES_LINEWIDTH;

	gridCanvas = document.getElementById("theGridCanvas");
	gridContext = gridCanvas.getContext("2d");
	gridContext.strokeStyle = GRID_COLOR;
	gridContext.lineWidth = GRID_LINEWIDTH;
	gridContext.setLineDash(GRID_LINEDASH);

	var drawButton = document.getElementById("drawButton");
	drawButton.onclick = handleDrawButtonClick;

	var clearButton = document.getElementById("clearButton");
	clearButton.onclick = handleClearButtonClick;

	axesCheckbox = document.getElementById("axesCheckbox");
	axesCheckbox.onclick = drawAxesAndGridIfDesired;
	gridCheckbox = document.getElementById("gridCheckbox");
	gridCheckbox.onclick = drawAxesAndGridIfDesired;
	
	drawAxesAndGridIfDesired();

}

function handleDrawButtonClick() {

	plotContext.clearRect(0, 0, wI, hI);

	var fstr = functionInput.value;
	var theFunction = eval("(x) => (" + fstr + ")");


	plot(theFunction,
		parseFloat(xMinInput.value), parseFloat(xMaxInput.value),
		parseFloat(yMinInput.value), parseFloat(yMaxInput.value));
}

function handleClearButtonClick() {
	plotContext.clearRect(0, 0, wI, hI);
}

function drawAxesAndGridIfDesired() {


	var xMin = parseFloat(xMinInput.value); var xMax = parseFloat(xMaxInput.value);
	var yMin = parseFloat(yMinInput.value); var yMax = parseFloat(yMaxInput.value);

	// The origin in canvas coordinates.
	var originX = toCanvasX(0.0, xMin, xMax);
	var originY = toCanvasY(0.0, yMin, yMax);
	
	// Tick mark properties.
	var xTickIncrement = Math.pow(10, Math.floor(Math.log10(xMax - xMin)));
	var firstXTick = xTickIncrement * (Math.ceil(xMin / xTickIncrement));
	var halfXTickIncrement = xTickIncrement / 2.0;
	var firstHalfXTick = firstXTick - halfXTickIncrement > xMin ? firstXTick - halfXTickIncrement : firstXTick + halfXTickIncrement;
	var yTickIncrement = Math.pow(10, Math.floor(Math.log10(yMax - yMin)));
	var firstYTick = yTickIncrement * (Math.ceil(yMin / yTickIncrement));
	var halfYTickIncrement = yTickIncrement / 2.0;
	var firstHalfYTick = firstYTick - halfYTickIncrement > yMin ? firstYTick - halfYTickIncrement : firstYTick + halfYTickIncrement;

	axesContext.clearRect(0, 0, wI, hI);
	if (axesCheckbox.checked) {
		// Draw X and Y axes.
		drawLineSegment(axesContext, 0, originY, wI, originY);
		drawLineSegment(axesContext, originX, 0, originX, hI);

		// Tick marks.
		for (let tick = firstXTick; tick <= xMax; tick += xTickIncrement) {
			let canvasTick = toCanvasX(tick, xMin, xMax);
			drawLineSegment(axesContext, canvasTick, originY - TICK, canvasTick, originY + TICK);
		}

		for (let tick = firstHalfXTick; tick <= xMax; tick += xTickIncrement) {
			let canvasTick = toCanvasX(tick, xMin, xMax);
			drawLineSegment(axesContext, canvasTick, originY - HALF_TICK, canvasTick, originY + HALF_TICK);
		}

		for (let tick = firstYTick; tick <= yMax; tick += yTickIncrement) {
			let canvasTick = toCanvasY(tick, yMin, yMax);
			drawLineSegment(axesContext, originX - TICK, canvasTick, originX + TICK, canvasTick);
		}

		for (let tick = firstHalfYTick; tick <= yMax; tick += yTickIncrement) {
			let canvasTick = toCanvasY(tick, yMin, yMax);
			drawLineSegment(axesContext, originX - HALF_TICK, canvasTick, originX + HALF_TICK, canvasTick);
		}

	}


	// Grid.
	gridContext.clearRect(0, 0, wI, hI);
	if (gridCheckbox.checked) {
		for (let tick = firstXTick; tick <= xMax; tick += xTickIncrement) {
			let canvasTick = toCanvasX(tick, xMin, xMax);
			drawLineSegment(gridContext, canvasTick, 0, canvasTick, hI);
		}
		for (let tick = firstYTick; tick <= yMax; tick += yTickIncrement) {
			let canvasTick = toCanvasY(tick, yMin, yMax);
			drawLineSegment(gridContext, 0, canvasTick, wI, canvasTick);
		}
	}



}


function plot(aFunction, xMin, xMax, yMin, yMax) {
	
	// TODO handle OOB and NaN

	plotContext.beginPath();
	plotContext.moveTo(0, toCanvasY(aFunction(xMin), yMin, yMax));
	for (i = 1; i <= wI; i++) {
		var x = toX(i, xMin, xMax);
		var y = aFunction(x);
		var plotCanvasY = toCanvasY(y, yMin, yMax);
		plotContext.lineTo(i, plotCanvasY);
	}
	plotContext.stroke();


}

function toCanvasX(x, xMin, xMax) {
	return Math.floor(wF * (x - xMin) / (xMax - xMin));
}

function toCanvasY(y, yMin, yMax) {
	return Math.floor(hF * (yMax - y) / (yMax - yMin));
}

function toX(canvasX, xMin, xMax) {
	return (xMin + (canvasX / wF) * (xMax - xMin));
}

function drawLineSegment(ctx, ax, ay, bx, by) {
	// Utility function.
	// Presuming strokeStyle and lineWidth have already been called.
	ctx.beginPath();
	ctx.moveTo(ax, ay);
	ctx.lineTo(bx, by);
	ctx.stroke();
}

function fillTriangle(ax, ay, bx, by, cx, cy) {
	plotContext.beginPath();
	plotContext.moveTo(ax, ay);
	plotContext.lineTo(bx, by);
	plotContext.lineTo(cx, cy);
	plotContext.closePath();

	plotContext.fillStyle = "black";
	plotContext.fill();
}

function sqr(x) {
	return x * x;
}

