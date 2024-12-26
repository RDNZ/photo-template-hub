import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrdersChartProps {
  data: Array<{
    month: string;
    orders: number;
  }>;
}

export const OrdersChart = ({ data }: OrdersChartProps) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};