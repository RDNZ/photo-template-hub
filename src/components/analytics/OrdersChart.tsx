import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { colors } from '@/config/theme/colors';

interface OrdersChartProps {
  data: Array<{
    month: string;
    orders: number;
  }>;
}

export const OrdersChart = ({ data }: OrdersChartProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{
            top: 20,
            right: isMobile ? 0 : 30,
            left: isMobile ? -20 : 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            fontSize={12}
            tick={{ fill: colors.brand.gray.dark }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: colors.brand.gray.dark }}
          />
          <Tooltip />
          <Bar 
            dataKey="orders" 
            fill={colors.brand.teal}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};