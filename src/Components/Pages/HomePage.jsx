import React from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;
    console.log("user:", user);
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>Добро пожаловать!</h1>

            {user ? (
                <>
                    <p>Вы вошли как <strong>{user.role}</strong></p>

                    {user.role === "admin" && (
                        <Button type="primary" onClick={() => navigate("/admin")} style={{ marginBottom: "10px" }}>
                            Перейти в админ-панель
                        </Button>
                    )}

                    {user.role === "user" && (
                        <Button onClick={() => navigate("/comment")} style={{ marginBottom: "10px" }}>
                            Оставить комментарий
                        </Button>
                    )}

                    <br />
                    <Button onClick={() => navigate("/dashboard")}>Личный кабинет</Button>
                </>
            ) : (
                <>
                    <p>Вы не вошли в систему.</p>
                    <Button type="primary" onClick={() => navigate("/login")}>
                        Войти
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={() => navigate("/register")}>
                        Зарегистрироваться
                    </Button>
                </>
            )}
        </div>
    );
};

export default HomePage;