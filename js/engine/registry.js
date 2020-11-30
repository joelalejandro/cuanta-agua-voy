export default class Registry {
  services = {};

  async loadComponent(componentTagName) {
    const { default: component } = await import(`/components/${componentTagName}/${componentTagName}.js`);

    const templateRequest = await fetch(`/components/${componentTagName}/${componentTagName}.html`);
    const template = await templateRequest.text();

    component.template = template;

    if (Array.isArray(component.services)) {
      component.services.forEach((service) => {
        const serviceInstance = this.services[service];
        const serviceClassName = serviceInstance.constructor.name;
        const camelCasedServiceInstanceName = serviceClassName.substr(0, 1).toLowerCase() + serviceClassName.substr(1);
        component.prototype[camelCasedServiceInstanceName] = this.services[service];
      });
    }

    if (Array.isArray(component.attributes)) {
      component.attributes.forEach((attribute) => {
        let attributeName;
        let attributeType;
        if (typeof attribute === "string") {
          attributeName = attribute
            .split("-")
            .map((attr) => attr.substr(0, 1).toUpperCase() + attr.substr(1))
            .join("");
          attributeType = String;
        } else {
          ({ name: attributeName, type: attributeType } = attribute);
        }
        const camelCasedAttributeName = attributeName.substr(0, 1).toLowerCase() + attributeName.substr(1);
        Object.defineProperty(component.prototype, camelCasedAttributeName, {
          get: function () {
            return attributeType(this.getAttribute(attributeName));
          },
          set: function (value) {
            this.setAttribute(attributeName, value);
          },
        });
      });
    }

    customElements.define(componentTagName, component);
  }

  async loadService(serviceName, options = {}) {
    const { default: Service } = await import(`/js/services/${serviceName}.js`);
    this.services[serviceName] = new Service(options);
  }
}
