const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

app.post('/webhooks/github', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);

    const secret = 'YOUR_GITHUB_WEBHOOK_SECRET';
    const hash = crypto.createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    if (hash !== signature.split('=')[1]) {
        console.error('Invalid signature');
        return res.sendStatus(403);
    }

    console.log('Received GitHub webhook event:', req.body);

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Webhook receiver listening on port 3000');
});