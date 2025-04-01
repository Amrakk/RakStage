import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/shared/Loading";
import LazyRoute from "./components/routes/LazyRoute";
import AuthRoute, { authLazyPages } from "./components/routes/AuthRoute";
import UserRoute, { userLazyPages } from "./components/routes/UserRoute";
import AdminRoute, { adminLazyPages } from "./components/routes/AdminRoute";

import "./styles/style.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<UserRoute />}>
                    {LazyRoute({ lazyPages: userLazyPages })}
                </Route>
                <Route path="/auth" element={<AuthRoute />}>
                    {LazyRoute({ lazyPages: authLazyPages })}
                </Route>
                <Route path="/admin" element={<AdminRoute />}>
                    {LazyRoute({ lazyPages: adminLazyPages })}
                </Route>
            </Routes>
            <ToastContainer autoClose={2000} closeOnClick={true} />
            <Loading />
        </>
    );
}

export default App;
