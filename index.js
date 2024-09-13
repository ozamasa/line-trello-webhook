const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// LINE Webhook URLのエンドポイント
app.post('/trello', async (req, res) => {
    const events = req.body.events;
    
    if (events && events.length > 0) {
        // LINEのメッセージ内容を取得
        const message = events[0].message.text;
        
        // Trelloにカードを追加
        await createTrelloCard(message);
    }
    
    res.status(200).send('OK');
});

// Trello APIを使ってカードを作成
const createTrelloCard = async (message) => {
    const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
    const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
    const LIST_ID = process.env.LIST_ID; // 環境変数からリストIDを取得

    try {
        const url = `https://api.trello.com/1/cards`;
        const params = {
            key: TRELLO_API_KEY,
            token: TRELLO_TOKEN,
            idList: LIST_ID,
            name: message, // LINEのコメントをカードの名前に
        };
        
        const response = await axios.post(url, {}, { params });
        console.log('Trello card created:', response.data);
    } catch (error) {
        console.error('Error creating Trello card:', error);
    }
};

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
