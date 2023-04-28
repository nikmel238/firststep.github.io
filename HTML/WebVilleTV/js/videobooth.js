// создадим видео и добавим в него 2 видео
let videos = {
	video1: '../video/demovideo1',
	video2: '../video/demovideo2',
};

// создаем переменную для эффекта
let effectFunction = null;

// создаем функцию, которая будет активна после загрузки страницы
window.onload = function () {
	// получаем ссылку не элемент
	let video = document.getElementById('video');
	// присваиваем ему атрибут src с необходимым форматом видео
	video.src = videos.video1 + getFormatExtension();
	// загружаем видео
	video.load();

	// получаем ссылку на селекторы
	let controlLinks = document.querySelectorAll('a.control');
	for (let i = 0; i < controlLinks.length; i += 1) {
		controlLinks[i].onclick = handleControl;
	}

	// получаем ссылку на селекторы
	let effectLinks = document.querySelectorAll('a.effect');
	for (let i = 0; i < effectLinks.length; i += 1) {
		effectLinks[i].onclick = setEffect;
	}

	// получаем ссылку на селекторы
	let videoLinks = document.querySelectorAll('a.videoSelection');
	for (let i = 0; i < videoLinks.length; i += 1) {
		videoLinks[i].onclick = setVideo;
	}

	pushUnpushButtons('video1', []);
	pushUnpushButtons('normal', []);
	video.addEventListener('ended', endedHandler, false);
	video.addEventListener('play', processFrame, false);
	video.addEventListener('error', errorHandler, false);
};

// функция определения на какую кнопку нажали, и помогает изменить внешний вид
function handleControl(e) {
	let id = e.target.getAttribute('id');
	let video = document.getElementById('video');

	if (id === 'play') {
		pushUnpushButtons('play', ['pause']);
		// если видео просмотрено до конца, то снова загрузим его
		if (video.ended) {
			video.load();
		}
		// запускаем видео
		video.play();
	} else if (id === 'pause') {
		pushUnpushButtons('pause', ['play']);
		// ставим видео на паузу
		video.pause();
	} else if (id === 'loop') {
		if (isButtonPushed('loop')) {
			pushUnpushButtons('', ['loop']);
		} else {
			pushUnpushButtons('loop', []);
		}
		// зацикливаем
		video.loop = !video.loop;
	} else if (id === 'mute') {
		if (isButtonPushed('mute')) {
			pushUnpushButtons('', ['mute']);
		} else {
			pushUnpushButtons('mute', []);
		}
		// отключаем звук
		video.muted = !video.muted;
	}
}

// функция определения на какую кнопку нажали, и помогает изменить внешний вид
function setEffect(e) {
	let id = e.target.getAttribute('id');

	if (id === 'normal') {
		pushUnpushButtons('normal', ['western', 'noir', 'scifi']);
		effectFunction = null;
	} else if (id === 'western') {
		pushUnpushButtons('western', ['normal', 'noir', 'scifi']);
		effectFunction = western;
	} else if (id === 'noir') {
		pushUnpushButtons('noir', ['normal', 'western', 'scifi']);
		effectFunction = noir;
	} else if (id === 'scifi') {
		pushUnpushButtons('scifi', ['normal', 'western', 'noir']);
		effectFunction = scifi;
	}
}

// функция определения на какую кнопку нажали, и помогает изменить внешний вид
function setVideo(e) {
	let id = e.target.getAttribute('id');
	let video = document.getElementById('video');

	if (id === 'video1') {
		pushUnpushButtons('video1', ['video2']);
	} else if (id === 'video2') {
		pushUnpushButtons('video2', ['video1']);
	}

	// присваиваем выбранному видео формат
	video.src = videos[id] + getFormatExtension();
	video.load();
	video.play();
	// меняем изображение кнопке
	pushUnpushButtons('play', ['pause']);
}

