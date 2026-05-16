const supabase = require('../config/supabase');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  const { data: events, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    res.status(500);
    throw new Error(error.message);
  }
  res.json(events);
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

module.exports = {
  getEvents,
  getEventById,
};
