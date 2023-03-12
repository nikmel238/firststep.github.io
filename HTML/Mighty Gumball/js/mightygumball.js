/* JS для MightyGimball.html */

// свойство позволяющее активировать скрипты после полной загрузки страницы
window.onload = function () {
	// задаем интервал обновления данных
	setInterval(handleRefresh, 1000);
};

let lastReportTime = 0;

// функция вызова JSONP
function handleRefresh() {
	// присваиваем переменной ссылку откуда брать данные
	let url =
		`http://gumball.wickedlysmart.com/?callback=updateSales` +
		//отправляем только свежие данные
		`&lastreporttime=` +
		lastReportTime +
		// избавляемся от кэширования
		`&random=` +
		new Date().getTime();
	// создаем новый элемент script в DOM
	let newScriptElement = document.createElement(`script`);
	// присваиваем элементы атрибуты
	newScriptElement.setAttribute('src', url);
	newScriptElement.setAttribute('id', `jsonp`);

	// перезаписываем JSONP
	// извлекаем элемент с id = jsonp
	let oldScriptElement = document.getElementById(`jsonp`);
	// извлекаем элемент head
	let head = document.getElementsByTagName(`head`)[0];
	// если старый элемент еще отсутствует ...
	if (oldScriptElement === null) {
		// вставляем в head - script
		head.appendChild(newScriptElement);
	} else {
		// заменяем старый script на новый
		head.replaceChild(newScriptElement, oldScriptElement);
	}
}

function updateSales(sales) {
	// извлекаем из HTML элемент с id = sales
	var salesDiv = document.getElementById('sales');
	// создаем цикл, и для каждого элемента массива ...
	for (var i = 0; i < sales.length; i += 1) {
		var sale = sales[i];
		// создаем элемент div в HTML
		var div = document.createElement('div');
		// обращаемся к атрибуту class и присваиваем ему значение saleItem
		div.setAttribute('class', 'saleItem');
		// образуем содержимое для элемента div
		div.innerHTML = `В магазине "${sale.name}" продано ${sale.sales} жвачек.`;
		// определяем элемент div как дочерний
		salesDiv.appendChild(div);
	}

	if (sales.length > 0) {
		lastReportTime = sales[sales.length - 1].time;
	}
}
