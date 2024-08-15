const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const moment = require('moment');
const path = require('path');

const prisma = new PrismaClient();
const router = express.Router();
const fs = require('fs');

// Configure multer for file uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'receipts');

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to create a new expense entry and recurring entry if applicable
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const { amount, date, category, description, isRecurring, recurrenceType } = req.body;

    // Basic validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Create the initial expense entry
    const newExpenseEntry = await prisma.expenseEntry.create({
      data: {
        amount: parseFloat(amount),
        date: moment(date).toDate(),
        category,
        description: description || null,
        receipt: req.file ? path.join('api/uploads/receipts', req.file.filename) : null,
        userId: req.user.id,
      },
    });

    // If the transaction is recurring, create a record in RecurringExpense
    if (isRecurring === 'true') {
      const nextDueDate = calculateNextDueDate(moment().startOf('day').toDate(), recurrenceType);

      await prisma.recurringExpense.create({
        data: {
          amount: parseFloat(amount),
          category,
          description: description || null,
          recurrenceType,
          nextDueDate: nextDueDate,
          userId: req.user.id,
        },
      });
    }

    res.status(201).json(newExpenseEntry);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to fetch all source types from the Category table for the authenticated user
router.get('/categories', async (req, res) => {
  try {
    const sources = await prisma.category.findMany({
      where: { userId: req.user.id, type: 'expense' }, // Fetch categories for the authenticated user
    });
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sources' });
  }
});

// Route to fetch all recurring expenses for the authenticated user
router.get('/recurring', async (req, res) => {
  try {
    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: { userId: req.user.id },
      orderBy:{
        createdAt: 'asc'
      }
    });
    res.status(200).json(recurringExpenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recurring expenses' });
  }
});



router.get('/summary', async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Fetch all expense entries for the authenticated user within the current month
    const expenseEntries = await prisma.expenseEntry.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Fetch all budgets for the authenticated user
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.id },
    });

    // If there are no expense entries or budgets, return zeroed values
    if (!expenseEntries.length && !budgets.length) {
      return res.status(200).json({
        totalMonthlyExpenses: 0,
        totalMonthlyBudget: 0,
        remainingBudget: 0,
      });
    }

    // Calculate total monthly expenses
    const totalMonthlyExpenses = expenseEntries.reduce((total, entry) => total + entry.amount, 0);

    // Calculate total monthly budget
    const totalMonthlyBudget = budgets.reduce((total, budget) => total + budget.budget, 0);

    // Calculate remaining budget
    const remainingBudget = totalMonthlyBudget - totalMonthlyExpenses;

    res.status(200).json({
      totalMonthlyExpenses,
      totalMonthlyBudget,
      remainingBudget,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating income summary', error });
  }
});




router.patch('/recurring/:id/disable', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedExpense = await prisma.recurringExpense.update({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
      data: {
        isActive: false,
      },
    });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error disabling recurring expense' });
  }
});

router.delete('/recurring/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.recurringExpense.delete({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });
    res.status(200).json({ message: 'Recurring expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recurring expense' });
  }
});


// Route to fetch all expense entries for the authenticated user
router.get('/', async (req, res) => {
  try {
    const expenseEntries = await prisma.expenseEntry.findMany({
      where: { userId: req.user.id },
      orderBy:{
        createdAt: 'asc'
      }
    });
    res.status(200).json(expenseEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense entries' });
  }
});

// Route to fetch a specific expense entry by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const expenseEntry = await prisma.expenseEntry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!expenseEntry) {
      return res.status(404).json({ message: 'Expense entry not found' });
    }

    res.status(200).json(expenseEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense entry' });
  }
});

// Route to update an existing expense entry
router.put('/:id', upload.single('receipt'), async (req, res) => {
  const { id } = req.params;

  try {
    const { amount, date, category, description } = req.body;
    // Basic validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const expenseEntry = await prisma.expenseEntry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!expenseEntry) {
      return res.status(404).json({ message: 'Expense entry not found' });
    }

    const updatedExpenseEntry = await prisma.expenseEntry.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseFloat(amount),
        date: moment(date).toDate(),
        category,
        description: description || null,
        receipt: req.file ? path.join('api/uploads/receipts', req.file.filename) : expenseEntry.receipt,
      },
    });

    res.status(200).json(updatedExpenseEntry);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete an expense entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const expenseEntry = await prisma.expenseEntry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!expenseEntry) {
      return res.status(404).json({ message: 'Expense entry not found' });
    }

    await prisma.expenseEntry.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Expense entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense entry' });
  }
});

// Helper function to calculate the next due date
function calculateNextDueDate(currentDate, recurrenceType) {
  switch (recurrenceType) {
    case 'daily':
      return moment(currentDate).add(1, 'day').toDate();
    case 'weekly':
      return moment(currentDate).add(1, 'week').toDate();
    case 'monthly':
      return moment(currentDate).add(1, 'month').toDate();
    default:
      throw new Error('Invalid recurrence type');
  }
}

module.exports = router;
