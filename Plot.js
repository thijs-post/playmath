/**
 * 
 */

const TICK = 10;
const HALF_TICK = 5;

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

	axesCanvas = document.getElementById("theAxesCanvas");
	axesContext = axesCanvas.getContext("2d");
	axesContext.strokeStyle = "black";
	axesContext.lineWidth = 1;

	var drawButton = document.getElementById("drawButton");
	drawButton.onclick = handleDrawButtonClick;

	var clearButton = document.getElementById("clearButton");
	clearButton.onclick = handleClearButtonClick;

	axesCheckbox = document.getElementById("axesCheckbox");
	axesCheckbox.onclick = handleAxesGridCheckboxClick;
	gridCheckbox = document.getElementById("gridCheckbox");
	gridCheckbox.onclick = handleAxesGridCheckboxClick;

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

function handleAxesGridCheckboxClick() {

	if (axesCheckbox.checked) {
		var xMin = parseFloat(xMinInput.value); var xMax = parseFloat(xMaxInput.value);
		var yMin = parseFloat(yMinInput.value); var yMax = parseFloat(yMaxInput.value);

		// The origin in canvas coordinates.
		var originX = toCanvasX(0.0, xMin, xMax);
		var originY = toCanvasY(0.0, yMin, yMax);

		// Draw X and Y axes.
		var ctx = axesContext;
		//ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		drawLineSegment(ctx, 0, originY, wI, originY);
		drawLineSegment(ctx, originX, 0, originX, hI);

		// Tick marks.
		var xTickIncrement = Math.pow(10, Math.floor(Math.log10(xMax-xMin)));
		var halfXTickIncrement = xTickIncrement/2.0;
		var firstXTick = xTickIncrement * (Math.ceil(xMin/xTickIncrement));
		console.log("X-axis ticks from " + firstXTick + " increment " + xTickIncrement);
		for(let xTick=firstXTick; xTick<=xMax; xTick+=xTickIncrement) {
			let canvasXTick = toCanvasX(xTick, xMin, xMax);
			drawLineSegment(ctx, canvasXTick, originY-TICK, canvasXTick, originY+TICK );
			let halfCanvasXTick = toCanvasX(xTick+halfXTickIncrement, xMin, xMax);
			drawLineSegment(ctx,halfCanvasXTick, originY-HALF_TICK, halfCanvasXTick, originY+HALF_TICK );
			if(gridCheckbox.checked) {
				ctx.setLineDash([2, 4]);
				drawLineSegment(ctx, canvasXTick, 0, canvasXTick, hI);
				ctx.setLineDash([]);
			}
		}
		var yTickIncrement = Math.pow(10, Math.floor(Math.log10(yMax-yMin)));
		var halfYTickIncrement = yTickIncrement/2.0;
		var firstYTick = yTickIncrement * (Math.ceil(yMin/yTickIncrement));
		console.log("Y-axis ticks from " + firstYTick + " increment " + yTickIncrement);
		for(let yTick=firstYTick; yTick<=yMax; yTick+=yTickIncrement) {
			let canvasYTick = toCanvasY(yTick, yMin, yMax);
			drawLineSegment(ctx, originX-TICK, canvasYTick, originX+TICK, canvasYTick );
			let halfCanvasYTick = toCanvasY(yTick+halfYTickIncrement, yMin, yMax);
			drawLineSegment(ctx, originX-HALF_TICK, halfCanvasYTick, originX+HALF_TICK, halfCanvasYTick );
			if(gridCheckbox.checked) {
				ctx.setLineDash([2, 4]);
				drawLineSegment(ctx, 0, canvasYTick, wI, canvasYTick);
				ctx.setLineDash([]);
			}
		}



	} else {
		axesContext.clearRect(0, 0, wI, hI);
	}


}


function plot(aFunction, xMin, xMax, yMin, yMax) {

	plotContext.beginPath();
	plotContext.moveTo(0, toCanvasY(aFunction(xMin), yMin, yMax));
	for (i = 1; i <= wI; i++) {
		var x = toX(i, xMin, xMax);
		var y = aFunction(x);
		var plotCanvasY = toCanvasY(y, yMin, yMax);
		plotContext.lineTo(i, plotCanvasY);
	}
	plotContext.strokeStyle = "red";
	plotContext.lineWidth = 3;
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

