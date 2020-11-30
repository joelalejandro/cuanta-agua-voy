import Component from "../../js/engine/component.js";

export default class CavPage extends Component {
  static services = ["water-service"];

  bindUIElements() {
    this.ui.progress = this.shadowRoot.querySelector("progress");
    this.ui.progress.max = this.waterService.ultimateGoal.targetAmount;
  }

  bindUIEvents() {
    this.waterService.onWaterDrank(() => this.updateProgress());
  }

  updateProgress() {
    this.ui.progress.value = this.waterService.waterDrank;
  }

  onRender() {
    this.updateProgress();
  }
}
