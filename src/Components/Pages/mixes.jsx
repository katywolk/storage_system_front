import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Divider, Spin, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const MixesList = () => {
    const [mixes, setMixes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/mixes`)
            .then(res => {
                setMixes(res.data);
                setLoading(false);
            })
            .catch(() => {
                message.error("Не удалось загрузить миксы");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spin tip="Загрузка миксов..." style={{ marginTop: 100 }} />;
    }

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto" }}>
            <Title level={2}>Сохранённые миксы</Title>

            {mixes.length === 0 ? (
                <Text>Нет сохранённых миксов.</Text>
            ) : (
                mixes.map((mix) => (
                    <Card
                        key={mix._id}
                        title={mix.title}
                        style={{ marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                    >
                        {mix.description && (
                            <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                                {mix.description}
                            </Text>
                        )}

                        <Divider>Состав</Divider>

                        {mix.tobaccos.map((t, index) => (
                            <Row key={index} justify="space-between" style={{ marginBottom: 8 }}>
                                <Col><Text>{t.tobaccoId?.title || "Табак"}</Text></Col>
                                <Col><Text type="secondary">{t.percent}%</Text></Col>
                            </Row>
                        ))}

                        <Divider />

                        <Text type="secondary">
                            Создан: {new Date(mix.createdAt).toLocaleString()}
                        </Text>
                    </Card>
                ))
            )}
        </div>
    );
};

export default MixesList;