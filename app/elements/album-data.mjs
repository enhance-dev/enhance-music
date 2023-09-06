export default function AlbumData ({ html, state }) {
  const { store } = state
  const { album } = store

  return html`
    <style>
      :host {
        display: block;
        padding-block-end: var(--playerHeight);
      }

      li {
        border-bottom: 1px solid gainsboro;
      }

      li:first-of-type {
        border-top: 1px solid gainsboro;
      }

      a {
        grid-template-columns: 4ch 1fr 10ch;
        transition: color 0.3s var(--easeOutQuint);
      }

      a:hover {
        color: var(--purple);
      }

      a:focus-visible {
        outline-offset: 2px;
      }

      album-cover {
        flex: 1 0 150px;
      }

      header {
        min-inline-size: 66%;
      }
    </style>
    <article>
      <layout-container>
        <div class='meta flex flex-wrap align-items-center gap0 gap2-lg mb2'>
          <album-cover cover='${album.cover}'></album-cover>
          <header>
            <h2 class='text3 font-medium tracking-1 leading1'>${album.title}</h2>
            <p class='muted text1 mbe2'>${album.artist}</p>
            <p class='muted text-1'>${album.label || 'Self released'}, ${album.year}</p>
          </header>
        </div>

        <ol class='mb0 list-none flex flex-col'>
          ${album.tracklist.map((track, index) => `<li>
            <a class='pb-4 grid flow-col align-items-baseline' href='/player/foo' target='player'>
              <span class='muted numeric text-1'>
                ${index + 1}
              </span>
              <span>
                ${track.title}
              </span>
              <span class='muted numeric text-1 text-end'>
                ${track.duration}
              </span>
            </a>
          </li>`).join('')}
        </ol>
      </layout-container>
    </article>
  `
}
