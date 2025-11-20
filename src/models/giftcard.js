import mongoose from "mongoose";

const giftCardSchema = new mongoose.Schema({
  comprador_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }, // Opcional se não estiver logado
  nome_comprador: String,
  email_comprador: String,
  celular_comprador: String,
  nome_presenteado: String,
  email_presenteado: String,
  servico_escolhido: String,
  valor: Number,
  duracao: Number,
  data_compra: { type: Date, default: Date.now },
  codigo_resgate: String // Um código único para usar depois
});

export default mongoose.model("GiftCard", giftCardSchema);