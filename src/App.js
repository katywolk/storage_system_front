import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import LoginPage from "../src/Components/Awtorization/LoginPage";
import RegisterPage from "../src/Components/Awtorization/RegisterPage";
import Dashboard from "../src/Components/Awtorization/Dashboard";
import PrivateRoute from "../src/Components/Awtorization/PrivateRoute";
import HomePage from "./Components/Pages/HomePage";
import Jar from "./Components/Pages/jar";
import Jars from "./Components/Pages/jars";
import Tobacco from "./Components/Pages/tobacco";
import AdminDashboard from "./Components/Awtorization/AdminDashboard";
import TobaccosList from "./Components/Pages/tobaccos";
import MixPage from "./Components/Pages/mix";
import MixesList from "./Components/Pages/mixes";
import { Layout } from "antd";
import Navbar from "./Components/Layout/Navbar";
import "./App.css";
import {getBackendUrl} from "./utils";



function App() {
    console.log("API URL:", getBackendUrl());


    return (
        <ConfigProvider>
            <Router>
                <Layout>
                <Navbar />
                <Layout.Content style={{ padding: "24px" }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/jar/:id" element={<Jar />} />
                        <Route path="/jars" element={<Jars />} />
                        <Route path="/tobaccos/:id" element={<Tobacco />} />
                        <Route path="/tobaccos" element={<TobaccosList />} />
                        <Route path="/mix" element={<MixPage />} />
                        <Route path="/mixes" element={<MixesList />} />
                        {/*<Route path="/comments" element={<CommentsPage />} />*/}
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </Layout.Content>
                </Layout>
            </Router>
        </ConfigProvider>
    );
}

export default App;
