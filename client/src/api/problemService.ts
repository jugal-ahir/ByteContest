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
        
        try {
            const response = await fetch(`${this.url}/api/v1/problems/all`,
                {
                    method: "GET",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                        // "Authorization": "Bearer " + token,
                    },
                }
            );
            console.log("Problems response status:", response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching problems:", errorData);
                throw new Error(errorData.message || "Error fetching problems");
            }
            
            return response.json();
        } catch (error) {
            console.error("Problem service error:", error);
            throw error;
        }
    }

    async getProblem(problemId: string) {
        const token = getCookie("accessToken");
        try {
            const response = await fetch(`${this.url}/api/v1/problems/${problemId}`,
                {
                    method: "GET",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                        //"Authorization": "Bearer " + token,
                    },
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error fetching problem");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error fetching problem:", error);
            throw error;
        }
    }

    async getPracticeProblem(problemId: string,) {
        const token = getCookie("accessToken");
        try {
            const response = await fetch(`${this.url}/api/v1/problems/practice/${problemId}`,
                {
                    method: "GET",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                        //"Authorization": "Bearer " + token,
                    },
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error fetching practice problem");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error fetching practice problem:", error);
            throw error;
        }
    }

    async changeProblemStatus(problemId: string, problemIsHidden: boolean) {
        const token = getCookie("accessToken");
        try {
            const response = await fetch(`${this.url}/api/v1/problems/${problemId}/${problemIsHidden}`,
                {
                    method: "PUT",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                        //"Authorization": "Bearer " + token,
                    },
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error changing problem status");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error changing problem status:", error);
            throw error;
        }
    }

    async getEditorialById(problemId: string) {
        const token = getCookie("accessToken");
        const editorialId = problemId;
        try {
            const response = await fetch(`${this.url}/api/v1/problems/editorial/${editorialId}`,
                {
                    method: "GET",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                       // "Authorization": "Bearer " + token,
                    },
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error fetching editorial");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error fetching editorial:", error);
            throw error;
        }
    }

    async changeProblemEditorialStatus(problemId: string, problemEditorialIsHidden: boolean) {
        const token = getCookie("accessToken");
        try {
            const response = await fetch(`${this.url}/api/v1/problems/editorial/${problemId}/${problemEditorialIsHidden}`,
                {
                    method: "PUT",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                       // "Authorization": "Bearer " + token,
                    },
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error changing editorial status");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error changing editorial status:", error);
            throw error;
        }
    }

    async createProblem(problem: any) {
        const token = getCookie("accessToken");
        try {
            const response = await fetch(`${this.url}/api/v1/problems/create`,
                {
                    method: "POST",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                       // "Authorization": "Bearer " + token,
                    },
                    body: JSON.stringify(problem),
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error creating problem");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error creating problem:", error);
            throw error;
        }
    }

    async updateProblem(problemId: string, problem: any) {
        const token = getCookie("accessToken");
        try {
            const response = await fetch(`${this.url}/api/v1/problems/update/${problemId}`,
                {
                    method: "PUT",
                    credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                       // "Authorization": "Bearer " + token,
                    },
                    body: JSON.stringify(problem),
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error updating problem");
            }
            
            return response.json();
        } catch (error) {
            console.error("Error updating problem:", error);
            throw error;
        }
    }
}

export const problemService = new ProblemService();
