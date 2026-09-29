export interface ProductVariant {
  id: string;
  sku: string;
  label: string;
  unitLabel: string;
  priceCents: number;
  available: boolean;
  minQty: number;
  maxQty: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  flavorType: 'Tradicional' | 'Sabor' | 'Fruta' | 'Especial';
  category: string;
  categorySlug: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string;
  allergens: string;
  image: string;
  imageAlt: string;
  prepTime: string;
  storageInfo: string;
  variants: ProductVariant[];
  featured?: boolean;
}

export const STORE_INFO = {
  brandName: 'Doçuras da Angel',
  specialty: 'Doces Caramelizados • Balas Baiana',
  tagline: 'Doce de coco e leite condensado em um recheio cremoso, envolvido por uma fina camada de caramelo crocante e dourado.',
  phone: '(43) 9 8824-0581',
  phoneClean: '5543988240581',
  whatsappUrl: 'https://wa.me/5543988240581',
  instagram: '@docurasdaangel.oficial',
  instagramUrl: 'https://instagram.com/docurasdaangel.oficial',
  cityRegion: 'Ivaiporã e Região (PR)',
  pickupLocation: 'Ateliê Doçuras da Angel — Retirada sob agendamento em Ivaiporã, PR',
};

export const CATEGORIES = [
  { id: 'todas', name: 'Todos os Sabores', slug: 'todas' },
  { id: 'tradicionais', name: 'Tradicional de Coco', slug: 'tradicionais' },
  { id: 'sabores', name: 'Sabores Especiais', slug: 'sabores' },
  { id: 'frutas', name: 'Com Frutas Naturais', slug: 'frutas' },
  { id: 'doce-de-leite', name: 'Doce de Leite', slug: 'doce-de-leite' },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'prod-bb-tradicional',
    slug: 'bala-baiana-tradicional',
    name: 'Bala Baiana Tradicional',
    flavorType: 'Tradicional',
    category: 'Tradicional de Coco',
    categorySlug: 'tradicionais',
    badge: 'A Clássica Mais Pedida',
    shortDescription: 'Doce de coco ralado e leite condensado em um recheio cremoso, envolvido pela famosa casquinha crocante e dourada de caramelo de vidro.',
    fullDescription: 'Nossa receita assinatura e paixão de todos os clientes. O recheio é preparado lentamente na panela com coco selecionado e leite condensado de alta qualidade até o ponto cremoso perfeito. Depois de enrolada, cada bala recebe um banho quente de calda de açúcar em ponto de vidro cristalino, resultando no inconfundível contraste entre a casca super crocante e o recheio macio.',
    ingredients: 'Leite condensado integral, coco ralado fresco, açúcar cristal, água filtrada, manteiga e glucose.',
    allergens: 'Contém leite e derivados. Não contém glúten.',
    image: '/images/products/bala-tradicional.jpg',
    imageAlt: 'Bala Baiana Tradicional com casca dourada de caramelo e interior de coco cremoso à mostra',
    prepTime: 'Produção diária fresca',
    storageInfo: 'Consumir preferencialmente em até 7 a 10 dias. Manter em local fresco, seco e protegido de umidade para preservar a crocância do caramelo.',
    featured: true,
    variants: [
      {
        id: 'var-bb-trad-6',
        sku: 'BB-TRAD-6UN',
        label: 'Caixa Degustação (6 unidades)',
        unitLabel: 'caixa',
        priceCents: 1800,
        available: true,
        minQty: 1,
        maxQty: 15,
      },
      {
        id: 'var-bb-trad-12',
        sku: 'BB-TRAD-12UN',
        label: 'Caixa Família (12 unidades)',
        unitLabel: 'caixa',
        priceCents: 3200,
        available: true,
        minQty: 1,
        maxQty: 10,
      },
      {
        id: 'var-bb-trad-25',
        sku: 'BB-TRAD-25UN',
        label: 'Caixa Presenteável (25 unidades)',
        unitLabel: 'caixa artesanal',
        priceCents: 6000,
        available: true,
        minQty: 1,
        maxQty: 8,
      },
      {
        id: 'var-bb-trad-100',
        sku: 'BB-TRAD-100UN',
        label: 'Cento para Festas & Eventos (100 un)',
        unitLabel: 'cento',
        priceCents: 22000,
        available: true,
        minQty: 1,
        maxQty: 5,
      },
    ],
  },
  {
    id: 'prod-bb-maracuja',
    slug: 'bala-baiana-maracuja',
    name: 'Bala Baiana de Maracujá',
    flavorType: 'Sabor',
    category: 'Sabores Especiais',
    categorySlug: 'sabores',
    badge: 'Toque Cítrico',
    shortDescription: 'Creme aveludado de maracujá artesanal com coco e leite condensado sob uma casquinha de caramelo dourado estaladiço.',
    fullDescription: 'Uma explosão equilibrada entre a acidez natural do maracujá e o dulçor aveludado do leite condensado com coco. A calda de caramelo dourado sela a bala com aquele estalo perfeito na mordida. Ideal para quem busca um doce caramelizado com frescor cítrico irresistível.',
    ingredients: 'Leite condensado, polpa concentrada de maracujá, coco ralado, manteiga e calda de açúcar caramelizado.',
    allergens: 'Contém leite e derivados. Não contém glúten.',
    image: '/images/products/bala-maracuja.jpg',
    imageAlt: 'Bala Baiana de Maracujá cortada ao meio revelando o recheio amarelo aveludado',
    prepTime: 'Lote fresco sob encomenda',
    storageInfo: 'Guardar em temperatura ambiente fresca. Manter embalagem fechada para proteger o caramelo.',
    featured: true,
    variants: [
      {
        id: 'var-bb-mar-6',
        sku: 'BB-MAR-6UN',
        label: 'Caixa Degustação (6 unidades)',
        unitLabel: 'caixa',
        priceCents: 1900,
        available: true,
        minQty: 1,
        maxQty: 15,
      },
      {
        id: 'var-bb-mar-12',
        sku: 'BB-MAR-12UN',
        label: 'Caixa Família (12 unidades)',
        unitLabel: 'caixa',
        priceCents: 3400,
        available: true,
        minQty: 1,
        maxQty: 10,
      },
      {
        id: 'var-bb-mar-25',
        sku: 'BB-MAR-25UN',
        label: 'Caixa Presenteável (25 unidades)',
        unitLabel: 'caixa artesanal',
        priceCents: 6500,
        available: true,
        minQty: 1,
        maxQty: 8,
      },
      {
        id: 'var-bb-mar-100',
        sku: 'BB-MAR-100UN',
        label: 'Cento para Festas & Eventos (100 un)',
        unitLabel: 'cento',
        priceCents: 23000,
        available: true,
        minQty: 1,
        maxQty: 5,
      },
    ],
  },
  {
    id: 'prod-bb-morango',
    slug: 'bala-baiana-morango',
    name: 'Bala Baiana de Morango',
    flavorType: 'Sabor',
    category: 'Sabores Especiais',
    categorySlug: 'sabores',
    badge: 'Favorito nas Festas',
    shortDescription: 'Recheio cremoso e aromático de morango com leite condensado e coco, envolvido por uma casquinha de caramelo brilhante.',
    fullDescription: 'Sucesso absoluto em mesas de aniversários infantis e celebrações. A massa macia e rosinha de morango com coco e leite condensado é envolta por uma fina camada cristalina de açúcar caramelizado. Cada mordida combina cor vibrante, textura macia e o estalinho do caramelo.',
    ingredients: 'Leite condensado, creme de morango artesanal, coco ralado, manteiga e calda de açúcar.',
    allergens: 'Contém leite e derivados. Não contém glúten.',
    image: '/images/products/bala-morango.jpg',
    imageAlt: 'Bala Baiana de Morango com casca avermelhada brilhante e recheio cremoso',
    prepTime: 'Lote fresco diário',
    storageInfo: 'Conservar em recipiente fechado e arejado. Consumir em até 8 dias.',
    featured: true,
    variants: [
      {
        id: 'var-bb-mor-6',
        sku: 'BB-MOR-6UN',
        label: 'Caixa Degustação (6 unidades)',
        unitLabel: 'caixa',
        priceCents: 1900,
        available: true,
        minQty: 1,
        maxQty: 15,
      },
      {
        id: 'var-bb-mor-12',
        sku: 'BB-MOR-12UN',
        label: 'Caixa Família (12 unidades)',
        unitLabel: 'caixa',
        priceCents: 3400,
        available: true,
        minQty: 1,
        maxQty: 10,
      },
      {
        id: 'var-bb-mor-25',
        sku: 'BB-MOR-25UN',
        label: 'Caixa Presenteável (25 unidades)',
        unitLabel: 'caixa artesanal',
        priceCents: 6500,
        available: true,
        minQty: 1,
        maxQty: 8,
      },
      {
        id: 'var-bb-mor-100',
        sku: 'BB-MOR-100UN',
        label: 'Cento para Festas & Eventos (100 un)',
        unitLabel: 'cento',
        priceCents: 23000,
        available: true,
        minQty: 1,
        maxQty: 5,
      },
    ],
  },
  {
    id: 'prod-bb-ameixa',
    slug: 'bala-baiana-ameixa',
    name: 'Bala Baiana de Ameixa (Fruta)',
    flavorType: 'Fruta',
    category: 'Com Frutas Naturais',
    categorySlug: 'frutas',
    badge: 'Com Fruta Natural',
    shortDescription: 'Ameixas pretas selecionadas recheadas com doce de coco cremoso, banhadas em calda de caramelo em ponto de vidro.',
    fullDescription: 'O clássico sofisticado das confeitarias finas. Utilizamos ameixas secas tenras e macias, abertas e generosamente recheadas com nosso doce cremoso de coco com leite condensado. O acabamento com banho de caramelo cria uma película crocante que contrasta perfeitamente com a umidade da fruta.',
    ingredients: 'Ameixa preta sem caroço, leite condensado integral, coco ralado fresco, manteiga e açúcar caramelizado.',
    allergens: 'Contém leite e derivados. Não contém glúten.',
    image: '/images/products/bala-ameixa.jpg',
    imageAlt: 'Bala Baiana de Ameixa com recheio de coco e cobertura caramelizada brilhante',
    prepTime: '24 horas para preparo artesanal',
    storageInfo: 'Conservar em local seco e fresco por até 10 dias.',
    featured: true,
    variants: [
      {
        id: 'var-bb-ame-6',
        sku: 'BB-AME-6UN',
        label: 'Caixa Degustação (6 unidades)',
        unitLabel: 'caixa',
        priceCents: 2000,
        available: true,
        minQty: 1,
        maxQty: 15,
      },
      {
        id: 'var-bb-ame-12',
        sku: 'BB-AME-12UN',
        label: 'Caixa Família (12 unidades)',
        unitLabel: 'caixa',
        priceCents: 3600,
        available: true,
        minQty: 1,
        maxQty: 10,
      },
      {
        id: 'var-bb-ame-25',
        sku: 'BB-AME-25UN',
        label: 'Caixa Presenteável (25 unidades)',
        unitLabel: 'caixa artesanal',
        priceCents: 6800,
        available: true,
        minQty: 1,
        maxQty: 8,
      },
      {
        id: 'var-bb-ame-100',
        sku: 'BB-AME-100UN',
        label: 'Cento para Festas & Eventos (100 un)',
        unitLabel: 'cento',
        priceCents: 24000,
        available: true,
        minQty: 1,
        maxQty: 5,
      },
    ],
  },
  {
    id: 'prod-bb-goiabada',
    slug: 'bala-baiana-goiabada',
    name: 'Bala Baiana de Goiabada (Fruta)',
    flavorType: 'Fruta',
    category: 'Com Frutas Naturais',
    categorySlug: 'frutas',
    badge: 'Com Fruta Natural',
    shortDescription: 'A união perfeita da goiabada cascão cremosa com o doce de coco, selada na casquinha de caramelo dourado e estaladiço.',
    fullDescription: 'Inspirada nas melhores tradições doces brasileiras. O pedaço generoso de goiabada cascão artesanal é envolvido pela massa suave de coco e leite condensado e banhado na calda crocante. O resultado une a acidez aveludada da goiaba com o estalo do caramelo.',
    ingredients: 'Goiabada cascão tradicional, leite condensado, coco ralado, manteiga e calda de açúcar caramelizado.',
    allergens: 'Contém leite e derivados. Não contém glúten.',
    image: '/images/products/bala-goiabada.jpg',
    imageAlt: 'Bala Baiana de Goiabada Cascão envolta em caramelo dourado brilhante',
    prepTime: 'Preparo diário fresco',
    storageInfo: 'Guardar em temperatura ambiente arejada por até 10 dias.',
    featured: true,
    variants: [
      {
        id: 'var-bb-goi-6',
        sku: 'BB-GOI-6UN',
        label: 'Caixa Degustação (6 unidades)',
        unitLabel: 'caixa',
        priceCents: 2000,
        available: true,
        minQty: 1,
        maxQty: 15,
      },
      {
        id: 'var-bb-goi-12',
        sku: 'BB-GOI-12UN',
        label: 'Caixa Família (12 unidades)',
        unitLabel: 'caixa',
        priceCents: 3600,
        available: true,
        minQty: 1,
        maxQty: 10,
      },
      {
        id: 'var-bb-goi-25',
        sku: 'BB-GOI-25UN',
        label: 'Caixa Presenteável (25 unidades)',
        unitLabel: 'caixa artesanal',
        priceCents: 6800,
        available: true,
        minQty: 1,
        maxQty: 8,
      },
      {
        id: 'var-bb-goi-100',
        sku: 'BB-GOI-100UN',
        label: 'Cento para Festas & Eventos (100 un)',
        unitLabel: 'cento',
        priceCents: 24000,
        available: true,
        minQty: 1,
        maxQty: 5,
      },
    ],
  },
  {
    id: 'prod-doce-de-leite',
    slug: 'doce-de-leite-artesanal',
    name: 'Doce de Leite Artesanal da Angel',
    flavorType: 'Especial',
    category: 'Doce de Leite',
    categorySlug: 'doce-de-leite',
    badge: 'Receita de Família',
    shortDescription: 'Doce de leite apurado lentamente no tacho em cubos macios cortados à mão e na versão caramelizada que derrete na boca.',
    fullDescription: 'Elaborado sem amidos, espessantes ou conservantes industriais. O leite pasteurizado e o açúcar cristal cozinham lentamente por horas até adquirirem textura macia, consistência sedosa e cor caramelo dourada. Cortado em tabletes ou disponível em porções caramelizadas.',
    ingredients: 'Leite integral fresco, açúcar cristal, leite condensado e bicarbonato de sódio para equilíbrio de acidez.',
    allergens: 'Contém leite e derivados. Não contém glúten.',
    image: '/images/products/pe-de-moca.jpg',
    imageAlt: 'Tabletes artesanais de doce de leite macio cortados à mão sobre papel manteiga',
    prepTime: 'Disponível em lote semanal fresco',
    storageInfo: 'Guardar em pote fechado ou na própria embalagem por até 20 dias.',
    featured: true,
    variants: [
      {
        id: 'var-dl-cubos-6',
        sku: 'DL-CUB-6UN',
        label: 'Porção com 6 unidades (180g)',
        unitLabel: 'porção',
        priceCents: 1800,
        available: true,
        minQty: 1,
        maxQty: 15,
      },
      {
        id: 'var-dl-cubos-12',
        sku: 'DL-CUB-12UN',
        label: 'Caixa com 12 unidades (360g)',
        unitLabel: 'caixa',
        priceCents: 3200,
        available: true,
        minQty: 1,
        maxQty: 10,
      },
      {
        id: 'var-dl-cento',
        sku: 'DL-CENTO',
        label: 'Cento para Mesas de Doces (100 un)',
        unitLabel: 'cento',
        priceCents: 20000,
        available: true,
        minQty: 1,
        maxQty: 5,
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
