// запускает функцию после загрузки страницы
window.onload = getMyLocation;

let prevCoords = null;

let options = {
	enableHighAccurace: true,
	timeout: 50,
	maximumAge: 0
}

let watchId = null;

let ourCoords = {
	latitude: 45.02603912353516,
	longitude: 39.02180862426758
}
function getMyLocation() {

	// проверяем поддерживает ли браузер API Geolocation
	if (navigator.geolocation) {
		// Добавляем обрработчик событий CLICK
		let watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation;
		let clearWatchButton = document.getElementById("clearWatch");
		clearWatchButton.onclick = clearWatch;

	} else {
		alert("Не поддерживается определение координат");
	}
}

// передаем функции объект position, содержащиц информацию о местоположении браузера
function displayLocation(position) {
	// примваиваем переменным значения, хранящиеся в свойсвах position и coords
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	// призваиваем переменной значента элемента с ID location
	let div = document.getElementById("location");

	// изменяем значение переменной div
	div.innerHTML = "Ваши координаты.  Широта:" + latitude + " , Долгота: " + longitude;
	div.innerHTML += " (c точностью " + position.coords.accuracy + " метров).";
	div.innerHTML += " (поиск составил " + options.timeout + " милисекунд)";

	let km = computeDistance(position.coords, ourCoords);
	let distance = document.getElementById("distance");
	distance.innerHTML = "Вы находитесь на " + km + " км от меня";

	if (map == null) {
		showMap(position.coords);
		prevCoords = position.coords;
	} else {
		let meters = computeDistance(position.coords, prevCoords) * 1000;
		if (meters > 20) {
			scrollMapToPosition(position.coords);
			prevCoords = position.coords;
		}
	}
}

// передаем функции объект error, содержащий информации об ошибке
function displayError (error) {
	let errorTypes = {
		0: "Общая (неизвестная) ошибка",
		1: "Ползователь отказал в запросе на разрешение использовать информацию о местоположении",
		2: "Браузер не смог определить местоположение",
		3: "Превышено время ожидания",
	};
	let errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.mesage;
	}
	let div = document.getElementById("location");
	div.innerHTML = errorMessage;

	options.timeout += 50;
	navigator.geolocation.getCurrentPosition(
		displayLocation,
		displayError,
		options);
	div.innerHTML += "... повторная попытка определения местоположения задержка = " + options.timeout;
}

//присвоени переменной метод успешного (ошибки) обработки функции определения местоположения
function watchLocation() {
	watchId = navigator.geolocation.getCurrentPosition(
		displayLocation,
		displayError,
		options);
}

//обработчик остановки отслеживания
function clearWatch() {
	if (watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

//функция возвращает дистаницю между двумя точками
function computeDistance(startCoords, destCoords) {
	let startLatRads = degreesToRadians(startCoords.latitude);
	let startLongRads = degreesToRadians(startCoords.longitude);
	let destLatRads = degreesToRadians(destCoords.latitude);
	let destLongRads = degreesToRadians(destCoords.longitude);

	let Radius = 6371;
	let distace = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
		Math.cos(startLatRads) * Math.cos(destLatRads) *
		Math.cos(startLongRads - destLongRads)) * Radius;
	return distace;
}

function degreesToRadians(degrees) {
	let radians = (degrees * Math.PI) / 180;
	return radians;
}

//для Гугл карты

let map;

function showMap(coords) {
	let googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
	let mapOptions = {
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	let mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);

	let title = "Ваше";
	let content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);
}

function addMarker(map, latlong, title, content) {
	let markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};

	let marker = new google.maps.Marker(markerOptions);

	let infoWindowOptions = {
		content: content,
		position: latlong
	};

	let infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	google.maps.event.addListener(marker, "cliclk", function () {
		infoWindow.open(map);
	});
}


function scrollMapToPosition(coords) {
	let latitude = coords.latitude;
	let longitude = coords.longitude;
	let latlong = new google.maps.LatLng(latitude, longitude);

	map.panTo(latlong);

	addMarker(map, latlong, "Ваше новое местополежние", "Ваши координаты: "
		+ latitude + ", " + longitude);
}


