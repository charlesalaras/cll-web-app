// API endpoint to calculate parameters or grades

export default async(req, res) => {
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

    // Run the new file in a Python forked process
    const { spawn } = require('node:child_process');
    const python = spawn('python3' ['driver.py', '--generate', snippet]);
    // Record response from standard out
    let answer;
    python.stdout.on('data', (data) => {
        answer = { response: data }
    });
    res.json(answer);
}
