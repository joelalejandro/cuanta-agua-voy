import App from "./engine/app.js";

const app = new App({
  components: ["cav-page", "cav-progress", "cav-button"],
  services: ["water-service"],
});

app.onReady(() => {
  console.log("Ready to roll");
});

app.initialize();
