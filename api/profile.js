import dotenv from 'dotenv';
import validate from './validate.js';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import Ajv from 'ajv';

const schema = JSON.parse(fs.readFileSync(process.cwd() + '/public/json/schema.json', 'utf8'));

dotenv.config();

const client = new MongoClient(process.env.db_uri);

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('test');
    const profile = database.collection('profile');
    const getData = async () => {
      const data = await profile.find().project({ _id: 0 }).toArray();
      return data;
    }

    if (req.method === 'GET') {
      const data = await getData();
      res.json(data);
    }

    // req.body looks like this { firstname: 'Jack', age: '34', ... }
    // db collection looks like this:
    // { name: "firstname", value" "Tom" }
    // { name: "age", value" "23" }

    if (req.method === 'POST') {

      const result = validate(req.body, schema, Ajv);
      if (result && Array.isArray(result)) {
        console.log(result);
        return res.json({error: result});
      }

      for (const property in req.body) {
        const query = { name: property };
        const updateDoc = {
          $set: { value: req.body[property] }
        };
        await profile.updateOne(query, updateDoc, { upsert: true });
      }

      const data = await getData();
      res.json(data);
    }

  } catch (e) {
    console.error(e);
    res.status(500).end();
  } finally {
    await client.close();
  }
}
