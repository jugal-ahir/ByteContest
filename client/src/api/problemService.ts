import { getCookie } from '../lib/cookieUtility';

class ProblemService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getProblems() {
        console.log("Fetching problems from:", this.url);
        const token = getCookie("accessToken");
        console.log("Token available:", token ? "Yes" : "No");
        
        const response = await fetch(`${this.url}/api/v1/problems/all`,
            {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );
        console.log("Problems response status:", response.status);
        if (!response.ok) {
            throw new Error("Error fetching problems");
        }
        return response.json();
    }

    async getProblem(problemId: string) {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/problems/${problemId}`,
            {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );
        return response.json();
    }

    async getPracticeProblem(problemId: string,) {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/problems/practice/${problemId}`,
            {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );
        return response.json();
    }

    async changeProblemStatus(problemId: string, problemIsHidden: boolean) {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/problems/${problemId}/${problemIsHidden}`,
            {
                method: "PUT",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );
        return response.json();
    }

    async getEditorialById(problemId: string) {
        const token = getCookie("accessToken");
        const editorialId = problemId;
        const response = await fetch(`${this.url}/api/v1/problems/editorial/${editorialId}`,
            {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );

        return response.json();
    }

    async changeProblemEditorialStatus(problemId: string, problemEditorialIsHidden: boolean) {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/problems/editorial/${problemId}/${problemEditorialIsHidden}`,
            {
                method: "PUT",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );

        return response.json();
    }

    async createProblem(problem: any) {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/problems/create`,
            {
                method: "POST",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(problem),
            }
        );
        return response.json();
    }

    async updateProblem(problemId: string, problem: any) {
        const token = getCookie("accessToken");
        const response = await fetch(`${this.url}/api/v1/problems/update/${problemId}`,
            {
                method: "PUT",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(problem),
            }
        );
        return response.json();
    }

}

export const problemService = new ProblemService();
