'use client'

import { useEffect, useState } from "react"

import Link from 'next/link'
import useStore from "@/store"

// 新規投稿ボタン
const BlogNewButton = () => {
  const { user } = useStore()
  const [login, setLogin] = useState(false)

  // ログインしている人のみ表示
  const renderButton = () => {
    if (login) {
      return (
        <div className="mb-5 flex justify-end">
          <Link href="blog/new">
            <div className="font-bold bg-sky-500 hover:brightness-95 rounded-md w-full p-2 text-white text-sm">
              新規投稿
            </div>
          </Link>
        </div>
      )
    }
  }

  useEffect(() => {
    if (user.id) {
      setLogin(true)
    }
  }, [user])

  return <>{renderButton()}</>
}

export default BlogNewButton
