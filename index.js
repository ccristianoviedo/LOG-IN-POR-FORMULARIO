const express= require("express")
const app = express();
const session = require("express-session");
const mongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
  store: new mongoStore({
    mongoUrl:"mongodb://localhost/sessiones",
  }),
  secret:"coder",
  resave: false,
  saveUninitialized: false,
  cookie :{
    originalMaxAge:600000,
   }    
}));

const auth = (req, res, next)=> {
  if(req.session.user && req.session.pass) {
    return next()
  }
  res.redirect("http://localhost:8080")
}
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialDir: __dirname + "views/partials",
  })
);
app.set("view engine", "hbs"); // registra el motor de plantillas
app.set("views", "./views"); // especifica el directorio de vistas

const datos=[]

//GET

app.get("/in", auth, function (req, res) {
  res.render("main",{
    datos,
    user: req.session.user,
    pass: req.session.pass,
  });
});

app.get("/login", (req, res)=> {
  res.render("login");
});

app.get("/logout", (req, res)=> {
  res.render("logout", {user: req.session.user});
  req.session.destroy(err=>{
    if(err)
    return res.json({status: "logout error", body : err})
  })
});

//POST

app.post("/login", (req, res)=> {
  const username = req.body.user;
  const pass = req.body.pass;
  if (username == "cristian" && pass=="azul"){
    req.session.user = username;
    req.session.pass = pass
    res.redirect("http://localhost:8080/in")
    return
  }
  res.send("login error");
});

app.post('/in', (req, res) => {
    datos.push(req.body)
  res.render("main", datos);
})

app.listen(8080, () => console.log("Server up"));