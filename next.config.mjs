/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // experimental は削除（appDir は今は不要）
  images: {
    domains: ['azytmuykcefdpqzkeprr.supabase.co'],
  },
};

export default nextConfig;
