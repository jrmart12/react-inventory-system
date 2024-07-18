import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Typography, Table,  } from "antd";
const { Title, Text } = Typography;
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

function InventoryReport() {
  const [products, setProducts] = useState<Product[]>([]);

  const inventoryColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
      key: "inventory",
    },
    {
      title: "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
      render: (value:number) => `Lps ${value.toFixed(2)}`,
    },
    {
      title: "Total",
      key: "total",
      render: (record: Product) =>
        `Lps ${(record.selling_price * record.inventory).toFixed(2)}`,
    },
  ];

  const fetchProducts = async () => {
    // Fetch products from the "Products" table
    const { data, error } = await supabase.from("Products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };

  const totalInventoryCost = products.reduce(
    (total, product) => total + product.selling_price * product.inventory,
    0
  );

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div>
      <Title level={3}>Inventory Report</Title>
      <Table
        dataSource={products}
        columns={inventoryColumns}
        pagination={false}
        rowKey="id"
        footer={() => (
          <div>
            <Text>
              Total Inventory Cost: Lps {totalInventoryCost.toFixed(2)}
            </Text>
          </div>
        )}
      />
    </div>
  );
}

export default InventoryReport;
