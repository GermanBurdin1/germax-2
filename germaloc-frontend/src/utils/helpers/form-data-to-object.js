export function formDataToObject(form) {
	const formData = {};

	for (let i = 0; i < form.elements.length; i++) {
		const element = form.elements[i];
		if (element.name) {
			if (element.type === "checkbox" || element.type === "radio") {
				if (element.checked) {
					formData[element.name] = element.value;
				} else {
					if (!formData[element.name]) {
						formData[element.name] = "";
					}
				}
			} else if (element.type === "number") {
				formData[element.name] = element.valueAsNumber;
			} else if (element.type === "date") {
				formData[element.name] = new Date(element.value);
			} else {
				formData[element.name] = element.value;
			}
		}
	}

	return formData;
}
