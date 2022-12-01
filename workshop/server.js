const express = require("express");
const PORT = process.env.PORT || 3000;
const templates = require("./templates");

const cookie = require('cookie-parser');
const server = express();

let posts = [{ author: "oli", title: "hello", content: "lorem ipsum etc" }];

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
server.use(express.static("workshop/public"));
server.use(express.urlencoded());
server.use(cookie());
server.get("/", (req, res) => {
    const email = req.cookies.useremail
    const html = templates.home(email);
    res.send(html);
  });

  server.get("/new-post", (req, res) => {
    if (req.cookies.useremail){ 
    const html = templates.newPost();
    res.send(html);
}
else res.status(401).send("<h1>nuh uh</h1>")

  });

  server.get("/posts", (req, res) => {
    const html = templates.allPosts(posts);
    res.send(html);
  });
  server.post("/new-post", (req, res) => {
    
        const newPost = req.body;
        posts.push(newPost);
        res.redirect("/posts");
    
  });
  server.get("/posts/:title", (req, res) => {
    const post = posts.find((p) => p.title === req.params.title);
    const html = templates.post(post);
    res.send(html);
  });
  server.get("/delete-post/:delpost" ,(req, res) => {
    posts= posts.filter(x=>x.title!=req.params.delpost)

    res.redirect("/posts");
  });

  server.get("/log-in", (req, res) => {
    const html = templates.logIn();
    res.send(html);
  });

  server.post("/log-in", (req, res) => {
      const email = req.body.email;
      res.cookie("useremail",email,{ maxAge: 600000 })
    console.log("email");
    res.redirect("/");

});

server.get("/log-out", (req, res) => {
    res.clearCookie("useremail");
    res.redirect("/");
  });
