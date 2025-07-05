import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "antd";
import API from "../Utils/axiosInstance";



const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        API.get(`/me`)
            .then(res => {
                if (res.status === 401) throw new Error("Unauthorized");
                return res;
            })
            .then(data => setUser(data.user))
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []);

    useEffect(() => {
        if (!user) return;

        API.get(`/jars`)
            .then(data => {
                setItems(data);
                const reviews = [];
                data.forEach(item => {
                    item.reviews?.forEach(review => {
                        if (review.userId === user.id) {
                            reviews.push({
                                itemName: item.name,
                                rating: review.rating,
                                comment: review.comment
                            });
                        }
                    });
                });
                setUserReviews(reviews);
            });
    }, [user]);


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>Привет, {user?.email || "пользователь"}!</h1>
            <h2>Мои отзывы:</h2>
            {userReviews.length === 0 ? (
                <p>Вы пока не оставили отзывов.</p>
            ) : (
                <ul>
                    {userReviews.map((review, index) => (
                        <li key={index} style={{ marginBottom: 12 }}>
                            <strong>{review.itemName}</strong> — Оценка: {review.rating}<br />
                            Комментарий: {review.comment}
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/jars">
                <button style={{ marginTop: 30 }}>Посмотреть существующие банки</button>
            </Link>
            <Link to="/tobaccos">
                <button style={{ marginTop: 10 }}>Посмотреть табаки</button>
            </Link>

            <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                danger
                onClick={handleLogout}>
                Выйти из аккаунта
            </Button>
        </div>
    );
};

export default Dashboard;
