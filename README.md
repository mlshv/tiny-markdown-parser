# tiny-markdown-parser
```
  _   _                                   
 | |_(_)_ _ _  _                          
 |  _| | ' | || |                         
  \__|_|_||_\_, |_      _                 
  _ __  __ _|__/| |____| |_____ __ ___ _  
 | '  \/ _` | '_| / / _` / _ \ V  V | ' \ 
 |_|_|_\__,_|_| |_\_\__,_\___/\_/\_/|_||_|
  _ __ __ _ _ _ ______ _ _                
 | '_ / _` | '_(_-/ -_| '_|               
 | .__\__,_|_| /__\___|_|                 
 |_|                                      
```

Tiny ~1.1kB _(minified + gzipped)_ markdown parser with TypeScript typings. It has the same functionality as [1kB snarkdown](https://github.com/developit/snarkdown) but also supports tables.

[demo](https://mlshv.github.io/tiny-markdown-parser)

``` shell
npm install -S tiny-markdown-parser
```

## Usage

``` javascript
import { parse } from 'tiny-markdown-parser';

const result = parse('_this_ is **MARKDOWN**');
```

tiny-markdown-parser exports 3 functions, although you mostly want to use **parse**.

- `parse` turns markdown string into html:

- `inline` replaces only the inline markup. (bold,italic,underline,strike-trough,line-breaks);

- `inlineBlock` transforms only inline code blocks, links and images

## Support

- Headlines: `### Headline`
- Inline:
  - `*italic*, **bold**, ***bold italic***`
  - \``_code_="- something";`\` or direct escaping with \\
  - `~underline~, ~~strike through~~, ~~~deleted~~~`
- Blocks:
  - pre format blocks: surrounded by \`\`\`
  - blockquotes: `> something`
- Anchors: `#[jump-here]`
- Links: `[Label](destination Title)`
  - URL auto linking `https://github.com/mlshv/tiny-markdown-parser`
- Images: `![label](source altText))`
  - linked: `[![label](source altText))](destination Title)`
- Lists:
  - Unordered lists using: `+` and `-`
  - Ordered lists using: `1.`
  - Nested lists
- Tables: `| some | text |`
  - Header row: `|- header -|- row -|` or by a following `|---`

## Special thanks

This project is a fork of [micro-down](https://github.com/commit-intl/micro-down) by [Dustin Hagemeier](https://commit.international/)
