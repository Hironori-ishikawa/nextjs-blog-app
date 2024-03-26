'use client'

import Link from 'next/link'
import useStore from '@/store'

import { useState } from "react";


// ナビゲーション
const Navigation = () => {
  const { user } = useStore()


  const [isOpen, setOpen] = useState<boolean>(false);
  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };



  return (
    <header className='border-b py-5'>
      <div className='container max-w-screen-xl mx-auto relative flex justify-center items-center'>
        <Link href="/" className=' font-bold text-xl cursor-pointer' onClick={handleMenuClose}>
          TECH BLOG
        </Link>

        <div className="absolute right-5">
          {user.id ? (
            <div className="flex space-x-4" >
              <Link href="/auth/profile">プロフィール</Link>
            </div>
          ) : (

            <div className="flex space-x-4" >
              <div>
                <nav className={
                  isOpen
                    ? "fixed h-screen flex flex-col transition"
                    : "fixed right-[-100%]"
                }
                >
                  <ul
                    className={
                      isOpen
                        ? "justify-center items-center flex-col gap-6 pt-20 transition-all ease-linear"
                        : "block"
                    }
                  >
                    <div>
                      <button className=' mb-3'>
                        <li><Link href="/auth/login" onClick={handleMenuClose}>ログイン</Link></li>
                      </button>
                      <button className=''>
                        <li><Link href="/auth/signup" onClick={handleMenuClose}>サインアップ</Link></li>
                      </button>
                    </div>
                  </ul>
                </nav>
              </div>

              <button className="z-50 space-y-2 mb:hidden" onClick={handleMenuOpen}>
                <span
                  className={
                    isOpen
                      ? "block w-8 h-0.5 bg-gray-600 translate-y-2.5 rotate-45 duration-300"
                      : "block w-8 h-0.5 bg-gray-600 duration-300"
                  }
                />
                <span
                  className={
                    isOpen ? "block opacity-0 duration-300" : "block w-8 h-0.5 bg-gray-600 duration-300"
                  }
                />
                <span
                  className={
                    isOpen
                      ? "block w-8 h-0.5 bg-gray-600 -rotate-45 duration-300"
                      : "block w-8 h-0.5 bg-gray-600 duration-300"
                  }
                />
              </button>

            </div>
          )}
        </div>
      </div>


    </header>
  )
}
export default Navigation
