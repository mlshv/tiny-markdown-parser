import { describe, expect, it } from 'vitest'

import * as md from './index';

describe('md.parse()', () => {
  describe('inline formatting', () => {
    it('parses italics with *', () => {
      expect(md.inline('I *like* markdown')).toEqual(
        'I <em>like</em> markdown'
      );
    });

    it('parses italics with _', () => {
      expect(md.inline('I _like_ markdown')).toEqual(
        'I <em>like</em> markdown'
      );
    });

    it('parses bold with **', () => {
      expect(md.inline('I **like** markdown')).toEqual(
        'I <strong>like</strong> markdown'
      );
    });

    it('parses bold with __', () => {
      expect(md.inline('I __like__ markdown')).toEqual(
        'I <strong>like</strong> markdown'
      );
    });

    it('parses bold italics with ***', () => {
      expect(md.inline('I ***like*** markdown')).toEqual(
        'I <em><strong>like</strong></em> markdown'
      );
    });

    it('parses bold italics with ___', () => {
      expect(md.inline('I ___like___ markdown')).toEqual(
        'I <em><strong>like</strong></em> markdown'
      );
    });

    it('parses underline with ~', () => {
      expect(md.inline('I ~like~ markdown')).toEqual('I <u>like</u> markdown');
    });

    it('parses strike through with ~~', () => {
      expect(md.inline('I ~~like~~ markdown')).toEqual(
        'I <s>like</s> markdown'
      );
    });

    it('parses deletions with ~~~', () => {
      expect(md.inline('I ~~~like~~~ markdown')).toEqual(
        'I <del>like</del> markdown'
      );
    });

    it('should handle after line break "  \\n"', () => {
      expect(md.inline('I like  \nmarkdown')).toEqual('I like<br>markdown');
    });

    it('should handle pre line break "\\n  "', () => {
      expect(md.inline('I like\n  markdown')).toEqual('I like<br>markdown');
    });
  });

  describe('titles', () => {
    it('parses H1 titles', () => {
      expect(md.parse('# I like markdown')).toEqual('<h1>I like markdown</h1>');
    });

    it('parses H2 titles', () => {
      expect(md.parse('## I like markdown')).toEqual(
        '<h2>I like markdown</h2>'
      );
    });

    it('parses H3 titles', () => {
      expect(md.parse('### I like markdown')).toEqual(
        '<h3>I like markdown</h3>'
      );
    });

    it('parses H4 titles', () => {
      expect(md.parse('#### I like markdown')).toEqual(
        '<h4>I like markdown</h4>'
      );
    });

    it('parses H5 titles', () => {
      expect(md.parse('##### I like markdown')).toEqual(
        '<h5>I like markdown</h5>'
      );
    });

    it('parses H6 titles', () => {
      expect(md.parse('###### I like markdown')).toEqual(
        '<h6>I like markdown</h6>'
      );
    });
  });

  describe('code & links & images', () => {
    it('parses inline code blocks with `', () => {
      expect(md.inlineBlock('I `like` markdown')).toEqual(
        'I <code>like</code> markdown'
      );
    });

    it('parses links', () => {
      expect(
        md.inlineBlock(
          '[markdown](https://de.wikipedia.org/wiki/Markdown And a Title)'
        )
      ).toEqual(
        '<a href="https://de.wikipedia.org/wiki/Markdown" title=" And a Title">markdown</a>'
      );
    });

    it('parses inline code blocks with `', () => {
      expect(md.inlineBlock('I `like` markdown')).toEqual(
        'I <code>like</code> markdown'
      );
    });

    it('auto format links', () => {
      expect(
        md.inlineBlock('https://en.wikipedia.org/wiki/Open_Financial_Exchange')
      ).toEqual(
        '<a href="https://en.wikipedia.org/wiki/Open_Financial_Exchange">https://en.wikipedia.org/wiki/Open_Financial_Exchange</a>'
      );
    });

    it("don't inline link content", () => {
      expect(
        md.inlineBlock(
          '[https://en.wikipedia.org/wiki/Open_Financial_Exchange](https://en.wikipedia.org/wiki/Open_Financial_Exchange)'
        )
      ).toEqual(
        '<a href="https://en.wikipedia.org/wiki/Open_Financial_Exchange">https://en.wikipedia.org/wiki/Open_Financial_Exchange</a>'
      );
    });

    it('parses anchor links', () => {
      expect(md.inlineBlock('[Example](#example)')).toEqual(
        '<a href="#example">Example</a>'
      );
    });

    it('parses images', () => {
      expect(md.inlineBlock('![title](foo.png)')).toEqual(
        '<img src="foo.png" alt="title"></img>'
      );
      expect(md.inlineBlock('![](foo.png)')).toEqual(
        '<img src="foo.png"></img>'
      );
    });

    it('parses images within links', () => {
      expect(md.inlineBlock('[![](toc.png)](#toc)')).toEqual(
        '<a href="#toc"><img src="toc.png"></img></a>'
      );
      expect(md.inlineBlock('[![a](a.png)](#a) [![b](b.png)](#b)')).toEqual(
        '<a href="#a"><img src="a.png" alt="a"></img></a> <a href="#b"><img src="b.png" alt="b"></img></a>'
      );
    });
  });

  describe('horizontal rule', () => {
    it('parses horizontal rule with ---', () => {
      expect(md.parse('---')).toEqual('<hr>');
    });

    it('parses horizontal rule with -------------', () => {
      expect(md.parse('-------------')).toEqual('<hr>');
    });

    it('parses horizontal rule with ===', () => {
      expect(md.parse('===')).toEqual('<hr>');
    });

    it('parses horizontal rule with ===', () => {
      expect(md.parse('===')).toEqual('<hr>');
    });
  });

  describe('lists', () => {
    it('parses an unordered list with -', () => {
      expect(md.parse('- One\n- Two')).toEqual(
        '<ul><li>One</li><li>Two</li></ul>'
      );
    });

    it('parses an unordered list with +', () => {
      expect(md.parse('+ One\n+ Two')).toEqual(
        '<ul><li>One</li><li>Two</li></ul>'
      );
    });

    it('parses an ordered list', () => {
      expect(md.parse('1. Ordered\n2. Lists\n4. Numbers are ignored')).toEqual(
        '<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
      );
    });

    it('parses a list with contained inlineBlock', () => {
      expect(md.parse('+ One\n+ Two  \n  **strong**[link](link)')).toEqual(
        '<ul><li>One</li><li>Two<br><strong>strong</strong><a href="link">link</a></li></ul>'
      );
    });

    it('parses a recursive list', () => {
      expect(
        md.parse('+ One\n+ Two\n  1. Twenty One\n  2. Twenty Two\n- Three')
      ).toEqual(
        '<ul><li>One</li><li>Two\n<ol><li>Twenty One</li><li>Twenty Two</li></ol></li><li>Three</li></ul>'
      );
    });
  });

  describe('tables', () => {
    it('parses basic', () => {
      expect(md.parse('|a|b|\n|---|---|\n|1|2|')).toEqual(
        '<table><tr><th>a</th><th>b</th></tr>\n<tr><td>1</td><td>2</td></tr></table>'
      );
    });
    it('parses basic without header', () => {
      expect(md.parse('|a|b|\n|1|2|')).toEqual(
        '<table><tr><td>a</td><td>b</td></tr>\n<tr><td>1</td><td>2</td></tr></table>'
      );
    });
    it('parses empty cells', () => {
      expect(md.parse('|a|b|\n|---|---|\n|||')).toEqual(
        '<table><tr><th>a</th><th>b</th></tr>\n<tr><td></td><td></td></tr></table>'
      );
    });
    it('parses empty header cells', () => {
      expect(md.parse('|a||c|\n|---|---|\n|a|b|c|')).toEqual(
        '<table><tr><th>a</th><th></th><th>c</th></tr>\n<tr><td>a</td><td>b</td><td>c</td></tr></table>'
      );
    });
    it('parses empty without header', () => {
      expect(md.parse('|||c|\n|1|2|')).toEqual(
        '<table><tr><td></td><td></td><td>c</td></tr>\n<tr><td>1</td><td>2</td></tr></table>'
      );
    });
  });

  describe('code block', () => {
    it('parses basic', () => {
      expect(md.parse('```\nnpm run dev\n```')).toEqual(
        '<pre><code>npm run dev\n</code></pre>'
      );
    });

    it('parses specific language', () => {
      expect(
        md.parse("```javascript\nconsole.log('Hello World!');\n```")
      ).toEqual(
        '<pre><code class="language-javascript">console.log(\'Hello World!\');\n</code></pre>'
      );
    });
  });
});
