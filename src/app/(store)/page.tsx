import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  ChefHat, 
  CheckCircle2, 
  Star, 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Gift, 
  Award,
  ChevronRight
} from 'lucide-react';
import { STORE_INFO, PRODUCTS } from '@/lib/products-data';
import { Button } from '@/components/ui/button';

const TESTIMONIALS = [
  {
    name: 'Camila Mendonça',
    role: 'Noiva · Casamento em Ivaiporã',
    comment: 'As balas baianas da Angel foram a sensação da mesa de doces do meu casamento! O caramelo é fininho e crocante como vidro, e o recheio é incrivelmente cremoso. Todos os convidados elogiaram.',
    rating: 5,
    tag: 'Casamento',
  },
  {
    name: 'Renata Vasconcellos',
    role: 'Cliente Frequente',
    comment: 'A bala baiana de morango fresco é simplesmente divina. Você morde a casquinha crocante e sente a fruta fresquinha explodir na boca. Não fico mais sem a caixinha do final de semana!',
    rating: 5,
    tag: 'Bala de Morango',
  },
  {
    name: 'Eduardo Guimarães',
    role: 'Aniversário de 40 anos',
    comment: 'Encomendei 200 unidades para uma comemoração de família. Chegaram impecáveis, no horário combinado e com um aroma maravilhoso. Atendimento nota 10 da Angel do início ao fim.',
    rating: 5,
    tag: 'Encomenda 200 un.',
  },
];

const FAQS = [
  {
    q: 'O que torna a Bala Baiana da Doçuras da Angel tão única?',
    a: 'Nosso segredo está no controle preciso da temperatura do açúcar e no respeito ao tempo de preparo. O recheio é feito lentamente com coco úmido e leite condensado de primeira qualidade, e banhado em calda quente que atinge o ponto de vidro cristalino perfeito — resultando em um estalo crocante ao morder, sem grudar nos dentes.',
  },
  {
    q: 'Qual é o segredo para conservar a crocância do caramelo?',
    a: 'O caramelo de vidro reage à umidade e ao calor. Por isso, conserve suas balas em local fresco, arejado e seco, longe da luz direta do sol. Não recomendamos colocar em geladeira antes de consumir para não acelerar a umidificação da casquinha.',
  },
  {
    q: 'Como funcionam as encomendas para festas e eventos?',
    a: 'Atendemos casamentos, aniversários, batizados e eventos corporativos com centos promocionais, caixas presenteáveis personalizadas e embalagens especiais para mesa de doces. É possível agendar data e horário de entrega com antecedência.',
  },
  {
    q: 'Como comprar pelo site e receber?',
    a: 'Você escolhe os sabores no cardápio online, define se prefere retirada no ateliê em Ivaiporã ou entrega programada, e realiza o pagamento seguro via Pix ou Cartão. Seus doces são produzidos frescos no dia da entrega.',
  },
];

