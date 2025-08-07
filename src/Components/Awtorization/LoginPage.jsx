import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import API from "../Utils/axiosInstance";
import "./LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await API.post(`/login`,
                values,
                { withCredentials: true }
            );
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            message.success("Вы успешно вошли!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || "Ошибка входа");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 style={{ textAlign: "center", marginBottom: 24 }}>Вход</h2>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: "Введите email" }]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Введите пароль" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Пароль"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Запомнить меня</Checkbox>
                            </Form.Item>
                            <a href="#">Забыли пароль?</a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            block
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center" }}>
                    <a href="/register" style={{ fontSize: 14, color: "#1890ff" }}>
                        Зарегистрироваться сейчас!
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
