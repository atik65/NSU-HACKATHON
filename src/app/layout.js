import "./globals.css";

export const metadata = {
  title: "Reportify",
  description: "Report crime in our area",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
