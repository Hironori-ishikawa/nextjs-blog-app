'use client'

import { useEffect, useState, useRef, FormEvent } from "react"
import { format } from 'date-fns'
import { useRouter } from "next/navigation"
import { useSupabase } from "../supabase-provider"
import { HeartIcon } from "@heroicons/react/24/solid"

import Link from 'next/link'
import useStore from "@/store"
import Image from "next/image"
import Loading from "@/app/loading"

import type { BlogListType, LikeType, CommentType } from "@/utils/blog.types"
type PageProps = {
  blog: BlogListType
}

// ブログ詳細
const BlogDetail = ({ blog }: PageProps) => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { user } = useStore()
  const [myBlog, setMyBlog] = useState(false)
  const [loading, setLoading] = useState(false)
  // ↓コメント機能追加
  const [login, setLogin] = useState(false)
  const [loadingComment, setLoadingComment] = useState(false)
  const commentRef = useRef<HTMLTextAreaElement>(null!)
  // ↓いいね機能追加
  const [LoadingLike, setLoadingLike] = useState('')


  useEffect(() => {
    // ログインチェック
    if (user.id != '') {
      setLogin(true)

      // 自分が投稿したブログチェック
      if (user.id === blog.user_id) {
        setMyBlog(true)
      }
    }
  }, [user])

  // ブログ削除
  const deleteBlog = async () => {
    setLoading(true)

    // Supabaseブログ削除
    const { error } = await supabase.from('blogs').delete().eq('id', blog.id)

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // ファイル名取得
    const fileName = blog.image_url.split('/').slice(-1)[0]

    // 画像を削除
    await supabase.storage.from('blogs').remove([`${user.id}/${fileName}`])

    // トップページ遷移
    router.push('/')
    router.refresh()

    setLoading(false)
  }

  // コメントを送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingComment(true)

    // コメントを新規作成
    const { error: insertError } = await supabase.from('comments').insert({
      content: commentRef.current.value,
      blog_id: blog.id,
      profile_id: user.id!,
    })

    // エラーチェック
    if (insertError) {
      alert(insertError.message)
      setLoadingComment(false)
      return
    }

    // フォームクリア
    commentRef.current.value = ''

    // キャッシュクリア
    router.refresh()

    setLoadingComment(false)
  }

  // コメント並び替え
  blog.comments.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) return 1
    if (new Date(a.created_at) < new Date(b.created_at)) return -1
    return 0
  })

  // いいねボタンをクリック
  const commentLike = async (comment_id: string, handle: boolean) => {
    setLoadingLike(comment_id)

    if (handle) {
      // いいねを新規作成
      await supabase.from('likes').insert({
        user_id: user.id!,
        comment_id,
      })
    } else {
      // いいねを削除
      await supabase.from('likes').delete().match({ user_id: user.id, comment_id: comment_id })
    }

    // キャッシュクリア
    router.refresh()

    setLoadingLike('')
  }

  // 自分が投稿したブログのみ、編集削除ボタンを表示
  const renderButton = () => {
    if (myBlog) {
      return (
        <div className="flex justify-end mb-5">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex items-center space-x-5">
              <Link className="font-bold bg-yellow-500 hover:brightness-95 rounded-md p-2 text-white" href={`/blog/${blog.id}/edit`}>編集</Link>
              <div className="font-bold bg-red-500 hover:brightness-95 rounded-md p-2 inline-block text-white cursor-pointer" onClick={() => deleteBlog()}>
                削除
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  // useEffect(() => {
  //   // 自分が投稿したブログチェック
  //   if (user.id === blog.user_id) {
  //     setMyBlog(true)
  //   }
  // }, [user])

  // いいねボタンを表示
  const renderLike = (data: CommentType) => {
    // ログインチェック
    if (login) {
      //いいねしているユーザーをリスト化
      const user_id_list = data.likes.map((x) => x.user_id)

      if (LoadingLike == data.id) {
        // ローディング
        return (
          <div className="h-4 w-4 animate-spin rounded-full border border-yellow-500 border-t-transparent" />
        )
      } else if (user_id_list.includes(user.id!)) {
        // いいね済み
        return (
          <div className="text-pink-500 cursor-pointer" onClick={() => commentLike(data.id, false)}>
            <HeartIcon className="h-5 w-5" />
          </div>
        )
      } else {
        // いいね無し
        return (
          <div className="text-gray-400 cursor-pointer" onClick={() => commentLike(data.id, true)}>
            <HeartIcon className="h-5 w-5" />
          </div>
        )
      }
    } else {
      // 初期値
      return (
        <div className="text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>
      )
    }

  }

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="flex flex-col items-center justify-center mb-5 iconsInner">
        <div className="mb-1">
          <Image
            src={blog.avatar_url ? blog.avatar_url : '/default.png'}
            className="rounded-full iconImage"
            alt="avatar"
            width={70}
            height={70}
          />
        </div>
        <div className="font-bold text-gray-500 iconName">{blog.name}</div>

      </div>

      <div className="mb-5">
        <div className="text-center font-bold text-3*1 text-xl mb-5 blogInnerTitle">{blog.title}</div>
        <div className="mb-5">
          <Image
            src={blog.image_url}
            className="rounded-lg aspect-video object-cover border border-black"
            alt="image"
            width={1024}
            height={576}
          />
        </div>
        <div className="leading-relaxed break-words whitespace-pre-wrap mb-5 blogText">{blog.content}</div>
        <div className="text-sm text-gray-500 timeStamps">
          {format(new Date(blog.created_at), 'yyyy/MM/dd HH:mm')}
        </div>
      </div>

      {renderButton()}

      <div className="border rounded mb-5 bg-gray-200 p-3">
        <div className="font-bold mb-3">コメントする</div>

        {login ? (
          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <textarea
                className="w-full rounded border py-1px-3 outline-none focus:ring-2 focus:ring-yellow-500"
                rows={5}
                ref={commentRef}
                id="comment"
                required
              />
            </div>
            <div className="text-center mb-5">
              {loadingComment ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-sky-500 hover:brightness-110 rounded py-1 px-8"
                >
                  投稿
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="text-center my-10 text-sm text-gray-500">
            コメントするには
            <Link href="auth/login" className="text-blue-500 underline">
              ログイン
            </Link>
            が必要です。
          </div>
        )}
      </div>

      <div className="border rounded">
        <div className="bg-gray-200 flex items-center justify-between p-3">
          <div className="font-bold">コメント</div>
          <div>{blog.comments.length}人</div>
        </div>

        {blog.comments.map((data, index) => (
          <div key={data.id} className={blog.comments.length - 1 === index ? '' : 'border-b'}>
            <div className="flex items-center justify-between border-b p-3">
              <div className="flex items-center space-x-2">
                <Image
                  src={data.profiles.avatar_url ? data.profiles.avatar_url : '/default.png'}
                  className="rounded-full"
                  alt="avatar"
                  width={30}
                  height={30}
                />
                <div className="">{data.profiles.name}</div>
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(data.created_at), 'yyyy/MM/dd HH:mm')}
              </div>
            </div>
            <div className="leading-relaxed break-words whitespace-pre-wrap p-3">
              {data.content}
            </div>

            <div className="flex items-center justify-end px-3 mb-3">
              <div className="flex items-center space-x-1">
                {renderLike(data)}
                <div>{data.likes.length}</div>
              </div>
            </div>
          </div>
        ))}

        {!blog.comments.length && (
          <div className="py-10 text-center text-sm text-gray-500">コメントはまだありません。</div>
        )}
      </div>
    </div>
  )
}

export default BlogDetail
