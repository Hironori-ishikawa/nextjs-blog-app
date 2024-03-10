'use client'

import { useRef, FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "../supabase-provider"

import Link from 'next/link'
import Loading from "@/app/loading"

// ログイン
const Login = () => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // ログイン処理
    // 認証はクライアントコンポーネントで行う
    const { error: signinError } = await supabase.auth.signInWithPassword({
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
    })

    if (signinError) {
      alert(signinError.message)
      setLoading(false)
      return
    }

    // トップページ遷移
    router.push('/')

    setLoading(false)
  }

  return (
    <div className="mx-w-sm mx-auto">
      <form onSubmit={onSubmit}>

        {/* メールアドレス */}
        <div className="mb-5">
          <div className="text-sm mb-1">メールアドレス</div>
          <input
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-skyblue-500"
            ref={emailRef}
            type="email"
            id="email"
            placeholder="Email"
            required
          />
        </div>

        {/* パスワード */}
        <div className="mb-5">
          <div className="text-sm mb-1">パスワード</div>
          <input
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-skyblue-500"
            ref={passwordRef}
            type="password"
            id="password"
            placeholder="password"
            required
          />
        </div>

        {/* ログインボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type='submit'
              className='font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm'>
              ログイン
            </button>
          )}
        </div>

        <div className="text-center text-sm">アカウントは未登録ですか？</div>
        <div className="text-center text-sm">
          <Link href="/auth/signup" className="text-gray-500 font-bold">
            サインアップ
          </Link>
        </div>

      </form>
    </div>
  )
}

export default Login
