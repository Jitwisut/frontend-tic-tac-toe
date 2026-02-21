import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Tic-Tac-Toe | เกมโอเอ็กซ์แบบ Multiplayer',
  description: 'เล่นเกม Tic-Tac-Toe ออนไลน์กับเพื่อน หรือท้าทาย AI ที่ไม่มีวันแพ้!',
  keywords: ['tic-tac-toe', 'game', 'multiplayer', 'xo', 'โอเอ็กซ์'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
