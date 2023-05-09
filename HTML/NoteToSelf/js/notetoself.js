'use strict';

// после загрузки страницы, запускаем функцию
window.onload = init;

function init() {
	// получаем ссылку на кнопку добавить
	let button = document.getElementById('add_button');
	// по клику на на кнопку запускаем функцию
	button.onclick = createSticky;

	// извлекаем stickiesArray из локального хранилища с помощью функции
	let stickiesArray = getStickiesArray();

	// зацикливаем массив, который хранится в локальных данных
	for (let i = 0; i < stickiesArray.length; i += 1) {
		// получаем ключ каждого элемента массива
		let key = stickiesArray[i];
		// получаем его значение и отправляем в следующую функцию
		let value = JSON.parse(localStorage[key]);
		//запускаем функцию, которая добавляет элемент в DOM
		addStickyToDOM(key, value);
	}
}

// функция получения данных из локального хранилища
function getStickiesArray() {
	// запрашиваем пару по ключу
	let stickiesArray = localStorage.getItem('stickiesArray');
	// если его не существует, создаем данные в виде массива stickiesArray
	if (!stickiesArray) {
		stickiesArray = [];
		// преобразуем массив в строку и сохраняем его
		localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));
	} else {
		// преобразуем полученное значение (строку) в объект (массив)
		stickiesArray = JSON.parse(stickiesArray);
	}
	// возвращаем массив
	return stickiesArray;
}

// функция добавления стиков
function createSticky() {
	// извлекаем stickiesArray из локального хранилища
	let stickiesArray = getStickiesArray();

	// создаем уникальное имя для стиков с помощью объекта дата
	let currentDate = new Date();
	let key = 'sticky_' + currentDate.getTime();

	// получаем ссылку на элемент DOM
	let colorSelectObj = document.getElementById('note_color');
	// получаем индекс заданного элемента из списка
	let index = colorSelectObj.selectedIndex;
	// получаем значение в соответствии с индексом
	let color = colorSelectObj[index].value;

	// получаем дату добавления стика
	let date = `${currentDate.getDate()} / ${
		currentDate.getMonth() + 1
	} / ${currentDate.getFullYear()}`;

	// получаем написанное значение стика
	let value = document.getElementById('note_text').value;

	// создаем объект стика со свойствами
	let stickyObj = {
		value: value,
		color: color,
		date: date,
	};

	// записываем новую пару в локальные данные
	localStorage.setItem(key, JSON.stringify(stickyObj));

	// добавляем новый ключ в массив
	stickiesArray.push(key);
	// перезаписываем массив в локальных данных
	localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));

	// создаем стик
	addStickyToDOM(key, stickyObj);
	document.getElementById('form').submit();
}

// функция для добавления элемента в DOM
function addStickyToDOM(key, stickyObj) {
	// получаем ссылку на элемент
	let stickies = document.getElementById('stickies');

	// создаем новый элемент (сам стик) и получаем на него ссылку
	let sticky = document.createElement('li');
	// добавляем атрибут для созданного элемента
	sticky.setAttribute('id', key);
	// задаем стиль CSS для созданного элемента
	sticky.style.backgroundColor = stickyObj.color;

	// создаем элемент, в котором будет содержаться дата
	let spanDate = document.createElement('span');
	spanDate.setAttribute('class', 'stickyDate');
	// вставляем в созданный элемент значение
	spanDate.innerHTML = stickyObj.date;

	// создаем новый элемент (текс) и получаем на него ссылку
	let spanText = document.createElement('span');
	// добавляем атрибут для созданного элемента
	spanText.setAttribute('class', 'sticky');
	// добавляем значение для созданного элемента
	spanText.innerHTML = stickyObj.value;

	// добавляем созданные элементы в DOM
	sticky.appendChild(spanDate);
	sticky.appendChild(spanText);

	// добавляем созданные элементы в DOM
	stickies.appendChild(sticky);

	sticky.onclick = deleteSticky;
}

// функция удаления заметок
function deleteSticky(e) {
	// после события, создается объект event, получаем его id
	let key = e.target.id;
	// если это span
	if (e.target.tagName.toLowerCase() === 'span') {
		// присваиваем id его родительского элемента
		key = e.target.parentNode.id;
	}

	// удаляем из локального хранилища
	localStorage.removeItem(key);

	// извлекаем из массива заметок из локального хранилища
	let stickiesArray = getStickiesArray();

	if (stickiesArray) {
		for (let i = 0; i < stickiesArray.length; i += 1) {
			// находим нужный нам элемент массива
			if (key === stickiesArray[i]) {
				// удаляем его из массива
				stickiesArray.splice(i, 1);
			}
		}
		//перезаписываем локальное хранилище
		localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));
		removeStickyFromDOM(key);
	}
}

// функция для удаления элемента DOM
function removeStickyFromDOM(key) {
	// получаем ссылку на элемент DOM
	let sticky = document.getElementById(key);
	//удаляем дочерний элемент UL
	sticky.parentNode.removeChild(sticky);
}
