import { asyncHandler } from "../utils/AsyncHandler"
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User, JwtPayload } from "../models/user.model";
import { Request, Response, NextFunction } from "express"

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Try to get token from cookies first, then from Authorization header
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Log for debugging
        console.log("Auth middleware - Token:", accessToken ? "Token found" : "No token");
        console.log("Auth middleware - Cookies:", req.cookies);
        console.log("Auth middleware - Headers:", req.headers.authorization);

        // if user doesn't have access tokens then send error
        if (!accessToken) {
            // throw new ApiError(401, "User not authenticated!!");
            return res
                .status(200)
                .json(new ApiError(401, "Request doesn't have token!!"));
        }

        // verify the user by comparing the access tokens
        const secret = process.env.ACCESS_TOKEN_SECRET || "";
        const decoded = jwt.verify(accessToken, secret) as JwtPayload;

        // adding the user object in the request object
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            // throw new ApiError(401, "User not authenticated!!");
            return res
                .status(200)
                .json(new ApiError(401, "User is not registered!!"));
        }

        req.body.user = user;
        next();
    } catch (error: any) {
        console.error("Auth middleware error:", error);
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }

});
