const express = require('express');
const { PrismaClient } = require('@prisma/client');
const moment = require('moment');

const prisma = new PrismaClient();
const router = express.Router();




/**
 * Function to calculate average annual savings for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<number>} - The average annual savings
 */
async function calculateAverageAnnualSavings(userId) {
  try {
    // Fetch income data and group by year
    const incomeEntries = await prisma.incomeEntry.findMany({
      where: {
        userId: userId,
      },
      select: {
        amount: true,
        date: true,
      },
    });

    // Fetch expense data and group by year
    const expenseEntries = await prisma.expenseEntry.findMany({
      where: {
        userId: userId,
      },
      select: {
        amount: true,
        date: true,
      },
    });

    // Group income and expenses by year
    const incomeByYear = incomeEntries.reduce((acc, entry) => {
      const year = moment(entry.date).year();
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += entry.amount;
      return acc;
    }, {});

    const expenseByYear = expenseEntries.reduce((acc, entry) => {
      const year = moment(entry.date).year();
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += entry.amount;
      return acc;
    }, {});

    // Calculate yearly savings
    const yearlySavings = Object.keys(incomeByYear).map((year) => {
      const incomeForYear = incomeByYear[year] || 0;
      const expenseForYear = expenseByYear[year] || 0;
      return incomeForYear - expenseForYear;
    });

    // Calculate the average annual savings
    const totalSavings = yearlySavings.reduce((total, savings) => total + savings, 0);
    const numberOfYears = yearlySavings.length;
    const averageAnnualSavings = numberOfYears > 0 ? totalSavings / numberOfYears : 0;

    return averageAnnualSavings;
  } catch (error) {
    console.error('Error calculating average annual savings:', error);
    throw new Error('Error calculating average annual savings');
  }
}


/**
 * Function to calculate average monthly savings for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<number>} - The average monthly savings
 */
async function calculateAverageMonthlySavings(userId) {
  try {
    // Fetch income data and group by month and year
    const incomeEntries = await prisma.incomeEntry.findMany({
      where: {
        userId: userId,
      },
      select: {
        amount: true,
        date: true,
      },
    });

    // Fetch expense data and group by month and year
    const expenseEntries = await prisma.expenseEntry.findMany({
      where: {
        userId: userId,
      },
      select: {
        amount: true,
        date: true,
      },
    });

    // Group income and expenses by month and year
    const incomeByMonth = incomeEntries.reduce((acc, entry) => {
      const yearMonth = moment(entry.date).format('YYYY-MM');
      if (!acc[yearMonth]) {
        acc[yearMonth] = 0;
      }
      acc[yearMonth] += entry.amount;
      return acc;
    }, {});

    const expenseByMonth = expenseEntries.reduce((acc, entry) => {
      const yearMonth = moment(entry.date).format('YYYY-MM');
      if (!acc[yearMonth]) {
        acc[yearMonth] = 0;
      }
      acc[yearMonth] += entry.amount;
      return acc;
    }, {});

    // Calculate monthly savings
    const monthlySavings = Object.keys(incomeByMonth).map((yearMonth) => {
      const incomeForMonth = incomeByMonth[yearMonth] || 0;
      const expenseForMonth = expenseByMonth[yearMonth] || 0;
      return incomeForMonth - expenseForMonth;
    });

    // Calculate the average monthly savings
    const totalSavings = monthlySavings.reduce((total, savings) => total + savings, 0);
    const numberOfMonths = monthlySavings.length;
    const averageMonthlySavings = numberOfMonths > 0 ? totalSavings / numberOfMonths : 0;

    return averageMonthlySavings;
  } catch (error) {
    console.error('Error calculating average monthly savings:', error);
    throw new Error('Error calculating average monthly savings');
  }
}


