import Component from "../../js/engine/component.js";

export default class CavButton extends Component {
  static services = ["water-service"];
  static attributes = [{ name: "log", type: Number }, { name: "split", type: Boolean }, "splitMessage"];

  bindUIElements() {
    this.ui.button = this.shadowRoot.querySelector("button");
  }

  bindUIEvents() {
    this.ui.button.addEventListener("click", () => this.buttonClicked());
  }

  buttonClicked() {
    if (this.split) {
      const amount = Number(prompt(this.splitMessage));
      this.waterService.logDrink(parseInt(this.log / amount));
    } else {
      this.waterService.logDrink(this.log);
    }
  }
}
