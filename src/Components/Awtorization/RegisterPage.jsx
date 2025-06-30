import React from "react";
import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email, password, confirmPassword } = values;

        if (password !== confirmPassword) {
            message.error("Пароли не совпадают");
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
                email,
                password,
            });

            message.success("Регистрация прошла успешно!");
            navigate("/login");
        } catch (error) {
            message.error(error.response?.data?.message || "Ошибка при регистрации");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 style={{ textAlign: "center", marginBottom: 24 }}>Регистрация</h2>

                <Form onFinish={onFinish} layout="vertical"
                      onFinishFailed={(errorInfo) => {
                          console.log("Ошибка при отправке формы:", errorInfo);
                      }}
                      >

                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: "Введите email" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Введите пароль" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        rules={[{ required: true, message: "Подтвердите пароль" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Повторите пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" block>
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center" }}>
                    <a href="/login" style={{ fontSize: 14, color: "#1890ff" }}>
                        Уже есть аккаунт? Войти
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;