# Text Case Converter

A RemNote plugin that cycles selected text through three case styles with a single shortcut — just like **Shift+F3** in Microsoft Word.

![Text Case Converter demo](https://github.com/hugomarins/remnote-text-case-converter/blob/main/public/text-case-converter.gif)

---

## How it works / Como funciona

Press **Shift+F3** with text selected to cycle through:

| Step | Style | Example |
|------|-------|---------|
| 1st press | **Title Case** | *Cyclone in Tropical Latitudes* |
| 2nd press | **UPPERCASE** | *CYCLONE IN TROPICAL LATITUDES* |
| 3rd press | **lowercase** | *cyclone in tropical latitudes* |

The plugin **auto-detects** the current case of the selection and always advances to the next stage, so you never have to think about where you are in the cycle.

---

## English Title Case rules / Regras do English Title Case

Title Case follows **Chicago/APA style**:

- **Always capitalised / Sempre maiúsculas:**
  - The first and last word of the selection.
  - All nouns, verbs, adjectives and adverbs.

- **Kept lowercase / Mantidas em minúsculas** (unless first or last word):
  - **Articles / Artigos:** *a, an, the* · *o, a, os, as, um, uma…*
  - **Prepositions / Preposições:** *at, by, in, of, on, to, up, as, via* · *de, em, por, para, com, sem, sob, sobre…*
  - **Conjunctions / Conjunções:** *and, or, nor, but, for, yet, so* · *e, ou, mas, nem, que, se, como, pois, logo…*
  - **Portuguese contractions / Contrações portuguesas:** *do, da, dos, das, no, na, nos, nas, ao, aos, pelo, pela, pelos, pelas…*

### Examples / Exemplos

> `cyclone in tropical or subtropical latitudes`
> → **Cyclone in Tropical or Subtropical Latitudes**

> `princípios das radiocomunicações marítimas`
> → **Princípios das Radiocomunicações Marítimas**

---

## Other features / Outras funcionalidades

- **Formatting preserved / Formatação preservada:** bold, italic, highlight and all other rich-text styles are kept intact through every transformation.
- **Cross-element word boundaries / Palavras com formatação mista:** words split across formatting runs (e.g. a bold first letter) are handled correctly — only the true first letter of each word is capitalised.
