import {
  declareIndexPlugin,
  ReactRNPlugin,
  RICH_TEXT_ELEMENT_TYPE,
} from '@remnote/plugin-sdk';

// ─── Helpers ────────────────────────────────────────────────────────────────

function transformCase(richText: any[], fn: (s: string) => string): any[] {
  return richText.map((element) => {
    if (typeof element === 'string') return fn(element);
    if (element?.i === RICH_TEXT_ELEMENT_TYPE.TEXT && typeof element.text === 'string') {
      return { ...element, text: fn(element.text) };
    }
    return element;
  });
}

type CaseState = 'lower' | 'title' | 'upper';

/**
 * Detects the current case state of a string.
 * Cycle order: lower → title → upper → lower (matching Word's Shift+F3)
 */
function detectCase(text: string): CaseState {
  const letters = text.match(/[a-zA-Z]/g);
  if (!letters || letters.length === 0) return 'lower';

  const allUpper = letters.every((c) => c === c.toUpperCase());
  if (allUpper) return 'upper';

  const allLower = letters.every((c) => c === c.toLowerCase());
  if (allLower) return 'lower';

  // Check title case: first letter of each word is uppercase, the rest lowercase
  const isTitle = text
    .split(/(\s+)/)
    .filter((w) => w.trim().length > 0)
    .every((word) => {
      const wordLetters = word.match(/[a-zA-Z]/g);
      if (!wordLetters) return true;
      return (
        wordLetters[0] === wordLetters[0].toUpperCase() &&
        wordLetters.slice(1).every((c) => c === c.toLowerCase())
      );
    });

  return isTitle ? 'title' : 'lower';
}

/** Next stage in the cycle: lower → title → upper → lower */
function nextCase(current: CaseState): CaseState {
  if (current === 'lower') return 'title';
  if (current === 'title') return 'upper';
  return 'lower';
}

/**
 * Applies Title Case to a rich text array while tracking word boundaries
 * across element boundaries, so intra-word formatting (e.g. bold first letter)
 * is handled correctly.
 */
function transformTitleCase(richText: any[]): any[] {
  let atWordStart = true;

  return richText.map((element) => {
    const applyToString = (s: string): string => {
      let result = '';
      for (const c of s) {
        if (/\s/.test(c)) {
          result += c;
          atWordStart = true;
        } else if (atWordStart) {
          result += c.toUpperCase();
          atWordStart = false;
        } else {
          result += c.toLowerCase();
        }
      }
      return result;
    };

    if (typeof element === 'string') return applyToString(element);
    if (element?.i === RICH_TEXT_ELEMENT_TYPE.TEXT && typeof element.text === 'string') {
      return { ...element, text: applyToString(element.text) };
    }
    return element;
  });
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerCommand({
    id: 'text-case-converter',
    name: 'Text Case Converter',
    keyboardShortcut: 'shift+F3',
    action: async () => {
      const selection = await plugin.editor.getSelectedText();
      if (!selection?.richText?.length) {
        await plugin.app.toast('No text selected.');
        return;
      }

      const fullText = selection.richText
        .map((e: any) => (typeof e === 'string' ? e : e?.text ?? ''))
        .join('');

      const current = detectCase(fullText);
      const next = nextCase(current);

      const transformed =
        next === 'title'
          ? transformTitleCase(selection.richText)
          : transformCase(
              selection.richText,
              next === 'upper' ? (s) => s.toUpperCase() : (s) => s.toLowerCase()
            );
      await plugin.editor.delete();
      await plugin.editor.insertRichText(transformed);
      await plugin.editor.selectText({
        start: selection.range.start,
        end: selection.range.start + fullText.length,
      });
    },
  });
}

async function onDeactivate(_plugin: ReactRNPlugin) { }

declareIndexPlugin(onActivate, onDeactivate);