import Admin from "../models/Admin.js";
import { generateToken } from "../utils/auth.js";


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        
        generateToken(user._id, res);

        res.status(200).json({
            _id: user.id,
            email: user.email,
        })
    } catch (error) {
        console.log("Error In Login Controller");
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in Logout Controller");
        res.status(500).json({ message: "Internal Server Error" });
    }
}