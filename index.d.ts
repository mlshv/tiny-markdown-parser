/**
 * Creates an HTML inline element with the given text.
 * @param {string} text - The text to convert to an HTML inline element.
 * @returns {string} The HTML inline element as a string.
 */
export function inline(text: string): string;
/**
 * Creates an HTML inline element with the given text and options.
 * @param {string} [text=""] - The text to convert to an HTML inline element.
 * @param {boolean} [dontInline=false] - Whether to prevent certain media elements from being inlined.
 * @returns {string} The HTML inline element as a string.
 */
export function inlineBlock(text?: string, dontInline?: boolean): string;
/**
 * Parses a string of text and converts it to HTML.
 * @param {string} text - The text to convert to HTML.
 * @returns {string} The HTML as a string.
 */
export function parse(text: string): string;
