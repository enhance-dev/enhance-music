export default function LayoutGrid ({ html }) {
  return html`
    <style>
      :host {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100vh;
        position: relative;
      }

      [name="library"] {
        padding-block-end: var(--playerHeight);
      }

      [name="player"] {
        border-block-start: 1px solid gainsboro;
        block-size: var(--playerHeight);
      }
    </style>
    <slot></slot>
  `
}
