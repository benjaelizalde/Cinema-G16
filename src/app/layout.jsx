import Navbar from "@/components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}</body>
    </html>
  );
}
