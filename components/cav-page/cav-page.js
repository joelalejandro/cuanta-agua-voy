import Component from "../../js/engine/component.js";

export default class CavPage extends Component {
  static services = ["water-service"];

  bindUIElements() {
    this.ui.waterDrankElement = this.shadowRoot.querySelector("#waterDrank");
    this.ui.milestoneElement = this.shadowRoot.querySelector("#goal");
  }

  bindUIEvents() {
    this.waterService.onWaterDrank(() => this.updateLabel());
    this.waterService.onMilestone((milestone) => this.notifyMilestone(milestone));
  }

  updateLabel() {
    this.ui.waterDrankElement.innerHTML = this.waterService.waterDrank;
  }

  notifyMilestone(milestone) {
    const { milestoneElement: element } = this.ui;
    element.style.display = "block";
    element.innerHTML = `¡Felicidades! Has alcanzado los ${milestone.targetAmount} ml.`;
    setTimeout(() => {
      element.style.display = "none";
    }, 5000);
  }

  onRender() {
    this.updateLabel();
  }
}
