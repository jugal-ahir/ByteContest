import { getCookie } from '../lib/cookieUtility';

class ProblemService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getProblems() {
        console.log(this.url);
        const response = await fetch(`${this.url}/api/v1/problems/all`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        console.log(response);
        if (!response.ok) {
            throw new Error("Error fetching problems");
        }
        return response.json();
    }

    async getProblem(problemId: string) {
        const response = await fetch(`${this.url}/api/v1/problems/${problemId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
        return response.json();
    }

    async getPracticeProblem(problemId: string,) {
        const response = await fetch(`${this.url}/api/v1/problems/practice/${problemId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
        return response.json();
    }

    async changeProblemStatus(problemId: string, problemIsHidden: boolean) {
        const response = await fetch(`${this.url}/api/v1/problems/${problemId}/${problemIsHidden}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );
        return response.json();
    }

    async getEditorialById(problemId: string) {
        const editorialId = problemId;
        const response = await fetch(`${this.url}/api/v1/problems/editorial/${editorialId}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );

        return response.json();
    }

    async changeProblemEditorialStatus(problemId: string, problemEditorialIsHidden: boolean) {
        const response = await fetch(`${this.url}/api/v1/problems/editorial/${problemId}/${problemEditorialIsHidden}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("accessToken"),
                },
            }
        );

        return response.json();
    }

    async createProblem(problem: any) {
        const response = await fetch(`${this.url}/api/v1/problems/create`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(problem),
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }

    async updateProblem(problemId: string, problem: any) {
        const response = await fetch(`${this.url}/api/v1/problems/update/${problemId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(problem),
            }
        );
        return response.json();
    }

    async deleteProblem(problemId: string) {
        const response = await fetch(`${this.url}/api/v1/problems/delete/${problemId}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        return response.json();
    }

    async getProblemByIds(problemsIds: string[]) {
        const response = await fetch(`${this.url}/api/v1/problems/getProblemByIds`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ problemIds: problemsIds }),
            }
        );
        return response.json();
    }

}

export const problemService = new ProblemService();