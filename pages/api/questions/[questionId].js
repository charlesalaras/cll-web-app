import { connectToDatabase } from '../../../util/mongodb';

export default async(req, res) => {
    const { ObjectId } = require('mongodb');
    const { db } = await connectToDatabase();
    const { questionId } = req.query;

    const question = await db
        .collection("questions")
        .findOne({ "_id": ObjectId(`${questionId}`)});
   
    if(question.smart) { // If its dynamic, we need to fetch its params + results
        const [params] = await db
            .collection("variants")
            .aggregate([
                { $match: { parent: ObjectId(`${questionId}`)}},
                { $sample: { size: 1 } }
            ]).toArray();
        const dynamicQuestion = { ...question, ...params };
        res.json(dynamicQuestion);
        return;
    } // Otherwise, just give back the question data
    res.json(question);
}
