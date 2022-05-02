import app from "./application.js";
import config from "./config.js";

app.listen(config.port, () => {
  console.log(`open http://localhost:${config.port}`);
});
