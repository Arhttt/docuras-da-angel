'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Package, 
  User, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  LogIn, 
  Sparkles, 
  Search, 
  LogOut, 
  CheckCircle2, 
  ShoppingBag, 
  Calendar, 
  Phone, 
  Mail, 
  AlertCircle 
} from 'lucide-react';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, AuthUser } from '@/modules/auth/auth-context';
import { formatPhone, formatCep } from '@/lib/formatters';

function MinhaContaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'orders' | 'profile' | 'addresses' | null;

  const { user, loading, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<any[]>([]);

  // Anonymous tracking input
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingError, setTrackingError] = useState('');

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Form State
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);

  // Sincroniza tab com URL se presente
  useEffect(() => {
    if (tabParam && ['orders', 'profile', 'addresses'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Carrega histórico de pedidos
  useEffect(() => {
    try {
      const historyRaw = localStorage.getItem('doces_angel_orders_history');
      if (historyRaw) {
        setOrders(JSON.parse(historyRaw));
      } else {
        const lastRaw = localStorage.getItem('doces_angel_last_order');
        if (lastRaw) {
          setOrders([JSON.parse(lastRaw)]);
        }
      }
    } catch (e) {
      console.error('Erro ao ler pedidos:', e);
    }
  }, []);

  // Popula formulários quando o usuário estiver logado
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');

      if (user.address) {
        setCep(user.address.postalCode || '');
        setStreet(user.address.street || '');
        setNumber(user.address.number || '');
        setComplement(user.address.complement || '');
        setNeighborhood(user.address.neighborhood || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
      }
    }
  }, [user]);

  const handleLookupOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setTrackingError('Digite o código do pedido.');
      return;
    }
    const cleanCode = trackingCode.trim().toUpperCase();
    router.push(`/acompanhar?pedido=${encodeURIComponent(cleanCode)}`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);

    await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
    });

    setProfileSaving(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressSuccess(false);

    await updateProfile({
      address: {
        postalCode: cep.trim(),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim(),
      },
    });

    setAddressSaving(false);
    setAddressSuccess(true);
    setTimeout(() => setAddressSuccess(false), 4000);
  };

  // 1. ESTADO DE CARREGAMENTO
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#EED7DC] border-t-[#6E2637] rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-[#6E4D55]">Carregando suas informações...</p>
      </div>
    );
  }

  // 2. ESTADO DESCONECTADO (SEM CONTA / NÃO AUTENTICADO)
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Banner de Boas-vindas / Acesso */}
        <div className="bg-white rounded-3xl border border-[#EED7DC] p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#FDECEF]/60 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDECEF] text-[#6E2637] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E65A78]" />
              <span>Área do Cliente</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#33161E]">
                Acesse sua conta para ver seus pedidos
              </h1>
              <p className="text-sm sm:text-base text-[#6E4D55] leading-relaxed">
                Conecte-se para acompanhar o preparo e a entrega em tempo real, gerenciar seus endereços favoritos e agilizar novos pedidos de doces finos.
              </p>
            </div>

            {/* Ações Principais */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                asChild
                className="bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold py-6 px-7 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <Link href="/login?redirect=/minha-conta">
                  <LogIn className="w-4 h-4" />
                  <span>Entrar na minha conta</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-[#EED7DC] text-[#33161E] hover:bg-[#FDECEF] hover:text-[#6E2637] font-semibold py-6 px-6 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Link href="/cadastro?redirect=/minha-conta">
                  <Sparkles className="w-4 h-4 text-[#E65A78]" />
                  <span>Criar cadastro gratuito</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Vantagens de ter uma conta */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-serif-title text-2xl font-bold text-[#33161E]">
              Vantagens de ser cliente cadastrada(o)
            </h2>
            <p className="text-xs sm:text-sm text-[#8C6D75]">
              Praticidade e atendimento exclusivo em cada encomenda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Package className="w-6 h-6 text-[#6E2637]" />,
                title: 'Acompanhamento Ao Vivo',
                desc: 'Status de cada etapa: recebido, em produção, embalado e a caminho.',
              },
              {
                icon: <Clock className="w-6 h-6 text-[#6E2637]" />,
                title: 'Histórico Completo',
                desc: 'Consulte pedidos anteriores, recibos detalhados e repita seus favoritos.',
              },
              {
                icon: <MapPin className="w-6 h-6 text-[#6E2637]" />,
                title: 'Endereços Salvos',
                desc: 'Compre em poucos segundos sem precisar digitar seu endereço novamente.',
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#6E2637]" />,
                title: 'Encomendas Especiais',
                desc: 'Prioridade em datas comemorativas, festas de aniversário e eventos.',
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#EED7DC] p-6 space-y-3 shadow-xs hover:border-[#6E2637]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FDECEF] flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-bold text-sm text-[#33161E]">{v.title}</h3>
                <p className="text-xs text-[#6E4D55] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consulta Rápida sem Login */}
        <div className="bg-[#FDECEF]/60 rounded-3xl border border-[#EED7DC] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif-title font-bold text-lg text-[#33161E]">
                Fez um pedido como visitante?
              </h3>
              <p className="text-xs text-[#6E4D55]">
                Digite o código que você recebeu (ex: <span className="font-mono font-semibold">ANGEL-2026-XXXXXX</span>) para consultar o status:
              </p>
            </div>

            <form onSubmit={handleLookupOrder} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => {
                  setTrackingCode(e.target.value);
                  setTrackingError('');
                }}
                placeholder="ANGEL-2026-..."
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl border border-[#EED7DC] bg-white text-xs sm:text-sm text-[#33161E] placeholder:text-[#B89FAA] uppercase font-mono focus:outline-none focus:border-[#6E2637]"
              />
              <button
                type="submit"
                className="bg-[#6E2637] hover:bg-[#581D2B] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Rastrear</span>
              </button>
            </form>
          </div>
          {trackingError && (
            <p className="text-xs text-red-600">{trackingError}</p>
          )}
        </div>
      </div>
    );
  }

  // 3. ESTADO AUTENTICADO (USUÁRIO CONECTADO)
  const firstName = user.name ? user.name.split(' ')[0] : 'Cliente';
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header do Usuário Logado */}
      <div className="bg-white rounded-3xl border border-[#EED7DC] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#6E2637] text-white font-serif-title font-bold text-2xl flex items-center justify-center shadow-md">
            {userInitial}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33161E]">
                Olá, {firstName}!
              </h1>
              <span className="text-[11px] font-semibold bg-[#FDECEF] text-[#6E2637] px-2.5 py-0.5 rounded-full border border-[#EED7DC]">
                Cliente VIP
              </span>
            </div>
            <p className="text-xs text-[#6E4D55] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#8C6D75]" />
              <span>{user.email}</span>
              {user.phone && (
                <>
                  <span>•</span>
                  <Phone className="w-3.5 h-3.5 text-[#8C6D75]" />
                  <span>{user.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da conta</span>
        </button>
      </div>

      {/* Navegação de Abas */}
      <div className="flex border-b border-[#EED7DC] gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#6E2637] text-[#6E2637]'
              : 'border-transparent text-[#6E4D55] hover:text-[#33161E]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Meus Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-[#6E2637] text-[#6E2637]'
              : 'border-transparent text-[#6E4D55] hover:text-[#33161E]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Endereços Salvos</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-[#6E2637] text-[#6E2637]'
              : 'border-transparent text-[#6E4D55] hover:text-[#33161E]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Dados Pessoais</span>
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* Aba 1: Meus Pedidos */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EED7DC] p-10 sm:p-14 text-center space-y-4 max-w-md mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FDECEF] text-[#6E2637] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-serif-title font-bold text-xl text-[#33161E]">
                Nenhum pedido realizado ainda
              </h3>
              <p className="text-xs text-[#6E4D55] leading-relaxed">
                Você ainda não fez nenhum pedido no site. Visite nosso cardápio e experimente nossas balas baianas artesanais!
              </p>
              <Button asChild className="bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold py-3 px-6 rounded-xl text-xs">
                <Link href="/doces">Ver Cardápio de Doces</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#EED7DC] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#6E2637]/30 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-sm text-[#6E2637] bg-[#FDECEF] px-2.5 py-1 rounded-lg">
                        {ord.orderId}
                      </span>
                      <span className="text-[11px] bg-[#E8F5E9] text-[#2E7D32] font-semibold px-2.5 py-1 rounded-full">
                        Em Preparo
                      </span>
                      {ord.createdAt && (
                        <span className="text-xs text-[#8C6D75] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6E4D55]">
                      {ord.items?.length || 1} {(ord.items?.length || 1) === 1 ? 'item' : 'itens'} • Total:{' '}
                      <strong className="text-[#33161E] font-serif-title text-sm">{formatCentsToBrl(ord.totalCents || 0)}</strong>
                    </p>

                    <p className="text-[11px] text-[#8C6D75]">
                      {ord.fulfillment?.type === 'pickup' ? 'Retirada no Ateliê' : 'Entrega Local'} • Janela: {ord.fulfillment?.slot || 'Horário agendado'}
                    </p>
                  </div>

                  <Button variant="outline" size="sm" asChild className="border-[#EED7DC] hover:bg-[#FDECEF] text-[#6E2637] font-semibold shrink-0">
                    <Link href={`/acompanhar?pedido=${encodeURIComponent(ord.orderId)}`}>
                      <span>Linha do Tempo</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba 2: Endereços Salvos */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-[#EED7DC] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-serif-title font-bold text-lg text-[#33161E]">
              Endereço Principal de Entrega
            </h3>
            <p className="text-xs text-[#6E4D55]">
              Salve seu endereço para preencher o checkout automaticamente nas próximas compras.
            </p>
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  placeholder="86000-000"
                  maxLength={9}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  Logradouro (Rua / Avenida)
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua das Camélias"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="142"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 42"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Centro"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ivaiporã"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="PR"
                  maxLength={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
                />
              </div>
            </div>

            {addressSuccess && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Endereço atualizado com sucesso!</span>
              </p>
            )}

            <button
              type="submit"
              disabled={addressSaving}
              className="bg-[#6E2637] hover:bg-[#581D2B] disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              {addressSaving ? 'Salvando...' : 'Salvar Endereço'}
            </button>
          </form>
        </div>
      )}

      {/* Aba 3: Dados Pessoais */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#EED7DC] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-serif-title font-bold text-lg text-[#33161E]">
              Seus Dados Cadastrados
            </h3>
            <p className="text-xs text-[#6E4D55]">
              Mantenha seu telefone e nome atualizados para contato referente aos pedidos.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                E-mail de Cadastro
              </label>
              <input
                type="email"
                value={profileEmail}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-gray-100 text-sm text-[#8C6D75] cursor-not-allowed"
              />
              <span className="text-[11px] text-[#8C6D75] mt-1 block">
                O e-mail é utilizado como identificador da conta.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#33161E] uppercase tracking-wider block mb-1">
                WhatsApp / Celular
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(formatPhone(e.target.value))}
                placeholder="(43) 99999-9999"
                maxLength={15}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED7DC] bg-[#FFF8F9] text-sm text-[#33161E] focus:outline-none focus:border-[#6E2637]"
              />
            </div>

            {profileSuccess && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dados atualizados com sucesso!</span>
              </p>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="bg-[#6E2637] hover:bg-[#581D2B] disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              {profileSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function MinhaContaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#6E4D55]">Carregando...</div>}>
      <MinhaContaContent />
    </Suspense>
  );
}
