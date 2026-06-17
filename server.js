// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// CORS পলিসি ইনেবল করা যাতে যেকোনো হোস্টিং থেকে এটি এক্সেস করা যায়
app.use(cors());

// ফ্রন্টএন্ড ফাইলগুলো পরিবেশন (Serve) করার জন্য
app.use(express.static(path.join(__dirname, 'public')));

// বাছাইকৃত সেরা ১৩টি ফুটবল এবং ওয়ার্ল্ড কাপ লাইভ স্ট্রিম চ্যানেল
const channels = [
    { id: 1, name: "Football World Cup (BEIN SPORTS)", url: "http://starhub.pro/live/farhat-3379/67897-913379/744517.ts" },
    { id: 2, name: "Football World Cup (BIOSCOPE PLUS)", url: "https://streamsportixa.ajmainearafat.workers.dev/live.m3u8" },
    { id: 3, name: "Football World Cup Hindi", url: "http://starhub.pro/live/farhat-3379/67897-913379/741567.ts" },
    { id: 4, name: "Football World Cup Sky", url: "https://d1211whpimeups.cloudfront.net/smil:rtbgo/chunklist.m3u8" },
    { id: 5, name: "Football World Cup 2026", url: "http://202.70.146.135:8000/play/a06s/index.m3u8" },
    { id: 6, name: "Football World Cup (4K) 1", url: "http://ytoxw6un.ottclub.xyz/iptv/KCUHA6DGYYVA8ZZFUPQV3KZH/6408/index.m3u8" },
    { id: 7, name: "Football World Cup (4K) 2", url: "http://starhub.pro/live/farhat-3379/67897-913379/745269.ts" },
    { id: 8, name: "Football World Cup (4K) 3", url: "http://starhub.pro/live/farhat-3379/67897-913379/745270.ts" },
    { id: 9, name: "Caze TV BR (World Cup)", url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8" },
    { id: 10, name: "DSports FHD", url: "http://190.108.83.69:8000/play/a05w/index.m3u8" },
    { id: 11, name: "FOX Sports Live", url: "https://d1jzu95oc8fgt3.cloudfront.net/FOX_Sports720p.m3u8" },
    { id: 12, name: "Star Sports 1 HD", url: "http://41.205.93.154/STARSPORTS1/index.m3u8" },
    { id: 13, name: "T Sports Live", url: "http://luckonline.eu/live/y49sz6KMQs/6115263489/1142.ts" }
];

// এপিআই এন্ডপয়েন্ট: চ্যানেল লিস্ট ফ্রন্টএন্ডে পাঠানোর জন্য
app.get('/api/channels', (req, res) => {
    res.json(channels);
});

// ভিডিও রিভার্স প্রক্সি রাউট: CORS এবং আইপি ব্লক বাইপাস করার জন্য
app.get('/proxy', async (req, res) => {
    const streamUrl = req.query.url;
    if (!streamUrl) return res.status(400).send("Stream URL missing");

    try {
        const response = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Referer': streamUrl
            }
        });

        // কন্টেন্ট টাইপ ঠিক রেখে ডেটা পাইপ করা
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("Error loading stream: " + error.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`IPTV Server is running on port ${PORT}`));
