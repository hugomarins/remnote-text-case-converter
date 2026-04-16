import {
  declareIndexPlugin,
  ReactRNPlugin,
  RICH_TEXT_ELEMENT_TYPE,
} from '@remnote/plugin-sdk';

function transformCase(richText: any[], fn: (s: string) => string): any[] {
  return richText.map((element) => {
    if (typeof element === 'string') return fn(element);
    if (element?.i === RICH_TEXT_ELEMENT_TYPE.TEXT && typeof element.text === 'string') {
      return { ...element, text: fn(element.text) };
    }
    return element;
  });
}

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerCommand({
    id: 'text-toggle-case',
    name: 'Toggle Text Case',
    keyboardShortcut: 'ctrl+shift+u',
    action: async () => {
      const selection = await plugin.editor.getSelectedText();
      if (!selection?.richText?.length) {
        await plugin.app.toast('No text selected.');
        return;
      }
      const fullText = selection.richText
        .map((e: any) => (typeof e === 'string' ? e : e?.text ?? ''))
        .join('');
      const upper = (fullText.match(/[A-Z]/g) || []).length;
      const lower = (fullText.match(/[a-z]/g) || []).length;
      const fn = upper >= lower
        ? (s: string) => s.toLowerCase()
        : (s: string) => s.toUpperCase();
      const transformed = transformCase(selection.richText, fn);
      const length = fullText.length;
      await plugin.editor.delete();
      await plugin.editor.insertRichText(transformed);
      await plugin.editor.selectText({
        start: selection.range.start,
        end: selection.range.start + length,
      });
    },
  });
}

async function onDeactivate(_plugin: ReactRNPlugin) { }

declareIndexPlugin(onActivate, onDeactivate);