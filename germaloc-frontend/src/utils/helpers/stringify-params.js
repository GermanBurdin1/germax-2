/**
 * Функция для преобразования объекта параметров в строку запроса.
 * @param {Object.<string, any>} paramsObj - Объект параметров, где ключ - имя параметра, а значение - его значение.
 * @returns {string} Строка запроса, представляющая параметры.
 */
export function stringifyParams(paramsObj) {
	const queryString = Object.entries(paramsObj)
			.map(([key, value]) => (value !== null && value !== "") ? `${key}=${value}` : '')
			.filter(paramString => paramString !== '')
			.join('&');
	return queryString;
}

//"typeName=electronics&modelName=laptop&statusNames=available&page=1&limit=20"
