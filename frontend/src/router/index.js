// src/router/index.jsx – ĐÃ SỬA XONG, KHÔNG CÒN LỖI NỮA!
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { publicRoutes, privateRoutes } from '~/routes/routes';
import config from '~/config/routes';

import DefaultLayout from '~/layouts/defaultLayout';
import { Fragment } from 'react';

// Guard components
const GuestOnly = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to={user?.isProfileComplete ? config.ChooseCV : config.RegisInformationUser} replace />;
    }
    return <Outlet />;
};

const Protected = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to={config.Login} replace />;
    return children ?? <Outlet />;
};

const NeedProfile = () => {
    const { user } = useAuth();
    const isComplete = user?.isProfileComplete === true; // chỉ true mới là hoàn thiện
    console.log('NeedProfile → isComplete:', isComplete);
    if (isComplete) {
        return <Navigate to={config.ChooseCV} replace />;
    }
    return <Outlet />;
};

// Sửa HasProfile (quan trọng nhất!)
const HasProfile = () => {
    const { user } = useAuth();
    const isComplete = user?.isProfileComplete === true; // chỉ true mới cho vào
    console.log('HasProfile → isComplete:', isComplete);
    if (!isComplete) {
        return <Navigate to={config.RegisInformationUser} replace />;
    }
    return <Outlet />;
};

const RenderRoute = ({ route }) => {
    const Page = route.component;
    const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
    return (
        <Layout>
            <Page />
        </Layout>
    );
};

// ĐÚNG KIỂU: PHẢI LÀ ARRAY CỦA <Route> JSX, KHÔNG PHẢI <></>
export const appRoutes = [
    // GUEST ROUTES
    <Route key="guest" element={<GuestOnly />}>
        {publicRoutes.map((route) => (
            <Route
                key={route.path}
                index={route.path === '/'} // nếu có trang chủ trong public
                path={route.path}
                element={<RenderRoute route={route} />}
            />
        ))}
    </Route>,

    // ONBOARDING
    <Route
        key="onboarding"
        element={
            <Protected>
                <NeedProfile />
            </Protected>
        }
    >
        {privateRoutes
            .filter((r) => r.path === config.RegisInformationUser)
            .map((route) => (
                <Route key={route.path} path={route.path} element={<RenderRoute route={route} />} />
            ))}
    </Route>,

    // MAIN APP
    <Route
        key="main"
        element={
            <Protected>
                <HasProfile />
            </Protected>
        }
    >
        {/* Trang chủ */}
        {privateRoutes
            .filter((r) => r.path === config.home)
            .map((route) => (
                <Route key="home" index element={<RenderRoute route={route} />} />
            ))}

        {/* Các trang khác */}
        {privateRoutes
            .filter((r) => r.path !== config.RegisInformationUser && r.path !== config.home)
            .map((route) => (
                <Route key={route.path} path={route.path} element={<RenderRoute route={route} />} />
            ))}
    </Route>,

    // 404
    <Route key="notfound" path="*" element={<Navigate to="/" replace />} />,
];
