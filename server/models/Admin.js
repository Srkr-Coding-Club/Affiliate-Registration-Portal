import mongoose from "mongoose";

const adminschema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            minlength: 6,
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);


const Admin = mongoose.model("Admin", adminschema);

export default Admin;