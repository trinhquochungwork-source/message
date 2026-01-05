import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStores.ts';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);
    // const init = async () => {
    //     //* có thể xảy ra khi refresh trang
    //     if (!accessToken) {
    //         await refresh();
    //     }
    //     if (accessToken && !user) {
    //         await fetchMe();
    //     }
    //     setStarting(false);
    // };
    // useEffect(() => {
    //     init();
    // }, []);
    useEffect(() => {
        const init = async () => {
            if (!accessToken) {
                await refresh();
            }
            if (accessToken && !user) {
                await fetchMe();
            }
            setStarting(false);
        };

        init();
    }, []);
    if (starting || loading) {
        return <div className='flex h-screen items-center justify-center'>Đang tải trang...</div>;
    }
    if (!accessToken) {
        return <Navigate to='/signin' replace />;
    }
    return <Outlet></Outlet>;
};

export default ProtectedRoute;