router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch total income and total expenses
    const totalIncome = await prisma.incomeEntry.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const totalExpenses = await prisma.expenseEntry.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    // Fetch monthly budget
    const totalMonthlyBudget = await prisma.budget.aggregate({
      where: { userId },
      _sum: { budget: true },
    });

    // Fetch expenses by category
    const expensesByCategory = await prisma.expenseEntry.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true },
    });

    const expensesByCategoryData = expensesByCategory.map((item) => ({
      name: item.category,
      y: item._sum.amount || 0,
    }));

    // Fetch monthly income and expenses for the last 8 months
    const currentMonth = moment().startOf('month');
    const previousMonths = [];
    for (let i = 7; i >= 0; i--) {
      previousMonths.push(currentMonth.clone().subtract(i, 'months').format('YYYY-MM'));
    }

    const expensesAndIncome = {
      categories: previousMonths.map(month => moment(month, 'YYYY-MM').format('MMMM')),
      series: [
        {
          name: 'Expenses',
          data: await Promise.all(previousMonths.map(async (month) => {
            const startOfMonth = moment(month, 'YYYY-MM').startOf('month').toDate();
            const endOfMonth = moment(month, 'YYYY-MM').endOf('month').toDate();
            const sumExpenses = await prisma.expenseEntry.aggregate({
              where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
              _sum: { amount: true },
            });
            return sumExpenses._sum.amount || 0;
          })),
        },
        {
          name: 'Income',
          data: await Promise.all(previousMonths.map(async (month) => {
            const startOfMonth = moment(month, 'YYYY-MM').startOf('month').toDate();
            const endOfMonth = moment(month, 'YYYY-MM').endOf('month').toDate();
            const sumIncome = await prisma.incomeEntry.aggregate({
              where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
              _sum: { amount: true },
            });
            return sumIncome._sum.amount || 0;
          })),
        },
      ],
    };

    // Fetch recent 5 expenses
    const recentExpenses = await prisma.expenseEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    // Fetch recent 5 income entries
    const recentIncome = await prisma.incomeEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    // Fetch monthly budgets with spent amounts
    const budgets = await prisma.budget.findMany({ where: { userId } });

    const monthlyBudget = await Promise.all(budgets.map(async (budget) => {
      const spent = await prisma.expenseEntry.aggregate({
        where: {
          userId,
          category: budget.category,
          date: {
            gte: moment().startOf('month').toDate(),
            lte: moment().endOf('month').toDate(),
          },
        },
        _sum: { amount: true },
      });
      return {
        name: budget.category,
        spent: spent._sum.amount || 0,
        total: budget.budget,
        progress: ((spent._sum.amount || 0) / budget.budget) * 100,
      };
    }));

    // Calculate total savings, monthly savings, and annual savings
    const totalSavings = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);

    const savings = {
      total: totalSavings,
      monthly: totalSavings / previousMonths.length || 0,
      annual: totalSavings * 12 || 0,
      chart: {
        categories: moment.months(),
        series: [
          {
            name: 'Savings',
            data: await Promise.all(previousMonths.map(async (month) => {
              const startOfMonth = moment(month, 'YYYY-MM').startOf('month').toDate();
              const endOfMonth = moment(month, 'YYYY-MM').endOf('month').toDate();
              const income = await prisma.incomeEntry.aggregate({
                where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
                _sum: { amount: true },
              });
              const expenses = await prisma.expenseEntry.aggregate({
                where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
                _sum: { amount: true },
              });
              return (income._sum.amount - expenses._sum.amount) || 0;
            })),
          },
        ],
      },
    };

    const averageAnnualSaving = await calculateAverageAnnualSavings(userId)
    const averageMonthlySavings = await calculateAverageMonthlySavings(userId);
    // Construct the response data
    const data = {
      cards: [
        { title: 'Total Income', amount: totalIncome._sum.amount || 0, change: '' },
        { title: 'Total Expenses', amount: totalExpenses._sum.amount || 0, change: '' },
        { title: 'Monthly Budget', amount: totalMonthlyBudget._sum.budget || 0, change: '' },
        { title: 'Budget Spent', amount: monthlyBudget.reduce((acc, budget) => acc + budget.spent, 0), progress: { value: (monthlyBudget.reduce((acc, budget) => acc + budget.spent, 0) / (totalMonthlyBudget._sum.budget || 1)) * 100, label: '' } },
        { title: 'Remaining Budget ', amount: (totalMonthlyBudget._sum.budget || 0) - monthlyBudget.reduce((acc, budget) => acc + budget.spent, 0), change: '' },
        { title: 'Total Saving', amount: totalSavings, change: '' },
        { title: 'Average Monthly Saving', amount: averageMonthlySavings || 0, change: '' },
        { title: 'Average Annual Saving', amount: averageAnnualSaving || 0, change: '' },
      ],
      expensesByCategory: {
        series: expensesByCategoryData,
      },
      expensesAndIncome,
      recentExpenses: recentExpenses.map(expense => ({
        date: moment(expense.date).format('YYYY-MM-DD'),
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
      })),
      recentIncome: recentIncome.map(income => ({
        date: moment(income.date).format('YYYY-MM-DD'),
        amount: income.amount,
        source: income.source,
        description: income.description,
      })),
      monthlyBudget,
      savings,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
});



