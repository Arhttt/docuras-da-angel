'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  PackageCheck, 
  Clock, 
  Sparkles, 
  Gift, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/modules/auth/auth-context';
import { sanitizeEmail } from '@/lib/formatters';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/minha-conta';

  const { signIn, resetPassword } = useAuth();
  
  // State: 'login' ou 'forgot-password'
  const [view, setView]                     = useState<'login' | 'forgot-password'>('login');
  const [showPass, setShowPass]             = useState(false);
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState(false);
  const [forgotSentEmail, setForgotSentEmail] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitizeEmail(email);

    if (!cleanEmail || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Por favor, insira um e-mail válido (ex: seu@email.com).');
      return;
    }

    setLoading(true);
    const result = await signIn(cleanEmail, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(redirectPath);
    }, 600);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitizeEmail(email);

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Por favor, informe o e-mail cadastrado na sua conta.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(cleanEmail);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    setForgotSentEmail(cleanEmail);
  };

  const serif = { fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' };

  return (
    <div className="w-full max-w-sm">

      {/* ── MODO 1: LOGIN ── */}
      {view === 'login' && (
        <div className="animate-in fade-in duration-200">
          {/* Header */}
          <div className="mb-7 space-y-1">
            <h1 className="text-3xl font-bold text-[#33161E]" style={serif}>
              Bem-vinda de volta
            </h1>
            <p className="text-sm text-[#6E4D55]">
              Ainda não tem conta?{' '}
              <Link
                href={`/cadastro${redirectPath !== '/minha-conta' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
                className="text-[#6E2637] font-semibold hover:underline"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
            {/* E-mail */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
                E-mail
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
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm text-[#33161E] placeholder:text-[#B89FAA] bg-white transition-all focus:outline-none focus:ring-2 disabled:opacity-70 ${
                    error && (!email || !email.includes('@'))
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15'
                      : 'border-[#EED7DC] focus:border-[#6E2637] focus:ring-[#6E2637]/15'
                  }`}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setView('forgot-password');
                  }}
                  className="text-xs text-[#6E2637] hover:underline font-medium cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full h-12 pl-10 pr-11 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
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
                <span>Login efetuado com sucesso! Redirecionando...</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-12 flex items-center justify-center gap-2 bg-[#6E2637] hover:bg-[#581D2B] disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer text-sm shadow-xs mt-1"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar na minha conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#EED7DC]" />
              <span className="text-[11px] text-[#6E4D55] font-medium">ou</span>
              <div className="flex-1 h-px bg-[#EED7DC]" />
            </div>

            {/* Visitante */}
            <Link
              href="/"
              className="w-full h-11 flex items-center justify-center gap-2 border border-[#EED7DC] text-[#33161E] hover:bg-[#FDECEF] hover:border-[#6E2637]/30 font-semibold rounded-xl transition-all duration-200 text-sm"
            >
              Continuar como visitante
            </Link>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-[#B89FAA] leading-relaxed">
            Ao entrar, você concorda com nossos{' '}
            <Link href="/termos" className="underline hover:text-[#6E2637]">Termos de Uso</Link>
            {' '}e{' '}
            <Link href="/privacidade" className="underline hover:text-[#6E2637]">Política de Privacidade</Link>.
          </p>
        </div>
      )}

      {/* ── MODO 2: ESQUECI MINHA SENHA ── */}
      {view === 'forgot-password' && (
        <div className="animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => {
              setError('');
              setForgotSentEmail('');
              setView('login');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#6E2637] hover:underline font-semibold mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o Login</span>
          </button>

          {/* Header */}
          <div className="mb-6 space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-[#FDECEF] text-[#6E2637] flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5 text-[#6E2637]" />
            </div>
            <h1 className="text-3xl font-bold text-[#33161E]" style={serif}>
              Recuperar Senha
            </h1>
            <p className="text-sm text-[#6E4D55] leading-relaxed">
              Informe seu e-mail de cadastro e enviaremos um link seguro para você redefinir sua senha.
            </p>
          </div>

          {forgotSentEmail ? (
            <div className="space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-emerald-900 leading-relaxed">
                  <strong className="block text-emerald-950 font-bold text-sm">Link enviado com sucesso!</strong>
                  <p>
                    Enviamos as instruções para <strong className="text-emerald-950">{forgotSentEmail}</strong>. Verifique sua caixa de entrada e a pasta de spam.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setForgotSentEmail('');
                  setView('login');
                }}
                className="w-full mt-2 bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Voltar e Fazer Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
                  Seu E-mail Cadastrado *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
                  <input
                    id="forgot-email"
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
                    disabled={loading}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
                  />
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 leading-relaxed animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-[#6E2637] hover:bg-[#581D2B] disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer text-sm shadow-xs mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enviar link de recuperação</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
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
                Doces feitos com<br />
                <span className="text-[#E65A78]">amor e carinho.</span>
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Acesse sua conta para acompanhar pedidos, fazer encomendas e gerenciar seus dados.
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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FFF8F9] px-6 py-12">
        {/* Logo mobile */}
        <div className="lg:hidden mb-8">
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
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}