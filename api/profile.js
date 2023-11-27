import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import validator from './validator.js';

dotenv.config();

const client = new MongoClient(process.env.db_uri);

async function updateDB(collection, data) {
  const userId = data._id;
  const query = { _id: new ObjectId(userId) };

  // removing _id property as this field can't be overwritten in db
  delete data._id;

  // find and update document in db
  await collection.updateOne(query, { $set: data });
}

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('profiles');

    if (req.method === 'GET') {
      const data = await collection.find().toArray();
      res.json(data);
    }

    if (req.method === 'POST') {
      // if body contains invalid data return errors in response
      const valid = validator(req.body);
      if (!valid) {
        return res.json({error: validator.errors});
      }

      await updateDB(collection, req.body);
      const data = await collection.find().toArray();
      res.json(data);
    }
  } catch (e) {
    console.error(e);
    res.status(500).end();
  } finally {
    await client.close();
  }
}
