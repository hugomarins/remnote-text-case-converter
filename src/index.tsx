import {
  declareIndexPlugin,
  ReactRNPlugin,
  RICH_TEXT_ELEMENT_TYPE,
} from '@remnote/plugin-sdk';

// ─── Helpers ────────────────────────────────────────────────────────────────

function transformCase(
  richText: any[],
  fn: (s: string) => string
): any[] {
  return richText.map((element) => {
    if (typeof element === 'string') {
      return fn(element);
    }
    if (element?.i === RICH_TEXT_ELEMENT_TYPE.TEXT && typeof element.text === 'string') {
      return { ...element, text: fn(element.text) };
    }
    // Referências, imagens, clozes, etc. — não altera
    return element;
  });
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

async function onActivate(plugin: ReactRNPlugin) {

  // ── Comando 1: CAIXA ALTA (Ctrl+Shift+U) ──────────────────────────────────
  await plugin.app.registerCommand({
    id: 'text-to-uppercase',
    name: 'Converter para CAIXA ALTA',
    description: 'Converte o texto selecionado para CAIXA ALTA',
    keyboardShortcut: 'ctrl+shift+u',
    action: async () => {
      const selection = await plugin.editor.getSelectedText();
      if (!selection?.richText?.length) {
        await plugin.app.toast('Nenhum texto selecionado.');
        return;
      }

      const transformed = transformCase(selection.richText, (s) => s.toUpperCase());
      await plugin.editor.delete();
      await plugin.editor.insertRichText(transformed);
    },
  });

  // ── Comando 2: minúsculas (Ctrl+Shift+L) ──────────────────────────────────
  await plugin.app.registerCommand({
    id: 'text-to-lowercase',
    name: 'Converter para minúsculas',
    description: 'Converte o texto selecionado para minúsculas',
    keyboardShortcut: 'ctrl+shift+l',
    action: async () => {
      const selection = await plugin.editor.getSelectedText();
      if (!selection?.richText?.length) {
        await plugin.app.toast('Nenhum texto selecionado.');
        return;
      }

      const transformed = transformCase(selection.richText, (s) => s.toLowerCase());
      await plugin.editor.delete();
      await plugin.editor.insertRichText(transformed);
    },
  });

  // ── Comando 3: Alternar (Ctrl+Shift+K) — detecta automaticamente ──────────
  await plugin.app.registerCommand({
    id: 'text-toggle-case',
    name: 'Alternar CAIXA ALTA / minúsculas',
    description: 'Alterna automaticamente entre CAIXA ALTA e minúsculas',
    keyboardShortcut: 'ctrl+shift+k',
    action: async () => {
      const selection = await plugin.editor.getSelectedText();
      if (!selection?.richText?.length) {
        await plugin.app.toast('Nenhum texto selecionado.');
        return;
      }

      // Detecta se a maioria já está em maiúsculas
      const fullText = selection.richText
        .map((e) => (typeof e === 'string' ? e : e?.text ?? ''))
        .join('');

      const upperCount = (fullText.match(/[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÚÜÇÑ]/g) || []).length;
      const lowerCount = (fullText.match(/[a-záàâãéèêíïóôõúüçñ]/g) || []).length;
      const isCurrentlyUpper = upperCount >= lowerCount;

      const fn = isCurrentlyUpper
        ? (s: string) => s.toLowerCase()
        : (s: string) => s.toUpperCase();

      const transformed = transformCase(selection.richText, fn);
      await plugin.editor.delete();
      await plugin.editor.insertRichText(transformed);
    },
  });
}

async function onDeactivate(_plugin: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
