import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.db_uri);
const insertProfile = async (profile, req) => {
  console.log(req.body.name);
  const updateDoc = {
    $set: {
      name: req.body.name
    }
  };
  const options = { upsert: true };
  const result = await profile.updateOne({}, updateDoc, options);
  return result;
};

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('test');
    const profile = database.collection('profile');

    if (req.method === 'GET') {
      const data = await profile.find().toArray();
      res.json(data);
    }

    if (req.method === 'POST') {
      const result = await insertProfile(profile, req);
      if (result.upsertedId || result.matchedCount) {
        res.status(200).send({
          message: 'Profile updated!'
        });
      } else {
        res.status(500).send({
          error: 500,
          message: 'Invalid data!'
        });
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
