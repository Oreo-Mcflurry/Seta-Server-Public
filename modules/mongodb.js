const { MongoClient } = require("mongodb");

const mongoURI = "mongodb://~~";

async function connectToMongoDB() {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    console.log("Connected to the database");
    const database = client.db("ArtistData");
    return database;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
}

async function closeMongoDBConnection(client) {
  try {
    await client.close();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error.message);
  }
}

async function overwriteCollection() {
  const client = new MongoClient(mongoURI);
  try {
      await client.connect();

      const db = client.db("ArtistData");
      const sourceCollection = db.collection("TempArtist");
      const destinationCollection = db.collection("ArtistCollection");

      const dataToOverwrite = await sourceCollection.find({}).toArray();
      await destinationCollection.deleteMany({});
      await destinationCollection.insertMany(dataToOverwrite);
      await sourceCollection.deleteMany({});
      console.log('Collection overwritten successfully');
  } finally {
      await client.close();
  }
}


module.exports = { connectToMongoDB, closeMongoDBConnection, overwriteCollection };