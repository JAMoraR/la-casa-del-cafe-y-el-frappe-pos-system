import "@/styles/globals.css";

export const metadata = {
  title: "Venta | La casa del Café y el Frappe",
  description: "Punto de venta de La casa del Café y el Frappe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
