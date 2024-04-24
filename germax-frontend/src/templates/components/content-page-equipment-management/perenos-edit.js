document.querySelectorAll(".edit-action").forEach((item) => {
		item.addEventListener("click", function (event) {
			event.preventDefault();
			const row = this.closest("tr");
			row.classList.add("editing");

			// Скрываем span и делаем видимыми поля ввода и select
			row.querySelectorAll("td span").forEach((element) => {
				element.classList.add("d-none");
			});
			row.querySelectorAll("td input, td textarea, td select").forEach(
				(element) => {
					element.classList.remove("d-none");
					if (
						element.tagName === "INPUT" ||
						element.tagName === "TEXTAREA"
					) {
						// Присваиваем input и textarea значение предыдущего span
						element.value = element.previousElementSibling
							? element.previousElementSibling.textContent.trim()
							: "";
					}
				}
			);

			// Для select элементов, загружаем и устанавливаем текущее значение из данных оборудования
			const equipmentId = row.dataset.equipmentId;
			const data = JSON.parse(
				localStorage.getItem(`equipment_${equipmentId}`) || "{}"
			);

			const categorySelect = row.querySelector(
				"select[name='equipment-category']"
			);
			const availabilitySelect = row.querySelector(
				"select[name='equipment-availability']"
			);
			if (categorySelect) {
				categorySelect.value = data.category || ""; // Устанавливаем значение или пустую строку, если данных нет
			}
			if (availabilitySelect) {
				availabilitySelect.value = data.availability || ""; // То же самое для доступности
			}

			// Добавляем или обновляем кнопки "Сохранить изменения" и "Отменить изменения", если они не были добавлены
			if (!row.querySelector(".save-changes")) {
				const saveButton = document.createElement("button");
				saveButton.textContent = "Sauvegarder les changements";
				saveButton.classList.add("btn", "btn-primary", "save-changes");
				row.querySelector("td:last-child").appendChild(saveButton);
			}
			if (!row.querySelector(".cancel-changes")) {
				const cancelButton = document.createElement("button");
				cancelButton.textContent = "Annuler les changements";
				cancelButton.classList.add(
					"btn",
					"btn-secondary",
					"cancel-changes"
				);
				row.querySelector("td:last-child").appendChild(cancelButton);
			}
		});
	});
document.addEventListener("click", function (event) {
		const target = event.target;

		if (target.classList.contains("save-changes")) {
			const row = target.closest("tr");
			const equipmentId = row.dataset.equipmentId;
			// Извлечение данных
			const nameInput = row.querySelector("input[name='equipment-name']");
			const categorySelect = row.querySelector(
				"select[name='equipment-category']"
			);
			const descriptionTextarea = row.querySelector(
				"textarea[name='equipment-description']"
			);
			const availabilitySelect = row.querySelector(
				"select[name='equipment-availability']"
			);

			if (nameInput && row.querySelector(".equipment-name")) {
				row.querySelector(".equipment-name").textContent =
					nameInput.value;
			}
			if (categorySelect && row.querySelector(".equipment-category")) {
				row.querySelector(".equipment-category").textContent =
					categorySelect.options[categorySelect.selectedIndex].text;
			}
			if (
				descriptionTextarea &&
				row.querySelector(".equipment-description")
			) {
				row.querySelector(".equipment-description").textContent =
					descriptionTextarea.value;
			}
			if (
				availabilitySelect &&
				row.querySelector(".equipment-availability")
			) {
				row.querySelector(".equipment-availability").textContent =
					availabilitySelect.options[
						availabilitySelect.selectedIndex
					].text;
			}

			// Сохраняем изменения в localStorage
			const data = {
				name: nameInput.value,
				category: categorySelect.value,
				description: descriptionTextarea.value,
				availability: availabilitySelect.value,
			};
			localStorage.setItem(
				`equipment_${equipmentId}`,
				JSON.stringify(data)
			);

			// Возвращаем элементы <span> к видимости и скрываем поля ввода
			row.querySelectorAll("td span").forEach((element) => {
				element.classList.remove("d-none");
			});
			row.querySelectorAll("td input, td textarea, td select").forEach(
				(element) => {
					element.classList.add("d-none");
				}
			);

			// Удаление кнопок "Sauvegarder les changements" и "Annuler les changements"
			row.querySelectorAll(".save-changes, .cancel-changes").forEach(
				(button) => {
					button.remove();
				}
			);

			row.classList.remove("editing");
		} else if (target.classList.contains("cancel-changes")) {
			const row = target.closest("tr");

			// Возвращаем элементы <span> к видимости и скрываем поля ввода без сохранения изменений
			row.querySelectorAll("td span").forEach((element) => {
				element.classList.remove("d-none");
			});
			row.querySelectorAll("td input, td textarea, td select").forEach(
				(element) => {
					element.classList.add("d-none");
				}
			);

			// Удаление кнопок "Sauvegarder les changements" и "Annuler les changements"
			row.querySelectorAll(".save-changes, .cancel-changes").forEach(
				(button) => {
					button.remove();
				}
			);

			row.classList.remove("editing");
		}
	});
