require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define the Stats schema
const statSchema = new mongoose.Schema({
  title: String,
  value: Number,
});

const Stat = mongoose.model('Stat', statSchema);

// Define the Text schema
const textSchema = new mongoose.Schema({
  section: String,
  content: String,
});

const Text = mongoose.model('Text', textSchema);

// Routes for Stats
app.get('/stats', async (req, res) => {
  const stats = await Stat.find();
  res.json(stats);
});

app.post('/stats', async (req, res) => {
  const { title, value } = req.body;
  const stat = new Stat({ title, value });
  await stat.save();
  res.status(201).json(stat);
});

app.put('/stats/:id', async (req, res) => {
  const { id } = req.params;
  const { title, value } = req.body;
  const updatedStat = await Stat.findByIdAndUpdate(id, { title, value }, { new: true });
  res.json(updatedStat);
});

// Routes for Text
app.get('/text', async (req, res) => {
  const texts = await Text.find();
  res.json(texts);
});

app.post('/text', async (req, res) => {
  const { section, content } = req.body;
  const text = new Text({ section, content });
  await text.save();
  res.status(201).json(text);
});

app.put('/text/:id', async (req, res) => {
  const { id } = req.params;
  const { section, content } = req.body;
  const updatedText = await Text.findByIdAndUpdate(id, { section, content }, { new: true });
  res.json(updatedText);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
