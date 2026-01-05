import { toast } from 'sonner';
import Logout from '../components/auth/Logout.tsx';
import { Button } from '../components/ui/button.tsx';
import api from '../lib/axios.ts';
import { useAuthStore } from '../stores/useAuthStores.ts';

const ChatAppPage = () => {
    const user = useAuthStore((s) => s.user);
    const handleOnclick = async () => {
        try {
            await api.get('users/test', { withCredentials: true });
            toast.success('OK');
        } catch (error) {
            toast.error('Thất bại !');
            console.error(error);
        }
    };
    return (
        <div>
            {user?.username}
            <Logout />
            <Button onClick={handleOnclick}>Test</Button>
        </div>
    );
};

export default ChatAppPage;
