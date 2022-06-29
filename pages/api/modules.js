import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
    const { db } = await connectToDatabase();

    const modules = await db
        .collection("modules")
        .find({})
        .toArray();

    res.json(modules);
};
