/**
 * Creates an HTML tag with the given tag name, children, and attributes.
 * @param {string} tagName - The name of the HTML tag to create.
 * @param {string} children - The children of the HTML tag.
 * @param {Object} [attributes={}] - The attributes of the HTML tag.
 * @returns {string} The HTML tag as a string.
 */
const tag = (tagName, children, attributes = {}) =>
  `<${tagName}${Object.entries(attributes)
    .map(([k, v]) => (v ? ` ${k}="${encode(v)}"` : ''))
    .join('')}>${children}</${tagName}>`;

/**
 * Removes the common leading whitespace from each line of a string.
 * @param {string} [text=""] - The string to outdent.
 * @returns {string} The outdented string.
 */
const outdent = (text = '') => {
  return text.replace(
    new RegExp('^' + (text.match(/^\s+/) || '')[0], 'gm'),
    ''
  );
};

/**
 * Encodes double quotes and HTML tags to entities.
 * @param {string} [text=""] - The string to encode.
 * @returns {string} The encoded string.
 */
const encode = (text = '') =>
  text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const markdownListRegex = /(?:(^|\n)([+-]|\d+\.) +(.*(\n[ \t]+.*)*))+/g;

/**
 * Converts a string with markdown-style lists to an HTML unordered or ordered list.
 * @param {string} text - The string to convert to a list.
 * @returns {string} The HTML unordered or ordered list as a string.
 */
const list = (text) => {
  const tagName = text.match(/^[+-]/m) ? 'ul' : 'ol';

  return text
    ? tag(
        tagName,
        text.replace(/(?:[+-]|\d+\.) +(.*)\n?(([ \t].*\n?)*)/g, (match, a, b) =>
          tag(
            'li',
            inlineBlock(`${a}\n${outdent(b).replace(markdownListRegex, list)}`)
          )
        )
      )
    : '';
};

/**
 * Returns a function that creates an HTML tag with the given tag name,
 * using a regular expression to replace the matched text with the tag.
 * @param {string} tagName - The name of the HTML tag to create.
 * @param {RegExp} regex - The regular expression to use for matching the text to replace.
 * @param {string} replacement - The replacement string to use for creating the tag.
 * @param {function} [format=(string) => string] - An optional function to format the
 * matched text before creating the tag.
 * @returns {function} A function that takes a string and returns the HTML tag as a string.
 */
const createTaggedReplacement =
  (tagName, regex, replacement, format = (string) => string) =>
  (match) =>
    tag(tagName, format(match.replace(regex, replacement)));

/**
 * Creates an HTML block element with the given text.
 * @param {string} text - The text to convert to an HTML block element.
 * @returns {string} The HTML block element as a string.
 */
