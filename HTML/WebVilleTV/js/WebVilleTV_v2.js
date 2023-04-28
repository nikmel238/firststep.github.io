let position = 0; // задаем переменную для позиции видео в массиве
let playlist = []; //  создаем плейлист в виде массива
let video; // создаем переменную для элемента

// создаем функцию, которая будет запускаться после загрузки страницы
window.onload = function () {
	playlist = [
		'../video/preroll',
		'../video/areyoupopular',
		'../video/destinationearth',
	]; // добавляем в массив ссылки на видео
	video = document.getElementById('video'); // получаем ссылку на элемент страницы
	video.addEventListener('ended', nextVideo, false); // создаем обработчик по завершению видео

	video.src = playlist[position] + getFormatExtension(); //передаем элементу позицию видео
	video.load(); // загружаем его
	video.play(); // воспроизводим
};

// функция для запуска следующего видео

function nextVideo() {
	position += 1;
	if (position >= playlist.length) {
		position = 0;
	}

	video.src = playlist[position] + getFormatExtension();
	video.load();
	video.play();
}

// функция определению формата
function getFormatExtension() {
	if (video.canPlayType('video/mp4') != '') {
		return '.mp4';
	} else if (video.canPlayType('video/webm') != '') {
		return '.webm';
	} else if (video.canPlayType('video/ogg') != '') {
		return '.ogv';
	}
}
