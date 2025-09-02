import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        // console.log(decoded);

        const user = await Admin.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User Not Found"});
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error"});
    }

}