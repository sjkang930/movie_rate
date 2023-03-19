export default async function handler(req, res) {
    const url = 'https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies';
    const headers = {
        'Access-Control-Allow-Origin': '*'
    };
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.status(200).json(data);
}