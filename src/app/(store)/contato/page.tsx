'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/social-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STORE_INFO } from '@/lib/products-data';

export default function ContatoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78]">
          Atendimento Direto
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#33161E]">
          Fale com a Doçuras da Angel
        </h1>
        <p className="text-sm sm:text-base text-[#6E4D55]">
          Estamos à disposição para dúvidas sobre nossos sabores de bala baiana, prazos de produção e encomendas de festas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Contacts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EED7DC] p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="font-serif-title font-bold text-xl text-[#33161E]">
              Canais de Contato
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#6E4D55]">
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF8F9] border border-[#EED7DC] hover:border-[#25D366] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#33161E] block">WhatsApp Oficial:</strong>
                  <span className="text-sm font-bold text-[#6E2637]">{STORE_INFO.phone}</span>
                  <span className="text-[11px] text-[#6E4D55] block mt-0.5">Clique para iniciar conversa</span>
                </div>
              </a>

              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF8F9] border border-[#EED7DC] hover:border-[#E65A78] transition-colors"
              >
                <InstagramIcon className="w-5 h-5 text-[#E65A78] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#33161E] block">Instagram Oficial:</strong>
                  <span className="text-sm font-bold text-[#33161E]">{STORE_INFO.instagram}</span>
                  <span className="text-[11px] text-[#6E4D55] block mt-0.5">Siga e veja novidades diárias</span>
                </div>
              </a>

              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-[#6E2637] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#33161E] block">Horário de Atendimento:</strong>
                  <span>Segunda a Sábado: 09h às 19h</span>
                  <span className="block text-[11px] text-[#7C675B]">Domingo: Sob agendamento de eventos</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6E2637] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#33161E] block">Retiradas e Entregas:</strong>
                  <span>Ateliê Doçuras da Angel</span>
                  <span className="block text-[11px] text-[#7C675B]">Atendimento sob agendamento prévio</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F8EBEF] text-xs text-[#6E4D55] leading-relaxed">
              Aceitamos encomendas com antecedência para aniversários, casamentos e celebrações com caixas especiais ou centos de balas.
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#EED7DC] p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="font-serif-title font-bold text-xl text-[#33161E]">
              Mande Sua Mensagem
            </h2>

            {sent ? (
              <div className="p-8 text-center space-y-3 bg-[#FFF8F9] rounded-2xl border border-[#EED7DC]">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
                <h3 className="font-serif-title font-bold text-lg text-[#33161E]">Mensagem Enviada!</h3>
                <p className="text-xs text-[#6E4D55]">
                  Recebemos sua mensagem e entraremos em contato via WhatsApp no número informado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Seu Nome *"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    label="WhatsApp para Contato *"
                    placeholder="(43) 98824-0581"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#33161E] block">
                    Mensagem ou Pedido *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Conte para a gente como podemos te atender..."
                    required
                    className="w-full bg-[#FFF8F9] border border-[#EED7DC] rounded-xl p-3 text-xs sm:text-sm text-[#33161E] focus:border-[#6E2637] focus:outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full cursor-pointer">
                  <span>Enviar Mensagem</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
