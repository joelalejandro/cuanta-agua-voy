import App from "./engine/app.js";

const app = new App({
  components: ["cav-page"],
});

app.onReady(() => {});
app.initialize();
