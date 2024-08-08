import Link from "@/components/ui/Link";
import {
  BadgePoundSterlingIcon,
  BarChart2,
  CircleUser,
  CreditCard,
  Home,
  Menu,
  PieChart,
  PoundSterlingIcon,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { formatNumber } from "@/lib/formatters";
import { useLocation } from "react-router-dom";
import { EntryCreator } from "./entry-creator";

const pathname = [
  { to: '/dashboard', name: "Dashboard", icon: <Home className='h-4 w-4' /> },
  {
    to: "/income",
    name: "Income",
    icon: <PoundSterlingIcon className='h-4 w-4' />,
  },
  { to: "/expense", name: "Expense", icon: <CreditCard className='h-4 w-4' /> },
  { to: "/budget", name: "Budget", icon: <PieChart className='h-4 w-4' /> },
  { to: "/category", name: "Category", icon: <Tag className='h-4 w-4' /> },
  { to: "/report", name: "Report", icon: <BarChart2 className='h-4 w-4' /> },
];

export default function Dashboard({ children }) {
  const { pathname: currentPathname } = useLocation();
  return (
    <>
      <div className='container px-0 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] '>
        <div className='hidden border-r bg-muted  md:block sticky top-0 left-0 max-h-screen'>
          <div className='flex h-full max-h-screen flex-col gap-2'>
            <div className='flex h-14 items-center md:h-[50px]  pl-3.5'>
              <Link
                to='/dashboard'
                className='flex items-baseline gap-2 font-semibold bg-transparent py-0'
              >
                <div className='object-contain w-5 aspect-square'>
                  <img src='/logo.png' alt='logo' />
                </div>
                <span className='text-primary'>Expense Tracker</span>
              </Link>
            </div>
            <div className='flex-1'>
              <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                {pathname.map((path) => (
                  <Link
                    key={path.to}
                    to={path.to}
                    className='flex items-center gap-3 rounded-md'
                  >
                    {path.icon}
                    {path.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <header className='flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6 sticky top-0 z-50'>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='default'
                  size='icon'
                  className='shrink-0 md:hidden'
                >
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='flex flex-col'>
                <nav className='grid gap-2 text-lg font-medium'>
                  <Link
                    to='/dashboard'
                    className='flex items-baseline gap-2 font-semibold bg-transparent py-0 px-0 mb-5'
                  >
                    <div className='object-contain w-10'>
                      <img src='/logo.png' alt='logo' />
                    </div>
                    <span>Expense Tracker</span>
                  </Link>
                  {pathname.map((path) => (
                    <Link
                      key={path.to}
                      to={path.to}
                      className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
                    >
                      {path.icon}
                      {path.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className='w-full flex-1'>
              <form>
                <div className='relative'>
                  <h1 className='text-primary font-medium text-lg'>
                    {pathname.find((path) => currentPathname === path.to)?.name}
                  </h1>
                </div>
              </form>
            </div>
            <div className='mt-auto p-4 px-8 flex text-secondary-foreground justify-start items-center gap-2 '>
              <BadgePoundSterlingIcon className=' w-5 h-5' />
              <p className=''>{formatNumber(100000)}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='secondary'
                  size='icon'
                  className='rounded-full'
                >
                  <CircleUser className='h-5 w-5' />
                  <span className='sr-only'>Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button variant='destructive' className='w-full min-w-36'>
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
            {children}
          </main>
        </div>
      </div>
      <div className="fixed bottom-14 right-14">
        <EntryCreator/>
      </div>
    </>
  );
}
