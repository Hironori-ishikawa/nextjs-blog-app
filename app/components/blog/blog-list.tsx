import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase-server";

import BlogItem from './blog-item'


// ブログリスト
const BlogList = async () => {
  const supabase = createClient()

  //ブログリストの取得
  const { data: blogsData } = await supabase
    .from('blogs')
    .select()
    .order('created_at', { ascending: false })

  // ブログが見つからない場合
  if (!blogsData) return notFound()

  return (
    <div className="grid grid-cols-3 gap-10 blogList">
      {/* mapでasync/awaitを使用するためpromise.allを使用 */}
      {await Promise.all(
        blogsData.map(async (blogData) => {
          // プロフィール取得
          const { data: userData } = await supabase
            .from('profiles')
            .select()
            .eq('id', blogData.user_id)
            .single()

          // ブログとプロフィールのテーブルを結合
          const blog = {
            id: blogData.id,
            created_at: blogData.created_at,
            title: blogData.title,
            content: blogData.content,
            user_id: blogData.user_id,
            image_url: blogData.image_url,
            name: userData!.name,
            avatar_url: userData!.avatar_url,
          }

          return <BlogItem comments={[]} key={blog.id} {...blog} /> // comments機能を追加したためcomments={[]}を追記する。
        })
      )}
    </div>
  )
}

export default BlogList
