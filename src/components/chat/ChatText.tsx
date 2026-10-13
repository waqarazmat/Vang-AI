import { Fragment } from 'react';

/**
 * Renders the assistant's light Markdown (paragraphs, **bold**, *italic*, bullet and numbered
 * lists, bare links) as React elements. Nothing is injected as HTML, so a reply can never run
 * markup on the page.
 */

type Block = { kind: 'p'; text: string } | { kind: 'ul' | 'ol'; items: string[] };

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•→]\s+(.+)/);
    const number = line.match(/^\d+[.)]\s+(.+)/);
    const last = blocks[blocks.length - 1];
    if (bullet || number) {
      const kind = bullet ? 'ul' : 'ol';
      const item = (bullet ?? number)![1];
      if (last && last.kind === kind) last.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else if (line) {
      blocks.push({ kind: 'p', text: line.replace(/^#{1,6}\s+/, '') });
    }
  }
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;

export function Inline({ text, linkClass }: { text: string; linkClass: string }) {
  return (
    <>
      {text.split(INLINE).map((part, i) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
        if (/^https?:\/\//.test(part))
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {part}
            </a>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function ChatText({ text, linkClass }: { text: string; linkClass: string }) {
  const blocks = parseBlocks(text);
  return (
    <div className="flex flex-col gap-[6px]">
      {blocks.map((b, i) => {
        if (b.kind === 'p')
          return (
            <p key={i} className="m-0">
              <Inline text={b.text} linkClass={linkClass} />
            </p>
          );
        const List = b.kind;
        return (
          <List
            key={i}
            className={`m-0 flex flex-col gap-[3px] pl-[18px] ${List === 'ol' ? 'list-decimal' : 'list-disc'}`}
          >
            {b.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} linkClass={linkClass} />
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
