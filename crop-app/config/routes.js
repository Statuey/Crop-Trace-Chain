import home from "../app/routes/home-route.js";
import user from "../app/routes/user-route.js";

export default (app) => {
  app.use("/", home);
  app.use("/dashboard", user);
};
