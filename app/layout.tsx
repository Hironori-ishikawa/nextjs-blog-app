import 'server-only'

import SupabaseListener from './components/supabase-listener';
import SupabaseProvider from './components/supabase-provider';
import Navigation from "./components/navigation";
import "./globals.css";
import { createClient } from '@/utils/supabase-server';

// キャッシュしない
export const revalidate = 0

// レイアウト
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()

  // セッション情報を取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html>
      <body>
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          <div className="flex flex-col min-h-screen">
            <Navigation />

            <main className="flex-1 container max-w-screen-xl mx-auto px-5 py-5 mainContainer">{children}</main>
            <footer className="py-5 border-t">
              <div className="text-center text-sm text-gray-500">
                TECH BLOG @ H.R.I HI Portfolio
              </div>
            </footer>
          </div>
        </SupabaseProvider>

      </body>
    </html>
  )
}

export default RootLayout
