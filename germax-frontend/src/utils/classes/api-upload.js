import { ApiAuth } from "./api-auth";

export class UploadAPI {
    _apiAuth = ApiAuth.getInstance();
    _baseUrl = "http://germax-api/upload";

    constructor() {}

    async uploadPhoto(photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);

        const response = await fetch(`${this._baseUrl}`, {
            method: "POST",
            headers: {
                token: this._apiAuth.getToken(),
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to upload photo");
        }
        return data;
    }
}
