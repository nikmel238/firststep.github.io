'use strict';

window.onload = init;

function init() {
	let button = document.getElementById('add_button');
	button.onclick = createSticky;

	// извлекаем stickiesArray из локального хранилища
	let stickiesArray = getStickiesArray();

	// зацикливаем все локальные данные
	for (let i = 0; i < stickiesArray.length; i += 1) {
		// получаем их ключи
		let key = stickiesArray[i];
		// получаем его значение и отправляем в следующую функцию
		let value = JSON.parse(localStorage[key]);
		addStickyToDOM(key, value);
	}
}

function getStickiesArray() {
	let stickiesArray = localStorage.getItem('stickiesArray');
	// если его не существует, создаем массив stickiesArray
	if (!stickiesArray) {
		stickiesArray = [];
		localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));
	} else {
		stickiesArray = JSON.parse(stickiesArray);
	}
	return stickiesArray;
}

// функция добавления стиков
function createSticky() {
	// извлекаем stickiesArray из локального хранилища
	let stickiesArray = getStickiesArray();

	// создаем уникальное имя для стиков с помощью объекта дата
	let currentDate = new Date();
	let key = 'sticky_' + currentDate.getTime();
	let colorSelectObj = document.getElementById('note_color');
	let index = colorSelectObj.selectedIndex;
	let color = colorSelectObj[index].value;
	let date = `${currentDate.getDate()} / ${
		currentDate.getMonth() + 1
	} / ${currentDate.getFullYear()}`;

	// получаем написанное значение
	let value = document.getElementById('note_text').value;

	let stickyObj = {
		value: value,
		color: color,
		date: date,
	};
	localStorage.setItem(key, JSON.stringify(stickyObj));

	stickiesArray.push(key);
	localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));

	// создаем стик

	addStickyToDOM(key, stickyObj);
	document.getElementById('form').submit();
}

// функция удаления заметок
function deleteSticky(e) {
	let key = e.target.id;
	if (e.target.tagName.toLowerCase() === 'span') {
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

// функция для добавления стика
function addStickyToDOM(key, stickyObj) {
	let stickies = document.getElementById('stickies');
	let sticky = document.createElement('li');
	sticky.setAttribute('id', key);

	sticky.style.backgroundColor = stickyObj.color;

	let spanDate = document.createElement('span');

	spanDate.setAttribute('class', 'stickyDate');
	spanDate.innerHTML = stickyObj.date;

	let spanText = document.createElement('span');

	spanText.setAttribute('class', 'sticky');
	spanText.innerHTML = stickyObj.value;

	sticky.appendChild(spanDate);
	sticky.appendChild(spanText);

	stickies.appendChild(sticky);

	sticky.onclick = deleteSticky;
}

// функция для удаления элемента DOM
function removeStickyFromDOM(key) {
	let sticky = document.getElementById(key);
	sticky.parentNode.removeChild(sticky);
}
