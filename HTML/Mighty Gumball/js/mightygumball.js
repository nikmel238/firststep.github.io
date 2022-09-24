/* JS для MightyGimball.html */
/*
 * get the content of a JSON file using Ajax 
 *
 */

// свойство позволяющее активировать скрипты после полной загрузки страницы
window.onload = init;

// создаем функцию init, которая содержит в себе функцию getSales
function init() {
	getSales();
}

function getSales() {

	// задаем переменную с указанием адреса программы на сервере
	var url = "http://gumball.wickedlysmart.соm/gumball/gumball.html";
	// создаем объект и присваиваем его переменной
	var request = new XMLHttpRequest();
	// используем метод open, для обращения к программе на сервере, используя HTTP запрос GET
	request.open("GET", url);
	// создаем обработчик, который при получении кода 200 (ответ сервера, что все ОК), запускает функцию updateSales
	request.onload = function() {
		if (request.status == 200) {
			updateSales(request.responseText);
		}
	};
	// с помощью метода send отправляем запрос на сервер, при этом ничего не передаем ему
	request.send(null);
}

function updateSales(responseText) {
	// извлекаем из HTML элемент с id = sales
	var salesDiv = document.getElementById("sales");
	// создаем переменную sales, и с помощью метода parse преобразует полученную строку в объект (массив)
	var sales = JSON.parse(responseText);
	// создаем цикл, и для каждого элемента массива ...
	for (var i = 0; i < sales.length; i++) {
		var sale = sales[i];
		// создаем элемент div в HTML
		var div = document.createElement("div");
		// обращаемся к атрибуту class и присваиваем ему значение saleItem
		div.setAttribute("class", "saleItem");
		// образуем содержимое для элемента div
		div.innerHTML = sale.name + " sold " + sale.sales + " gumballs";
		// определяем элемент div как дочерний
		salesDiv.appendChild(div);
	}
}

