import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/modules/checkout/cart-context';
import { CartDrawer } from '@/components/store/cart-drawer';

export const metadata: Metadata = {
  title: 'Doçuras da Angel | Balas Baiana & Doces Caramelizados',
  description: 'Doce de coco e leite condensado em um recheio cremoso, envolvido por uma fina camada de caramelo crocante e dourado. Sabores Tradicional, Maracujá, Morango, Ameixa, Goiabada e Doce de Leite.',
  keywords: ['Doçuras da Angel', 'balas baiana', 'doces caramelizados', 'bala baiana tradicional', 'maracujá', 'morango', 'ameixa', 'goiabada', 'doce de leite', 'encomendas para festas'],
  authors: [{ name: 'Doçuras da Angel' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FFF8F9] text-[#33161E]">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
