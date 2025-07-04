import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Alert, Typography, List } from "antd";
import axios from "axios";
import {getBackendUrl} from "../../utils";

const { Title, Text } = Typography;

const Jar = () => {
    const { id } = useParams();
    const [jar, setJar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`${getBackendUrl()}/api/jar/${id}`)
            .then((res) => {
                setJar(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Не удалось загрузить банку");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Spin tip="Загрузка..." style={{ marginTop: 100 }} />;
    if (error) return <Alert type="error" message={error} style={{ marginTop: 100 }} />;

    return (
        <Card
            title={jar.title}
            style={{ maxWidth: 700, margin: "40px auto", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        >
            <Title level={4}>Содержимое банки</Title>
            {jar.tobaccos && jar.tobaccos.length > 0 ? (
                <List
                    dataSource={jar.tobaccos}
                    renderItem={(entry) => {
                        const t = entry.tobaccoId;
                        return (
                            <List.Item>
                                <Card
                                    title={t.title}
                                    style={{ width: "100%" }}
                                    cover={
                                        t.imageUrl && (
                                            <img
                                                alt={t.title}
                                                src={t.imageUrl}
                                                style={{ height: 160, objectFit: "cover" }}
                                            />
                                        )
                                    }
                                >
                                    <p><b>Вкус:</b> {t.flavor}</p>
                                    <p><b>Описание:</b> {t.description}</p>
                                    <p style={{ fontSize: 12, color: "#999" }}>
                                        Дата создания табака: {new Date(t.createdAt).toLocaleString()}
                                    </p>
                                </Card>
                            </List.Item>
                        );
                    }}
                />
            ) : (
                <Text type="secondary">Банка пока пуста</Text>
            )}
            {/*<Text type="secondary" style={{ display: "block", marginTop: 16 }}>*/}
            {/*    Создана: {new Date(jar.createdAt).toLocaleString()}*/}
            {/*</Text>*/}
        </Card>
    );
};

export default Jar;
