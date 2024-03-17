'use client'

import { FormEvent, useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "../supabase-provider"
import { v4 as uuidv4 } from "uuid"

import useStore from "@/store"
import Loading from "@/app/loading"

const BlogNew = () => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { user } = useStore()
  const titleRef = useRef<HTMLInputElement>(null!)
  const contentRef = useRef<HTMLTextAreaElement>(null!)
  const [image, setImage] = useState<File>(null!)
  const [loading, setLoading] = useState(false)

  // 画像アップロード
  const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files?.length == 0) {
      return
    }
    setImage(files[0])
  }, [])

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (user.id) {
      // Supabaseストレージに画像をアップロード
      const { data: storageData, error: StorageError } = await supabase.storage
        .from('blogs')
        .upload(`${user.id}/${uuidv4()}`, image)

      if (StorageError) {
        alert(StorageError.message)
        setLoading(false)
        return
      }

      // 画像のURLを取得
      const { data: urlData } = await supabase.storage
        .from('blogs')
        .getPublicUrl(storageData.path)

      // ブログデータを新規作成
      const { error: insertError } = await supabase.from('blogs').insert({
        title: titleRef.current.value,
        content: contentRef.current.value,
        image_url: urlData.publicUrl,
        user_id: user.id,
      })

      if (insertError) {
        alert(insertError.message)
        setLoading(false)
        return
      }

      // トップページに遷移
      router.push('/')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <form onSubmit={onSubmit}>

        {/* タイトル */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">タイトル</div>
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline focus:border-sky-500"
            placeholder="Title"
            ref={titleRef}
            id="title"
            required
          />
        </div>

        {/* 画像 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">画像</div>
          <input
            type="file"
            id="thumbnail"
            onChange={onUploadImage}
            required
          />
        </div>

        {/* 内容 */}
        <div className="mb-5">
          <div className="text-sm mb-1">内容</div>
          <textarea
            className="border rounded-md w-full py-2 px-3 focus:outline focus:border-sky-500"
            ref={contentRef}
            id="content"
            placeholder="Content"
            rows={15}
            required
          />
        </div>

        {/* 作成ボタン */}
        <div className="text-center mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="shadow-lg font-bold bg-sky-500 hover:brightness-95 rounded-md py-2 px-3  text-white text-sm"
            >
              作成
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default BlogNew
