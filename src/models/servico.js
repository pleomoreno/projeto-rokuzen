import mongoose from "mongoose";

const servicoSchema = new mongoose.Schema({
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  nome_servico: { type: String, required: true },
  descricao: String, // Ex: "Massagem nas costas..."
  ativo: { type: String, enum: ["S", "N"], default: "S" },
  // Novo campo para guardar as variações de preço e tempo
  opcoes: [
    {
      duracao: Number, // em minutos (ex: 15)
      preco: Number,   // em reais (ex: 52.00)
      titulo: String   // ex: "15 minutos - R$ 52,00"
    }
  ]
});

export default mongoose.model("Servico", servicoSchema);