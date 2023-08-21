export default function AlbumGrid ({ html }) {
  return html`
    <style>
      ol {
        grid-template-columns: repeat(auto-fit, minmax(max(20%, 150px), 1fr));
      }
    </style>
    <ol class='grid gap0 gap2-lg list-none'>
      <slot></slot>
    </ol>
  `
}
