import mongoose from "mongoose";

const atendimentoSchema = new mongoose.Schema({
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  servico_id: { type: mongoose.Schema.Types.ObjectId, ref: "Servico" },
  colaborador_id: { type: mongoose.Schema.Types.ObjectId, ref: "Colaborador" },
  parceiro_id: { type: mongoose.Schema.Types.ObjectId, ref: "Parceiro" },
  inicio_atendimento: Date,
  fim_atendimento: Date,
  valor_servico: Number,
  tipo_pagamento: String,
  observacao_cliente: String,
  foi_marcado_online: { type: String, enum: ["S", "N"] },
  pacote_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pacote" },
});

export default mongoose.model("Atendimento", atendimentoSchema);
