module.exports = function(content) {
	if (!content.trim()) {
	  // Возвращаем минимально валидный HTML, если файл пустой
	  return '\n';
	}
	// В противном случае возвращаем исходный контент
	return content;
  };
