import mongoose from "mongoose";

const unidadeSchema = new mongoose.Schema({
  nome_unidade: { type: String, required: true },
  whatsapp: { type: String, required: true }, // Novo campo
});

export default mongoose.model("Unidade", unidadeSchema);
