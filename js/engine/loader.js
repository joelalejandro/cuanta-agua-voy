import ComponentRegistry from "./registry.js";

const loadComponents = async (componentsList) => {
  const components = new ComponentRegistry();
  await Promise.all(componentsList.map((component) => components.load(component)));
};

export default loadComponents;