export default function HomePage() {
  const serif = { fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' };

  // Destaques dos 6 sabores principais para a vitrine institucional
  const showcaseProducts = PRODUCTS.slice(0, 6);

  return (
    <div className="space-y-20 sm:space-y-32 pb-24 overflow-hidden">

      {/* ── 1. HERO INSTITUCIONAL FULL-SCREEN ── */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/atelie-hero.jpg"
          alt="Ateliê Doçuras da Angel com bancada artesanal e doces caramelizados"
          fill
          priority
          className="object-cover object-center scale-105 animate-in fade-in duration-1000"
          sizes="100vw"
        />

        {/* Gradient Overlay Luxuoso */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, rgba(20, 5, 10, 0.70) 0%, rgba(110, 38, 55, 0.45) 50%, rgba(20, 5, 10, 0.85) 100%)',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 text-center flex-1 flex flex-col items-center justify-center">
          
          {/* Badge de Origem */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E65A78]" />
            <span>Ateliê de Confeitaria Artesanal · Ivaiporã, PR</span>
          </div>

          {/* Título Principal */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.08] tracking-tight drop-shadow-md"
            style={serif}
          >
            A verdadeira arte da<br />
            <span className="text-[#E65A78]">Bala Baiana.</span>
          </h1>

          {/* Subtítulo Poético */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            O encontro mágico entre o estalo crocante do caramelo de vidro e a cremosidade aveludada do doce feito lentamente à mão.
          </p>

          {/* Botões de Ação da Landing Page */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto">
            <Button
              asChild
              className="w-full sm:w-auto bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base cursor-pointer group"
            >
              <Link href="/doces">
                <span>Conhecer o Cardápio</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-6 rounded-2xl backdrop-blur-md transition-all text-sm sm:text-base cursor-pointer"
            >
              <Link href="/encomendas">
                <Gift className="w-4 h-4 mr-2 text-[#E65A78]" />
                <span>Encomendas & Festas</span>
              </Link>
            </Button>
          </div>

          {/* Selos de Confiança Rápidos */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/80 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E65A78]" />
              <span>100% Feito à Mão</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E65A78]" />
              <span>Ponto de Vidro Perfeito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E65A78]" />
              <span>Ingredientes Selecionados</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-6 flex flex-col items-center gap-1.5 text-white/50 text-[10px] tracking-widest uppercase pointer-events-none">
          <span>Descubra Nosso Ateliê</span>
          <div className="w-px h-6 bg-white/30 animate-pulse" />
        </div>
      </section>


      {/* ── 2. NOSSOS PILARES ARTESANAIS (CARDS DE DESTAQUE) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="bg-white rounded-3xl border border-[#EED7DC] p-8 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-[#FDECEF] text-[#6E2637] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-[#6E2637]" />
            </div>
            <h3 className="text-xl font-bold text-[#33161E] mb-2" style={serif}>
              A Casquinha de Vidro
            </h3>
            <p className="text-sm text-[#6E4D55] leading-relaxed">
              O ponto de caramelo cristalino que quebra delicadamente ao morder. Brilho espelhado, textura estaladiça e o sabor equilibrado que não enjoa.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EED7DC] p-8 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-[#FDECEF] text-[#6E2637] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-[#6E2637]" />
            </div>
            <h3 className="text-xl font-bold text-[#33161E] mb-2" style={serif}>
              Recheios Puros & Naturais
            </h3>
            <p className="text-sm text-[#6E4D55] leading-relaxed">
              Coco ralado fresco, morangos inteiros in natura, maracujá de verdade e doce de leite cozido lentamente. Zero corantes, conservantes ou aditivos.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EED7DC] p-8 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-[#FDECEF] text-[#6E2637] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-[#6E2637]" />
            </div>
            <h3 className="text-xl font-bold text-[#33161E] mb-2" style={serif}>
              Lotes Diários Sob Demanda
            </h3>
            <p className="text-sm text-[#6E4D55] leading-relaxed">
              Cada bala é boleada e banhada no dia da sua entrega ou retirada, garantindo que o doce chegue até sua mesa no auge absoluto da crocância.
            </p>
          </div>

        </div>
      </section>


      {/* ── 3. VITRINE VISUAL DE SABORES DA MARCA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#EED7DC]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEF] text-[#6E2637] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E65A78]" />
              <span>Vitrine Exclusiva</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#33161E]" style={serif}>
              Nossas Criações Artesanais
            </h2>
            <p className="text-sm sm:text-base text-[#6E4D55] leading-relaxed">
              Explore a variedade de sabores autorais que encantam o paladar de Ivaiporã e região. Cada doce possui sua própria personalidade e harmonia de sabores.
            </p>
          </div>

          <Button asChild className="bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold px-6 py-3 rounded-xl shrink-0">
            <Link href="/doces">
              <span>Ver Cardápio & Comprar</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Grade de Sabores com Cards Visuais Apaixonantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EED7DC] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              {/* Imagem do Produto com Zoom e Badge */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#FDECEF]/30">
                <Image
                  src={product.image}
                  alt={product.imageAlt || product.name}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay de gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Badge de Categoria */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#6E2637] text-xs font-bold shadow-xs">
                  {product.badge || 'Artesanal'}
                </span>

                {/* Tag de sabor inferior */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <span>Doçuras da Angel</span>
                  <span className="text-[#FBBF24] font-semibold">Ponto de Vidro ★★★★★</span>
                </div>
              </div>

              {/* Informações Institucionais do Produto */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#33161E] group-hover:text-[#6E2637] transition-colors" style={serif}>
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E4D55] line-clamp-3 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Notas de Degustação */}
                <div className="pt-3 border-t border-[#F5E6E9] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8C6D75]">
                    {product.category === 'balas-baiana' ? 'Bala Baiana Recheada' : 'Doce Tradicional'}
                  </span>

                  <Link
                    href={`/doces/${product.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6E2637] hover:text-[#581D2B] transition-colors group-hover:translate-x-0.5"
                  >
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Banner de Ação para o Cardápio Completo */}
        <div className="mt-12 text-center bg-[#FDECEF]/60 rounded-3xl p-8 border border-[#EED7DC] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h4 className="font-bold text-lg text-[#33161E]" style={serif}>
              Quer montar sua caixa personalizada de sabores?
            </h4>
            <p className="text-xs sm:text-sm text-[#6E4D55]">
              Acesse o cardápio completo, escolha as porções desejadas e faça seu pedido online com entrega agendada.
            </p>
          </div>

          <Button asChild className="bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold px-7 py-3 rounded-xl shrink-0">
            <Link href="/doces">
              <span>Explorar Todo o Cardápio</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

      </section>


      {/* ── 4. A HISTÓRIA DA EMPRESA & O ATELIÊ ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#EED7DC] p-8 sm:p-12 lg:p-16 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Coluna de Imagem com Decoração */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-lg border border-[#EED7DC]">
                <Image
                  src="/images/atelie-hero.jpg"
                  alt="Angel preparando doces artesanais no ateliê"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Card Flutuante de Citação */}
              <div
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#6E2637] text-white p-5 sm:p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block border border-[#8A3348]"
              >
                <p className="text-xs sm:text-sm font-medium italic leading-snug" style={serif}>
                  “O doce é a memória mais viva de um abraço em família.”
                </p>
                <span className="text-[11px] text-[#FDECEF]/80 block mt-2 font-sans font-bold">
                  — Angelina (Angel), Fundadora
                </span>
              </div>
            </div>

            {/* Coluna de Texto com a Narrativa */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEF] text-[#6E2637] text-xs font-bold">
                  <ChefHat className="w-3.5 h-3.5 text-[#E65A78]" />
                  <span>Nossa Trajetória</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#33161E]" style={serif}>
                  Amor, Paciência e o Ponto Perfeito do Açúcar.
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#6E4D55] leading-relaxed">
                <p>
                  A história da <strong className="text-[#33161E]">Doçuras da Angel</strong> começou de forma despretensiosa em Ivaiporã, no calor da cozinha familiar. O que no início eram mimos preparados com carinho para presentear amigos e vizinhos em datas comemorativas, logo virou uma paixão incontornável.
                </p>
                <p>
                  Enquanto a indústria se voltava para conservantes e produção em massa, a Angel tomou o caminho oposto: <strong className="text-[#33161E]">o respeito ao tempo de panela</strong>. Foram meses aperfeiçoando a temperatura exata da calda de caramelo para que ela ficasse translúcida, fina e crocante como vidro.
                </p>
                <p>
                  Hoje, nosso ateliê produz diariamente lotes limitados de balas baianas e doces artesanais, mantendo a mesma receita afetiva, o coco ralado fresco e o boleamento manual que conquistaram os corações de nossos clientes.
                </p>
              </div>

              {/* Destaques da História */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-[#F5E6E9]">
                <div className="space-y-0.5">
                  <span className="font-serif-title font-bold text-2xl sm:text-3xl text-[#6E2637]">100%</span>
                  <span className="text-xs text-[#8C6D75] block">Artesanal & Natural</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-serif-title font-bold text-2xl sm:text-3xl text-[#6E2637]">6+</span>
                  <span className="text-xs text-[#8C6D75] block">Sabores Autorais</span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-serif-title font-bold text-2xl sm:text-3xl text-[#6E2637]">+5.000</span>
                  <span className="text-xs text-[#8C6D75] block">Doces Entregues</span>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild variant="outline" className="border-[#EED7DC] text-[#6E2637] hover:bg-[#FDECEF] font-bold px-6 py-2.5 rounded-xl text-sm">
                  <Link href="/sobre">
                    <span>Ler Nossa História Completa</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ── 5. ANATOMIA DO DOCE: O SEGREDO DO PONTO DE VIDRO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78]">Processo Artesanal</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#33161E]" style={serif}>
            A Anatomia da Bala Baiana Perfeita
          </h2>
          <p className="text-sm text-[#6E4D55]">
            Cada doce é uma escultura comestível equilibrada em camadas de sabor e textura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="bg-[#FFF8F9] rounded-3xl p-8 border border-[#EED7DC] space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#6E2637] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
              1
            </div>
            <h3 className="font-bold text-xl text-[#33161E]" style={serif}>
              A Casquinha Crocante
            </h3>
            <p className="text-xs sm:text-sm text-[#6E4D55] leading-relaxed">
              Calda de açúcar no ponto de vidro que sela o doce, mantendo o recheio protegido e proporcionando um estalo inesquecível ao morder.
            </p>
          </div>

          <div className="bg-[#FFF8F9] rounded-3xl p-8 border border-[#EED7DC] space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#6E2637] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
              2
            </div>
            <h3 className="font-bold text-xl text-[#33161E]" style={serif}>
              O Recheio Cremoso
            </h3>
            <p className="text-xs sm:text-sm text-[#6E4D55] leading-relaxed">
              Base de coco fresco ralado e leite condensado cozidos no ponto aveludado, com textura macia que derrete e equilibra com a casca.
            </p>
          </div>

          <div className="bg-[#FFF8F9] rounded-3xl p-8 border border-[#EED7DC] space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#6E2637] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
              3
            </div>
            <h3 className="font-bold text-xl text-[#33161E]" style={serif}>
              O Toque de Fruta Real
            </h3>
            <p className="text-xs sm:text-sm text-[#6E4D55] leading-relaxed">
              Morangos inteiros, reduções de maracujá fresco ou ameixa preta que trazem acidez e aromas naturais para uma experiência gourmet.
            </p>
          </div>

        </div>
      </section>


      {/* ── 6. SEÇÃO DE ENCOMENDAS PARA FESTAS E CASAMENTOS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#6E2637] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          
          {/* Elemento decorativo de fundo */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#8A3348]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                <Gift className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Celebrações Inesquecíveis</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight" style={serif}>
                Encomendas Especiais para Casamentos, Festas e Eventos
              </h2>

              <p className="text-sm sm:text-base text-[#FDECEF]/90 leading-relaxed max-w-2xl font-light">
                Surpreenda seus convidados com doces banhados frescos, caixas de presentes requintadas e centos promocionais montados especialmente para a sua comemoração.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FDECEF]">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0" />
                  <span>Embalagens Personalizadas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FDECEF]">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0" />
                  <span>Desconto para Centos</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FDECEF]">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0" />
                  <span>Agendamento de Data</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <Button
                asChild
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#33161E] font-bold py-6 rounded-2xl shadow-lg transition-all text-sm sm:text-base cursor-pointer"
              >
                <Link href="/encomendas">
                  <span>Solicitar Orçamento de Festa</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl border border-white/30 text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ── 7. DEPOIMENTOS DE CLIENTES (PROVA SOCIAL) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78]">Depoimentos Reais</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#33161E]" style={serif}>
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-sm text-[#6E4D55]">
            A alegria de quem já se encantou com o estalo do nosso caramelo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#EED7DC] p-7 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#6E2637]/30 transition-colors"
            >
              <div className="space-y-4">
                {/* Estrelas de Avaliação */}
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#33161E] italic leading-relaxed">
                  “{t.comment}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5E6E9] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#33161E]">{t.name}</h4>
                  <p className="text-[11px] text-[#8C6D75]">{t.role}</p>
                </div>

                <span className="text-[10px] font-semibold bg-[#FDECEF] text-[#6E2637] px-2.5 py-1 rounded-full">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* ── 8. DÚVIDAS FREQUENTES & FAQ ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78]">Tire Suas Dúvidas</span>
          <h2 className="text-3xl font-bold text-[#33161E]" style={serif}>
            Dúvidas Frequentes
          </h2>
          <p className="text-sm text-[#6E4D55]">
            Informações sobre o ponto do caramelo, conservação, entregas e pedidos.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EED7DC] p-6 text-left space-y-2 shadow-xs hover:border-[#6E2637]/30 transition-colors"
            >
              <h3 className="font-bold text-base text-[#33161E]" style={serif}>
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E4D55] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </section>


      {/* ── 9. BANNER FINAL: CHAMADA PARA EXPERIMENTAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8F9] rounded-3xl border border-[#EED7DC] p-10 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-xs">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDECEF] text-[#6E2637] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E65A78]" />
              <span>Experimente Hoje</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-[#33161E]" style={serif}>
              Pronta para se apaixonar pela nossa Bala Baiana?
            </h2>

            <p className="text-sm sm:text-base text-[#6E4D55] leading-relaxed">
              Visite nosso cardápio online, escolha seus sabores favoritos e receba doces fresquinhos feitos com todo carinho.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              asChild
              className="bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold py-6 px-9 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/doces">
                <span>Ir para o Cardápio de Doces</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-[#EED7DC] text-[#33161E] hover:bg-[#FDECEF] font-semibold py-6 px-8 rounded-2xl text-base"
            >
              <Link href="/contato">
                <span>Falar com o Ateliê</span>
              </Link>
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}