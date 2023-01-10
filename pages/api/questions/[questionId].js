import { connectToDatabase } from '../../../util/mongodb';
import { createClient } from '@supabase/supabase-js';

export default async(req, res) => {
    const { ObjectId } = require('mongodb');
    const { db } = await connectToDatabase();
    const { questionId } = req.query;

    const question = await db
        .collection("questions")
        .findOne({ "_id": ObjectId(`${questionId}`)});
   
    if(question.smart == "variant") { // If we don't need to generate any code, we can grab the variant directly.
        const [params] = await db
            .collection("variants")
            .aggregate([
                { $match: { parent: ObjectId(`${questionId}`)}},
                { $sample: { size: 1 } }
            ]).toArray();
        const dynamicQuestion = { ...question, ...params };
        res.json(dynamicQuestion);
        return;
    } 
    else if(question.smart == "generative") { // Otherwise we need to generate new data.
        // Download file from storage
        const { data, error } = await supabase
            .storage
            .from('code')
            .download(snippet)

        if(error) {
            res.json({response: "ERROR"});
            return;
        }
        // Concatenate response into its own file
        const buffer = Buffer.from( await data.arrayBuffer() );
        await fs.promises.writeFile(snippet, buffer);
        // Run the new file in a Python forked process
        const { execFile } = require('node:child_process');
        let params;
        const python = execFile('python3' ['driver.py', '--generate', snippet], (error, stdout, stderr) => {
            if(error) {
                console.log(error);
            }
            // Record response from stdout
            params = stdout;
        });
        // Delete file now that we are finished with it.
        try {
            fs.unlinkSync(snippet);
        } catch(err) {
            console.log(error);
        }
        //FIXME: Does this actually work??
        const dynamicQuestion = { ...question, ...params };
        res.json(dynamicQuestion);
        return;
    } // Otherwise, just give back the question data
    res.json(question);
}
