import mongoose from "mongoose";

const atendimentoSchema = new mongoose.Schema({
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  servico_id: { type: mongoose.Schema.Types.ObjectId, ref: "Servico" },
  colaborador_id: { type: mongoose.Schema.Types.ObjectId, ref: "Colaborador" }, // Pode ser opcional
  parceiro_id: { type: mongoose.Schema.Types.ObjectId, ref: "Parceiro" },     // Pode ser opcional
  inicio_atendimento: Date,
  fim_atendimento: Date,

  valor_servico: Number,          // <--- TEM QUE TER ISSO
  observacao_cliente: String,     // <--- E ISSO (para o combo)
  email_contato: String,          // <--- Opcional, se quiser salvar o email extra

  tipo_pagamento: String,
  foi_marcado_online: { type: String, enum: ["S", "N"] },
  pacote_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pacote" },
});

export default mongoose.model("Atendimento", atendimentoSchema);