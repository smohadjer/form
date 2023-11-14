import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.db_uri);
const insertProfile = async (profile, req) => {
  for (const property in req.body) {
    console.log(property, ':', req.body[property]);
    const query = {
      'name': property
    };
    const updateDoc = {
      $set: {
        value: req.body[property]
      }
    };
    const options = { upsert: false };
    await profile.updateOne(query, updateDoc, options);
  }

  const data = await profile.find().toArray();
  return data;

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
      const data = await insertProfile(profile, req);
      res.json(data);
      /*
      if (result) {
        console.log(result);
        res.status(200).send(result);
      } else {
        res.status(500).send({
          error: 500,
          message: 'Invalid data!'
        });
      }
      */
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
