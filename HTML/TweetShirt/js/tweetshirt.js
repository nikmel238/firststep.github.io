`use strict`;

// запускаем скрипт после загрузки страницы с помощью свойства onload
window.onload = function () {
	const previewButton = document.getElementById('previewButton'); // передаем переменной ссылку на элемент MOD
	previewButton.onclick = previewHandler; // при нажатии на button передается функция
};

// функция при нажатии на button
function previewHandler() {
	const canvas = document.getElementById(`tshirtCanvas`); // передаем переменной ссылку на элемент DOM
	const context = canvas.getContext(`2d`); // передаем переменной контекст в режиме 2D

	fillBackgroundColor(canvas, context); // заливаем все белым

	const selectObj = document.getElementById(`shape`); // передаем переменной ссылку на элемент DOM
	const index = selectObj.selectedIndex; // получаем индекс выбранного значения
	const shape = selectObj[index].value; // присваиваем переменной значение индекса

	// в зависимости от выбранного вида фигур
	if (shape === `squares`) {
		for (let squares = 0; squares < 20; squares += 1) {
			// рисуем 20 шт с помощью drawSquare
			drawSquare(canvas, context);
		}
	} else if (shape === `circles`) {
		for (let circles = 0; circles < 20; circles += 1) {
			// рисуем 20 шт с помощью drawSquare
			drawCircle(canvas, context);
		}
	} else if (shape === `triangles`) {
		for (let triangles = 0; triangles < 20; triangles += 1) {
			//рисуем 20 треугольников
			drawTriangles(canvas, context);
		}
	}

	drawText(canvas, context); // добавляем элемент текста
	drawBird(canvas, context); // добавляем изображение
}

// функция для рисования квадратов
function drawSquare(canvas, context) {
	// создаем рандомную позицию и размер квадрата
	const w = Math.floor(Math.random() * 40);
	const x = Math.floor(Math.random() * canvas.width);
	const y = Math.floor(Math.random() * canvas.height);

	context.fillStyle = `lightblue`; // залиаваем фигуру в необходимы цвет
	context.fillRect(x, y, w, w); // используя контекст рисуем с заданными параметрами
	context.fillStyle = `black`;
	context.strokeRect(x, y, w, w);
}
// функция рисования кругов
function drawCircle(canvas, context) {
	// создаем рандомную позицию и размер квадрата
	const radius = Math.floor(Math.random() * 40);
	const x = Math.floor(Math.random() * canvas.width);
	const y = Math.floor(Math.random() * canvas.height);

	context.beginPath(); // включаем режим рисования
	context.arc(x, y, radius, 0, degreesToRadians(360), true); // рисуем дугу с заданными параметрами
	context.fillStyle = `lightblue`; // задаем цвет заливки
	context.fill(); // заливаем контур
	context.stroke();
	context.lineWidth = 1;
}

// функция для рисованию треугольников
function drawTriangles(canvas, context) {
	const x = Math.floor(Math.random() * canvas.width);
	const y = Math.floor(Math.random() * canvas.height);
	const size = Math.floor(Math.random() * 40);

	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + size, y);
	context.lineTo(x + size / 2, y - (Math.sqrt(3) / 2) * size);
	context.closePath();
	context.fillStyle = 'lightblue';
	context.fill(); // заливаем контур

	context.stroke();
	context.lineWidth = 1;
}

// функция преобразования грудусов в радианы
const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

//функция отчистки элемента canvas
function fillBackgroundColor(canvas, context) {
	const selectObj = document.getElementById(`backgroundColor`); // передаем переменной ссылку на элемент DOM
	const index = selectObj.selectedIndex; // получаем индекс выбранного значения
	const bgColor = selectObj[index].value; // присваиваем переменной значение индекса

	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
}

/* // функция обработки твита
function updateTweets(tweets) {
	const tweetsSelection = document.getElementById(`tweets`); // присваиваем ссылку элемента DOM

	// для каждого твита из массива
	for (let i = 0; i < tweets.length; i += 1) {
		let tweet = tweets[i];
		let option = document.createElement(`option`); // создаем элемент
		option.text = tweet.text; // присваиваем ему текст твита
		option.value = tweet.text.replace(`\"`, '`'); // заменяем виды кавычек

		tweetsSelection.options.add(option); // добавляем options в DOM
	}

	tweetsSelection.selectedIndex = 0;
} */

// функция для написания текста
function drawText(canvas, context) {
	let selectObj = document.getElementById(`foregroundColor`); // присваиваем переменной ссылку на элемент DOM
	let index = selectObj.selectedIndex;
	let fgColor = selectObj[index].value; // получаем выбранное значение

	context.fillStyle = fgColor; // заливаем текст в выбранный цвет
	context.font = `bold 1em sans-serif`; // создаем стиль для текста
	context.textAlign = `left`; // выбираем выравнивание
	context.fillText(`Тут должна была появится велика мысль ...`, 20, 40); // вставляем текст

	selectObj = document.getElementById(`tweets`); // присваиваем переменной ссылку на элемент DOM
	let tweet = selectObj.value; // получаем введенное значение
	context.font = `italic 1.4em serif`; // создаем стиль для текста
	context.textAlign = `center`; // выбираем выравнивание
	context.fillText(tweet, 300, 100, canvas.width - 20); // вставляем текст

	context.font = `bold 1em sans-serif`; // создаем стиль для текста
	context.textAlign = `right`; // выбираем выравнивание
	context.fillText(
		`....а в результате получилось ОНО!`,
		canvas.width - 20,
		canvas.height - 40
	); // вставляем текст
}

// функция вставки изображения
function drawBird(canvas, context) {
	let twitterBird = new Image(); // создаем объект ИЗОБРАЖЕНИЕ
	twitterBird.src = `twitterBird.png`; // указываем объекту ссылку на изображение

	twitterBird.onload = function () {
		context.drawImage(twitterBird, 20, 120, 70, 70); // вставляем изображение
	}; // после того как изображение загрузилось
}
