import { options } from 'joi';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import useDarkMode from '../../../hooks/useDarkMode';
import DropdownOptions, { dropdownOptions } from '../DropdownOptions';
import ProfileHead from '../ProfileHead';
import SearchBar from '../SearchBar';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const AdminSecondaryNav: FC<Props> = (props): JSX.Element => {
  const router = useRouter();
  const { toggleTheme } = useDarkMode();
  const navigateToCreateNewPost = () => router.push('/admin/posts/create');
  const handleLogOut = async () => await signOut();
  const options: dropdownOptions = [
    {
      label: 'Add new post',
      onClick: navigateToCreateNewPost,
    },
    {
      label: 'Change theme',
      onClick: toggleTheme,
    },
    {
      label: 'Log out',
      onClick: handleLogOut,
    },
  ];

  return (
    <div className="flex items-center justify-between">
      {/* search bar*/}
      <SearchBar />
      {/* options / profile head */}
      <DropdownOptions
        head={<ProfileHead nameInitial="G" />}
        options={options}
      />
    </div>
  );
};

export default AdminSecondaryNav;
