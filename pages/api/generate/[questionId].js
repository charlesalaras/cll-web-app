import { connectToDatabase } from '../../../util/mongodb';

export default async(req, res) => {
    // Spawn Child Process
    const { exec } = require('node:child_process');
    // Access backend database
    const { db } = connectToDatabase();
    // Grab id sent from URL
    const { questionId } = req.query;

    // Grab python file from S3
    const file = "./path";
    exec('./generate.py '+ file);
}
