export default function AlbumItem ({ html, state }) {
  const { attrs } = state
  const { id, cover, title, artist, year } = attrs

  return html`
    <style>
      figure,
      img {
        border-radius: 0.25em;
      }

      img {
        aspect-ratio: 1 / 1;
      }

      figure {
        box-shadow: 0 2px 3px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.2);
        transition: scale 0.3s var(--easeOutQuint);
      }

      p {
        color: var(--muted);
      }

      a:hover figure {
        scale: 0.9375;
      }

      a:focus-visible {
        outline-offset: 0.25em;
      }
    </style>
    <a href='/album/${id}'>
      <article>
        <figure class='relative mbe-2'>
          <img src='${cover}' alt='' class='object-cover' />
        </figure>
        <h3 class='text-1 font-medium'>${title}</h3>
        <p class='text-1'>${artist}</p>
      </article>
    </a>
  `
}
