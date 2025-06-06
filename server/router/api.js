const express = require('express')
const UserProfile = require('../model/userProfile')


const router = express.Router()


router.get('/', async (req, res) => {
    try {
        const Data = await UserProfile.find()
        return res.json(Data)
    } catch (error) {
        res.status(500).json({ message: 'fetching data', error: error.message });

    }
})

router.patch('/toggleStatus', async (req, res) => {
    try {
        const userId = req.body._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await UserProfile.findById(userId);
        const updatedUser = await UserProfile.findByIdAndUpdate(userId,
            { $set: { shortlistStatus: !user.shortlistStatus } },
            { new: true }
        )
        return res.status(201).json({ message: "Success", updatedUser })
    } catch (error) {
        res.status(500).json({ message: 'Error toggling shortlist status', error: error.message });
    }
})


module.exports = router;