//импортируем готовый код
importScripts('workerlib.js');

// задаем обработчик полученных сообщений
onmessage = function (task) {
	// передаем функции содержимое
	let workerResult = computeRow(task.data);
	// передаем результат обратно
	postMessage(workerResult);
};
