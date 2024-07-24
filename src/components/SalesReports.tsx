import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Typography, Table, Space,Input } from 'antd';
import { format, startOfMonth, endOfMonth } from "date-fns";
import "../sass/pages/SalesReport.scss";
const { Title } = Typography;

interface SellsOrder {
  id: number;
  sales_order: string;
  sales_order_date: string;
  items: { product: string; quantity: number; price: number }[];
  subtotal: number;
  total: number;
}
interface Product {
  id: number;
  created_at: string;
  name: string;
  price: number;
  selling_price: number;
  cost_price: number;
  inventory: number;
  image_url: string;
}

const SalesReport: React.FC = () => {
  const [salesData, setSalesData] = useState<SellsOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  useEffect(() => {
    fetchProducts();
    fetchSalesData();
  }, []);


  const fetchSalesData = async () => {
    // Fetch sales data from the "Sales" table
    const { data, error } = await supabase.from('Sales').select('*');
    if (error) {
      console.error('Error fetching sales data:', error);
    } else {
      setSalesData(data);
    }
  };

  const fetchProducts = async () => {
    // Fetch products from the "Products" table
    const { data, error } = await supabase.from("Products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };




const salesColumns = [
  {
    title: 'Sales Order',
    dataIndex: 'sales_order',
    key: 'sales_order',
  },
  {
    title: 'Sales Order Date',
    dataIndex: 'sales_order_date',
    key: 'sales_order_date',
  },
  {
    title: 'Items',
    dataIndex: 'items',
    key: 'items',
    render: (items: { product: string; quantity: number; price: number }[]) =>
      items.map((item, index) => (
        <div key={index}>
          {item.product} x {item.quantity} (Lps {item.price.toFixed(2)})
        </div>
      )),
  },
  {
    title: 'Subtotal',
    dataIndex: 'subtotal',
    key: 'subtotal',
    render: (value: number) => `Lps ${value.toFixed(2)}`,  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (value: number) => `Lps ${value.toFixed(2)}`,  },
  {
    title: 'Profit',
    key: 'profit',
    render: ( record: { items: Array<{ product: string; quantity: number }>; total: number }) => {
      const totalCost = record.items.reduce(
        (cost, item) => {
          const product = products.find((p) => p.name === item.product);
          if (product) {
            return cost + product.cost_price * item.quantity;
          }
          return cost;
        },
        0
      );
      const profit = record.total - totalCost;
      return `Lps ${profit.toFixed(2)}`;
    },
  },
];

const filterSalesByMonth = () => {
  const [year, month] = filterMonth.split("-");
  const startOfMonthDate = startOfMonth(
    new Date(+year, +month - 1, 1)
  );
  const endOfMonthDate = endOfMonth(new Date(+year, +month - 1, 1));

  const filteredSales = salesData.filter(
    (sale) =>
      sale.sales_order_date >= format(startOfMonthDate, "yyyy-MM-dd") &&
    sale.sales_order_date <= format(endOfMonthDate, "yyyy-MM-dd")
  );

  const totalSales = filteredSales.reduce(
    (total, sale) => total + sale.total,
    0
  );
  const totalProfit = filteredSales.reduce(
    (total, sale) => {
      const totalCost = sale.items.reduce(
        (cost, item) => {
          const product = products.find((p) => p.name === item.product);
          if (product) {
            return cost + product.cost_price * item.quantity;
          } else {
            console.warn(`Product "${item.product}" not found in the database.`);
            return cost;
          }
        },
        0
      );
      const profit = sale.total - totalCost;
      return total + profit;
    },
    0
  );

  return { filteredSales, totalSales, totalProfit };
};


const { filteredSales, totalSales, totalProfit } = filterSalesByMonth();

return (
  <div className="sales-report-container">
    <Title level={3}>Sales Report</Title>
    <Space style={{ marginBottom: 16 }}>
      <Typography.Text className="filter-label">
        Filter by Month:
      </Typography.Text>
      <Input
        type="month"
        value={filterMonth}
        onChange={(e) => {
          setFilterMonth(e.target.value);
        }}
      />
    </Space>
    <div className="table-container">
      <Table dataSource={filteredSales} columns={salesColumns} rowKey="id" />
    </div>
    <div className="totals-container">
      <Typography.Text>
        Total Sales: Lps {totalSales.toFixed(2)}
      </Typography.Text>
      <Typography.Text>
        Total Profit: Lps {totalProfit.toFixed(2)}
      </Typography.Text>
    </div>
  </div>
);
};

export default SalesReport;