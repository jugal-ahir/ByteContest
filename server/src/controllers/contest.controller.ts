import { ApiError } from "../utils/ApiError";
import { Contest } from "../models/contest.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from 'express';
import { getUserFromSection } from "../functions/user/getUserFromSection";
import { generateContestCustomCookie } from "../functions/contest/generateContestCustomCookie";
import { IUserFunctionResponse } from "../models/user.model";
class ContestController {

    // Admin Functions
    async createContest(req: Request, res: Response) {
        const {
            contestId,
            contestName,
            contestDescription,
            contestProblems,
            contestStartTime,
            contestEndTime,
            contestSection,
        } = req.body;

        try {
            console.log("Creating contest for section:", contestSection);
            const usersInfo: IUserFunctionResponse = await getUserFromSection(contestSection);
            if (!usersInfo.ok) {
                console.log("Failed to get users from section:", usersInfo.message);
                return res.status(200).json(new ApiError(400, usersInfo.message));
            }
            if (!usersInfo.usersInfo) {
                console.log("No users found in section:", contestSection);
                return res.status(200).json(new ApiError(400, "No users found in the given section"));
            }
            
            console.log("Users found in section:", usersInfo.usersInfo.length);
            console.log("User roll numbers:", usersInfo.usersInfo.map(u => u.userRollNumber));
            
            const contestUsers = usersInfo.usersInfo.map((user) => {
                return {
                    contestUserRollNumber: user.userRollNumber,
                    contestUserCurrentMarks: 0,
                    contestUserName: user.userName,
                    contestUserProblemStatus: contestProblems.map((problemId: number) => {
                        return {
                            problemId,
                            problemScore: 0,
                        };
                    }),
                    contestCustomCookie: "",
                };
            });

            const contest = new Contest({
                contestId,
                contestName,
                contestDescription,
                contestProblems,
                contestStartTime,
                contestEndTime,
                contestSection,
                contestUsers,
            });
            const savedContest = await contest.save();
            const response = {
                ok: true,
                message: "Contest created successfully",
                contest: savedContest,
            };
            return res.status(201).json(new ApiResponse(201, response, "Contest created successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async updateContest(req: Request, res: Response) {
        const { contestId } = req.params;
        const {
            contestName,
            contestDescription,
            contestProblems,
            contestStartTime,
            contestEndTime,
            contestSection,
        } = req.body;

        try {
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(200).json(new ApiError(404, "Contest not found"));
            }

            contest.contestName = contestName;
            contest.contestDescription = contestDescription;
            contest.contestProblems = contestProblems;
            contest.contestStartTime = contestStartTime;
            contest.contestEndTime = contestEndTime;
            contest.contestSection = contestSection;
            contest.contestUsers = contest.contestUsers;
            const savedContest = await contest.save();
            const response = {
                ok: true,
                message: "Contest updated successfully",
                contest: savedContest,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contest updated successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async deleteContest(req: Request, res: Response) {
    }

    async getContest(req: Request, res: Response) {
        const { contestId } = req.params;
        try {
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(200).json(new ApiError(404, "Contest not found"));
            }
            
            console.log("User trying to access contest:", {
                userRollNumber: req.body.user.userRollNumber,
                userSection: req.body.user.userSection,
                userIsAdmin: req.body.user.userIsAdmin,
                contestSection: contest.contestSection,
                contestUsersCount: contest.contestUsers.length
            });
            
            if (req.body.user.userIsAdmin === false) {
                const userInContest = contest.contestUsers.find((contestUser) => contestUser.contestUserRollNumber === req.body.user.userRollNumber);
                console.log("User found in contest:", !!userInContest);
                
                if (userInContest === undefined) {
                    console.log("User not found in contest users list");
                    return res.status(200).json(new ApiError(400, "User not found in contest"));
                }
                if (contest.contestSection !== req.body.user.userSection) {
                    console.log("User section mismatch:", req.body.user.userSection, "vs", contest.contestSection);
                    return res.status(200).json(new ApiError(402, "User not authorized to view this contest"));
                }
                if (new Date(contest.contestStartTime) > new Date()) {
                    console.log("Contest has not started yet");
                    return res.status(200).json(new ApiError(402, "Contest has not started yet"));
                }
                if (new Date(contest.contestEndTime) < new Date()) {
                    console.log("Contest has ended");
                    return res.status(200).json(new ApiError(402, "Contest has ended"));
                }
            }
            const response = {
                ok: true,
                message: "Contest fetched successfully",
                contest,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contest fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }


    async getAllContests(req: Request, res: Response) {
        try {
            const contests = await Contest.find();
            const response = {
                ok: true,
                message: "Contests fetched successfully",
                contests,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contests fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async signInContest(req: Request, res: Response) {
        try {
            const { contestId } = req.params;
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(200).json(new ApiError(404, "Contest not found"));
            }
            const user = req.body.user;
            
            console.log("User trying to sign in to contest:", {
                contestId: intContestId,
                userRollNumber: user.userRollNumber,
                userSection: user.userSection,
                contestSection: contest.contestSection,
                contestUsersCount: contest.contestUsers.length
            });
            
            const contestUser = contest.contestUsers.find((contestUser) => contestUser.contestUserRollNumber === user.userRollNumber);
            console.log("User found in contest for sign in:", !!contestUser);
            
            if (!contestUser) {
                console.log("Available contest users:", contest.contestUsers.map(u => u.contestUserRollNumber));
                return res.status(200).json(new ApiError(200, "User not found in contest"));
            }
            if (contestUser.contestCustomCookie !== "") {
                return res.status(200).json(new ApiError(200, "User already signed in"));
            }
            contestUser.contestCustomCookie = await generateContestCustomCookie(contest.contestId.toString(), user);
            await contest.save();
            const response = {
                ok: true,
                message: "User signed in successfully",
                contestId: contest.contestId,
            };
            return res
                .status(200)
                .cookie("customContestCookie", contestUser.contestCustomCookie)
                .json(new ApiResponse(200, response, "User signed in successfully"));

        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

    async updateContestDeadline(req: Request, res: Response) {
    }

    async clearUserContestCustomCookie(req: Request, res: Response) {
        try {
            const { contestId, userRollNumber } = req.body;
            const intContestId = Number(contestId);
            const contest = await Contest.findOne({ contestId: intContestId });
            if (!contest) {
                return res.status(200).json(new ApiError(200, "Contest not found"));
            }
            // console.log(contest);
            let contestUser;
            for (let i = 0; i < contest.contestUsers.length; i++) {
                console.log(contest.contestUsers[i].contestUserRollNumber, userRollNumber);
                if (contest.contestUsers[i].contestUserRollNumber === userRollNumber) {
                    contestUser = contest.contestUsers[i];
                    break;
                }
            }
            if (!contestUser) {
                return res.status(200).json(new ApiError(200, "User not found in contest"));
            }
            contestUser.contestCustomCookie = "";
            await contest.save();
            const response = {
                ok: true,
                message: "User signed out successfully",
            };
            return res
                .status(200)
                .clearCookie("customContestCookie")
                .json(new ApiResponse(200, response, "User signed out successfully"));

        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));

        }
    }

    async getContestDeadline(req: Request, res: Response) {
        const { contestId } = req.params;
        try {
            const intContestId = Number(contestId);
            const contest = await Contest
                .findOne({ contestId: intContestId })
                .select("contestStartTime contestEndTime");
            if (!contest) {
                return res.status(200).json(new ApiError(404, "Contest not found"));
            }
            const response = {
                ok: true,
                message: "Contest deadline fetched successfully",
                contestStartTime: contest.contestStartTime,
                contestEndTime: contest.contestEndTime,
            };
            return res.status(200).json(new ApiResponse(200, response, "Contest deadline fetched successfully"));
        } catch (error: any) {
            return res.status(400).json(new ApiError(400, error?.message));
        }
    }

};

export const contestController = new ContestController();