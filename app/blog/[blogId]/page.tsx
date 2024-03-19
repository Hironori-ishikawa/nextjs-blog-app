import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase-server";
import type { BlogListType } from "@/utils/blog.types";

import BlogDetail from "@/app/components/blog/blog-detail";

type PageProps = {
  params: {
    blogId: string
  }
}

// ブログ詳細
const BlogDetailPage = async ({ params }: PageProps) => {
  const supabase = createClient()

  // ブログの詳細取得
  const { data: blogData }: any = await supabase // anyでなんでも入力できるようにした。
    .from('blogs')
    .select('*, comments(id, content, created_at, profiles(name, avatar_url), likes(user_id))') // コメント取得
    .eq('id', params.blogId)
    .returns<BlogListType>() // 型を指定
    .single()

  // ブログは存在しない場合
  if (!blogData) return notFound()

  // [Tips]
  // blogsテーブルのuser_idをprofile_idに変更することで、ブログと同時にプロフィールも取得できるようになる。
  // supabase.from('blog').select(`id, created_at, title, content, image_url, profiles(name, avatar_url), likes(user_id))`).eq('id', params.blogId).returns<BlogListType>().single()
  // こうすると別でプロフィールを取得する必要がなくなる。


  // プロフィール情報を取得
  const { data: profileData } = await supabase
    .from('profiles')
    .select()
    .eq('id', blogData.user_id)
    .single()

  // 表示ブログ詳細作成
  const blog: BlogListType = {
    id: blogData.id,
    created_at: blogData.created_at,
    title: blogData.title,
    content: blogData.content,
    image_url: blogData.image_url,
    user_id: blogData.user_id,
    name: profileData!.name,
    avatar_url: profileData!.avatar_url,
    comments: blogData.comments,
  }

  return <BlogDetail blog={blog} />
}

export default BlogDetailPage
