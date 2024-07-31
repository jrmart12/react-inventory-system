import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  Table,
  Button,
  Input,
  DatePicker,
  Typography,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
} from "antd";
import { supabase } from "../supabaseClient";
import "../sass/pages/Sells.scss";

const { Title, Text } = Typography;
const { Option } = Select;

interface SellsOrder {
  id: number;
  sales_order: string;
  sales_order_date: string;
  items: { product: string; quantity: number; price: number }[];
  subtotal: number;
  total: number;
  payed_in: string;
}

interface Product {
  id: number;
  created_at: string;
  name: string;
  price: number;
  selling_price: number;
  cost_price: number;
  inventory: number;
}

const Sells: React.FC = () => {
  const [sellsOrders, setSellsOrders] = useState<SellsOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<SellsOrder | null>(null);
  const [form] = Form.useForm();

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    fetchSellsOrders();
    fetchProducts();
  }, [filterMonth]);

  const calculateSubtotal = () => {
    const items = form.getFieldValue("items") || [];
    const newSubtotal = items.reduce(
      (total: number, item: { price?: number; quantity?: number }) =>
        total + (item?.price ?? 0) * (item?.quantity ?? 0),
      0
    );
    form.setFieldsValue({ subtotal: newSubtotal });
    form.setFieldsValue({ total: newSubtotal });
    setTotal(newSubtotal);
    setSubtotal(newSubtotal);
  };

  const fetchSellsOrders = async () => {
    try {
      const [year, month] = filterMonth.split("-");
      const startOfMonthDate = startOfMonth(new Date(+year, +month - 1, 1));
      const endOfMonthDate = endOfMonth(new Date(+year, +month - 1, 1));

      const { data, error } = await supabase
        .from("Sales")
        .select("*")
        .gte("sales_order_date", format(startOfMonthDate, "yyyy-MM-dd"))
        .lte("sales_order_date", format(endOfMonthDate, "yyyy-MM-dd"));

      if (error) {
        console.error("Error fetching sells orders:", error);
      } else {
        setSellsOrders(data as SellsOrder[]);
      }
    } catch (error) {
      console.error("Error fetching sells orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data as Product[]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    setEditingOrder(null);

    try {
      // Fetch the count of existing sales orders
      const { data: salesCount, error: salesCountError } = await supabase
        .from("Sales")
        .select("id", { count: "exact" });

      if (salesCountError) {
        console.error("Error fetching sales count:", salesCountError);
      } else {
        // Generate the sales order number
        const salesOrderCount = salesCount.length + 1;
        const salesOrderNumber = `BO-${String(salesOrderCount).padStart(
          6,
          "0"
        )}`;

        // Set the initial form values with the generated sales order number
        form.setFieldsValue({
          sales_order: salesOrderNumber,
          sales_order_date: "",
          items: [],
          subtotal: 0,
          total: 0,
        });
      }
    } catch (error) {
      console.error("Error generating sales order number:", error);
    }
  };

  const handleSaveOrder = async (values: SellsOrder) => {
    try {
      if (editingOrder) {
        const { error } = await supabase
          .from("Sales")
          .update({ ...values, payed_in: values.payed_in })
          .eq("id", editingOrder.id);
        if (error) {
          console.error("Error updating Sales order:", error);
        }
      } else {
        const { error } = await supabase
          .from("Sales")
          .insert([{ ...values, payed_in: values.payed_in }]);
        if (error) {
          console.error("Error creating sales order:", error);
        } else {
          for (const item of values.items) {
            const { data: dataProducts, error: errorProducts } = await supabase
              .from("Products")
              .select("*")
              .ilike("name", `%${item.product}%`);
            if (errorProducts) {
              console.error("Error fetching products:", error);
            } else {
              const { error } = await supabase
                .from("Products")
                .update({
                  inventory: dataProducts[0].inventory - item.quantity,
                })
                .eq("id", dataProducts[0].id);
              if (error) {
                console.error("Error updating product:", error);
              }
            }
          }
        }
      }
      setIsCreatingOrder(false);
      setEditingOrder(null);
      fetchSellsOrders();
    } catch (error) {
      console.error("Error saving Sales order:", error);
    }
  };

  const handleCancelOrder = () => {
    setIsCreatingOrder(false);
    setEditingOrder(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Sales Order",
      dataIndex: "sales_order",
      key: "sales_order",
    },
    {
      title: "Sales Order Date",
      dataIndex: "sales_order_date",
      key: "sales_order_date",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (
        items: { product: string; quantity: number; price: number }[]
      ) => (
        <Space direction="vertical">
          {items.map((item, index) => (
            <Text key={index}>
              {item.product} x {item.quantity} (Lps {item.price.toFixed(2)})
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal: number) => <Text>Lps {subtotal.toFixed(2)}</Text>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <Text>Lps {total.toFixed(2)}</Text>,
    },
    {
      title: "Payment Method",
      dataIndex: "payed_in",
      key: "payed_in",
      render: (payedIn: string) => <Text>{payedIn}</Text>,
    },
  ];

  return (
    <div className="sells-container">
      <Title level={2}>Sales</Title>
      <Space className="filter-container" style={{ marginBottom: 16 }}>
        <Text className="filter-label">Filter by Month:</Text>
        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
          }}
        />
        <Button type="primary" onClick={handleCreateOrder}>
          Create Order
        </Button>
      </Space>
      <div className="table-container">
        <Table
          dataSource={sellsOrders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
      <Modal
        title={editingOrder ? "Edit Order" : "Create Order"}
        open={isCreatingOrder}
        onCancel={handleCancelOrder}
        footer={null}
        className="order-modal"
      >
        <Form
          form={form}
          onFinish={handleSaveOrder}
          initialValues={{
            sales_order: "",
            sales_order_date: "",
            items: [],
            subtotal: 0,
            total: 0,
            payed_in: undefined,
          }}
        >
          <Form.Item
            name="sales_order"
            label="Sales Order"
            rules={[{ required: true, message: "Please enter a sales order" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sales_order_date"
            label="Sales Order Date"
            rules={[
              { required: true, message: "Please select a sales order date" },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div>
                <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
                  Products
                </p>

                {fields.map((field, index) => (
                  <Space className="items-modal" key={field.key} align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <p>Name</p>
                      <Form.Item
                        name={[index, "product"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select a product",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select a Product"
                          showSearch
                          optionFilterProp="children"
                          onSelect={(value) => {
                            const selectedProduct = products.find(
                              (product) => product.name === value
                            );
                            if (selectedProduct) {
                              form.setFieldValue([`items[${index}]`], {
                                name: selectedProduct.name,
                                price: selectedProduct.selling_price,
                                quantity: 0,
                              });
                            }
                          }}
                        >
                          {products
                            .filter((product) => product.inventory > 0)
                            .map((product) => (
                              <Option key={product.id} value={product.name}>
                                {product.name} ({product.selling_price}Lps)
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Price</p>
                      <Form.Item
                        name={[index, "price"]}
                        rules={[
                          {
                            required: true,
                            message: "Please have a selling price",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          onChange={(value) => {
                            const selectedProduct = products.find(
                              (product) =>
                                product.name ===
                                form.getFieldValue("items")[index].name
                            );
                            calculateSubtotal();
                            if (selectedProduct && value) {
                              form.setFieldValue([`items[${index}]`], {
                                name: selectedProduct.name,
                                price: value,
                                quantity: 0,
                              });
                            }
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Quantity</p>
                      <Form.Item
                        name={[index, "quantity"]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter a quantity",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          onChange={() => {
                            calculateSubtotal();
                          }}
                        />
                      </Form.Item>
                    </div>
                    <Button
                      danger
                      onClick={() => remove(index)}
                      size="middle"
                      style={{ marginTop: "25px" }}
                    >
                      delete
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} size="middle" block>
                  Add Item
                </Button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                ></div>
              </div>
            )}
          </Form.List>
          <Form.Item
            name="payed_in"
            label="Paid In"
            rules={[
              { required: true, message: "Please select a payment method" },
            ]}
          >
            <Select placeholder="Select payment method">
              <Option value="Bac Credomatic: Nidia Martinez">
                Bac Credomatic: Nidia Martinez
              </Option>
              <Option value="Banco Atlantida: Jose Martinez">
                Banco Atlantida: Jose Martinez
              </Option>
              <Option value="Banco Occidente: Rosa Bardales">
                Banco Occidente: Rosa Bardales
              </Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </Form.Item>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <Form.Item
              name={"subtotal"}
              label="Subtotal"
              rules={[
                {
                  required: true,
                  message: "Please enter a quantity",
                },
              ]}
            >
              <InputNumber min={0} step={0.01} defaultValue={subtotal} />
            </Form.Item>

            <Form.Item
              name={"total"}
              label="Total"
              rules={[
                {
                  required: true,
                  message: "Please enter a quantity",
                },
              ]}
            >
              <InputNumber min={0} step={0.01} value={total} />
            </Form.Item>
          </div>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Order
              </Button>
              <Button onClick={handleCancelOrder}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <div className="month-totals">
        <Title level={4}>Sales of the Month ({filterMonth})</Title>
        <Text>
          Total Sells: Lps{" "}
          {sellsOrders
            .reduce((total, order) => total + order.total, 0)
            .toFixed(2)}
        </Text>
      </div>
    </div>
  );
};

export default Sells;
