import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Grok Demo - AI 聊天助手',
  description: '一个类似 Grok 的 AI 聊天助手演示',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      {/* <head>    <script src="http://localhost:8097"></script></head> */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
