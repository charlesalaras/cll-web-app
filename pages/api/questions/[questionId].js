import { connectToDatabase } from '../../../util/mongodb';

export default async(req, res) => {
    const { ObjectId } = require('mongodb');
    const { db } = await connectToDatabase();
    const { questionId } = req.query;

    const question = await db
        .collection("questions")
        .findOne({ "_id": ObjectId(`${questionId}`)});
    
    res.json(question);
}
