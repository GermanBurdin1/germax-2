import "./index.css";

document
	.getElementById("loginForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		const formData = new FormData(this);
		const url = "http://germax-api/src/endpoints/login.php";

		fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === "success") {
					localStorage.setItem("userType", data.user_type);
					window.location.href = "/page-dashboard"; // Перенаправить на страницу после входа
				} else {
					alert("Login failed: " + data.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
