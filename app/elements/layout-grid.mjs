export default function LayoutGrid ({ html }) {
  return html`
    <style>
      :host {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100vh;
        position: relative;
      }

      [name="player"] {
        block-size: var(--playerHeight);
      }
    </style>
    <slot></slot>
  `
}
