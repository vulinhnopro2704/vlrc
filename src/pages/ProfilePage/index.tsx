import { useAuthSession } from '@/hooks/useAuthSession';
import { ProfileForm } from './components/ProfileForm';
import { PasswordForm } from './components/PasswordForm';

export const ProfilePage: FC = () => {
  const { data: me } = useAuthSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  if (!me) return null;

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "justify-start text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'profile'
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-muted hover:text-foreground text-muted-foreground"
              )}
            >
              Hồ sơ cá nhân
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "justify-start text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'security'
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-muted hover:text-foreground text-muted-foreground"
              )}
            >
              Bảo mật
            </button>
          </nav>
        </aside>
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'security' && <PasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
