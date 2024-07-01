// type Props = {};

import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterType } from "../../types/login";
import { hiddenSpinner, showSpinner } from "../../util/spinner";
import { https } from "../../config/axios";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: RegisterType) => {
    const data = {
      name: values.name,
      password: values.password,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };
    const postProduct = async () => {
      showSpinner();
      try {
        const res = await https.post("/auth/register", data);
        if (res) {
          message.success("Đăng ký thành công!");
          navigate("/auth/login");
          hiddenSpinner();
        }
      } catch (error) {
        hiddenSpinner();
        message.error(error.response.data.message);
        console.log(error);
      }
    };
    postProduct();
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 className=" text-2xl text-slate-700 mb-1">Register</h3>
      <Form
        layout="vertical"
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please fill in this field!" },
            {
              min: 6,
              max: 25,
              message: "Name must be between 6 and 25 characters!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please fill in this field!" },
            {
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Invalid email address!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please fill in this field!" },
            {
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
              message: "Invalid phone number format!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please fill in this field!" },
            {
              min: 6,
              max: 25,
              message: "Password must be between 6 and 25 characters!",
            },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,25}$/,
              message:
                "Password must contain at least one letter and one number!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          name="rePassword"
          rules={[
            { required: true, message: "Please fill in this field!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mismatched passwords!");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div className="flex justify-between sm:items-end items-start gap-1 sm:flex-row flex-col pt-2">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="text-white bg-slate-800"
            >
              Register
            </Button>
          </Form.Item>
          <Link
            to="/auth/login"
            className="text-xs text-slate-800 hover:text-slate-500 mb-3"
          >
            Already have an account?
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
