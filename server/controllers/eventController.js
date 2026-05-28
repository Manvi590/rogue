const supabase = require('../config/supabase');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;

    // Map camelCase fields to match previous Mongoose models for frontend compatibility
    const formattedEvents = events.map(e => ({
      _id: e.id,
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      image: e.image_url,
      imageUrl: e.image_url,
      isLive: e.is_live,
      streamUrl: e.stream_url,
      isPaid: e.is_paid,
      ticketPrice: e.ticket_price,
      competitors: e.competitors,
      judges: e.judges,
      isFeatured: e.is_featured,
      createdAt: e.created_at,
      updatedAt: e.updated_at
    }));

    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const formattedEvent = {
      _id: event.id,
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      image: event.image_url,
      imageUrl: event.image_url,
      isLive: event.is_live,
      streamUrl: event.stream_url,
      isPaid: event.is_paid,
      ticketPrice: event.ticket_price,
      competitors: event.competitors,
      judges: event.judges,
      isFeatured: event.is_featured,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

    res.json(formattedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  const { title, description, date, location, image, imageUrl, isLive, streamUrl, isPaid, ticketPrice, competitors, judges, isFeatured } = req.body;

  try {
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (isPaid && !ticketPrice) {
      return res.status(400).json({ message: 'Ticket price is required for paid events' });
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert([{
        title,
        description,
        date,
        location,
        image_url: imageUrl || image || '',
        is_live: isLive || false,
        stream_url: streamUrl || '',
        is_paid: isPaid || false,
        ticket_price: isPaid ? parseFloat(ticketPrice) : 0.00,
        competitors: competitors || '',
        judges: judges || '',
        is_featured: isFeatured || false
      }])
      .select()
      .single();

    if (error) throw error;

    const formattedEvent = {
      _id: event.id,
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      image: event.image_url,
      imageUrl: event.image_url,
      isLive: event.is_live,
      streamUrl: event.stream_url,
      isPaid: event.is_paid,
      ticketPrice: event.ticket_price,
      competitors: event.competitors,
      judges: event.judges,
      isFeatured: event.is_featured,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

    res.status(201).json({ message: 'Event created successfully', event: formattedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  const { title, description, date, location, image, imageUrl, isLive, streamUrl, isPaid, ticketPrice, competitors, judges, isFeatured } = req.body;

  try {
    // Check if event exists
    const { data: existingEvent, error: findError } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (isPaid && !ticketPrice) {
      return res.status(400).json({ message: 'Ticket price is required for paid events' });
    }

    const updates = {
      title: title !== undefined ? title : existingEvent.title,
      description: description !== undefined ? description : existingEvent.description,
      date: date !== undefined ? date : existingEvent.date,
      location: location !== undefined ? location : existingEvent.location,
      image_url: imageUrl !== undefined ? imageUrl : (image !== undefined ? image : existingEvent.image_url),
      is_live: isLive !== undefined ? isLive : existingEvent.is_live,
      stream_url: streamUrl !== undefined ? streamUrl : existingEvent.stream_url,
      is_paid: isPaid !== undefined ? isPaid : existingEvent.is_paid,
      ticket_price: isPaid !== undefined ? (isPaid ? parseFloat(ticketPrice) : 0.00) : existingEvent.ticket_price,
      competitors: competitors !== undefined ? competitors : existingEvent.competitors,
      judges: judges !== undefined ? judges : existingEvent.judges,
      is_featured: isFeatured !== undefined ? isFeatured : existingEvent.is_featured,
      updated_at: new Date()
    };

    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    const formattedEvent = {
      _id: event.id,
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      image: event.image_url,
      imageUrl: event.image_url,
      isLive: event.is_live,
      streamUrl: event.stream_url,
      isPaid: event.is_paid,
      ticketPrice: event.ticket_price,
      competitors: event.competitors,
      judges: event.judges,
      isFeatured: event.is_featured,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

    res.json({ message: 'Event updated successfully', event: formattedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { data: event, error: findError } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    const formattedEvent = {
      _id: event.id,
      id: event.id,
      title: event.title,
      description: event.description
    };
    
    res.json({ message: 'Event deleted successfully', event: formattedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle event between paid and free
// @route   PUT /api/events/:id/toggle-paid
// @access  Private/Admin
const toggleEventPaid = async (req, res) => {
  const { ticketPrice } = req.body;

  try {
    const { data: event, error: findError } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (findError || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newIsPaid = !event.is_paid;
    let newPrice = 0.00;
    
    if (newIsPaid && ticketPrice) {
      newPrice = parseFloat(ticketPrice);
    }

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        is_paid: newIsPaid,
        ticket_price: newPrice,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    const formattedEvent = {
      _id: updatedEvent.id,
      id: updatedEvent.id,
      title: updatedEvent.title,
      isPaid: updatedEvent.is_paid,
      ticketPrice: updatedEvent.ticket_price
    };

    res.json({ 
      message: `Event is now a ${updatedEvent.is_paid ? 'paid' : 'free'} event`, 
      event: formattedEvent 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventPaid
};
