const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get all categories for the authenticated user
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id }, // Fetch categories for the authenticated user
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// Create a new category for the authenticated user
router.post('/', async (req, res) => {
  const { type, name } = req.body;
  
  try {
    const newCategory = await prisma.category.create({
      data: {
        type,
        name,
        userId: req.user.id, // Associate the category with the authenticated user
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
});

// Delete a category for the authenticated user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id, // Ensure the category belongs to the authenticated user
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found or unauthorized' });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
});

module.exports = router;
