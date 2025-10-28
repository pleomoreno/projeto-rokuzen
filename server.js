// server.js
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração de sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1h
  })
);

// Servir pastas estáticas
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

// Rota padrão -> página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

// Função para proteger rotas
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect("/html/login.html");
}

// Rota de login (POST)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    res.redirect("/html/admin.html");
  } else {
    res.redirect("/html/login.html?error=1");
  }
});

// Rota protegida do admin
app.get("/html/admin.html", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "html", "admin.html"));
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/html/login.html");
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
