const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const { data: createdContact, error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, subject, message }])
    .select()
    .single();

  if (error) {
    res.status(400);
    return res.json({ message: error.message });
  }
  res.status(201).json(createdContact);
});

module.exports = router;
