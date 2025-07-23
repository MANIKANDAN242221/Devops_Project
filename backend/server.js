const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL || 'mongodb://mongo:27017';
const client = new MongoClient(uri);
let db;

client.connect().then(() => {
  db = client.db('emojiDB');
  console.log('MongoDB connected');
});

app.post('/api/vote', async (req, res) => {
  const { emoji } = req.body;
  await db.collection('votes').updateOne({ emoji }, { $inc: { count: 1 } }, { upsert: true });
  res.send({ message: 'Vote counted!' });
});

app.get('/api/votes', async (req, res) => {
  const votes = await db.collection('votes').find().toArray();
  res.send(votes);
});

app.listen(3000, () => console.log('Backend running on 3000'));
