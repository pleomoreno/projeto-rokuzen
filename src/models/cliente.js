import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nome_cliente: { type: String, required: true },
  email_cliente: { type: String, required: true, unique: true },
  telefone_cliente: String,
  senha: { type: String, required: true },
  data_nascimento: Date,
  respostas_saude: Object,
  primeiro_atendimento: Date,
  observacoes: String,
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model("Cliente", clienteSchema);
