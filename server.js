import express from 'express';
import profile from './api/profile.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

app.post('/api/profile', (req, res) => {
  profile(req, res);
});

app.get('/api/profile', (req, res) => {
  profile(req, res);
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});


