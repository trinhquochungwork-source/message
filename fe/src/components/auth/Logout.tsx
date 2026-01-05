import { Button } from '../ui/button.tsx';
import { useAuthStore } from '../../stores/useAuthStores.ts';
import { useNavigate } from 'react-router';

const Logout = () => {
    const { signOut } = useAuthStore();
    const nav = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            nav('/signin');
        } catch (error) {
            console.error(error);
        }
    };
    return <Button onClick={handleLogout}>logout</Button>;
};

export default Logout;