// функция нажатия/не нажатия кнопки
function pushUnpushButtons(idToPush, idArrayToUnpush) {
	// проверяем нажата ли кнопка
	if (idToPush !== '') {
		//получаем ссылку на элемент с помощью его ID
		let anchor = document.getElementById(idToPush);
		// и получаем его class
		let theClass = anchor.getAttribute('class');

		// проверяем имеется ли в в классе элементы selected, если нет то...
		if (!theClass.indexOf('selected') >= 0) {
			// прибавляем к классу
			theClass = theClass + ' selected';
			// устанавливаем новый класс
			anchor.setAttribute('class', theClass);
			// создаем новую ссылку на изображение
			let newImage = 'url(../images/' + idToPush + 'pressed.png';
			// присваиваем элементу новый фон
			anchor.style.backgroundImage = newImage;
		}
	}

	// запускаем цикл по кнопкам указанным в массиве (второй аргумент)
	for (let i = 0; i < idArrayToUnpush.length; i += 1) {
		// получаем элемент с помощью ID
		anchor = document.getElementById(idArrayToUnpush[i]);
		// получаем его класс
		theClass = anchor.getAttribute('class');
		// если класс содержит в себе элемент selected, то
		if (theClass.indexOf('selected') >= 0) {
			// удаляем selected
			theClass = theClass.replace('selected', '');
			// присваиваем элементу новый класс
			anchor.setAttribute('class', theClass);
			// убираем фоновую картинку
			anchor.style.backgroundImage = ``;
		}
	}
}

// функция проверки нажата ли кнопка
function isButtonPushed(id) {
	// получаем элемент с помощью ID
	let anchor = document.getElementById(id);
	// получаем его класс
	let theClass = anchor.getAttribute('class');
	// возвращаем true или false
	return theClass.indexOf('selected') >= 0;
}

// функция для действия по завершению видео
function endedHandler() {
	pushUnpushButtons('', ['play']);
}

// функция определению формата
function getFormatExtension() {
	let video = document.getElementById('video');
	if (video.canPlayType('video/mp4') != '') {
		return '.mp4';
	} else if (video.canPlayType('video/webm') != '') {
		return '.webm';
	} else if (video.canPlayType('video/ogg') != '') {
		return '.ogv';
	}
}

// функция для обработки писелов и перенос их в канвас
function processFrame() {
	let video = document.getElementById('video');

	// проверяем запущено ли видео
	if (video.paused || video.ended) {
		return;
	}

	// получаем ссылки на элементы канвас
	let bufferCanvas = document.getElementById('buffer');
	let displayCanvas = document.getElementById('display');
	// получаем ссылки на контекст
	let buffer = bufferCanvas.getContext('2d');
	let display = displayCanvas.getContext('2d');

	// передаем кадр видео и передаем в канвас
	buffer.drawImage(video, 0, 0, bufferCanvas.width, displayCanvas.height);
	// передаем полученное изображение другой переменной
	let frame = buffer.getImageData(
		0,
		0,
		bufferCanvas.width,
		displayCanvas.height
	);

	// получаем длину полученного кадра
	let length = frame.data.length / 4;

	// для каждого значения пиксела получаем значения RGB
	for (let i = 0; i < length; i++) {
		let r = frame.data[i * 4 + 0];
		let g = frame.data[i * 4 + 1];
		let b = frame.data[i * 4 + 2];
		//
		if (effectFunction) {
			// передаем функции эффекта пикселы
			effectFunction(i, r, g, b, frame.data);
		}
	}
	// после обработки кадра, передаем его в канвас
	display.putImageData(frame, 0, 0);

	// запускаем повторно функцию, как можно быстрее
	setTimeout(processFrame, 0);
}

// функция для эффекта
function noir(pos, r, g, b, data) {
	let brightness = (3 * r + 4 * g + b) >>> 3;
	if (brightness < 0) brightness = 0;
	data[pos * 4 + 0] = brightness;
	data[pos * 4 + 1] = brightness;
	data[pos * 4 + 2] = brightness;
}

function western(pos, r, g, b, data) {
	let brightness = (3 * r + 4 * g + b) >>> 3;
	data[pos * 4 + 0] = brightness + 40;
	data[pos * 4 + 1] = brightness + 20;
	data[pos * 4 + 2] = brightness - 20;
}

function scifi(pos, r, g, b, data) {
	let offset = pos * 4;
	data[offset] = Math.round(255 - r);
	data[offset + 1] = Math.round(255 - g);
	data[offset + 2] = Math.round(255 - b);
}

function bwcartoon(pos, r, g, b, data) {
	let offset = pos * 4;
	if (outputData[offset] < 120) {
		outputData[offset] = 80;
		outputData[++offset] = 80;
		outputData[--offset] = 80;
	} else {
		outputData[offset] = 255;
		outputData[++offset] = 255;
		outputData[--offset] = 255;
	}
	outputData[++offset] = 255;
	++offset;
}

function errorHandler() {
	let video = document.getElementById('video');
	if (video.error) {
		video.poster = '../images/technicaldifficulties.jpg';
		alert(video.error.code);
	}
}
