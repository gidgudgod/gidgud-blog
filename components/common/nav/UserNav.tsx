import Link from 'next/link';
import { FC } from 'react';
import { APP_NAME } from '../AppHead';
import Logo from '../Logo';
import { HiLightBulb } from 'react-icons/hi';
import { GitHubAuthButton } from '../../button';
import ProfileHead from '../ProfileHead';
import DropdownOptions, { dropdownOptions } from '../DropdownOptions';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { UserProfile } from '../../../utils/types';
import useDarkMode from '../../../hooks/useDarkMode';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const defaultOptions: dropdownOptions = [
  {
    label: 'Logout',
    async onClick() {
      await signOut();
    },
  },
];

const UserNav: FC<Props> = (props): JSX.Element => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuth = status === 'authenticated';
  const profile = session?.user as UserProfile | undefined;
  const isAdmin = profile && profile.role === 'admin';
  console.log(session);

  const { toggleTheme } = useDarkMode();

  const dropDownOptions: dropdownOptions = isAdmin
    ? [
        {
          label: 'Dashboard',
          onClick() {
            router.push('/admin');
          },
        },
        ...defaultOptions,
      ]
    : defaultOptions;

  return (
    <div className="flex items-center justify-between bg-primary-dark p-3">
      {/* logo */}
      <Link href="/" className="flex space-x-2 text-highlight-dark">
        <Logo className="fill-highlight-dark" />
        <span className="text-xl font-semibold">{APP_NAME}</span>
      </Link>

      <div className="flex items-center space-x-5">
        <button
          onClick={toggleTheme}
          className="text-secondary-light dark:text-secondary-dark"
        >
          <HiLightBulb size={34} />
        </button>

        {isAuth ? (
          <DropdownOptions
            options={dropDownOptions}
            head={
              <ProfileHead
                nameInitial="G"
                lightOnly
                avatar={session?.user?.image as string}
              />
            }
          />
        ) : (
          <GitHubAuthButton lightOnly />
        )}
      </div>
    </div>
  );
};

export default UserNav;
