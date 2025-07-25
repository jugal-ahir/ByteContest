import { getCookie } from "../lib/cookieUtility";
import { User } from "../types/user";
export class AuthService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }
    async register(user: User) {
        const reqBody = { userEmail: user.userEmail, userPassword: user.userPassword, userName: user.userName, userRollNumber: user.userRollNumber, userSection: user.userSection };
        const response = await fetch(`${this.url}/api/v1/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        if (response.status === 201)
            return this.login(user);
        return response.json();
    }

    async login(data: User) {
        console.log("from authService: ", data);
        console.log(this.url);
        const reqBody = { userEmail: data.userEmail, userPassword: data.userPassword };
        const response = await fetch(`${this.url}/api/v1/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        console.log(document.cookie)
        return response.json();
    }

    async forgotPassword(data: any) {
        console.log("from authService: ", data);
        console.log(this.url);
        const reqBody = { userEmail: data.userEmail, userSecret: data.userSecret, newPassword: data.newPassword };
        const response = await fetch(`${this.url}/api/v1/auth/forgot-password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        return response.json();
    }

    async logout() {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/auth/logout`, {
            method: "POST",
            credentials: "include", // Include cookies in the request
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            }
        });
        return response.json();
    }
}

export const authService = new AuthService();
