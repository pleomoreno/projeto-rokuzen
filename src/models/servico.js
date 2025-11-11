import mongoose from "mongoose";

const servicoSchema = new mongoose.Schema({
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  nome_servico: { type: String, required: true },
  ativo: { type: String, enum: ["S", "N"], default: "S" },
});

export default mongoose.model("Servico", servicoSchema);
