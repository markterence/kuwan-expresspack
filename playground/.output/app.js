// app.ts
import { createApp } from "@markterence/kuwan-expresspack";
var app = createApp();
app.get("/", (req, res) => {
  res.send("Hello from playground app!");
});
app.listen(3000, () => {
  console.log("Server is running");
});
