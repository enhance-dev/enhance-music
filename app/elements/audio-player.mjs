import arc from '@architect/functions'

export default function AudioPlayer ({ html, state }) {
  const { store } = state
  const { track } = store

  return html`
    <style scope='global'>
      /* Targets iframe's document */
      html,
      body {
        block-size: 100%;
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
        backdrop-filter: blur(3px);
      }

      [aria-pressed='false'] .pause {
        display: none;
      }

      [aria-pressed='true'] .play {
        display: none;
      }

      [name='playback'] {
        aspect-ratio: 1 / 1;
        inline-size: 2em;
        background: var(--purple);
      }

      .play {
        inset-inline-start: 0.05em;
      }

      input {
        accent-color: var(--purple);
      }
    </style>

    <figure
      id='player'
      class='
        align-items-center
        justify-content-center
        gap-2
        mb-2
        p-4
        radius-pill
        absolute
        z1
        m-auto
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
      <span id='currentTime' class='numeric text-2'>00:00</span>
      <input type='range' name='timeline' min='0' max='100' step='1' value='0' />
      <span id='duration' class='numeric text-2'>00:00</span>
      <audio autoplay id='client-audio' src='${arc.static(track)}'></audio>
    </figure>

    <div id='waveform' class='si-100 relative z0 hidden'></div>

    <figure id='systemUi' class='flex justify-content-center align-items-center sb-100'>
      <audio autoplay controls src='${arc.static(track)}'></audio>
    </figure>

    <script type='module'>
      import Wavesurfer from '/_public/browser/wavesurfer.mjs'
      import formatTime from '/_public/browser/formatTime.mjs'

      const colors = {
        cloud: '#f7f0fe',
        cyan: '#71f6ff',
        inky: '#4d7185',
        lily: '#e5ebee',
        magenta: '#e21893',
        paleCyan: '#d3fbff',
        princess: '#f57aff',
        purple: '#ad6ef9',
      }

      const waveCtx = document.createElement('canvas').getContext('2d')
      const waveGradient = waveCtx.createLinearGradient(0, 0, 0, 150)
      waveGradient.addColorStop(0.125, colors.cloud)
      waveGradient.addColorStop(1, colors.lily)

      const progressCtx = document.createElement('canvas').getContext('2d')
      const progressGradient = progressCtx.createLinearGradient(0, 0, 0, 200)
      progressGradient.addColorStop(0.125, colors.princess)
      progressGradient.addColorStop(1, colors.cyan)

      const playerHeight = getComputedStyle(document.body).getPropertyValue('--playerHeight')
      const playerHeightPx = parseInt(playerHeight) * 16

      class AudioPlayer extends HTMLElement {
        constructor() {
          super()

          // Properties
          this.player = document.getElementById('player')
          this.systemUi = document.getElementById('systemUi')
          this.audio = document.getElementById('client-audio')
          this.duration = this.audio.duration
          this.playback = this.querySelector('[name="playback"]')
          this.timeline = this.querySelector('[name="timeline"]')
          this.currentTimeDisplay = document.getElementById('currentTime')
          this.durationDisplay = document.getElementById('duration')
          this.waveform = document.getElementById('waveform')
          this.wavesurfer = null

          // Event listeners
          this.audio.addEventListener('loadedmetadata', this.onMetadata)
          this.playback.addEventListener('click', this.onPlayPause)
          this.audio.addEventListener('pause', this.onPause)
          this.audio.addEventListener('play', this.onPlay)
          this.audio.addEventListener('timeupdate', this.onTimeUpdate)
          this.audio.addEventListener('timeupdate', this.onFirstTimeUpdate, { once: true }) // handles autoplay
          this.audio.addEventListener('ended', this.onEnded)
          this.timeline.addEventListener('input', this.onTimelineInput)
          this.timeline.addEventListener('change', this.onTimelineChange)

        }

        connectedCallback() {
          this.systemUi.remove()
          this.player.classList.replace('hidden', 'inline-flex')
          this.waveform.classList.remove('hidden')

          // Wavesurfer
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
          this.duration = this.audio.duration
          this.timeline.setAttribute('max', this.audio.duration)
          this.durationDisplay.innerText = formatTime(this.duration)
        }

        // Annoyingly, the HTMLMediaElement play event doesn't seem to fire on autoplay, despite being meant to. 
        // So, to account for autoplay, we handle updating the playback button state on the first instace of the timeupdate event.
        // This event listener is attached with options.once, so this will be removed after its first invocation.
        onFirstTimeUpdate = () => {
          !this.audio.paused && this.onPlay()
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
          const { currentTime, paused } = this.audio
          this.timeline.value = currentTime
          this.currentTimeDisplay.innerText = formatTime(currentTime)
          this.wavesurfer.setTime(currentTime)
        }

        onTimelineInput = (e) => {
          // Pausing syncing between audio.currentTime and the timeline;
          // this allows us to update the range input based on user input instead
          this.audio.removeEventListener('timeupdate', this.onTimeUpdate)

          const seekTime = Number(e.target.value)
          this.currentTimeDisplay.innerText = formatTime(seekTime)
          this.wavesurfer.setTime(seekTime)
        }

        onTimelineChange = (e) => {
          const newTime = Number(e.target.value)
          this.timeline.value = newTime
          this.audio.currentTime = newTime

          // Start updating timeline value based on audio.currentTime again
          this.audio.addEventListener('timeupdate', this.onTimeUpdate)
        }

        onEnded = () => {
          this.playback.setAttribute('aria-pressed', false)
        }
      }

      customElements.define('audio-player', AudioPlayer)
    </script>
  `
}
