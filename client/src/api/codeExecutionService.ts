import { getCookie } from "../lib/cookieUtility";
export class CodeExecutionService {
    url;
    serverUrl;
    constructor() {
        this.url = import.meta.env.VITE_RAPIDAPI_URL;
        this.serverUrl = import.meta.env.VITE_SERVER_URL;
    }
    async executeCode(code: string, language: number, input: string, languageName: string) {
        const reqBody = JSON.stringify({ source_code: code, language_id: language, stdin: input });
        console.log(this.url, reqBody)
        const options = {
            method: "POST",
            params: { base64_encoded: `${languageName === 'cpp' ? 'true' : 'false'}` },
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            },
            body: reqBody,
        };
        
        try {
            const response = await fetch(`${this.url}/submissions`, options);
            console.log("response", response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error("Error executing code:", error);
            return {
                ok: false,
                message: error instanceof Error ? error.message : "Failed to execute code"
            };
        }
    }

    async checkStatus(token: string) {
        if (!token) {
            console.error("Token is undefined or null");
            return {
                ok: false,
                message: "Invalid token provided"
            };
        }
        
        const url = `${this.url}/submissions/${token}?base64_encoded=true`;
        console.log("url", url);
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            }
        };
        
        try {
            const response = await fetch(url, options);
            console.log("response", response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error("Error checking status:", error);
            return {
                ok: false,
                message: error instanceof Error ? error.message : "Failed to check status"
            };
        }
    }

    async submitCode(sourceCode: string, languageId: number, problemId: number) {
        const response = await fetch(`${this.serverUrl}/api/v1/judge/submit`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("accessToken"),
            },
            body: JSON.stringify({ sourceCode, languageId, problemId }),
        });
        return response.json();
    }

    async getSubmissions() {
        const response = await fetch(`${this.serverUrl}/api/v1/judge/submissions`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("accessToken"),
            },
        });
        return response.json();
    }

    async storeSubmission(submission: any, assignmentId: string | undefined, contestId: string | undefined, problemDifficulty: string) {
        const userCookie = getCookie("accessToken");
        console.log("sending submission", submission);
        const reqBody = JSON.stringify({ submission: submission, assignmentId, contestId, problemDifficulty });
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userCookie}`,
            },
            body: reqBody,
        };
        const apiUrl = `${this.serverUrl}/api/v1/judge/storeSubmission`;
        const response = await fetch(apiUrl, options);
        return response.json();
    }

    async getContestUserProblemStatus(problemId: string, userRollNumber: string) {
        const userCookie = getCookie("accessToken");
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userCookie}`,
            },
        };
        const apiUrl = `${this.serverUrl}/api/v1/judge/getContestUserProblemStatus/${problemId}/${userRollNumber}`;
        const response = await fetch(apiUrl, options);
        return response.json();
    }

}

export const codeExecutionService = new CodeExecutionService();