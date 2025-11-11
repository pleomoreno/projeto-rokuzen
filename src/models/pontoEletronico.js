import mongoose from "mongoose";

const pontoEletronicoSchema = new mongoose.Schema({
  colaborador_id: { type: mongoose.Schema.Types.ObjectId, ref: "Colaborador" },
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  entrada: Date,
  saida: Date,
  esta_presente: { type: String, enum: ["S", "N"] },
  fez_recepcao: { type: String, enum: ["S", "N"] },
  pontos_recepcao: Number,
  cobriu_colega: { type: String, enum: ["S", "N"] },
});

export default mongoose.model("PontoEletronico", pontoEletronicoSchema);
