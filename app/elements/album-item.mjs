export default function AlbumItem ({ html, state }) {
  const { attrs } = state
  const { id, cover, title, artist } = attrs

  return html`
    <style>
      a:hover album-cover {
        scale: 1.05;
      }

      a:active album-cover {
        scale: 0.9375;
      }

      a:focus-visible {
        outline-offset: 0.25em;
      }
    </style>
    <a href='/album/${id}'>
      <article>
        <album-cover cover='${cover}' id='${id}'></album-cover>
        <h3 class='text-1 font-medium'>${title}</h3>
        <p class='text-1 muted'>${artist}</p>
      </article>
    </a>
  `
}
