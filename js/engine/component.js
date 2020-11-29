export default class Component extends HTMLElement {
  constructor() {
    super();
    const { tagName } = this;
    const lowerCasedTagName = tagName.toLowerCase();
    const templateContainer = document.querySelector(`template#${lowerCasedTagName}`);
    const templateContent = templateContainer ? templateContainer.content : null;
    const shadowDom = this.attachShadow({ mode: "open" });

    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = `components/${lowerCasedTagName}/${lowerCasedTagName}.css`;
    shadowDom.appendChild(styles);

    if (templateContent) {
      shadowDom.appendChild(templateContent.cloneNode(true));
    } else if (this.constructor.template) {
      shadowDom.innerHTML += this.constructor.template
        .split("\n")
        .map((line) => line.trim())
        .join("");
    } else {
      shadowDom.innerHTML += "<slot></slot>";
    }

    this.ui = {};
  }

  connectedCallback() {
    if (this.bindUIElements) {
      this.bindUIElements();
    }

    if (this.bindUIEvents) {
      this.bindUIEvents();
    }

    if (this.onRender) {
      this.onRender();
    }
  }
}
