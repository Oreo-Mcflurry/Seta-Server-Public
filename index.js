const { connectToMongoDB, closeMongoDBConnection } = require("./modules/mongodb");
var crawling = require('./modules/crawlingArtist');

const express = require('express');
const app = express();
const port = 3000;

app.get('/api/getArtists', async (req, res) => {
  const database = await connectToMongoDB();

  try {
    const collection = database.collection('Collection');
    const artists = await collection.find({}).toArray();
    res.json(artists);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await closeMongoDBConnection(database.client);
  }
});

app.listen(port, () => {
  console.log(`Server is running!`);
});