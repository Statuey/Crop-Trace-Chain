import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { connection } from "../helpers/db-helper.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const db = await connection();
    const [result, _] = await db.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    db.release();
    console.log(result);
    if (!result.length) {
      return done(null, false, { message: "用户不存在" });
    }
    if (result[0].password === password) {
      return done(null, {
        username: username,
        id: result[0].id,
        organization: result[0].organization,
      });
    } else {
      return done(null, false, { message: "用户名或密码错误" });
    }
  })
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {
      id: user.id,
      username: user.username,
      organization: user.organization,
    });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});
