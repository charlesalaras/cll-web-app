

export default async(req, res) => {
    if(req.method !== 'POST') {
        res.status(405).send({message: 'POST ONLY'})
        return
    }
    const record = JSON.parse(req.body);
    res.end(`Response: ${record}`);
}
