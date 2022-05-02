export function pushMessage(req, msg) {
  if (!req.session.messages) {
    req.session.messages = [];
  }
  req.session.messages.push(msg);
}
