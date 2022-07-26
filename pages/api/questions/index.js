import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
    const { db } = await connectToDatabase();
    
    const questions = await db
        .collection("questions")
        .find({})
        .toArray();

    res.json(questions);
};
