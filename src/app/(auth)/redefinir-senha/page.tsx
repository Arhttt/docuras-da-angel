'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  ShieldCheck,
  Clock,
  PackageCheck,
  Sparkles,
  Gift
} from 'lucide-react';
import { useAuth } from '@/modules/auth/auth-context';

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error_description') || searchParams.get('error');

  const { updatePassword, isMock } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorParam || '');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPass) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  const serif = { fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' };

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-7 space-y-1">
        <div className="w-10 h-10 rounded-2xl bg-[#FDECEF] text-[#6E2637] flex items-center justify-center mb-3">
          <KeyRound className="w-5 h-5 text-[#6E2637]" />
        </div>
        <h1 className="text-3xl font-bold text-[#33161E]" style={serif}>
          Criar Nova Senha
        </h1>
        <p className="text-sm text-[#6E4D55] leading-relaxed">
          Escolha uma senha segura com no mínimo 6 caracteres para acessar sua conta.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-left animate-in fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-emerald-900 leading-relaxed">
              <strong className="block text-emerald-950 font-bold text-sm">Senha redefinida com sucesso!</strong>
              <p>
                Sua senha foi atualizada. Você será redirecionado para a tela de login em instantes...
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full block text-center mt-3 bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold py-3 rounded-xl text-xs transition-colors"
          >
            Fazer Login Agora
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nova Senha */}
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
              Nova Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
              <input
                id="new-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
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

          {/* Confirmar Nova Senha */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-new-password" className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block">
              Confirmar Nova Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D75]" />
              <input
                id="confirm-new-password"
                type={showConfirmPass ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Repita sua nova senha"
                disabled={loading}
                className="w-full h-12 pl-10 pr-11 rounded-xl border border-[#EED7DC] bg-white text-sm text-[#33161E] placeholder:text-[#B89FAA] focus:outline-none focus:border-[#6E2637] focus:ring-2 focus:ring-[#6E2637]/15 transition-all disabled:opacity-70"
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

          {/* Dica de segurança */}
          <div className="flex items-center gap-2 text-[11px] text-[#6E4D55] bg-[#FDECEF]/60 px-3 py-2 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-[#6E2637] shrink-0" />
            <span>Dica: misture letras maiúsculas, minúsculas e números para maior segurança.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 bg-[#6E2637] hover:bg-[#581D2B] disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer text-sm shadow-xs mt-1"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Salvar Nova Senha</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Link voltar para login */}
          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="text-xs text-[#6E2637] font-semibold hover:underline"
            >
              Lembrou a senha? Voltar ao login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RedefinirSenhaPage() {
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
                Segurança &<br />
                <span className="text-[#E65A78]">Tranquilidade.</span>
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Atualize sua senha para manter seus pedidos, endereços e encomendas sempre protegidos.
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
          <RedefinirSenhaForm />
        </Suspense>
      </div>
    </div>
  );
}
