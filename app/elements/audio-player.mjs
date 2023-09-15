import arc from '@architect/functions'

export default function AudioPlayer ({ html, state }) {
  const { store } = state
  const { track, trackTitle, trackArtist, trackCover} = store

  return html`
    <style scope='global'>
      /* Targets iframe's document */
      html,
      body {
        block-size: 100%;
        overflow: hidden;
      }
    </style>

    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-block-start: 1px solid gainsboro;
        position: relative;
        block-size: 100%;
      }

      figure {
        background: hsla(0 0% 100% / 0.5);
        -webkit-backdrop-filter: blur(2px);
        backdrop-filter: blur(2px);
        border-radius: 0.25em;
        grid-template-columns: auto 1fr 3.75em;
      }

      #player {
        box-shadow: 0 0 3px gainsboro;
      }

      [name='playback'] {
        aspect-ratio: 1 / 1;
        inline-size: 2em;
        background: var(--purple);
      }

      [aria-pressed='false'] .pause {
        display: none;
      }

      [aria-pressed='true'] .play {
        display: none;
      }

      /* Offset play icon for optical alignment */
      .play {
        inset-inline-start: 0.05em;
      }

      input {
        accent-color: var(--purple);
        max-inline-size: 100px;
      }
    </style>

    <!-- System audio player fallback -->
    <figure id='systemUi' class='flex justify-content-center align-items-center sb-100'>
      <audio autoplay controls src='${arc.static(track)}'></audio>
    </figure>

    <!-- Progressively enhanced audio player, client only -->
    <figure
      id='player'
      class='
        align-items-center
        justify-content-center
        gap-4
        gap-2-lg
        mb-2
        pis-4
        pis-2-lg
        absolute
        z1
        m-auto
        overflow-hidden
        hidden
    '>
      <button
        name='playback'
        aria-pressed='false'
        aria-label='Toggle playback'
        class='radius-100 flex align-items-center justify-content-center'
      >
        <img src='/_public/icons/play.svg' alt='play' class='play relative' />
        <img src='/_public/icons/pause.svg' alt='pause' class='pause' />
      </button>
      <div>
        <p class='text-2 text-center mbe-4'>
          <span class='block font-medium'>${trackTitle}</span>
          <span class='block muted'>${trackArtist}</span>
        </p>
        <div class='flex align-items-center justify-content-center gap-2'>
          <span id='currentTime' class='numeric text-2'>00:00</span>
          <input type='range' name='timeline' min='0' max='100' step='1' value='0' />
          <span id='duration' class='numeric text-2'>00:00</span>
        </div>
      </div>
      <img src='${trackCover}' alt='' />
    </figure>

    <!-- Waveform UI, client only -->
    <div id='waveform' class='si-100 relative z0 hidden'></div>

    <script type='module'>
      import Wavesurfer from '/_public/browser/wavesurfer.mjs'
      import formatTime from '/_public/browser/format-time.mjs'

      const colors = {
        cloud: '#f7f0fe',
        cyan: '#71f6ff',
        lily: '#e5ebee',
        paleCyan: '#d3fbff',
        princess: '#f57aff',
      }

      // Gradient for initial waveform
      const waveCtx = document.createElement('canvas').getContext('2d')
      const waveGradient = waveCtx.createLinearGradient(0, 0, 0, 200)
      waveGradient.addColorStop(0.125, colors.cloud)
      waveGradient.addColorStop(1, colors.paleCyan)

      // Gradient for progress waveform
      const progressCtx = document.createElement('canvas').getContext('2d')
      const progressGradient = progressCtx.createLinearGradient(0, 0, 0, 200)
      progressGradient.addColorStop(0.125, colors.princess)
      progressGradient.addColorStop(1, colors.cyan)

      const playerHeight = getComputedStyle(document.body).getPropertyValue('--playerHeight')
      const playerHeightPx = parseInt(playerHeight) * 16

      class AudioPlayer extends HTMLElement {
        constructor() {
          super()

          // Instance properties
          this.player = document.getElementById('player')
          this.systemUi = document.getElementById('systemUi')
          this.playback = this.querySelector('[name="playback"]')
          this.timeline = this.querySelector('[name="timeline"]')
          this.currentTimeDisplay = document.getElementById('currentTime')
          this.durationDisplay = document.getElementById('duration')
          this.waveform = document.getElementById('waveform')
          this.wavesurfer = null

          // Create client audio element.
          // We need to create this in JS in order to attach event listeners to the audio element
          // before rendering it; otherwise the events will fire before we can attach the listeners :,)
          this.audio = document.createElement('audio')
          this.audio.src = document.querySelector('#systemUi audio').getAttribute('src')
          this.audio.autoplay = true

          // Event listeners
          this.playback.addEventListener('click', this.onPlayPause)
          this.audio.addEventListener('loadedmetadata', this.onMetadata)
          this.audio.addEventListener('pause', this.onPause)
          this.audio.addEventListener('play', this.onPlay)
          this.audio.addEventListener('timeupdate', this.onTimeUpdate)
          this.audio.addEventListener('ended', this.onEnded)
          this.timeline.addEventListener('input', this.onTimelineInput)
          this.timeline.addEventListener('change', this.onTimelineChange)

          // Remove system UI, append client audio, show client UI
          this.systemUi.remove()
          this.player.appendChild(this.audio)
          this.player.classList.replace('hidden', 'inline-grid')
          this.waveform.classList.remove('hidden')

          // Create waveform
          this.wavesurfer = Wavesurfer.create({
            barRadius: 3,
            barWidth: 3,
            container: '#waveform',
            cursorWidth: 0,
            height: playerHeightPx,
            interact: false,
            progressColor: progressGradient,
            url: this.audio.getAttribute('src'),
            waveColor: waveGradient,
          })
        }

        onMetadata = () => {
          // Set duration
          const { duration } = this.audio
          this.timeline.setAttribute('max', duration)
          this.durationDisplay.innerText = formatTime(duration)
        }

        onPlayPause = () => {
          this.audio.paused ? this.audio.play() : this.audio.pause()
        }

        onPlay = () => {
          this.playback.setAttribute('aria-pressed', true)
        }

        onPause = () => {
          this.playback.setAttribute('aria-pressed', false)
        }

        onTimeUpdate = () => {
          // Sync currentTime to timeline value, time display, and wavesurfer
          const { currentTime, paused } = this.audio
          this.timeline.value = currentTime
          this.currentTimeDisplay.innerText = formatTime(currentTime)
          this.wavesurfer.setTime(currentTime)
        }

        // input.ontimeupdate fires continuously as the range input is dragged/manipulated by the user
        onTimelineInput = (e) => {
          // Pause syncing between audio.currentTime and the timeline value;
          // this allows us to update the range input based on user input instead
          this.audio.removeEventListener('timeupdate', this.onTimeUpdate)

          // Set time display and wavesurfer manually based on input value
          const seekTime = Number(e.target.value)
          this.currentTimeDisplay.innerText = formatTime(seekTime)
          this.wavesurfer.setTime(seekTime)
        }

        // input.onchange fires when the final value is selected by the user (i.e. on drag end)
        onTimelineChange = (e) => {
          const newTime = Number(e.target.value)
          this.timeline.value = newTime
          this.audio.currentTime = newTime

          // Start updating timeline value based on audio.currentTime again
          this.audio.addEventListener('timeupdate', this.onTimeUpdate)
        }

        // Reset the playback button when the audio ends
        onEnded = () => {
          this.playback.setAttribute('aria-pressed', false)
        }
      }

      customElements.define('audio-player', AudioPlayer)
    </script>
  `
}
