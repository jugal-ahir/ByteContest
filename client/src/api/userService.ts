export class UserService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getAllUsers() {
        const response = await fetch(`${this.url}/api/v1/users/getAllUsers`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getUser(userId: string) {
        const response = await fetch(`${this.url}/api/v1/users/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async updateUser(userId: string, user: any) {
        const response = await fetch(`${this.url}/api/v1/users/update/${userId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        return response.json();
    }

    async deleteUser(userId: string) {
        const response = await fetch(`${this.url}/api/v1/users/delete/${userId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getUsersFromSection(section: string) {
        const response = await fetch(`${this.url}/api/v1/users/section/${section}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async editUser(userEmail: string, userName: string, userRollNumber: string, userSection: string, userTeamName: string) {
        const response = await fetch(`${this.url}/api/v1/users/edituser/${userRollNumber}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, userName, userRollNumber, userSection, userTeamName }),
        });
        return await response.json();
    }

    async changeUserSecret(userEmail: string) {
        const response = await fetch(`${this.url}/api/v1/users/changeUserSecret`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ userEmail }),
        });
        return await response.json();
    }
}

export const userService = new UserService();