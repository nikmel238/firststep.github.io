`use strict`;
let canvas;
let ctx;

let i_max = 1.5;
let i_min = -1.5;
let r_min = -2.5;
let r_max = 1.5;

var max_iter = 1024;
var escape = 100;
var palette = [];

// помещаем все данные в объект
function createTask(row) {
	let task = {
		row: row, // определяет строку, для которой генерируются пикселы
		width: rowData.width, // определяет ширину строки
		generation: generation, // определяет сколько раз прибегли к увеличению
		r_min: r_min,
		r_max: r_max,
		i: i_max + ((i_min - i_max) * row) / canvas.height,
		max_iter: max_iter,
		escape: escape,
	};
	return task;
}

// преобразуем числа в массив цветов
function makePalette() {
	function wrap(x) {
		x = ((x + 256) & 0x1ff) - 256;
		if (x < 0) x = -x;
		return x;
	}
	for (i = 0; i <= this.max_iter; i++) {
		palette.push([wrap(7 * i), wrap(5 * i), wrap(11 * i)]);
	}
}

// получаем результат от worker и рисует соответствующие пикселы в канвас
function drawRow(workerResults) {
	let values = workerResults.values;

	let pixelData = rowData.data;

	for (let i = 0; i < rowData.width; i++) {
		let red = i * 4;
		let green = i * 4 + 1;
		let blue = i * 4 + 2;
		let alpha = i * 4 + 3;

		pixelData[alpha] = 255;

		if (values[i] < 0) {
			pixelData[red] = pixelData[green] = pixelData[blue] = 0;
		} else {
			let color = this.palette[values[i]];

			pixelData[red] = color[0];
			pixelData[green] = color[1];
			pixelData[blue] = color[2];
		}
	}

	ctx.putImageData(this.rowData, 0, workerResults.row);
}

// задаем глобальные переменные, используемые кодом для рисования
function setupGraphics() {
	// обращаемся к канвас
	canvas = document.getElementById('fractal');
	// создаем контекст 2д
	ctx = canvas.getContext('2d');

	// задаем размеры канвас
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let width = ((i_max - i_min) * canvas.width) / canvas.height;
	let r_mid = (r_max + r_min) / 2;
	r_min = r_mid - width / 2;
	r_max = r_mid + width / 2;

	// инициализируем переменную, используемую для записи пикселов в канвас
	rowData = ctx.createImageData(canvas.width, 1);

	// инициализируем палитру цветов, которую используем для рисования множества как фрактального изображения
	makePalette();
}
