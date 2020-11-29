export default class ComponentRegistry {
  async load(componentTagName) {
    const { default: component } = await import(`/components/${componentTagName}/${componentTagName}.js`);

    const templateRequest = await fetch(`/components/${componentTagName}/${componentTagName}.html`);
    const template = await templateRequest.text();

    component.template = template;
    customElements.define(componentTagName, component);
  }
}
