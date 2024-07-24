import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Button, Input, Table, Form, Popconfirm, Modal } from "antd";
import "../sass/pages/Products.scss";
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


const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .ilike("name", `%${searchTerm}%`);
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data as Product[]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const createProduct = async () => {
    const newProduct = form.getFieldsValue();
    const { error } = await supabase
      .from("Products")
      .insert([newProduct]);
    console.log(error);
    if (error) {
      console.error("Error creating product:", error);
    } else {
      form.resetFields();
      await fetchProducts();
      setIsModalOpen(false);
    }
  };

  const updateProduct = async () => {
    const updatedProduct = form.getFieldsValue();
    const {  error } = await supabase
      .from("Products")
      .update(updatedProduct)
      .eq("id", editingProduct?.id);
    if (error) {
      console.error("Error updating product:", error);
    } else {
      fetchProducts();
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };

  const deleteProduct = async (id: number) => {
    const { error } = await supabase.from("Products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      fetchProducts();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    setPreviewImageUrl(product.image_url);
    form.setFieldsValue(product);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (imageUrl: string) => <img src={imageUrl} alt="Product" style={{ maxWidth: '100px' }} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
    },
    {
      title: "Cost Price",
      dataIndex: "cost_price",
      key: "cost_price",
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
      key: "inventory",
    },
    {
      title: "Actions",
      key: "actions",
      render: ( record: Product) => (
        <div style={{ display: "flex",justifyContent: "center" }}>
          <Button size='middle' style={{width: 80,}} type="primary" onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ marginLeft: "8px",width: 75 }} size='middle'>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div style={{ marginBottom: "16px" }}>
        <Input
          placeholder="Search by product name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>
      <div>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create
        </Button>
        <Modal
          title="Create Product"
          open={isModalOpen}
          onOk={createProduct}
          onCancel={() => {
            setIsModalOpen(false);
            setPreviewImageUrl("");
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please input the product name!" },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="selling_price"
              label="Selling Price"
              rules={[
                { required: true, message: "Please input the selling price!" },
              ]}
            >
              <Input placeholder="Selling Price" type="number" />
            </Form.Item>
            <Form.Item
              name="cost_price"
              label="Cost Price"
              rules={[
                { required: true, message: "Please input the cost price!" },
              ]}
            >
              <Input placeholder="Cost Price" type="number" />
            </Form.Item>
            <Form.Item
              name="inventory"
              label="Inventory"
              rules={[
                { required: true, message: "Please input the inventory!" },
              ]}
            >
              <Input placeholder="Inventory" type="number" />
            </Form.Item>
            <Form.Item
              name="image_url"
              label="Image URL"
              rules={[
                { required: true, message: "Please enter an image URL!" },
              ]}
            >
              <Input
                placeholder="Image URL"
                onChange={(e) => setPreviewImageUrl(e.target.value)}
              />
            </Form.Item>
            {previewImageUrl && (
              <div style={{ marginTop: "16px" }}>
                <p>Image Preview:</p>
                <img
                  src={previewImageUrl}
                  alt="Product"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
          </Form>
        </Modal>
        <Modal
          title="Edit Product"
          open={isEditModalOpen}
          onOk={updateProduct}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
            setPreviewImageUrl("");
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please input the product name!" },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="selling_price"
              label="Selling Price"
              rules={[
                { required: true, message: "Please input the selling price!" },
              ]}
            >
              <Input placeholder="Selling Price" type="number" />
            </Form.Item>
            <Form.Item
              name="cost_price"
              label="Cost Price"
              rules={[
                { required: true, message: "Please input the cost price!" },
              ]}
            >
              <Input placeholder="Cost Price" type="number" />
            </Form.Item>
            <Form.Item
              name="inventory"
              label="Inventory"
              rules={[
                { required: true, message: "Please input the inventory!" },
              ]}
            >
              <Input placeholder="Inventory" type="number" />
            </Form.Item>
            <Form.Item
              name="image_url"
              label="Image URL"
              rules={[
                { required: true, message: "Please enter an image URL!" },
              ]}
            >
              <Input
                placeholder="Image URL"
                onChange={(e) => setPreviewImageUrl(e.target.value)}
              />
            </Form.Item>
            {previewImageUrl && (
              <div style={{ marginTop: "16px" }}>
                <p>Image Preview:</p>
                <img
                  src={previewImageUrl}
                  alt="Product"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
            {/* Add more Form.Item components for other columns */}
          </Form>
        </Modal>
      </div>
      <div className="table-container">
        <Table dataSource={products} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export default ProductsPage;
