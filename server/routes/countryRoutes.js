const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const dataPath = path.join(__dirname, '../data/countries.json');

router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error reading countries', error: err.message });
  }
});

router.post('/', protect, admin, (req, res) => {
  try {
    const { name, code, flag } = req.body;
    if (!name || !code || !flag) {
      return res.status(400).json({ message: 'Name, code, and flag are required' });
    }
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const newCountry = { name, code, flag, competitors: "0" };
    data.push(newCountry);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(500).json({ message: 'Error adding country', error: err.message });
  }
});

module.exports = router;
