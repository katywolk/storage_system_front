import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Rate, Form, Input, Button, Spin, Alert, message } from "antd";
import axios from "axios";

const { TextArea } = Input;

const TobaccoInfoPage = () => {
    const { id } = useParams();
    const [tobacco, setTobacco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/tobaccos/${id}`)
            .then((res) => {
                setTobacco(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Не удалось загрузить табак");
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async () => {
        if (!rating || !comment) {
            message.warning("Пожалуйста, поставьте оценку и напишите комментарий");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post("/api/tobaccos/review", {
                tobaccoId: id,
                rating,
                comment,
            });
            message.success("Отзыв отправлен!");
            setRating(0);
            setComment("");
        } catch (err) {
            message.error("Ошибка при отправке отзыва");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spin tip="Загрузка..." style={{ marginTop: 100 }} />;
    if (error) return <Alert type="error" message={error} style={{ marginTop: 100 }} />;

    return (
        <Card
            title={tobacco.title}
            style={{
                maxWidth: 600,
                margin: "40px auto",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: 12,
            }}
        >
            <p><strong>Вкус:</strong> {tobacco.flavor}</p>
            <p><strong>Описание:</strong> {tobacco.description}</p>

            <Form layout="vertical" style={{ marginTop: 30 }}>
                <Form.Item label="Оценка">
                    <Rate value={rating} onChange={setRating} />
                </Form.Item>
                <Form.Item label="Комментарий">
                    <TextArea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={submitting}
                        block
                    >
                        Отправить отзыв
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default TobaccoInfoPage;