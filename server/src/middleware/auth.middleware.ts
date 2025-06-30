import { asyncHandler } from "../utils/AsyncHandler"
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User, JwtPayload } from "../models/user.model";
import { Request, Response, NextFunction } from "express"

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Access token:", accessToken);

        if (!accessToken) {
            console.log("No access token found");
            return res
                .status(200)
                .json(new ApiError(401, "Request doesn't have token!!"));
        }

        const secret = process.env.ACCESS_TOKEN_SECRET || "";
        let decoded;
        try {
            decoded = jwt.verify(accessToken, secret) as JwtPayload;
            console.log("Decoded JWT:", decoded);
        } catch (jwtError) {
            console.log("JWT verification error:", jwtError);
            return res.status(200).json(new ApiError(401, "Invalid token!"));
        }

        const user = await User.findById(decoded._id).select("-password");
        console.log("User found:", user);

        if (!user) {
            console.log("User not found for decoded JWT");
            return res
                .status(200)
                .json(new ApiError(401, "User is not registered!!"));
        }

        req.user = user;
        next();
    } catch (error: any) {
        console.log("JWT verification error (outer catch):", error);
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }
});