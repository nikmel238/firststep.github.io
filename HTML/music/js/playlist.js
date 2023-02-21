function init() {
  let button = document.getElementById('addButton'); // обращаемся в элементу 'addButton' DOM
  button.onclick = handleButtonClick; // задаем кнопке свойство "клика", по которому ему присваивается функция обработки
  loadPlaylist(); // сохраняет данные при перезагрузке
}
// функция обработчик при клике на 'addButton'
function handleButtonClick() {
  let textInput = document.getElementById('songTextInput'); // обращаемся в элементу 'songTextInput' DOM
  let songName = textInput.value; // присваиваем введенное значение переменной

  if (songName === '' || songName === undefined || songName === null) {
    alert('Введите песню!');
  } else {
    alert('Добавлено: ' + songName);
    let li = document.createElement('li'); // создаем новый элемент в DOM
    li.innerHTML = songName; // добавляем текстовое содержимое
    let ul = document.getElementById('playlist'); // обращаемся к элементу 'playlist' DOM
    ul.appendChild(li); // добавляем дочерний элемент li в ul
    save(songName); // сохраняет внесенные данные
  }
}

window.onload = init;
