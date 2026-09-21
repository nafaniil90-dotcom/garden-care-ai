import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Мой Персональный Садовник (Garden Care AI)",
  description: "Telegram Mini App для ухода за садом и комнатными растениями с AI-диагностикой и люксметром",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#f2f7f4]">
        <main className="max-w-md mx-auto min-h-screen relative">{children}</main>
      </body>
    </html>
  );
}
