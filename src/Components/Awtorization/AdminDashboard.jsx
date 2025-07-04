import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Select,
    Modal,
    Typography,
    message,
} from "antd";
import axios from "axios";
import { getBackendUrl } from "../../utils";

const { Title } = Typography;
const { Option } = Select;

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const [showTobaccoModal, setShowTobaccoModal] = useState(false);
    const [showJarModal, setShowJarModal] = useState(false);
    const [showPutModal, setShowPutModal] = useState(false);

    const [tobaccos, setTobaccos] = useState([]);
    const [jars, setJars] = useState([]);

    const [tobaccoForm] = Form.useForm();
    const [jarForm] = Form.useForm();
    const [putForm] = Form.useForm();

    useEffect(() => {
        fetchTobaccos();
        fetchJars();
    }, []);

    const fetchTobaccos = async () => {
        try {
            const res = await axios.get(`${getBackendUrl()}/api/tobaccos`);
            setTobaccos(res.data);
        } catch (err) {
            message.error("Ошибка при загрузке табаков");
        }
    };

    const fetchJars = async () => {
        try {
            const res = await axios.get(`${getBackendUrl()}/api/jars`);
            setJars(res.data);
        } catch (err) {
            message.error("Ошибка при загрузке банок");
        }
    };

    const handleCreateTobacco = async (values) => {
        try {
            await axios.post(`${getBackendUrl()}/api/tobaccos`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Табак добавлен");
            setShowTobaccoModal(false);
            tobaccoForm.resetFields();
            fetchTobaccos();
        } catch (err) {
            message.error("Ошибка при добавлении табака");
        }
    };

    const handleCreateJar = async (values) => {
        try {
            await axios.post(`${getBackendUrl()}/api/jars`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Банка создана");
            setShowJarModal(false);
            jarForm.resetFields();
            fetchJars();
        } catch (err) {
            message.error("Ошибка при создании банки");
        }
    };

    const handlePutTobacco = async (values) => {
        try {
            await axios.post(`${getBackendUrl()}/api/jars/${values.jarId}/add`, {
                tobaccoId: values.tobaccoId,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Табак положен в банку");
            setShowPutModal(false);
            putForm.resetFields();
            fetchJars();
        } catch (err) {
            message.error("Ошибка при добавлении табака в банку");
        }
    };

    if (!user || user.role !== "admin") {
        return <Title level={3}>Доступ запрещён</Title>;
    }

    return (
        <div style={{ maxWidth: 800, margin: "40px auto" }}>
            <Title level={2}>Админ-панель</Title>

            <Button
                type="primary"
                style={{ marginRight: 12 }}
                onClick={() => setShowTobaccoModal(true)}
            >
                Создать новый табак
            </Button>

            <Button
                style={{ marginRight: 12 }}
                onClick={() => setShowJarModal(true)}
            >
                Создать новую банку
            </Button>

            <Button onClick={() => setShowPutModal(true)}>
                Положить табак в банку
            </Button>

            {/* Модалка создания табака */}
            <Modal
                title="Создать новый табак"
                open={showTobaccoModal}
                onCancel={() => setShowTobaccoModal(false)}
                footer={null}
            >
                <Form form={tobaccoForm} layout="vertical" onFinish={handleCreateTobacco}>
                    <Form.Item name="title" label="Название" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="flavor" label="Вкус" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Сохранить
                    </Button>
                </Form>
            </Modal>

            {/* Модалка создания банки */}
            <Modal
                title="Создать новую банку"
                open={showJarModal}
                onCancel={() => setShowJarModal(false)}
                footer={null}
            >
                <Form form={jarForm} layout="vertical" onFinish={handleCreateJar}>
                    <Form.Item name="title" label="Название банки" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Создать
                    </Button>
                </Form>
            </Modal>

            {/* Модалка: положить табак в банку */}
            <Modal
                title="Положить табак в банку"
                open={showPutModal}
                onCancel={() => setShowPutModal(false)}
                footer={null}
            >
                <Form form={putForm} layout="vertical" onFinish={handlePutTobacco}>
                    <Form.Item name="jarId" label="Банка" rules={[{ required: true }]}>
                        <Select placeholder="Выбери банку">
                            {jars.map(jar => (
                                <Option key={jar._id} value={jar._id}>{jar.title}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="tobaccoId" label="Табак" rules={[{ required: true }]}>
                        <Select placeholder="Выбери табак">
                            {tobaccos.map(t => (
                                <Option key={t._id} value={t._id}>{t.title}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Положить
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
