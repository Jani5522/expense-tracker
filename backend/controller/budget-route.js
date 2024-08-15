const express = require('express');
const { PrismaClient } = require('@prisma/client');
const moment = require('moment');
const prisma = new PrismaClient();
const router = express.Router();


// Route to fetch all budgets for the authenticated user
router.get('/', async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.id },
    });
    const gte = moment().startOf('month').toDate(); // Start of the month
    const lte = moment().endOf('month').toDate(); // End of the month

    // Calculate spent amount for each budget category
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.expenseEntry.aggregate({
          where: {
            userId: req.user.id,
            category: budget.category,
            date:{
              gte,
              lte
            }
          },
          _sum: {
            amount: true,
          },
        });

        return {
          ...budget,
          spent: spent._sum.amount || 0,
        };
      })
    );

    res.status(200).json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error });
  }
});

// Route to create a new budget for the authenticated user
router.post('/', async (req, res) => {
  const { category, budget } = req.body;

  try {
    const newBudget = await prisma.budget.create({
      data: {
        category,
        budget: parseFloat(budget),
        userId: req.user.id,
      },
    });
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error });
  }
});

// Route to update an existing budget for the authenticated user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { budget } = req.body;

  try {
    const updatedBudget = await prisma.budget.update({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
      data: {
        budget: parseFloat(budget),
      },
    });
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error updating budget', error });
  }
});

// Route to delete a budget for the authenticated user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.budget.delete({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error });
  }
});

module.exports = router;