router.get('/current-balance', async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch total income for the user
      const totalIncome = await prisma.incomeEntry.aggregate({
        where: { userId },
        _sum: { amount: true },
      });
  
      // Fetch total expenses for the user
      const totalExpenses = await prisma.expenseEntry.aggregate({
        where: { userId },
        _sum: { amount: true },
      });
  
      // Calculate current balance
      const currentBalance = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);
  
      res.status(200).json({ currentBalance });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating current balance', error });
    }
});
  




router.get('/report-data', async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'month' } = req.query;

    // Define the date range based on the selected timeframe
    let startDate, endDate, monthsCount = 1;
    
    if (timeframe === 'month') {
      startDate = moment().startOf('month').toDate();
      endDate = moment().endOf('month').toDate();
    } else if (timeframe === 'last-month') {
      startDate = moment().subtract(1, 'months').startOf('month').toDate();
      endDate = moment().subtract(1, 'months').endOf('month').toDate();
    } else if (timeframe === 'last-three-months') {
      startDate = moment().subtract(3, 'months').startOf('month').toDate();
      endDate = moment().endOf('month').toDate();
      monthsCount = 3;
    } else if (timeframe === 'year') {
      startDate = moment().startOf('year').toDate();
      endDate = moment().endOf('year').toDate();
      monthsCount = moment().endOf('year').diff(moment().startOf('year'), 'month') + 1;
    } else {
      startDate = moment().startOf('year').subtract(10, 'years').toDate();
      endDate = moment().endOf('year').toDate();
      monthsCount = 12 * 10;
    }

    // Fetch expenses
    const expenses = await prisma.expenseEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Aggregate expenses by category
    const expensesByCategory = await prisma.expenseEntry.groupBy({
      by: ['category'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Fetch income
    const income = await prisma.incomeEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Aggregate income by source
    const incomeBySource = await prisma.incomeEntry.groupBy({
      by: ['source'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Fetch budget data
    const budgets = await prisma.budget.findMany({
      where: { userId },
    });

    // Calculate actual spent for each budget category
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.expenseEntry.aggregate({
          where: {
            userId,
            category: budget.category,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalBudget = budget.budget * monthsCount;
        
        return {
          name: budget.category,
          spent: spent._sum.amount || 0,
          total: totalBudget,
          progress: Math.round((spent._sum.amount || 0) / totalBudget * 100),
        };
      })
    );

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const surplus = totalIncome - totalExpenses;

    // Prepare the budget options data
    const budgetData = [
      {
        name: 'Budget',
        y: budgetsWithSpent.reduce((sum, b) => sum + b.total, 0),
      },
      {
        name: 'Expense',
        y: totalExpenses,
      },
      {
        name: 'Income',
        y: totalIncome,
      },
      {
        name: 'Surplus',
        y: surplus,
      }
    ].filter(data => data.y !== 0); // Remove entries with y = 0

    const data = {
      expenses: expensesByCategory.map((e) => ({
        category: e.category,
        amount: e._sum.amount || 0,
      })),
      income: incomeBySource.map((i) => ({
        source: i.source,
        amount: i._sum.amount || 0,
      })),
      budget: budgetData,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report data', error });
  }
});


module.exports = router;
