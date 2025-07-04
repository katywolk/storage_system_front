import React, { useEffect, useState } from "react";
import { Card, Input, Button, Typography, Row, Col, Modal, Form, message } from "antd";
import axios from "axios";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getBackendUrl } from "../../utils";

const { Title } = Typography;

const TobaccosList = () => {
    const [tobaccos, setTobaccos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchTobaccos();
    }, []);

    const fetchTobaccos = async () => {
        try {
            const res = await axios.get(`${getBackendUrl()}/api/tobaccos`);
            setTobaccos(res.data);
        } catch (err) {
            message.error("Ошибка при загрузке табаков");
        }
    };

    const filtered = tobaccos.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.flavor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async (values) => {
        try {
            await axios.post(`${getBackendUrl()}/api/tobaccos`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Табак добавлен!");
            setShowModal(false);
            form.resetFields();
            fetchTobaccos();
        } catch (err) {
            message.error("Ошибка при добавлении табака");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${getBackendUrl()}/api/tobaccos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Удалено");
            fetchTobaccos();
        } catch (err) {
            message.error("Ошибка при удалении");
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <Title level={2} style={{ margin: 0 }}>
                    Список табаков
                </Title>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Поиск по названию или вкусу"
                    style={{ flex: 1, minWidth: 200, maxWidth: 400 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {user?.role === "admin" && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowModal(true)}
                    >
                        Добавить табак
                    </Button>
                )}
            </div>

            <Row gutter={[16, 16]}>
                {filtered.map((tobacco) => (
                    <Col key={tobacco._id} xs={24} sm={12} md={8}>
                        <Card
                            title={tobacco.title}
                            bordered
                            actions={[
                                <Button type="link" onClick={() => navigate(`/tobaccos/${tobacco._id}`)}>Подробнее</Button>,
                                user?.role === "admin" && (
                                    <Button type="link" danger onClick={() => handleDelete(tobacco._id)}>Удалить</Button>
                                )
                            ]}
                        >
                            <p><b>Вкус:</b> {tobacco.flavor}</p>
                            <p><b>Описание:</b> {tobacco.description}</p>
                            {tobacco.jar && (
                                <p><b>В банке:</b> {tobacco.jar?.title || "Банка"}</p>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title="Добавить табак"
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={() => form.submit()}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item name="title" label="Название" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="flavor" label="Вкус" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TobaccosList;
