import "./globals.css";
import Providers from "./providers";
import Header from "@/app/components/header";
import FooterMinimal from "./components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <FooterMinimal />
      </body>
    </html>
  );
}
