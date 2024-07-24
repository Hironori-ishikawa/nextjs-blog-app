'use client'

import { format } from 'date-fns'
import type { BlogListType } from '@/utils/blog.types'

import Link from 'next/link'
import Image from "next/image"

// ブログアイテム
const BlogItem = (blog: BlogListType) => {
  const MAX_LENGTH = 55
  let content = blog.content.replace(/\r?\n/g, '')

  //文字数制限
  if (content.length > MAX_LENGTH) {
    content = content.substring(0, MAX_LENGTH) + '...'
  }

  return (
    <div className="break-works blogItems">
      <div className="mb-5">
        <Link href={`blog/${blog.id}`}>
          <Image
            src={blog.image_url}
            className='rounded-lg aspect-video object-cover border border-black  itemImage'
            alt='image'
            width={640}
            height={360}
          />
        </Link>
      </div>

      <div className="font-bold text-xl blogTitle">{blog.title}</div>
      <div className="mb-0 text-gray-500 blogText">{content}</div>

      <div className="flex items-center space-x-3 mb-5 icons">
        <Image
          src={blog.avatar_url ? blog.avatar_url : '/default.png'}
          className='rounded-full iconImage'
          alt='avatar'
          width={40}
          height={40}
        />
        <div className="font-bold iconName">{blog.name}</div>
        <div className="text-gray-500 text-sm timeStamps">
          {format(new Date(blog.created_at), 'yyyy/MM/dd HH:mm')}
        </div>
      </div>
    </div>
  )
}

export default BlogItem
