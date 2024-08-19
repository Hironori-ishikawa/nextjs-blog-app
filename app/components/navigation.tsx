'use client'

import { useState, useEffect } from "react";
import Link from 'next/link';
import useStore from '@/store';

const Navigation = () => {
  const { user } = useStore();
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


  return (
    <header className={isScrolled ? "fixed top-0 left-0 right-0 bg-white border-b py-3 z-50 " : "py-3"}>
      <div className='container max-w-screen-xl mx-auto relative flex justify-between items-center'>
        <Link href="/"
          className='font-bold text-xl cursor-pointer titleName'>
          TECH BLOG
        </Link>

        <div className="flex items-center">
          <button
            className="z-50 space-y-2 mb:hidden p-3"
            aria-label="Open Navigation Menu"
          >

            <ul className="flex flex-col gap-6 text-md">
              {user.id ? (
                <>
                  <li>
                    <Link
                      href="/auth/profile">プロフィール
                    </Link>
                  </li>
                  {/* 他のメニューアイテムを追加 */}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                    >ログイン
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
