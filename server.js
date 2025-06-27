const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

function readData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/servers', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/update', (req, res) => {
  const { location, type, change } = req.body;
  const data = readData();

  if (!data[location]) data[location] = {};
  if (!data[location][type]) data[location][type] = 0;

  data[location][type] = Math.max(0, data[location][type] + change);
  writeData(data);
  res.json({ success: true, count: data[location][type] });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
