import { connectToDatabase } from '../../util/mongodb';

export default async(req, res) => {
    if(req.method !== 'POST') {
        res.status(405).send({message: 'POST ONLY'})
        return
    }
    const { db } = await connectToDatabase();
    const record = await db
        .collection("records")
        .insertOne(req.body);
    res.end(`Response: ${record}`);
}
