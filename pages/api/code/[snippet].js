// API endpoint to calculate parameters or grades
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

export default async(req, res) => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
    // Access filename from request
    const { snippet } = req.query;
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
    let answer;
    const python = execFile('python3' ['driver.py', '--generate', snippet], (error, stdout, stderr) => {
        if(error) {
            console.log(error);
        }
        // Record response from stdout
        answer = stdout;
    });
    // Delete file now that we are finished with it.
    try {
        fs.unlinkSync(snippet);
    } catch(err) {
        console.log(error);
    }
    res.json(answer);
}
