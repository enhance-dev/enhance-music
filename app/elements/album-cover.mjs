export default function AlbumCover ({ html, state }) {
  const { attrs } = state
  const { cover } = attrs

  return html`
    <style>
      :host {
        display: block;
        transition: scale 0.3s var(--easeOutQuint);
      }

      figure,
      img {
        border-radius: 0.25em;
      }

      figure {
        box-shadow: 0 2px 3px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.2);
      }

      img {
        aspect-ratio: 1 / 1;
      }
    </style>
    <figure class='relative mbe-2'>
      <img src='${cover}' alt='' class='object-cover' />
    </figure>
  `
}
