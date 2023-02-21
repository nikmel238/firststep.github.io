'use strict';
// создаем функцию-конструктор для объектов
function Movie(title, genre, rating, showtimes) {
  this.title = title;
  this.genre = genre;
  this.rating = rating;
  this.showtimes = showtimes;
  this.getNExtShowing = function () {
    let now = new Date().getTime(); // свойство объекта Date, возвращающее текущее время в млс

    for (let i = 0; i < this.showtimes.length; i += 1) {
      // проверяем каждый сеанс
      let showtime = getTimeFromString(this.showtimes[i]); // извлекаем значение сеанса в млс
      if (showtime - now > 0) {
        // проверяем есть ли сегодня сеанс
        return 'Следующий показ ' + this.title + ' в ' + this.showtimes[i];
      }
    }
    return this.title + ' - сегодня сеансов нет';
  };
}

// создаем новый объект, используя функцию-конструктор
let banzaiMovie = new Movie('Buckaroo Banzai', 'Cult Classic', 5, [
  '1:00pm',
  '5:00pm',
  '7:00pm',
  '18:00pm',
]);

let plan9Movie = new Movie('Plan 9 from Outer Space', 'Cult Classic', 2, [
  '3:00pm',
  '7:00pm',
  '15:00pm',
]);

let forbiddenPlaneMovie = new Movie('Forbidden Planet', 'Classic Sci-fi', 5, [
  '5:00pm',
  '9:00pm',
]);

alert(banzaiMovie.getNExtShowing());
alert(plan9Movie.getNExtShowing());
alert(forbiddenPlaneMovie.getNExtShowing());

function getTimeFromString(timeString) {
  // функция, которая преобразует 1:00pm в млс
  let theTime = new Date();
  let time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
  theTime.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
  theTime.setHours(parseInt(time[2]) || 0);
  return theTime.getTime();
}
