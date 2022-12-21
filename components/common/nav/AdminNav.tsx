import Link from 'next/link';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Logo from '../Logo';
import { MdSpaceDashboard } from 'react-icons/md';
import { AiFillContainer } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaComments } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { RiMenuFill, RiMenuFoldFill } from 'react-icons/ri';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface Props {
  navItems: { label: string; href: string; icon: IconType }[];
}

const NAV_OPEN_WIDTH = 'w-60';
const NAV_CLOSE_WIDTH = 'w-12';
const NAV_VISIBILITY_KEY = 'nav-visibility';

const AdminNav: FC<Props> = ({ navItems }): JSX.Element => {
  const navItemsHook = useMemo(() => {
    console.log('nav items changed');
    return navItems;
  }, [navItems]);
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const toggleNav = (visibility: boolean) => {
    const currentNav = navRef.current;
    if (!currentNav) return;

    const { classList } = currentNav;
    if (visibility) {
      //hide nav
      classList.remove(NAV_OPEN_WIDTH);
      classList.add(NAV_CLOSE_WIDTH);
    } else {
      //show nav
      classList.remove(NAV_CLOSE_WIDTH);
      classList.add(NAV_OPEN_WIDTH);
    }
  };

  const updateNavState = () => {
    toggleNav(visible);
    const newState = !visible;
    setVisible(newState);
    localStorage.setItem(NAV_VISIBILITY_KEY, JSON.stringify(newState));
  };

  useEffect(() => {
    const navState = localStorage.getItem(NAV_VISIBILITY_KEY);
    if (navState !== null) {
      const newState = JSON.parse(navState);
      setVisible(newState);
      toggleNav(!newState);
    } else {
      setVisible(true);
    }
  }, []);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 flex h-screen w-12 flex-col justify-between overflow-hidden bg-secondary-light shadow-sm transition-[width] dark:bg-secondary-dark"
    >
      <div>
        {/* logo */}
        <Link href="/admin" className="mb-10 flex items-center space-x-2 p-3">
          <Logo className="h-5 w-5 fill-highlight-light dark:fill-highlight-dark" />
          {visible && (
            <span className="fill-highlight-light text-xl font-semibold leading-none dark:fill-highlight-dark">
              Admin
            </span>
          )}
        </Link>

        {/* nav items */}
        <div className="space-y-6">
          {navItemsHook.map((item) => {
            return (
              <Tippy key={item.href} content={item.label}>
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center fill-highlight-light p-3 text-xl transition hover:scale-[0.98] dark:fill-highlight-dark"
                >
                  <item.icon size={24} />
                  {visible && (
                    <span className="ml-2 leading-none">{item.label}</span>
                  )}
                </Link>
              </Tippy>
            );
          })}
        </div>
      </div>

      {/* nav toggler */}
      <button
        onClick={updateNavState}
        className="self-end fill-highlight-light p-3 transition hover:scale-[0.98] dark:fill-highlight-dark"
      >
        {visible ? <RiMenuFoldFill size={25} /> : <RiMenuFill size={25} />}
      </button>
    </nav>
  );
};

export default AdminNav;