const block = (text) =>
  p(
    text,
    [
      // code block
      /^(```)(.*)\n((.*\n)*?)\1/gm,
      (match, wrapper, language, text) =>
        tag(
          'pre',
          tag(
            'code',
            encode(text),
            language ? { class: `language-${language.trim()}` } : {}
          )
        ),

      // blockquotes
      /(^>.*\n?)+/gm,
      createTaggedReplacement('blockquote', /^> ?(.*)$/gm, '$1', inline),

      // tables
      /((^|\n)\|.+)+/g,
      createTaggedReplacement(
        'table',
        /^.*(\n\|---.*?)?$/gm,
        (match, subline = '') =>
          createTaggedReplacement(
            'tr',
            /\|(-?)([^|]*)\1(\|$)?/gm,
            (match, type, text) =>
              tag(type || subline ? 'th' : 'td', inlineBlock(text))
          )(match.slice(0, match.length - subline.length))
      ),

      // lists
      markdownListRegex,
      list,

      //anchor
      /#\[([^\]]+?)]/g,
      tag('a', '', { name: '$1' }),

      // headlines
      /^(#+) +(.*)(?:$)/gm,
      (match, h, text) => tag('h' + h.length, inlineBlock(text)),

      // horizontal rule
      /^(===+|---+)(?=\s*$)/gm,
      '<hr>',
    ],
    parse
  );

/**
 * Creates an HTML inline element with the given text and options.
 * @param {string} [text=""] - The text to convert to an HTML inline element.
 * @param {boolean} [dontInline=false] - Whether to prevent certain media elements from being inlined.
 * @returns {string} The HTML inline element as a string.
 */
const inlineBlock = (text = '', dontInline) => {
  const temp = [];

  const injectInlineBlock = (text) =>
    text.replace(/\\(\d+)/g, (match, code) =>
      injectInlineBlock(temp[parseInt(code) - 1])
    );

  text = text
    .trim()
    // inline code block
    .replace(
      /`([^`]*)`/g,
      (match, text) => '\\' + temp.push(tag('code', encode(text)))
    )
    // inline media (a / img)
    .replace(
      /[!]?\[([!]?\[.*?\)|[^\]]*?)]\((.*?)( .*?)?\)|(\w+:\/\/[$\-.+!*'()\/,\w]+)/g,
      (match, text, href, title, link) => {
        if (link) {
          return dontInline
            ? match
            : '\\' + temp.push(tag('a', link, { href: link }));
        }

        return (
          '\\' +
          temp.push(
            match[0] == '!'
              ? tag('img', '', { src: href, alt: text, title })
              : tag('a', inlineBlock(text, 1), { href, title })
          )
        );
      }
    );

  return injectInlineBlock(dontInline ? text : inline(text));
};

/**
 * Creates an HTML inline element with the given text.
 * @param {string} text - The text to convert to an HTML inline element.
 * @returns {string} The HTML inline element as a string.
 */
const inline = (text) =>
  p(
    text,
    [
      // bold, italic, bold & italic
      /([*_]{1,3})((.|\n)+?)\1/g,
      (match, k, text) => {
        k = k.length;
        text = inline(text);
        if (k > 1) text = tag('strong', text);
        if (k % 2) text = tag('em', text);
        return text;
      },

      // strike through
      /(~{1,3})((.|\n)+?)\1/g,
      (match, k, text) => tag([, 'u', 's', 'del'][k.length], inline(text)),

      // replace remaining newlines with a <br>
      /  \n|\n  /g,
      '<br>',
    ],
    inline
  );

/**
 * Parses a string of text and converts it to HTML.
 * @param {string} text - The text to convert to HTML.
 * @param {Array} rules - An array of rules to apply to the text.
 * @param {function} parse - A function to use for parsing the text.
 * @returns {string} The HTML as a string.
 */
const p = (text, rules, parse) => {
  for (let i = 0; i < rules.length; i += 2) {
    const match = rules[i].exec(text);

    if (match) {
      const [matched, ...rest] = match;

      return (
        parse(text.slice(0, match.index)) +
        (typeof rules[i + 1] === 'string'
          ? rules[i + 1].replace(/\$(\d)/g, (_, d) => rest[d - 1])
          : rules[i + 1].apply(null, match)) +
        parse(text.slice(match.index + matched.length))
      );
    }
  }

  return text;
};

/**
 * Parses a string of text and converts it to HTML.
 * @param {string} text - The text to convert to HTML.
 * @returns {string} The HTML as a string.
 */
const parse = (text) => {
  const escaped = text
    .replace(/[\r\v\b\f]/g, '')
    .replace(/\\./g, (m) => `&#${m.charCodeAt(1)};`);

  const parsed =
    block(escaped) === escaped && !escaped.match(/^[\s\n]*$/i)
      ? inlineBlock(escaped).replace(/((.|\n)+?)(\n\n+|$)/g, (m, text) =>
          tag('p', text)
        )
      : block(escaped);

  return parsed.replace(/&#(\d+);/g, (m, code) => String.fromCharCode(+code));
};

export { inline, inlineBlock, parse };
