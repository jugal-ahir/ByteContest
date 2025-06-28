export default async function getTokens(submissionJsonString: string): Promise<string[]> {
    try {
        const baseUrl = process.env.RAPIDAPI_URL || process.env.VITE_RAPIDAPI_URL;
        if (!baseUrl) {
            throw new Error('RAPIDAPI_URL environment variable is not set');
        }
        
        // Parse the submission JSON to get individual submissions
        const submissionData = JSON.parse(submissionJsonString);
        const submissions = submissionData.submissions;
        
        console.log("Creating individual submissions for:", submissions.length, "test cases");
        
        const tokens: Array<string> = [];
        
        // Create individual submissions for each test case
        for (let i = 0; i < submissions.length; i++) {
            const submission = submissions[i];
            
            const options = {
                method: "POST",
                params: { base64_encoded: "true" },
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST || process.env.VITE_RAPIDAPI_HOST || "",
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY || "",
                },
                body: JSON.stringify(submission),
            };
            
            const url = `${baseUrl}/submissions`;
            console.log(`Making request ${i + 1}/${submissions.length} to:`, url);
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error Response for submission ${i + 1}:`, errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const resp = await response.json() as tokensObject;
            console.log(`Submission ${i + 1} response:`, resp);
            
            if (resp?.token) {
                tokens.push(resp.token);
            }
            
            // Add a small delay between submissions to avoid rate limiting
            if (i < submissions.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        console.log("All tokens generated:", tokens);
        return tokens;
    } catch (error) {
        console.error("Error in getTokens:", error);
        throw error;
    }
}

interface tokensObject {
    token: string;
}