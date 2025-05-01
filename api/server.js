// api/server.js 该函数为Vercel在线服务平台编写，其作用是创建一个 Express 应用程序，连接到 MongoDB 数据库。
import express from 'express';
import mongoose from 'mongoose';
import {API_ANIME_SIM, API_HELLO, API_USER_REC} from "../config/api.js";

const app = express();
const dbUrl = process.env.MONGODB_URL; // Get the database URL from environment variables
if (!dbUrl) {
  console.error('MONGODB_URL is not defined');
  process.exit(1);
}
const db = mongoose.createConnection(dbUrl);

db.on('error', (error) => {
  console.error('Connection error:', error);
  process.exit(1); // Exit the process with an error code
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get(API_HELLO, (req, res) => {
  res.send('Hello World');
})

app.get(API_ANIME_SIM, async (req, res) => {
  const { id } = req.params;

  try {
    const collection = db.collection('similarity');
    const data = await collection.findOne({ anime_id: parseInt(id) });

    if (data) {
      // Extract `id`, `score`, and `series`
      const results = data.similar_animes.map((item) => ({
        id: item.id.valueOf(),
        score: item.score,
        series: Array.isArray(item.series) ? item.series.map(seriesItem => ({
          id: seriesItem.id.valueOf(),
          score: seriesItem.score
        })) : []
      }));
      res.status(200).json(results);
    } else {
      res.status(404).send('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get(API_USER_REC, async (req, res) => {
  const { id } = req.params;

  try {
    const collection = db.collection('user');
    const data = await collection.findOne({ user_id: parseInt(id) });

    if (data) {
      const results = data.recommendations.map((item) => ({
        id: item.id.valueOf(),
        series: Array.isArray(item.series) ? item.series.map(seriesItem => ({
          id: seriesItem.id.valueOf(),
          score: seriesItem.score
        })) : []
      }));
      res.status(200).json(results);
    } else {
      res.status(404).send('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
export default app;