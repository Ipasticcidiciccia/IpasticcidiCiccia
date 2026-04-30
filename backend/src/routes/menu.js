const express = require('express');
const router = express.Router();

// Mock database
let menuItems = [
  {
    id: '1',
    name: 'Pasta alla Carbonara',
    description: 'Pasta fresca con guanciale, uova e pecorino',
    price: 8.50,
    category: 'Piatti Principali',
    available: true,
    image: null,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Margherita',
    description: 'Pizza con mozzarella, pomodoro e basilico',
    price: 6.50,
    category: 'Pizza',
    available: true,
    image: null,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Lasagna',
    description: 'Lasagna della nonna ricca di ragù',
    price: 9.00,
    category: 'Piatti Principali',
    available: true,
    image: null,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Dolce classico italiano',
    price: 5.00,
    category: 'Dolci',
    available: true,
    image: null,
    createdAt: new Date()
  }
];

// Get all menu items
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let items = menuItems;

    if (category) {
      items = items.filter(item => item.category === category);
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single menu item
router.get('/:id', (req, res) => {
  try {
    const item = menuItems.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create menu item (admin only)
router.post('/', (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      description: description || '',
      price,
      category,
      image: image || null,
      available: true,
      createdAt: new Date()
    };

    menuItems.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update menu item
router.put('/:id', (req, res) => {
  try {
    const item = menuItems.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    Object.assign(item, req.body, { id: item.id, createdAt: item.createdAt });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete menu item
router.delete('/:id', (req, res) => {
  try {
    const index = menuItems.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const deleted = menuItems.splice(index, 1);
    res.json({ message: 'Menu item deleted', item: deleted[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
