import { Contest, IContestUser } from "../../models/contest.model";
import { IProblemStatus } from "../../models/assignment.model";
import { IContestFunctionResponse } from "../../models/contest.model";

export const updateContestScore = async (contestId: number, userRollNumber: string, problemId: number, marks: number): Promise<IContestFunctionResponse> => {
    try {
        console.log("updateContestScore - Input parameters:", { contestId, userRollNumber, problemId, marks });
        
        const contest = await Contest.findOne({ contestId });
        if (!contest) {
            console.log("updateContestScore - Contest not found for contestId:", contestId);
            return {
                ok: false,
                message: "Contest not found",
            };
        }
        
        console.log("updateContestScore - Contest found:", contest.contestId);
        console.log("updateContestScore - Contest users count:", contest.contestUsers.length);
        console.log("updateContestScore - Looking for userRollNumber:", userRollNumber);
        console.log("updateContestScore - Available user roll numbers:", contest.contestUsers.map(u => u.contestUserRollNumber));
        
        const userIndex = contest.contestUsers.findIndex((contestUser: IContestUser) => contestUser.contestUserRollNumber === userRollNumber);
        console.log("updateContestScore - User index found:", userIndex);
        
        if (userIndex === -1) {
            console.log("updateContestScore - User not found in contest. UserRollNumber:", userRollNumber);
            return {
                ok: false,
                message: "User not found in contest",
            };
        }
        const problemIndex = contest.contestUsers[userIndex].contestUserProblemStatus.findIndex((problem: IProblemStatus) => problem.problemId === problemId);
        if (problemIndex === -1) {
            return {
                ok: false,
                message: "Problem not found in contest",
            };
        }
        if (marks > contest.contestUsers[userIndex].contestUserProblemStatus[problemIndex].problemScore) {
            contest.contestUsers[userIndex].contestUserProblemStatus[problemIndex].problemScore = marks;
        }
        let newMarks = 0;
        contest.contestUsers[userIndex].contestUserProblemStatus.forEach((problem: IProblemStatus) => {
            newMarks += problem.problemScore;
        });
        contest.contestUsers[userIndex].contestUserCurrentMarks = newMarks;
        await contest.save();
        return {
            ok: true,
            message: "Contest score updated successfully",
        };
    }
    catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}