const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./authentication/passport-config');
const authenticationRoute = require('./controller/authentication')
const express = require('express');
require('dotenv').config();
const app = express();
const { PrismaClient } = require("@prisma/client");
const { checkAuthenticated } = require('./authentication/route-protection');
const prisma = new PrismaClient();
const categoryRoute = require('./controller/categoryRoute');
const incomeRoute = require('./controller/income-route');
const expenseRoute = require('./controller/expense-route');
const budgetRoute = require('./controller/budget-route')
const dashboardRoute = require('./controller/dashboard-route')
const cron = require('node-cron');
const moment = require('moment');
const path = require('path');

const port = process.env.PORT || 3001;
app.use(cors());

// Initialize Passport
initializePassport(passport);

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/authentication', authenticationRoute )

// Routes
app.use('/api/categories',checkAuthenticated, categoryRoute )

// Routes
app.use('/api/income', checkAuthenticated, incomeRoute);

// Routes
app.use('/api/expense', checkAuthenticated, expenseRoute);

// Middleware for authentication (assuming you have some middleware)
app.use('/api/budgets', checkAuthenticated, budgetRoute); // Use appropriate authentication middleware

app.use('/api/dashboard', checkAuthenticated, dashboardRoute)

app.get('/user', async ( req, res )=>{
  const users = await prisma.user.findMany();
  res.send(users)
})



// Schedule cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = moment().startOf('day').toDate();

    // Find all recurring expenses due today or earlier
    const dueRecurringExpenses = await prisma.recurringExpense.findMany({
      where: {
        nextDueDate: {
          lte: today,
        },
        isActive: true,
      },
    });

    for (const recurringExpense of dueRecurringExpenses) {
      // Create a new expense entry based on the recurring expense
      await prisma.expenseEntry.create({
        data: {
          amount: recurringExpense.amount,
          date: recurringExpense.nextDueDate,
          category: recurringExpense.category,
          description: recurringExpense.description,
          userId: recurringExpense.userId,
        },
      });

      // Update the nextDueDate based on the recurrenceType
      const nextDueDate = calculateNextDueDate(recurringExpense.nextDueDate, recurringExpense.recurrenceType);

      await prisma.recurringExpense.update({
        where: { id: recurringExpense.id },
        data: { nextDueDate },
      });
    }

    console.log('Recurring expenses processed successfully.');
  } catch (error) {
    console.error('Error processing recurring expenses:', error);
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




app.listen(port, () => {
  console.log(`Starting Server at http://localhost:${port}`);
});



