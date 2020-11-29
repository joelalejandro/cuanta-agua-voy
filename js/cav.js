import App from "./engine/app.js";
import WaterService from "./services/water-service.js";

const app = new App({
  components: ["cav-page"],
});

app.onReady(() => {
  window.waterLog = new WaterService();
});
app.initialize();
