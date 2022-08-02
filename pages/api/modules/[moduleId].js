import { connectToDatabase } from '../../../util/mongodb';

export default async(req, res) => {
    const { ObjectId } = require('mongodb');
    const { db } = await connectToDatabase();
    const { moduleId } = req.query;

    const module = await db
        .collection("module")
        .findOne({ "_id": ObjectId(`${moduleId}`)});
    
    res.json(module);
}
