import { User } from "../types/user";
export class AuthService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async register(data: User) {
        console.log("from authService: ", data);
        console.log(this.url);
        const reqBody = { userEmail: data.userEmail, userPassword: data.userPassword, userName: data.userName, userRollNumber: data.userRollNumber, userSection: data.userSection, userTeamName: data.userTeamName };
        const response = await fetch(`${this.url}/api/v1/auth/register`, {
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
        const response = await fetch(`${this.url}/api/v1/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.json();
    }
}

export const authService = new AuthService();