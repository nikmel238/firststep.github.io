"use strict";
function Movie(title, genre, rating, showtimes) {
	this.title = title;
	this.genre = genre;
	this.rating = rating;
	this.showtimes = showtimes;
	this.getNExtShowing = function () {
		let now = new Date().getTime();

		for (let i = 0; i < this.showtimes.length; i += 1) {
			let showtime = getTimeFromString(this.showtimes[i]);
			if ((showtime - now) > 0) {
				return "Следующий показ " + this.title + " в " + this.showtimes[i];
			}
		}
		return "Сегодня сеансов нет";
	}
}


let banzaiMovie = new Movie(
	"Buckaroo Banzai",
	"Cult Classic",
	5,
	["1:00pm", "5:00pm", "7:00pm", "18:00pm"]
);

let plan9Movie = new Movie(
	"Plan 9 from Outer Space",
	"Cult Classic",
	2,
	["3:00pm", "7:00pm", "11:00pm"]
);

let forbiddenPlaneMovie = new Movie(
	"Forbidden Planet",
	"Classic Sci-fi",
	5,
	["5:00pm", "9:00pm"]
);

alert(banzaiMovie.getNExtShowing());
alert(plan9Movie.getNExtShowing());
alert(forbiddenPlaneMovie.getNExtShowing());

function getTimeFromString(timeString) {
	let theTime = new Date();
	let time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
	theTime.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
	theTime.setHours(parseInt(time[2]) || 0);
	return theTime.getTime();
}
