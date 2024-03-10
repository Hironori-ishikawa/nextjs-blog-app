'use client'

import { useRef, FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "../supabase-provider"

import Link from 'next/link'
import Loading from "@/app/loading"

// サインアップ
const Signup = () => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Supabaseサインアップ
    const { error: signupError } = await supabase.auth.signUp({
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
    })

    if (signupError) {
      alert(signupError.message)
      setLoading(false)
      return
    }

    // プロフィールの名前を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: nameRef.current!.value })
      .eq('email', emailRef.current!.value)

    if (updateError) {
      alert(updateError.message)
      setLoading(false)
      return
    }

    // トップページに遷移
    router.push('/')

    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={onSubmit}>
        {/* 名前 */}
        <div className="mb-5">
          <div className="text-sm mb-1">名前</div>
          <input
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-skyblue-500"
            ref={nameRef}
            type="text"
            id="name"
            placeholder="Name"
            required
          />
        </div>

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
            placeholder="Password"
            required
          />
        </div>

        {/* サインアップボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type='submit'
              className='font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm'>
              サインアップ
            </button>
          )}
        </div>
      </form>

      <div className="text-center text-sm">アカウントはお持ちですか？</div>
      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-gray-500 font-bold">
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}
export default Signup
