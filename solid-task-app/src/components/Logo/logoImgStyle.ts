/** Инлайновые ограничения размера — нужны во встроенном remote: CSS chunk может не попасть на страницу хоста. */
export const logoImgInlineStyle: Record<string, string> = {
  'box-sizing': 'border-box',
  display: 'block',
  height: '6em',
  width: 'auto',
  'max-width': 'min(12rem, 100%)',
  'max-height': '6em',
  padding: '1.5em',
  'object-fit': 'contain',
}
