class ProblemService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }

    async getProblems() {
        try {
            const response = await fetch(`${this.url}/api/v1/problems/all`, {
                method: "GET",
                credentials: "include", // Use session-based auth
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error fetching problems");
            }

            return response.json();
        } catch (error) {
            console.error("Problem service error:", error);
            throw error;
        }
    }

    async getProblem(problemId: string) {
        try {
            const response = await fetch(`${this.url}/api/v1/problems/${problemId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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

    async getPracticeProblem(problemId: string) {
        try {
            const response = await fetch(`${this.url}/api/v1/problems/practice/${problemId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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
        try {
            const response = await fetch(`${this.url}/api/v1/problems/${problemId}/${problemIsHidden}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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
        try {
            const response = await fetch(`${this.url}/api/v1/problems/editorial/${problemId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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
        try {
            const response = await fetch(`${this.url}/api/v1/problems/editorial/${problemId}/${problemEditorialIsHidden}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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
        try {
            const response = await fetch(`${this.url}/api/v1/problems/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(problem),
            });

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
        try {
            const response = await fetch(`${this.url}/api/v1/problems/update/${problemId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(problem),
            });

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
