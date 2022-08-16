import { connectToDatabase } from '../../util/mongodb';

export default async(req, res) => {
    if(req.method !== 'POST') {
        res.status(405).send({message: 'POST ONLY'})
        return
    }
    const { db } = await connectToDatabase();
    const completion = await db
        .collection("completion")
        .insertOne(req.body);
    res.end(`Response: ${completion}`);
}
