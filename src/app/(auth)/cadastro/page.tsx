'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone, CheckCircle2, Sparkles, AlertCircle, PackageCheck, Clock, Gift } from 'lucide-react';
import { useAuth } from '@/modules/auth/auth-context';
import { formatPhone, sanitizeEmail } from '@/lib/formatters';

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/minha-conta';

  const { signUp } = useAuth();
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [phone, setPhone]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPass, setConfirmPass]       = useState('');
  const [showPass, setShowPass]             = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitizeEmail(email);

    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Por favor, informe um e-mail válido (ex: seu@email.com).');
      return;
    }
    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPass) {
      setError('As senhas digitadas não conferem.');
      return;
    }

    setLoading(true);
    const result = await signUp({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone.trim(),
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(redirectPath);
    }, 700);
  };

  const serif = { fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' };

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDECEF] text-[#6E2637] text-[11px] font-bold mb-1.5 border border-[#EED7DC]">
          <Sparkles className="w-3 h-3 text-[#E65A78]" />
          <span>Cadastro Rápido</span>
        </div>
        <h1 className="text-3xl font-bold text-[#33161E]" style={serif}>
          Crie sua conta
        </h1>
        <p className="text-sm text-[#6E4D55]">
          Já tem cadastro?{' '}
          <Link
            href={`/login${redirectPath !== '/minha-conta' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="text-[#6E2637] font-semibold hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Nome */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
            Nome Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Carolina Silva"
              disabled={loading || success}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
            E-mail *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="seu@email.com"
              disabled={loading || success}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
            />
          </div>
        </div>

        {/* Telefone / WhatsApp */}
        <div className="space-y-1">
          <label htmlFor="phone" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
            WhatsApp / Celular <span className="text-[#8C6D75] font-normal lowercase">(opcional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(43) 99999-9999"
              maxLength={15}
              disabled={loading || success}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70 font-mono text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Senha */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
            Senha *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Mínimo 6 caracteres"
              disabled={loading || success}
              className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C6D75] hover:text-[#6E2637] transition-colors p-1"
              aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmação de Senha */}
        <div className="space-y-1">
          <label htmlFor="confirmPass" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
            Confirmar Senha *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
            <input
              id="confirmPass"
              type={showConfirmPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                if (error) setError('');
              }}
              placeholder="Repita sua senha"
              disabled={loading || success}
              className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C6D75] hover:text-[#6E2637] transition-colors p-1"
              aria-label={showConfirmPass ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 leading-relaxed animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sucesso */}
        {success && (
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Conta criada com sucesso! Entrando...</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#6E2637] hover:bg-[#581D2B] disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer text-sm shadow-xs mt-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Concluir Cadastro</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-5 text-center text-[11px] text-[#B89FAA] leading-relaxed">
        Ao criar sua conta, você concorda com nossos{' '}
        <Link href="/termos" className="underline hover:text-[#6E2637]">Termos de Uso</Link>
        {' '}e{' '}
        <Link href="/privacidade" className="underline hover:text-[#6E2637]">Política de Privacidade</Link>.
      </p>
    </div>
  );
}

export default function CadastroPage() {
  const serif = { fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' };

  return (
    <div className="min-h-screen flex">
      {/* ── Lado esquerdo: foto hero ── */}
      <div className="hidden lg:block relative w-[52%] flex-shrink-0">
        <Image
          src="/images/atelie-hero.jpg"
          alt="Ateliê Doçuras da Angel"
          fill
          priority
          className="object-cover object-center"
          sizes="52vw"
        />
        {/* overlay escuro suave */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Card glassmorphism centralizado */}
        <div className="relative z-10 h-full flex items-center justify-center p-8">
          <div
            className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-7"
            style={{
              background: 'rgba(20, 5, 10, 0.55)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(230, 90, 120, 0.25)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.40)',
            }}
          >
            {/* Logo */}
            <Link href="/" className="inline-block">
              <Image
                src="/images/Do%C3%A7uras%20da%20Angel.png"
                alt="Doçuras da Angel"
                width={160}
                height={72}
                className="object-contain drop-shadow-lg"
              />
            </Link>

            {/* Frase principal */}
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white leading-snug" style={serif}>
                Seja muito<br />
                <span className="text-[#E65A78]">bem-vinda(o)!</span>
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Crie sua conta para encomendar doces finos, salvar seus endereços favoritos e acompanhar cada etapa.
              </p>
            </div>

            {/* Divisor */}
            <div className="h-px bg-white/10" />

            {/* Benefícios da Conta com Ícones SVG */}
            <div className="flex flex-col gap-3.5">
              {[
                {
                  icon: <Clock className="w-4 h-4 text-[#E65A78]" />,
                  label: 'Acompanhamento em tempo real',
                  sub: 'Status detalhado do preparo à entrega do seu pedido',
                },
                {
                  icon: <PackageCheck className="w-4 h-4 text-[#E65A78]" />,
                  label: 'Histórico & pedidos rápidos',
                  sub: 'Recompre seus sabores favoritos com 1 clique',
                },
                {
                  icon: <Sparkles className="w-4 h-4 text-[#E65A78]" />,
                  label: 'Produção fresca no dia',
                  sub: 'Ponto de vidro crocante feito sob demanda em Ivaiporã',
                },
                {
                  icon: <Gift className="w-4 h-4 text-[#E65A78]" />,
                  label: 'Encomendas para festas',
                  sub: 'Agendamento prioritário e caixas personalizadas',
                },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-snug mb-0.5">{label}</p>
                    <p className="text-[11px] text-white/70 leading-relaxed">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-[10px] text-white/30 pt-1">
              © 2026 Doçuras da Angel · Ivaiporã, PR
            </p>
          </div>
        </div>
      </div>

      {/* ── Lado direito: formulário ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FFF8F9] px-6 py-10">
        {/* Logo mobile */}
        <div className="lg:hidden mb-6">
          <Link href="/">
            <Image
              src="/images/Do%C3%A7uras%20da%20Angel.png"
              alt="Doçuras da Angel"
              width={140}
              height={63}
              className="object-contain"
            />
          </Link>
        </div>

        <Suspense fallback={<div className="text-sm text-[#8C6D75]">Carregando formulário...</div>}>
          <CadastroForm />
        </Suspense>
      </div>
    </div>
  );
}
