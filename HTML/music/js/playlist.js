
function init() {
	let button = document.getElementById("addButton");
	button.onclick = handleButtonClick;
	loadPlaylist();
}

function handleButtonClick() {
	let textInput = document.getElementById("songTextInput");
	let songName = textInput.value;
	
	if (songName == "") {
		alert("Введите песню!");
	} else {
		alert("Добавленно: " + songName);
		let li = document.createElement("li");
		li.innerHTML = songName;
		let ul = document.getElementById("playlist");
		ul.appendChild(li);
	}

	save(songName);
}

window.onload = init;
