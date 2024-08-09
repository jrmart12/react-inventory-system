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
} from "antd";
import { supabase } from "../supabaseClient";
import "../sass/pages/Expenses.scss";
import dayjs from "dayjs";
const { Title, Text } = Typography;

interface Expense {
  id: number;
  expense_date: string;
  description: string;
  amount: number;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [isCreatingExpense, setIsCreatingExpense] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchExpenses();
  }, [filterMonth]);

  const fetchExpenses = async () => {
    try {
      const [year, month] = filterMonth.split("-");
      const startOfMonthDate = startOfMonth(new Date(+year, +month - 1, 1));
      const endOfMonthDate = endOfMonth(new Date(+year, +month - 1, 1));

      const { data, error } = await supabase
        .from("Expenses")
        .select("*")
        .gte("expense_date", format(startOfMonthDate, "yyyy-MM-dd"))
        .lte("expense_date", format(endOfMonthDate, "yyyy-MM-dd"));

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        setExpenses(data as Expense[]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleCreateExpense = () => {
    setIsCreatingExpense(true);
    setEditingExpense(null);
    form.setFieldsValue({
      expense_date: "",
      description: "",
      amount: 0,
    });
  };

  const handleSaveExpense = async (values: Expense) => {
    try {
      if (editingExpense) {
        const { error } = await supabase
          .from("Expenses")
          .update(values)
          .eq("id", editingExpense.id);
        if (error) {
          console.error("Error updating expense:", error);
        }
      } else {
        const { error } = await supabase.from("Expenses").insert([values]);
        if (error) {
          console.error("Error creating expense:", error);
        }
      }
      setIsCreatingExpense(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const { error } = await supabase.from("Expenses").delete().eq("id", id);
      if (error) {
        console.error("Error deleting expense:", error);
      } else {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleCancel = () => {
    setIsCreatingExpense(false);
    setEditingExpense(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Expense Date",
      dataIndex: "expense_date",
      key: "expense_date",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <Text>Lps {amount.toFixed(2)}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Expense) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setEditingExpense(record);
              console.log(record.expense_date);
              form.setFieldsValue({
                expense_date: dayjs(record.expense_date),
                description: record.description,
                amount: record.amount,
              });
              setIsCreatingExpense(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteExpense(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="expenses-container">
      <Title level={2}>Expenses</Title>
      <Space className="filter-container" style={{ marginBottom: 16 }}>
        <Text className="filter-label">Filter by Month:</Text>
        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
          }}
        />
        <Button type="primary" onClick={handleCreateExpense}>
          Create Expense
        </Button>
      </Space>
      <div className="table-container">
        <Table
          dataSource={expenses}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
      <Modal
        title={editingExpense ? "Edit Expense" : "Create Expense"}
        open={isCreatingExpense}
        onCancel={handleCancel}
        footer={null}
        className="expense-modal"
      >
        <Form
          form={form}
          onFinish={handleSaveExpense}
          initialValues={{
            expense_date: "",
            description: "",
            amount: 0,
          }}
        >
          <Form.Item
            name="expense_date"
            label="Expense Date"
            rules={[
              { required: true, message: "Please select an expense date" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter an amount" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="month-totals">
        <Title level={4}>Expenses of the Month ({filterMonth})</Title>
        <Text>
          Total Expenses: Lps{" "}
          {expenses
            .reduce((total, order) => total + order.amount, 0)
            .toFixed(2)}
        </Text>
      </div>
    </div>
  );
};

export default Expenses;
