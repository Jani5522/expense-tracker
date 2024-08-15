import useSWR from 'swr';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ExpenseCategorySelect({ value, onChange }) {
  const { data: incomeSources, error } = useSWR('/api/expense/categories', fetcher);

  if (error) return <div>Failed to load sources</div>;
  if (!incomeSources) return <div>Loading sources...</div>;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='capitalize'>
        <SelectValue placeholder='Select category'  className='capitalize'/>
      </SelectTrigger>
      <SelectContent>
        {incomeSources && incomeSources?.map((source) => (
          <SelectItem key={source.id} value={source.name} className='capitalize'>
            {source.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
