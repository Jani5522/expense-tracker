import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center container">
        <Link
           to='/'
           className='flex items-baseline gap-2 font-semibold bg-transparent py-0'
        >
           <div className='object-contain w-5 aspect-square'>
             <img src='/logo.png' alt='logo' />
           </div>
           <span className='text-primary'>Expense Tracker</span>
        </Link>
        <nav className="ml-auto  gap-4 sm:gap-6 hidden sm:flex">
          <Link to="/register" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            <Button variant='ghost'>Sign Up</Button>
          </Link>
          <Link to="/login" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            <Button>Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-5 md:py-6 lg:py-7 xl:py-8">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Take Control of Your Expenses
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Effortlessly track, manage, and report on your expenses with our intuitive expense tracking app.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    
                  >
                   Login
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/expense-ss.jpg"
                  alt="Expense Tracker"
                  className="overflow-hidden rounded-xl shadow-xl object-contain object-center "
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simplify Your Expense Tracking
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our expense tracking app makes it easy to stay on top of your finances. Quickly log expenses, set
                  budgets, and generate detailed reports.
                </p>
              </div>
              <div>
                <img
                  src="/expense-create.jpg"
                  width="550"
                  height="310"
                  alt="Expense Tracking"
                  className="overflow-hidden rounded-xl shadow-xl object-contain object-center sm:w-full"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[500px_1fr] lg:gap-12 xl:grid-cols-[550px_1fr]">
              <div>
              <img
                src="/budget.jpg"
                width="550"
                height="310"
                alt="Budget Management"
                className="overflow-hidden rounded-xl shadow-xl object-contain  object-center sm:w-full"
              />
              </div>
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Budget Management</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Stay on Top of Your Spending
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Set spending limits, track your progress, and receive alerts when you&apos;re approaching your budget.
                  Never overspend again.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Reporting</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Gain Insights into Your Spending
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Generate detailed reports to understand where your money is going. Identify areas for improvement and
                  make informed financial decisions.
                </p>
              </div>
              <div>

                <img
                  src="/report.jpg"
                  width="550"
                  height="310"
                  alt="Expense Reporting"
                  className="overflow-hidden rounded-xl shadow-xl object-contain  object-center sm:w-full"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Take Control of Your Finances
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our expense tracking app is the perfect tool to help you manage your money and reach your financial
                goals.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                to="/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t container">
        <p className="text-xs text-muted-foreground">&copy; 2024 Expense Tracker. All rights reserved.</p>
        {/* <nav className="sm:ml-auto flex gap-4 sm:gap-6"> */}
          {/* <Link to="#" className="text-xs hover:underline underline-offset-4" >
            Terms of Service
          </Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4" >
            Privacy
          </Link>
        </nav> */}
      </footer>
    </div>
  )
}
