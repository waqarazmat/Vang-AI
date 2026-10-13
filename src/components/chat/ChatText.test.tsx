import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChatText, parseBlocks } from './ChatText';

describe('parseBlocks', () => {
  it('groups paragraphs, bullet lists and numbered lists', () => {
    expect(parseBlocks('Hello\n\n- one\n- two\n1. first\n2. second\nBye')).toEqual([
      { kind: 'p', text: 'Hello' },
      { kind: 'ul', items: ['one', 'two'] },
      { kind: 'ol', items: ['first', 'second'] },
      { kind: 'p', text: 'Bye' },
    ]);
  });

  it('drops heading marks', () => {
    expect(parseBlocks('## Prices')).toEqual([{ kind: 'p', text: 'Prices' }]);
  });
});

describe('ChatText', () => {
  it('renders bold, italic and links as elements', () => {
    const html = renderToStaticMarkup(
      <ChatText text="From **€50** a *month*, see https://vangai.be/en/pricing." linkClass="l" />,
    );
    expect(html).toContain('<strong>€50</strong>');
    expect(html).toContain('<em>month</em>');
    expect(html).toContain(
      '<a href="https://vangai.be/en/pricing" target="_blank" rel="noopener noreferrer" class="l">',
    );
    expect(html).toContain('</a>.');
  });

  it('never injects HTML from a reply', () => {
    const html = renderToStaticMarkup(<ChatText text={'<img src=x onerror="alert(1)"> hi'} linkClass="l" />);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
