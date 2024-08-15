const moment = require('moment');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();
const router = express.Router();

// Zod schema for income entry validation
const incomeEntrySchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.string().transform((str) => new Date(str)),
  source: z.string().nonempty("Source is required"), // Source is now a string
  description: z.string().optional(),
});

// Route to fetch all income entries for the authenticated user
router.get('/', async (req, res) => {
  try {
    const incomeEntries = await prisma.incomeEntry.findMany({
      where: { userId: req.user.id },
      orderBy:{
        createdAt: 'asc'
      }
    });
    res.status(200).json(incomeEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching income entries' });
  }
});




// Route to fetch income summary statistics for the authenticated user
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the start and end of the current month and year
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    // Fetch income entries for the current user
    const incomeEntries = await prisma.incomeEntry.findMany({
      where: { userId },
    });

    if (!incomeEntries.length) {
      return res.status(200).json({
        currentMonthIncome: 0,
        totalYearlyIncome: 0,
        highestMonthlyIncome: 0,
      });
    }

    // Calculate the current month income
    const currentMonthIncome = incomeEntries
      .filter(entry => entry.date >= startOfMonth && entry.date <= endOfMonth)
      .reduce((sum, entry) => sum + entry.amount, 0);

    // Calculate the total yearly income
    const totalYearlyIncome = incomeEntries
      .filter(entry => entry.date >= startOfYear && entry.date <= endOfYear)
      .reduce((sum, entry) => sum + entry.amount, 0);

    // Calculate the highest monthly income in the current year
    const incomeByMonth = incomeEntries.reduce((acc, entry) => {
      const monthKey = moment(entry.date).format('YYYY-MM');
      acc[monthKey] = (acc[monthKey] || 0) + entry.amount;
      return acc;
    }, {});

    const highestMonthlyIncome = Math.max(...Object.values(incomeByMonth));

    res.status(200).json({
      currentMonthIncome,
      totalYearlyIncome,
      highestMonthlyIncome,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating income summary', error });
  }
});



// Route to fetch all source types from the Category table for the authenticated user
router.get('/sources', async (req, res) => {
    try {
      const sources = await prisma.category.findMany({
        where: { userId: req.user.id, type: 'income' }, // Fetch categories for the authenticated user
      });
      res.status(200).json(sources);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sources' });
    }
});


// Route to fetch a specific income entry by ID for the authenticated user
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const incomeEntry = await prisma.incomeEntry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!incomeEntry) {
      return res.status(404).json({ message: 'Income entry not found' });
    }

    res.status(200).json(incomeEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching income entry' });
  }
});

// Route to create a new income entry for the authenticated user
router.post('/', async (req, res) => {
  try {
    const validatedData = incomeEntrySchema.parse(req.body);

    const newIncomeEntry = await prisma.incomeEntry.create({
      data: {
        ...validatedData,
        userId: req.user.id, // Associate the income entry with the authenticated user
      },
    });

    res.status(201).json(newIncomeEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Route to update an existing income entry for the authenticated user
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const validatedData = incomeEntrySchema.parse(req.body);

    const incomeEntry = await prisma.incomeEntry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!incomeEntry) {
      return res.status(404).json({ message: 'Income entry not found' });
    }

    const updatedIncomeEntry = await prisma.incomeEntry.update({
      where: { id: parseInt(id) },
      data: validatedData,
    });

    res.status(200).json(updatedIncomeEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Route to delete an income entry by ID for the authenticated user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const incomeEntry = await prisma.incomeEntry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!incomeEntry) {
      return res.status(404).json({ message: 'Income entry not found' });
    }

    const deletedIncomeEntry = await prisma.incomeEntry.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json(deletedIncomeEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting income entry' });
  }
});



module.exports = router;
