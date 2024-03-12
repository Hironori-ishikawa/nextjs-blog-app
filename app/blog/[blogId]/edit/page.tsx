import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase-server";
import BlogEdit from "@/app/components/blog/blog-edit";



type PageProps = {
  params: {
    blogId: string
  }
}

// ブログ詳細ページ
const BlogEditPage = async ({ params }: PageProps) => {
  const supabase = createClient()

  // ブログ詳細取得
  const { data: blog } = await supabase.from('blogs').select().eq('id', params.blogId).single()

  // ブログが存在しない時
  if (!blog) return notFound()

  return <BlogEdit blog={blog} />
}

export default BlogEditPage
