export default function AlbumData ({ html, state }) {
  const { store } = state
  const { album } = store

  return html`
    <style>
      li {
        border-bottom: 1px solid gainsboro;
      }

      li:last-of-type {
        border-bottom: none;
      }

      a {
        grid-template-columns: 4ch 1fr 10ch;
      }

      .numeric {
        font-variant-numeric: tabular-nums;
      }
    </style>
    <article>
      <layout-container>
        <album-cover cover='${album.cover}' class='block mb0'></album-cover>
        <h2 class='text3 font-medium tracking-1 leading1'>${album.title}</h2>
        <p class='muted text1 mbe0'>${album.artist}</p>
        <p class='muted text-1'>${album.label || 'Self released'}, ${album.year}</p>

        <ol class='mb0 list-none flex flex-col'>
          ${album.tracklist.map((track, index) => `<li>
            <a class='pb-4 grid flow-col align-items-baseline'>
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
