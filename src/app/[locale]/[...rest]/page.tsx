import { notFound } from 'next/navigation';

// Any unknown path inside a language (e.g. /nl/does-not-exist) shows the localized 404 page.
export default function CatchAll() {
  notFound();
}
