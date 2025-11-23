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

import Cliente from "./src/models/cliente.js";
import Atendimento from "./src/models/atendimento.js";
import Servico from "./src/models/servico.js";
import Unidade from "./src/models/unidade.js";
import Colaborador from "./src/models/colaborador.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post("/signup", async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    const usuarioExistente = await Cliente.findOne({ email_cliente: email });
    if (usuarioExistente) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoCliente = new Cliente({
      nome_cliente: nome,
      email_cliente: email,
      senha: senhaHash,
      telefone_cliente: telefone,
    });

    await novoCliente.save();
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const cliente = await Cliente.findOne({ email_cliente: email });
    if (!cliente) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: cliente._id, isAdmin: cliente.isAdmin },
      process.env.JWT_SECRET || "segredo_temporario",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login realizado!",
      token,
      usuario: {
        id: cliente._id,
        nome: cliente.nome_cliente,
        email: cliente.email_cliente,
        telefone: cliente.telefone_cliente,
        isAdmin: cliente.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/unidades", async (req, res) => {
  const unidades = await Unidade.find();
  res.json(unidades);
});

app.get("/servicos", async (req, res) => {
  const servicos = await Servico.find({ ativo: "S" });
  res.json(servicos);
});

app.post("/agendar", async (req, res) => {
  try {
    const {
      unidade_id,
      servico_id,
      cliente_id,
      data_hora,
      valor_servico,
      observacao_cliente,
    } = req.body;

    const novoAgendamento = new Atendimento({
      unidade_id,
      servico_id,
      cliente_id,
      inicio_atendimento: new Date(data_hora),
      valor_servico: valor_servico,
      observacao_cliente: observacao_cliente,
      foi_marcado_online: "S",
    });

    await novoAgendamento.save();
    res.status(201).json({ message: "Agendamento realizado!" });
  } catch (error) {
    console.error("Erro ao agendar:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/admin/agendamentos", async (req, res) => {
  try {
    const agendamentos = await Atendimento.find()
      .populate("cliente_id", "nome_cliente email_cliente telefone_cliente")
      .populate("servico_id", "nome_servico")
      .populate("unidade_id", "nome_unidade")
      .sort({ inicio_atendimento: -1 });

    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/colaboradores", async (req, res) => {
  try {
    const lista = await Colaborador.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/colaboradores", async (req, res) => {
  try {
    const { nome, cargo } = req.body;
    const novo = new Colaborador({ nome, cargo });
    await novo.save();
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/colaboradores/:id", async (req, res) => {
  try {
    await Colaborador.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deletado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "index.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "login.html"))
);
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "admin.html"))
);

app.listen(PORT, () => {
  console.log(`🚀 Servidor Rokuzen rodando na porta ${PORT}`);
});
