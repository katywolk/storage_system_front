import React, { useEffect, useState } from "react";
import {
    Form,
    Button,
    Input,
    Select,
    Card,
    Typography,
    message,
    notification,
    Slider,
    Row,
    Col,
    Divider
} from "antd";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const MixPage = () => {
    const [form] = Form.useForm();
    const [tobaccos, setTobaccos] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/tobaccos`)
            .then((res) => {
                const onlyTobaccos = res.data.filter((t) => t.type === "tobacco");
                setTobaccos(onlyTobaccos);
            })
            .catch(() => message.error("Не удалось загрузить табаки"));
    }, []);

    const addTobacco = () => {
        if (selected.length >= tobaccos.length) {
            return message.warning("Все табаки уже добавлены");
        }
        setSelected([...selected, { tobaccoId: "", label: "", percent: 0 }]);
    };

    const handleSelect = (value, option, index) => {
        const updated = [...selected];
        updated[index].tobaccoId = value;
        updated[index].label = option.children;
        setSelected(updated);
    };

    const handleSlider = (index, value) => {
        const updated = [...selected];
        updated[index].percent = value;
        setSelected(updated);
    };

    const handleSubmit = async (values) => {
        const total = selected.reduce((sum, s) => sum + Number(s.percent), 0);
        if (total !== 100) {
            return message.warning("Сумма процентов должна быть ровно 100%");
        }

        try {
            const payload = {
                title: values.title,
                description: values.description,
                type: "mix",
                tobaccos: selected,
                createdAt: new Date()
            };

            await axios.post(`${process.env.REACT_APP_API_URL}/api/mixes`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            setTimeout(() => {
                notification.info({
                    message: "Микс сохранён",
                    description: "Я сохраню этот микс, чтобы ты смог забить его ещё раз.",
                    placement: "bottomRight",
                    duration: 4
                });

                form.resetFields();
                setSelected([]);
            }, 1000);
        } catch (err) {
            console.error("Ошибка при создании микса:", err);
            message.error("Ошибка при создании микса");
        }
    };

    const usedIds = selected.map((s) => s.tobaccoId).filter(Boolean);

    // Вычисление процента до последнего
    const totalBeforeLast = selected
        .slice(0, -1)
        .reduce((sum, s) => sum + Number(s.percent), 0);
    const lastIndex = selected.length - 1;
    const remaining = Math.max(0, 100 - totalBeforeLast);

    // Присваиваем остаток последнему табаку
    if (selected[lastIndex]) {
        selected[lastIndex].percent = remaining;
    }

    return (
        <div style={{ maxWidth: 700, margin: "40px auto" }}>
            <Card>
                <Title level={3}>Создать микс</Title>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="title" label="Название микса" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Описание">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    {selected.map((item, index) => (
                        <Form.Item
                            key={index}
                            label={`Табак ${index + 1}`}
                            required
                            style={{ marginBottom: 8 }}
                        >
                            <Select
                                placeholder="Выбери табак"
                                value={item.tobaccoId || undefined}
                                onChange={(val, opt) => handleSelect(val, opt, index)}
                            >
                                {tobaccos
                                    .filter((t) => !usedIds.includes(t._id) || t._id === item.tobaccoId)
                                    .map((t) => (
                                        <Option key={t._id} value={t._id}>
                                            {t.title}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    ))}

                    <Button onClick={addTobacco} style={{ marginBottom: 24 }}>
                        + Добавить табак
                    </Button>

                    {selected.length > 0 && (
                        <>
                            <Divider>Распределение (%)</Divider>

                            {selected.map((s, index) => (
                                <Row key={index} align="middle" gutter={16} style={{ marginBottom: 12 }}>
                                    <Col span={8}>
                                        <Text strong>{s.label || `Табак ${index + 1}`}</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={1}
                                            disabled={index === lastIndex}
                                            value={s.percent}
                                            onChange={(value) => handleSlider(index, value)}
                                            tooltip={{ formatter: (v) => `${v}%` }}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Text type="secondary">{s.percent}%</Text>
                                    </Col>
                                </Row>
                            ))}

                            <Divider />
                            <Text strong>Итого: {totalBeforeLast + remaining}%</Text>
                            {totalBeforeLast + remaining !== 100 && (
                                <Text type="danger" style={{ marginLeft: 10 }}>
                                    Сумма должна быть ровно 100%
                                </Text>
                            )}
                        </>
                    )}

                    <Form.Item style={{ marginTop: 32 }}>
                        <Button type="primary" htmlType="submit">
                            Сохранить микс
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default MixPage;