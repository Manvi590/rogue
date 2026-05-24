const supabase = require('../config/supabase');

const getFormattedTicket = (t) => {
  if (!t) return null;
  return {
    _id: t.id,
    id: t.id,
    user: t.user ? {
      _id: t.user.id,
      id: t.user.id,
      name: t.user.name,
      email: t.user.email
    } : t.user_id,
    userId: t.user_id,
    event: t.event ? {
      _id: t.event.id,
      id: t.event.id,
      title: t.event.title,
      description: t.event.description,
      date: t.event.date,
      location: t.event.location,
      imageUrl: t.event.image_url,
      isPaid: t.event.is_paid,
      ticketPrice: t.event.ticket_price
    } : t.event_id,
    eventId: t.event_id,
    accessCode: t.access_code,
    status: t.status,
    ticketType: t.ticket_type,
    expiresAt: t.expires_at,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
};

// @desc    Purchase a ticket for an event
// @route   POST /api/tickets
// @access  Private
const purchaseTicket = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is free
    if (!event.is_paid) {
      return res.status(400).json({ message: 'This is a free event, no ticket required' });
    }

    // Check existing valid ticket
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    
    if (existingTicket) {
      return res.status(400).json({ message: 'You already have a valid ticket for this event' });
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert([{
        user_id: userId,
        event_id: eventId,
        access_code: `${userId}-${eventId}-${Date.now()}`,
        status: 'active',
        ticket_type: 'spectator',
        expires_at: expiresAt.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Ticket purchased successfully', ticket: getFormattedTicket(ticket) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify if a user has a valid ticket for an event (or if event is free)
// @route   GET /api/tickets/verify/:eventId
// @access  Private
const verifyTicket = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user ? req.user.id : null;

  try {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // If event is free, no ticket required
    if (!event.is_paid) {
      return res.json({ 
        hasTicket: true, 
        canWatch: true,
        reason: 'free_event',
        event: { isPaid: false }
      });
    }

    // If event is paid but user is not logged in
    if (!userId) {
      return res.json({ 
        hasTicket: false, 
        canWatch: false,
        reason: 'not_logged_in',
        event: { isPaid: true, ticketPrice: event.ticket_price }
      });
    }

    // Check for valid ticket
    const { data: ticket } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (ticket) {
      return res.json({ 
        hasTicket: true, 
        canWatch: true,
        reason: 'valid_ticket',
        event: { isPaid: true, ticketPrice: event.ticket_price }
      });
    }

    // No valid ticket found
    res.json({ 
      hasTicket: false, 
      canWatch: false,
      reason: 'no_valid_ticket',
      event: { isPaid: true, ticketPrice: event.ticket_price }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ticket details
// @route   GET /api/tickets/:ticketId
// @access  Private
const getTicketDetails = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*, event:events(*)')
      .eq('id', ticketId)
      .single();

    if (error || !ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(getFormattedTicket(ticket));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Revoke a ticket (admin only)
// @route   PUT /api/tickets/:ticketId/revoke
// @access  Private/Admin
const revokeTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update({ status: 'revoked' })
      .eq('id', ticketId)
      .select()
      .single();

    if (error || !ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket revoked successfully', ticket: getFormattedTicket(ticket) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Grant free/VIP access to an event
// @route   POST /api/tickets/grant
// @access  Private/Admin
const grantFreeAccess = async (req, res) => {
  const { userId, eventId, ticketType = 'vip' } = req.body;

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingTicket) {
      return res.status(400).json({ message: 'User already has a ticket for this event' });
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert([{
        user_id: userId,
        event_id: eventId,
        access_code: `${userId}-${eventId}-${Date.now()}-grant`,
        status: 'active',
        ticket_type: ticketType, // 'vip' or 'free'
        expires_at: expiresAt.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: `${ticketType} access granted successfully`, ticket: getFormattedTicket(ticket) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  purchaseTicket,
  verifyTicket,
  getTicketDetails,
  revokeTicket,
  grantFreeAccess
};
