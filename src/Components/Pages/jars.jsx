import React, { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Alert,
    List,
    Button,
    Modal,
    Form,
    Select,
    Input,
    message
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeWithLogo from "../QRCode";


const { Title, Text } = Typography;
const { Option } = Select;

const Jars = () => {
    const [jars, setJars] = useState([]);
    const [tobaccos, setTobaccos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeJar, setActiveJar] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const [printMode, setPrintMode] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (printMode) {
            setTimeout(() => {
                window.print();
                setPrintMode(false);
            }, 300);
        };
        fetchData();
    }, [printMode]);

    const fetchData = async () => {
        try {
            const [jarRes, tobaccoRes] = await Promise.all([
                axios.get(`${getBackendUrl()}/api/jars`),
                axios.get(`${getBackendUrl()}/api/tobaccos`)
            ]);
            setJars(jarRes.data);
            setTobaccos(tobaccoRes.data);
            setLoading(false);
        } catch (err) {
            setError("Ошибка при загрузке данных");
            setLoading(false);
        }
    };

    const handlePutTobacco = async (values) => {
        try {
            await axios.post(
                `${getBackendUrl()}/api/jars/${activeJar}/add`,
                { tobaccoId: values.tobaccoId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success("Табак положен в банку");
            setActiveJar(null);
            form.resetFields();
            fetchData();
        } catch (err) {
            message.error("Ошибка при добавлении табака");
        }
    };

    const handleDeleteTobacco = async (jarId) => {
        try {
            await axios.delete(`${getBackendUrl()}/api/jars/${jarId}/tobacco`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Табак удалён");
            fetchData();
        } catch (err) {
            message.error("Не удалось удалить табак");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            createForm.setFieldsValue({ imageUrl: base64 }); // вставляем base64 в input
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCreateJar = async (values) => {
        try {
            await axios.post(`${getBackendUrl()}/api/jars`, values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Банка создана");
            setShowCreateModal(false);
            createForm.resetFields();
            fetchData();
        } catch (err) {
            message.error("Ошибка при создании банки");
        }
    };


    const usedTobaccoIds = new Set(
        jars.map((jar) => jar.tobaccos[0]?.tobaccoId?._id).filter(Boolean)
    );

    const getAvailableTobaccos = () =>
        tobaccos.filter((t) => !usedTobaccoIds.has(t._id));

    if (loading)
        return <Spin tip="Загрузка..." style={{ marginTop: 100 }} />;
    if (error)
        return <Alert type="error" message={error} style={{ marginTop: 100 }} />;


    return (
        <div style={{ padding: "40px" }}>
            <Title className="no-print" level={2}>Банки</Title>

            {isAdmin && (
                <>
                    <Button
                        className="no-print"
                        type="dashed"
                        onClick={() => setShowCreateModal(true)}
                        style={{ marginBottom: 24 }}
                    >
                        Добавить новую банку
                    </Button>

                    <Button className="no-print" type="primary" onClick={() => setPrintMode(true)} style={{ marginBottom: 16 }}>
                        Печать QR-кодов
                    </Button>

                    <Modal
                        open={showCreateModal}
                        title="Создать новую банку"
                        onCancel={() => {
                            setShowCreateModal(false);
                            createForm.resetFields();
                        }}
                        onOk={() => createForm.submit()}
                        okText="Создать"
                    >
                        <Form form={createForm} layout="vertical" onFinish={handleCreateJar}>
                            <Form.Item name="description" label="Описание">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                            <Form.Item name="imageUrl" label="Ссылка на изображение (необязательно)">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Или загрузите изображение">
                                <input type="file" accept="image/*" onChange={handleFileUpload} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}

            <Row gutter={[24, 24]}>
                {jars.map((jar) => {
                    const hasTobacco = jar.tobaccos?.length > 0;
                    const tobacco = jar.tobaccos[0]?.tobaccoId;
                    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
                    const qrValue = jar._id
                        // ? `${pro_cess.env.REACT_APP_BASE_URL}/jar/${jar._id}`
                        ? `${baseUrl}/jar/${jar._id}`
                        : null;
                    console.log (jar.imageUrl);
                    return(
                        <Col key={jar._id} xs={24} sm={12} md={8} lg={6}>
                            <Card title={jar.title} hoverable>
                                <div className="print-only" style={{ textAlign: "center", marginBottom: 12 }}>
                                    {qrValue && (
                                        <QRCodeWithLogo
                                            value={qrValue}
                                            logoUrl={jar.imageUrl}
                                            size={400}
                                        />
                                    )}
                                </div>


                                {hasTobacco ? (
                                    <List
                                        size="small"
                                        dataSource={[tobacco]}
                                        renderItem={(t) => (
                                            <List.Item className="no-print">
                                                <Text>{t.title}</Text>
                                                {isAdmin && (
                                                    <Button
                                                        danger
                                                        size="small"
                                                        onClick={() => handleDeleteTobacco(jar._id)}
                                                        style={{ marginLeft: "auto" }}
                                                    >
                                                        Удалить
                                                    </Button>
                                                )}
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Text className="no-print" type="secondary">Пока пусто</Text>
                                )}

                                <Text className="no-print" type="secondary" style={{ display: "block", marginTop: 10 }}>
                                    Создана: {new Date(jar.createdAt).toLocaleString()}
                                </Text>

                                <Link className="no-print" to={`/jar/${jar._id}`} style={{ display: "block", marginTop: 8 }}>
                                    Перейти к банке
                                </Link>

                                {isAdmin && (
                                    <Button
                                        className="no-print"
                                        type="primary"
                                        style={{ marginTop: 12 }}
                                        onClick={() => setActiveJar(jar._id)}
                                    >
                                        {hasTobacco ? "Заменить табак" : "Положить табак"}
                                    </Button>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Modal
                open={!!activeJar}
                title="Выберите табак"
                onCancel={() => {
                    setActiveJar(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Положить"
            >
                <Form form={form} layout="vertical" onFinish={handlePutTobacco}>
                    <Form.Item name="tobaccoId" label="Табак" rules={[{ required: true }]}>
                        <Select placeholder="Выберите табак">
                            {getAvailableTobaccos().map((t) => (
                                <Option key={t._id} value={t._id}>
                                    {t.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Jars;
