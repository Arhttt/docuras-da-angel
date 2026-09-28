'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Heart, Sparkles, CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/social-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STORE_INFO } from '@/lib/products-data';

export default function EncomendasPage() {
  const [eventType, setEventType] = useState('Aniversário');
  const [eventDate, setEventDate] = useState('');
  const [guestsCount, setGuestsCount] = useState('50');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([
    'Bala Baiana Tradicional',
    'Bala Baiana de Maracujá',
  ]);
  const [packagingType, setPackagingType] = useState('Cento para Mesa de Doces');
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((s) => s !== flavor) : [...prev, flavor]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;
    setIsSubmitted(true);
  };

  const flavorsList = [
    { name: 'Bala Baiana Tradicional', desc: 'Coco com leite condensado e casquinha de vidro' },
    { name: 'Bala Baiana de Maracujá', desc: 'Recheio cremoso e toque cítrico' },
    { name: 'Bala Baiana de Morango', desc: 'O sabor favorito das comemorações' },
    { name: 'Bala Baiana de Ameixa (Fruta)', desc: 'Ameixa preta macia com doce de coco caramelizado' },
    { name: 'Bala Baiana de Goiabada (Fruta)', desc: 'Goiabada cascão com massa de coco e caramelo' },
    { name: 'Doce de Leite Artesanal', desc: 'Em cubos macios de corte ou caramelizados' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner from Flyer */}
      <div className="bg-[#6E2637] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs relative overflow-hidden">
        <span className="text-xs uppercase tracking-widest font-bold text-[#FBBF24] block">
          Doçuras da Angel • Encomendas Especiais
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">
          Aceitamos Encomendas para Aniversários, Festas e Eventos
        </h1>
        <p className="text-sm sm:text-base text-[#FDECEF]/90 max-w-xl mx-auto leading-relaxed">
          {STORE_INFO.tagline}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#FDECEF]">
          <a
            href={STORE_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full hover:bg-[#20ba5a] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Chamar no WhatsApp: {STORE_INFO.phone}</span>
          </a>
          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-[#FBBF24]" />
            <span>{STORE_INFO.instagram}</span>
          </a>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl border border-[#EED7DC] p-10 sm:p-14 text-center space-y-5 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-title text-2xl font-bold text-[#33161E]">
              Pedido de Orçamento Enviado!
            </h2>
            <p className="text-xs sm:text-sm text-[#6E4D55] leading-relaxed">
              Muito obrigado, <strong>{clientName}</strong>! Entraremos em contato via WhatsApp no número <strong>{clientPhone}</strong> para passar os valores detalhados e combinar a data da sua encomenda.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" asChild>
              <Link href="/">Voltar à Página Inicial</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EED7DC] p-6 sm:p-10 shadow-xs space-y-8">
          {/* Section 1: Event Details */}
          <div className="space-y-4">
            <h2 className="font-serif-title text-xl font-bold text-[#33161E] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#6E2637]" />
              <span>1. Informações da Comemoração</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#33161E] block mb-1.5">
                  Tipo de Evento:
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-[#FFF8F9] border border-[#EED7DC] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#33161E] focus:border-[#6E2637] focus:outline-none"
                >
                  <option value="Aniversário">Aniversário / Festa Infantil</option>
                  <option value="Casamento">Casamento / Noivado</option>
                  <option value="Batizado">Batizado / Chá de Bebê</option>
                  <option value="Corporativo">Evento Corporativo / Brindes</option>
                  <option value="Outro">Outra Comemoração</option>
                </select>
              </div>

              <div>
                <Input
                  type="date"
                  label="Data da Festa / Evento *"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="number"
                  label="Estimativa de Pessoas / Convidados *"
                  placeholder="Ex: 50"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Flavors */}
          <div className="space-y-4 pt-4 border-t border-[#F8EBEF]">
            <h2 className="font-serif-title text-xl font-bold text-[#33161E] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E65A78]" />
              <span>2. Sabores que Deseja Incluir</span>
            </h2>
            <p className="text-xs text-[#6E4D55]">
              Você pode selecionar múltiplos sabores para montar uma mesa variada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {flavorsList.map((fl) => {
                const isSelected = selectedFlavors.includes(fl.name);
                return (
                  <button
                    key={fl.name}
                    type="button"
                    onClick={() => toggleFlavor(fl.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#6E2637] bg-[#FFF8F9] ring-1 ring-[#6E2637]'
                        : 'border-[#EED7DC] bg-white hover:border-[#E65A78]'
                    }`}
                  >
                    <div>
                      <span className="font-serif-title font-bold text-sm text-[#33161E] block">
                        {fl.name}
                      </span>
                      <span className="text-xs text-[#6E4D55] mt-0.5 block">
                        {fl.desc}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#6E2637] border-[#6E2637] text-white' : 'border-[#EED7DC]'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Contact */}
          <div className="space-y-4 pt-4 border-t border-[#F8EBEF]">
            <h2 className="font-serif-title text-xl font-bold text-[#33161E] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#6E2637]" />
              <span>3. Seus Dados de Contato</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Seu Nome *"
                  placeholder="Nome completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  label="WhatsApp para Contato *"
                  placeholder="(43) 98824-0581"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#33161E] block mb-1.5">
                Detalhes adicionais ou preferências:
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Gostaria de embalagens individuais para lembrancinha ou bandejas prontas..."
                className="w-full bg-[#FFF8F9] border border-[#EED7DC] rounded-xl p-3 text-xs sm:text-sm text-[#33161E] focus:border-[#6E2637] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#6E4D55]">
              Retorno rápido pelo WhatsApp <strong>{STORE_INFO.phone}</strong>.
            </span>
            <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto cursor-pointer">
              <span>Enviar Pedido de Encomenda</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
