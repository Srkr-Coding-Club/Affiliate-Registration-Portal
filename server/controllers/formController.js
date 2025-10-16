import Affiliate from "../models/Affiliate.js";
import sendMail from "../utils/sendEmail.js"


export const formController = async (req, res) => {
    const formData = req.body;
    // console.log(formData);
    try {
        const existingAffiliate = await Affiliate.findOne({
            $or: [
                { email: formData.email },
                { clubId: formData.clubId }
            ]
        }).maxTimeMS(5000);

        if (existingAffiliate) {
            return res.status(400).json({
                error: "Affiliate already exists with this email, register number, or club ID"
            });
        }

        const newAffiliate = new Affiliate(formData);
        await newAffiliate.save();

        // Send confirmation email
        // await sendMail(formData);

        res.status(201).json({
            message: "Affiliate registered successfully",
            data: newAffiliate
        });

    } catch (error) {
        res.status(500).json({
            error: "Error processing registration",
            details: error.message
        });
    }
};



export const getAllAffiliates = async (req, res) => {
    try {
        const affiliates = await Affiliate.find();
        res.status(200).json({
            message: "All affiliates retrieved successfully",
            data: affiliates
        });
    } catch (error) {
        res.status(500).json({
            error: "Error fetching affiliates",
            details: error.message
        });
    }
};


export const getLastClubId = async (req, res) => {
    try {
        const lastAffiliate = await Affiliate.findOne().sort({ clubId: -1 });
        let nextClubId;

        if (!lastAffiliate || !lastAffiliate.clubId) {
            // First club ID if no affiliates exist
            nextClubId = '25SCC001';
        } else {
            const lastClubId = lastAffiliate.clubId;

            // Extract the numeric part (last 3 digits)
            const numericPart = parseInt(lastClubId.slice(-3));
            const nextNumber = numericPart + 1;

            // Check if we've reached the maximum
            if (nextNumber > 999) {
                return res.status(400).json({
                    error: "Maximum club ID limit reached (25SCC999)",
                    details: "Please contact administrator"
                });
            }

            // Format with leading zeros
            const formattedNumber = nextNumber.toString().padStart(3, '0');
            nextClubId = `25SCC${formattedNumber}`;
        }

        res.status(200).json({
            message: "Next club ID generated successfully",
            data: { nextClubId }
        });
    } catch (error) {
        res.status(500).json({
            error: "Error generating next club ID",
            details: error.message
        });
    }
};


export const getaffilite = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Affiliate.findById(id);
        res.status(200).json({
            message: "Affiliate Data Received Succesfully",
            data: { user }
        })
    } catch (error) {
        res.status(500).json({
            error: "Error generating next club ID",
            details: error.message
        });
    }
}

export const updateAffiliate = async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;

        const updatedUser = await Affiliate.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Affiliate not found" });
        }
        // await sendMail(updatedUser);
        res.status(200).json({
            message: "Affiliate updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error updating affiliate",
            details: error.message,
        });
    }
};
