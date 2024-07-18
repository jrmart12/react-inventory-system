import { useState, useEffect } from "react";

import { Statistic, Table } from "antd";
import { supabase } from "../supabaseClient";
import { format, startOfMonth, endOfMonth } from "date-fns";
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

interface SellsOrder {
  id: number;
  sales_order: string;
  sales_order_date: string;
  items: { product: string; quantity: number; price: number }[];
  subtotal: number;
  total: number;
}
const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesData, setSalesData] = useState<SellsOrder[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchSalesData();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("Products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };

  const fetchSalesData = async () => {
    const { data, error } = await supabase.from("Sales").select("*");
    if (error) {
      console.error("Error fetching sales data:", error);
    } else {
      setSalesData(data);
    }
  };

  const filterSalesByMonth = () => {
    const [year, month] = format(new Date(), "yyyy-MM").split("-");
    const startOfMonthDate = startOfMonth(new Date(+year, +month - 1, 1));
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

    return { totalSales };
  };

  const { totalSales } = filterSalesByMonth();

  const productsToReorder = products.filter(
    (product) => product.inventory === 0
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (imageUrl: string) => <img src={imageUrl} alt="Product" style={{ maxWidth: '100px' }} />,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cost Price",
      dataIndex: "cost_price",
      key: "cost_price",
      render: (value: number) => `Lps ${value.toFixed(2)}`,    },
  ];

  return (
    <>
      <h1>Baby Heaven Inventory Management System</h1>
      <Statistic
        title="Total Sales (Current Month)"
        value={totalSales.toFixed(2)}
        prefix="Lps "
      />
      <Table
        dataSource={productsToReorder}
        columns={columns}
        title={() => <h2>Products to Reorder</h2>}
        rowKey="id"
      />
    </>
  );
};

export default Home;
