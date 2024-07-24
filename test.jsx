import { useState, useEffect } from "react";
import Link from 'next/link';
import useStore from '@/store';

const Navigation = () => {
  const { user } = useStore();
  const [isOpen, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <header className={isScrolled ? "fixed top-0 left-0 right-0 bg-white border-b py-3 z-50 transition duration-300" : "py-5"}>
      <div className='container max-w-screen-xl mx-auto relative flex justify-between items-center'>
        <Link href="/" className='font-bold text-xl cursor-pointer'>
          TECH BLOG
        </Link>

        <div className="flex items-center">
          <button
            className="z-50 space-y-2 mb:hidden p-3"
            onClick={handleMenuOpen}
            aria-label="Open Navigation Menu"
          >
            <span
              className={
                isOpen
                  ? "block w-6 h-0.5 bg-gray-600 translate-y-2.5 rotate-45 duration-300"
                  : "block w-6 h-0.5 bg-gray-600 duration-300"
              }
            />
            <span
              className={
                isOpen
                  ? "block opacity-0 duration-300"
                  : "block w-6 h-0.5 bg-gray-600 duration-300"
              }
            />
            <span
              className={
                isOpen
                  ? "block w-6 h-0.5 bg-gray-600 -rotate-45 duration-300"
                  : "block w-6 h-0.5 bg-gray-600 duration-300"
              }
            />
          </button>

          <nav
            className={
              isOpen
                ? "fixed top-full right-0 left-0 h-screen w-full bg-white flex flex-col justify-center items-center transition duration-300"
                : "fixed top-full right-0 left-full h-screen w-full bg-white flex flex-col justify-center items-center transition duration-300"
            }
          >
            <ul className="flex flex-col gap-6 text-xl">
              {user.id ? (
                <>
                  <li>
                    <Link
                      href="/auth/profile"
                      onClick={handleMenuClose}>プロフィール
                    </Link>
                  </li>
                  {/* 他のメニューアイテムを追加 */}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                      onClick={handleMenuClose}>ログイン
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/signup"
                      onClick={handleMenuClose}>新規作成
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
