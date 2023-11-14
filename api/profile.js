import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.db_uri);
const insertProfile = async (profile, req) => {
  console.log(req.body);
  Object.entries(req.body).forEach(async (item) => {
    console.log(item);
    const query = {'name': item[0] };
    const updateDoc = {
      $set: {
        value: item[1]
      }
    };
    const options = { upsert: true };
    await profile.updateOne(query, updateDoc, options);
  });

  const data = await profile.find().toArray();
  console.log(data);
  return data;
  /*

  const options = { upsert: true };
  const result = await profile.updateOne({}, updateDoc, options);
  if (result.upsertedId || result.matchedCount) {
    return await profile.findOne();
  } else {
    return;
  }
  */

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
