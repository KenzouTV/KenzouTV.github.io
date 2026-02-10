// server.js (Node.js)
const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.YT_API_KEY;   // définis dans ton .env
const CHANNEL_ID = 'YOUR_CHANNEL_ID';

app.get('/latest-video', async (req, res) => {
  try {
    const maxFetch = 10;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=${maxFetch}&key=${API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({error:'YouTube API error'});
    const data = await r.json();
    for (const item of data.items || []) {
      if (item.snippet && item.snippet.liveBroadcastContent === 'none') {
        return res.json({
          id: item.id.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
        });
      }
    }
    res.status(404).json({error:'No non-live video found'});
  } catch (e) {
    console.error(e);
    res.status(500).json({error:e.message});
  }
});

app.listen(PORT, ()=> console.log('Server listening on', PORT));
