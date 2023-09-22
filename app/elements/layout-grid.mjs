export default function LayoutGrid ({ html }) {
  return html`
    <style>
      :host {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-auto-rows: var(--playerHeight);
        block-size: 100vh;
        overflow: hidden;
      }
    </style>
    <slot></slot>
  `
}
