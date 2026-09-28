import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, ChefHat, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SobrePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Intro */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B77A43]">
          Nossa Trajetória
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#3B241B]">
          A História da Doces da Angel
        </h1>
        <p className="text-sm sm:text-base text-[#6E584D] leading-relaxed">
          Nascida da paixão pela doçaria clássica brasileira e do desejo de resgatar o sabor autêntico de doces feitos à mão com paciência.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-16/9 rounded-3xl overflow-hidden border border-[#E8D5C4] shadow-sm">
        <Image
          src="/images/atelie-hero.jpg"
          alt="Bancada de preparo artesanal da Doces da Angel com cerâmicas e doces tradicionais"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Story Text */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-[#E8D5C4] space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7A263A] block">
              O Ateliê
            </span>
            <p className="font-serif-title font-bold text-lg text-[#3B241B]">
              “O doce é a memória mais viva de um abraço em família.”
            </p>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              Angelina (Angel) começou produzindo balas banhadas para presentear amigos e vizinhos. O aroma de açúcar caramelizado e o carinho impresso em cada unidade transformaram o ateliê no endereço favorito de quem não abre mão do doce de verdade.
            </p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6 text-[#6E584D] text-sm sm:text-base leading-relaxed">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3B241B]">
            O Respeito ao Ponto do Açúcar
          </h2>
          <p>
            Em tempos de ultraprocessados e produção massificada, optamos pelo caminho inverso: o tempo que a panela de fundo grosso pede, a atenção ao ponto de vidro da calda de caramelo e a torra atenta do amendoim.
          </p>
          <p>
            Cada tacho de doce de leite é vigiado por horas até atingir a textura aveludada ideal, sem nenhuma adição de amido de milho para encorpar artificialmente. Nossas cocadas levam coco fresco ralado in natura, o que confere uma umidade inigualável.
          </p>
          <p>
            Produzimos em lotes reduzidos e sob demanda justamente para que o doce chegue até sua mesa com a casquinha fresca, crocante e os aromas originais preservados.
          </p>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="bg-white rounded-3xl border border-[#E8D5C4] p-8 sm:p-12 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B77A43]">
            Nossos Valores
          </span>
          <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3B241B]">
            Os Pilares da Nossa Cozinha
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4D7DA] text-[#7A263A] flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-serif-title font-bold text-base text-[#3B241B]">Ingredientes Selecionados</h4>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              Manteiga pura, leite fresco e frutas in natura. Rejeitamos aditivos químicos e conservantes artificiais.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4D7DA] text-[#7A263A] flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-serif-title font-bold text-base text-[#3B241B]">Pequenos Lotes Diários</h4>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              Produção sob encomenda para garantir frescor absoluto, crocância intacta e cremosidade no ponto certo.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4D7DA] text-[#7A263A] flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-serif-title font-bold text-base text-[#3B241B]">Preparo Manual</h4>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              Boleamento, banho de calda de caramelo e embalagem feitos individualmente à mão com rigor e carinho.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4D7DA] text-[#7A263A] flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="font-serif-title font-bold text-base text-[#3B241B]">Transparência Total</h4>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              Todos os ingredientes, tabelas de alérgenos e prazos são explicitados abertamente para sua segurança.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Button variant="primary" size="lg" asChild>
          <Link href="/doces">
            <span>Explorar Nossos Doces</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
