// определяем количество веб-сценариев
let numberOfWorkers = 16;
// создаем массив для размещения сценариев
let workers = [];
// переменная, для определения на какой строке находимся
let nextRow = 0;
// отслеживает сколько раз было запущено вычисление изображения
let generation = 0;

// создаем обработчик, который запускает функцию после загрузки страницы
window.onload = init;

function init() {
	// извлекаем контекст элемента канвас
	setupGraphics();

	window.onresize = function () {
		resizeToWindow();
	};

	// добавим обработчик событий клика
	canvas.onclick = function (event) {
		handleClick(event.clientX, event.clientY);
	};
	for (let i = 0; i < numberOfWorkers; i += 1) {
		// создаем сценарий
		let worker = new Worker(`js/worker.js`);

		// создаем обработчик сообщений
		worker.onmessage = function (event) {
			// передаем функции сценарий, который только что закончил выполнение задачи и его результат, соответственно
			processWork(event.target, event.data);
		};

		// добавляем в воркер свойство, обозначающее что событие свободно
		worker.idle = true;

		// добавляем его в массив
		workers.push(worker);
	}

	// запускаем веб сценарии
	startWorkers();
}

// функция будет запускать веб сценарий, а также перезапускать при изменении масштаба изображения
function startWorkers() {
	generation += 1;
	nextRow = 0;

	// запускаем цикл по всем сценариям
	for (let i = 0; i < workers.length; i += 1) {
		let worker = workers[i];

		// выбираем только свободные сценарии
		if (worker.idle) {
			// генерируем объект Task из mandellib.js
			let task = createTask(nextRow);

			// говорим что сценарий занят
			worker.idle = false;
			// отправляем сообщение сценарию, которое содержит объект
			worker.postMessage(task);

			// увеличиваем, чтобы следующий сценарий приступил к вычислению следующей строки
			nextRow += 1;
		}
	}
}

function processWork(worker, workerResults) {
	// если ген соответствует текущему
	if (workerResults.generation === generation) {
		// передаем результаты для рисования пикселов в канвас
		drawRow(workerResults);
	}

	// для присвоения сценарию новой задачи
	reassignWorker(worker);
}

function reassignWorker(worker) {
	let row = (nextRow += 1);

	// если строка превысит высоту канвас, то дело сделано
	if (row >= canvas.height) {
		worker.idle = true;
	} else {
		// создаем новый объект, который надо будет вычеслить
		let task = createTask(row);
		worker.idle = false;
		worker.postMessage(task);
	}
}

function handleClick(x, y) {
	var width = r_max - r_min;
	var height = i_min - i_max;
	var click_r = r_min + (width * x) / canvas.width;
	var click_i = i_max + (height * y) / canvas.height;

	var zoom = 8;

	r_min = click_r - width / zoom;
	r_max = click_r + width / zoom;
	i_max = click_i - height / zoom;
	i_min = click_i + height / zoom;

	startWorkers();
}

// функция следит за тем, чтобы размеры канвас соответсвовали размеру браузера
function resizeToWindow() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var width = ((i_max - i_min) * canvas.width) / canvas.height;
	var r_mid = (r_max + r_min) / 2;
	r_min = r_mid - width / 2;
	r_max = r_mid + width / 2;
	rowData = ctx.createImageData(canvas.width, 1);

	startWorkers();
}
