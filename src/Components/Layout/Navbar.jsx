import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
    const location = useLocation();

    const items = [
        { key: "/", label: <Link to="/">Главная</Link> },
        { key: "/tobaccos", label: <Link to="/tobaccos">Табаки</Link> },
        { key: "/jars", label: <Link to="/jars">Банки</Link> },
        { key: "/mix", label: <Link to="/mix">Создать микс</Link> },
        { key: "/mixes", label: <Link to="/mixes">Миксы</Link> },
        // { key: "/comments", label: <Link to="/comments">Комментарии</Link> },
    ];

    return (
        <Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                padding: 0,
            }}
        >
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={items}
                style={{ justifyContent: "center" }}
            />
        </Header>
    );
};

export default Navbar;