
// Получить токен
export const getToken = () => localStorage.getItem("token");

// Проверить, авторизован ли пользователь
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

// Удалить токен при выходе
export const logout = () => {
    localStorage.removeItem("token");
};