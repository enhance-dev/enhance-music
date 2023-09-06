export default function AlbumItem ({ html, state }) {
  const { attrs } = state
  const { id, cover, title, artist } = attrs

  return html`
    <style>
      p {
        color: var(--muted);
      }

      a:hover album-cover {
        scale: 1.05;
      }

      a:focus-visible {
        outline-offset: 0.25em;
      }
    </style>
    <a href='/album/${id}'>
      <article>
        <album-cover cover='${cover}'></album-cover>
        <h3 class='text-1 font-medium'>${title}</h3>
        <p class='text-1'>${artist}</p>
      </article>
    </a>
  `
}
