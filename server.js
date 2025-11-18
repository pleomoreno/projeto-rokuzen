import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

// Importação dos Modelos
import Cliente from "./src/models/cliente.js";
import Atendimento from "./src/models/atendimento.js";
import Servico from "./src/models/servico.js";
import Unidade from "./src/models/unidade.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// --- CONEXÃO COM O MONGODB ---
// A string de conexão deve estar no seu arquivo .env como DATABASE_URL
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Middlewares
app.use(cors()); // Permite conexões do front-end
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve arquivos estáticos da raiz

// --- ROTAS DE AUTENTICAÇÃO ---

// 1. Cadastro de Usuário (Sign Up)
app.post("/signup", async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    // Verifica se já existe
    const usuarioExistente = await Cliente.findOne({ email_cliente: email });
    if (usuarioExistente) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Cria o cliente
    const novoCliente = new Cliente({
      nome_cliente: nome,
      email_cliente: email,
      senha: senhaHash,
      telefone_cliente: telefone
    });

    await novoCliente.save();
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Procura o usuário
    const cliente = await Cliente.findOne({ email_cliente: email });
    if (!cliente) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // Gera o Token JWT
    // Use uma chave secreta forte no .env
    const token = jwt.sign(
      { id: cliente._id, isAdmin: cliente.isAdmin },
      process.env.JWT_SECRET || "segredo_temporario",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login realizado!",
      token,
      usuario: { id: cliente._id, nome: cliente.nome_cliente, isAdmin: cliente.isAdmin }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROTAS DO SISTEMA (AGENDAMENTO) ---

// 3. Buscar Unidades (Para preencher o select do agendamento)
app.get("/unidades", async (req, res) => {
  const unidades = await Unidade.find();
  res.json(unidades);
});

// 4. Buscar Serviços (Para preencher o select)
app.get("/servicos", async (req, res) => {
  const servicos = await Servico.find({ ativo: "S" });
  res.json(servicos);
});

// 5. Criar Agendamento
app.post("/agendar", async (req, res) => {
  // Aqui você deve validar o token JWT vindo do header para saber quem é o cliente
  // Mas para simplificar, vamos supor que o ID do cliente vem no corpo por enquanto
  try {
    const { unidade_id, servico_id, cliente_id, data_hora } = req.body;

    const novoAgendamento = new Atendimento({
      unidade_id,
      servico_id,
      cliente_id,
      inicio_atendimento: new Date(data_hora),
      foi_marcado_online: "S"
    });

    await novoAgendamento.save();
    res.status(201).json({ message: "Agendamento realizado!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROTAS DO ADMIN ---

// 6. Listar Agendamentos (Com populate para trazer os nomes em vez dos IDs)
app.get("/admin/agendamentos", async (req, res) => {
  try {
    // Populate troca o ID pelo objeto real (traz o nome do cliente e do serviço)
    const agendamentos = await Atendimento.find()
      .populate("cliente_id", "nome_cliente email_cliente")
      .populate("servico_id", "nome_servico")
      .populate("unidade_id", "nome_unidade");

    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Servir os arquivos HTML principais (suas rotas antigas)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "html", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "html", "login.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "html", "admin.html")));

app.listen(PORT, () => {
  console.log(`🚀 Servidor Rokuzen rodando na porta ${PORT}`);
});