import mongoose from "mongoose";

const colaboradorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cargo: { type: String, required: true }
});

export default mongoose.model("Colaborador", colaboradorSchema);