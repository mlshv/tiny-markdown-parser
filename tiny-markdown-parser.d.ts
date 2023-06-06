interface BlockFunction {
  (text: string): string;
}

type InlineBlockFunction = (text?: string, dontInline?: boolean) => string;
declare const inlineBlock: InlineBlockFunction;

type InlineFunction = (text: string) => string;
declare const inline: InlineFunction;

interface ParseMarkdownFunction {
  (text: string): string;
}
declare const parse: ParseMarkdownFunction;

export { parse, inline, inlineBlock };
