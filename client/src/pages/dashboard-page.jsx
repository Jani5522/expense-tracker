import useSWR from 'swr';
import DashboardSection from "@/components/sections/dashboard-section";
import { Loader } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

function DashboardPage() {
  const { data, error } = useSWR('/api/dashboard', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loader className='animate-spin text-primary w-10 h-10 m-auto my-10'></Loader>;

  return (
    <div>
      <DashboardSection data={data} />
    </div>
  );
}

export default DashboardPage;
