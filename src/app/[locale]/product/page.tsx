import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { VoiceDemo } from '@/components/demos/VoiceDemo';
import { WhatsAppDemo } from '@/components/demos/WhatsAppDemo';
import { WebChatDemo } from '@/components/demos/WebChatDemo';
import { CtaBand } from '@/components/sections/CtaBand';
import { JsonLd, faqLd } from '@/components/seo/JsonLd';
import {
  ChatSideCard,
  DoneForYou,
  ProductFaq,
  ProductOverview,
  ProductSection,
  WhatsAppSideCard,
} from '@/components/sections/product/ProductSections';
import { VoiceSideCard } from '@/components/sections/product/VoiceSideCard';
import '@/components/sections/product/product.css';

export async function generateMetadata({ params }: PageProps<'/[locale]/product'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/product', 'product');
}

export default async function ProductPage({ params }: PageProps<'/[locale]/product'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'product.cta' });
  const f = await getTranslations({ locale, namespace: 'product.faq' });
  const faq = (['voice', 'whatsapp', 'chat'] as const).flatMap((g) => f.raw(g) as { q: string; a: string }[]);
  return (
    <main>
      <JsonLd data={faqLd(faq)} />
      <ProductOverview />
      <ProductSection channel="voice" side={<VoiceSideCard />} demo={<VoiceDemo />} />
      <ProductSection channel="whatsapp" side={<WhatsAppSideCard />} demo={<WhatsAppDemo />} bordered />
      <ProductSection channel="chat" side={<ChatSideCard />} demo={<WebChatDemo />} bordered />
      <DoneForYou />
      <ProductFaq />
      <CtaBand title={t('title')} text={t('text')} cta={t('button')} tone="coral" />
    </main>
  );
}
