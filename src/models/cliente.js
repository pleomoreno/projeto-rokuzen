import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nome_cliente: { type: String, required: true },
  email_cliente: { type: String, required: true, unique: true }, // Adicionei unique
  telefone_cliente: String,
  senha: { type: String, required: true }, // <--- ADICIONE ISSO
  data_nascimento: Date,
  respostas_saude: Object,
  primeiro_atendimento: Date,
  observacoes: String,
  isAdmin: { type: Boolean, default: false } // <--- Sugestão para controlar o admin
});

export default mongoose.model("Cliente", clienteSchema);