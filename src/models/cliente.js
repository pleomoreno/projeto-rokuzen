import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nome_cliente: { type: String, required: true },
  email_cliente: String,
  telefone_cliente: String,
  data_nascimento: Date,
  respostas_saude: Object,
  primeiro_atendimento: Date,
  observacoes: String,
});

export default mongoose.model("Cliente", clienteSchema);
