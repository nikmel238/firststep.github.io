// запускает функцию после загрузки страницы
window.onload = getMyLocation;

let prevCoords = null;
let watchId = null;

/* задаем параметры для обнаружение координат */
let options = {
  enableHighAccuracy: true, // свойство высокой точности
  timeout: 500, // как долго браузер может определять местонахождение пользователя
  maximumAge: 500, // максимальный "возраст" данных, позволяющий обновлять их
};

let ourCoords = {
  latitude: 45.02603912353516,
  longitude: 39.02180862426758,
};
function getMyLocation() {
  // проверяем поддерживает ли браузер API Geolocation
  if (navigator.geolocation) {
    // Добавляем обработчик событий CLICK
    let watchButton = document.getElementById('watch'); // обращаемся к элементу `watch` DOM
    watchButton.onclick = watchLocation; // когда кликаем по заданному элементу, запускаем функцию
    let clearWatchButton = document.getElementById('clearWatch'); // обращаемся к элементу `clearWatch` DOM
    clearWatchButton.onclick = clearWatch; // когда кликаем по заданному элементу, запускаем функцию
  } else {
    alert('Определение координат не поддерживается ');
  }
}

// передаем функции объект position, содержащий информацию о местоположении браузера
function displayLocation(position) {
  // присваиваем переменным значения, хранящиеся в свойствах position и coords
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  // присваиваем переменной значения элемента с ID location
  let div = document.getElementById('location');

  // изменяем значение переменной div
  div.innerHTML =
    'Ваши координаты.  Широта:' + latitude + ' , Долгота: ' + longitude;
  div.innerHTML += ' (c точностью ' + position.coords.accuracy + ' метров)';
  div.innerHTML += ' (поиск составил ' + options.timeout + ' миллисекунд).';

  let km = computeDistance(position.coords, ourCoords); // обращаемся к функции, определяющая дистанцию между двумя точками
  let distance = document.getElementById('distance'); // обращаемся к элементу `distance` DOM
  distance.innerHTML = 'Вы находитесь на ' + km + ' км от меня'; // присваиваем ему новое значение

  if (map == null) {
    showMap(position.coords); // вызываем функцию гугл карты, которая создаст карту
    prevCoords = position.coords;
  } else {
    let meters = computeDistance(position.coords, prevCoords) * 1000;
    if (meters > 20) {
      scrollMapToPosition(position.coords); // добавляем новые маркеры
      prevCoords = position.coords;
    }
  }
}

// передаем функции объект error, содержащий информации об ошибке
function displayError(error) {
  let errorTypes = {
    0: 'Общая (неизвестная) ошибка',
    1: 'Пользователь отказал в запросе на разрешение использовать информацию о местоположении',
    2: 'Браузер не смог определить местоположение',
    3: 'Превышено время ожидания',
  };

  let errorMessage = errorTypes[error.code]; // присваиваем переменной номер ошибки
  if (error.code == 0 || error.code == 2) {
    errorMessage = errorMessage + ' ' + error.message;
  }
  let div = document.getElementById('location'); // обращаемся к элементу `location` DOM
  div.innerHTML = errorMessage; // вставляем сформированное значение

  /* сколько по времени происходил поиск */
  options.timeout += 100;
  navigator.geolocation.getCurrentPosition(
    displayLocation,
    displayError,
    options
  );
  div.innerHTML +=
    '... повторная попытка определения местоположения задержка = ' +
    options.timeout +
    ` млс.`;
}

// функция при клике на кнопку watch. Присвоение переменной метод успешного (ошибки) обработки функции определения местоположения
function watchLocation() {
  watchId = navigator.geolocation.watchPosition(
    displayLocation,
    displayError,
    options
  );
}

// функция при нажатии на кнопку clearWatch. Обработчик остановки отслеживания
function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

//функция возвращает дистанцию между двумя точками
function computeDistance(startCoords, destCoords) {
  let startLatRads = degreesToRadians(startCoords.latitude);
  let startLongRads = degreesToRadians(startCoords.longitude);
  let destLatRads = degreesToRadians(destCoords.latitude);
  let destLongRads = degreesToRadians(destCoords.longitude);

  let Radius = 6371;
  let distance =
    Math.acos(
      Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) *
          Math.cos(destLatRads) *
          Math.cos(startLongRads - destLongRads)
    ) * Radius;
  return distance;
}

function degreesToRadians(degrees) {
  let radians = (degrees * Math.PI) / 180;
  return radians;
}

/* для Гугл карты */

let map; // объявляем глобальную переменную, для хранения карты гугл

function showMap(coords) {
  // используем встроенный в API функцию-конструктор для получения широты и долготы
  let googleLatAndLong = new google.maps.LatLng(
    coords.latitude,
    coords.longitude
  );

  // задаем объект с параметрами для карты
  let mapOptions = {
    zoom: 10, // увеличение карты
    center: googleLatAndLong, // в центре помещаем, созданный объект (координаты)
    mapTypeId: google.maps.MapTypeId.ROADMAP, // выбираем поверхность (спутник и т.д.)
  };

  let mapDiv = document.getElementById('map'); // обращаемся к элементу `map` DOM
  map = new google.maps.Map(mapDiv, mapOptions); // присваиваем глобальной переменной объект, созданный при помощи встроенной в API функции-конструктора

  let title = 'Ваше положение';
  let content = 'Ваши координаты: ' + coords.latitude + ', ' + coords.longitude;
  addMarker(map, googleLatAndLong, title, content);
}

// добавляем функцию маркера
function addMarker(map, latlong, title, content) {
  let markerOptions = {
    position: latlong,
    map: map,
    title: title,
    clickable: true, // хотим ли мы, чтобы пользователь смог кликнуть по маркеру
  };

  let marker = new google.maps.Marker(markerOptions); // используем встроенную функцию-конструктор и передаем ей созданный объект
  // определяем параметры информационного окна
  let infoWindowOptions = {
    content: content,
    position: latlong,
  };

  let infoWindow = new google.maps.InfoWindow(infoWindowOptions); // используем встроенную функцию-конструктор и передаем ей созданный объект
  // добавляем слушателей для встроенного метода
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.open(map);
  });
}

/* прокручивание карты добавление старых маркеров */
function scrollMapToPosition(coords) {
  let latitude = coords.latitude;
  let longitude = coords.longitude;
  let latlong = new google.maps.LatLng(latitude, longitude);

  map.panTo(latlong); // метод, позволяющий быть всегда в центре карты

  addMarker(
    map,
    latlong,
    'Ваше новое местоположение',
    'Ваши координаты: ' + latitude + ', ' + longitude
  );
}
