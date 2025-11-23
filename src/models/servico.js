import mongoose from "mongoose";

const servicoSchema = new mongoose.Schema({
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  nome_servico: { type: String, required: true },
  descricao: String,
  ativo: { type: String, enum: ["S", "N"], default: "S" },

  opcoes: [
    {
      duracao: Number,
      preco: Number,
      titulo: String,
    },
  ],
});

export default mongoose.model("Servico", servicoSchema);
