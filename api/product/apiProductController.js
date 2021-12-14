const Rating = require('../../models/Rating');

exports.rate = async (req,res) => {
    const {protductID, rating, content} = req.body;
    
    try{
        const newRating = await Rating.create({
            productId,
            rating,
            content,
            //Userid
        });

        res.status(201).json(newRating);
    } catch (error){
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
};