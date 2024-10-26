import { Providers } from './providers';

export const metadata = {
  title: "Linkspace",
  description: "All link in one place",
};


export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
