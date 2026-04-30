const express = require('express');
const router = express.Router();

// Mock database
let orders = [];

// Get all orders (admin)
router.get('/', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', (req, res) => {
  try {
    const { userId, items, pickupDate, notes } = req.body;

    if (!userId || !items || items.length === 0 || !pickupDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
      id: Date.now().toString(),
      userId,
      items,
      pickupDate,
      notes: notes || '',
      status: 'pending', // pending, confirmed, ready, completed, cancelled
      total,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order
router.post('/:id/cancel', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order with status: ' + order.status });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
