import mongoose from "mongoose";

const escalaSchema = new mongoose.Schema({
  colaborador_id: { type: mongoose.Schema.Types.ObjectId, ref: "Colaborador" },
  unidade_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unidade" },
  inicio_escala: Date,
  fim_escala: Date,
});

export default mongoose.model("Escala", escalaSchema);
