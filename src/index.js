import connectDB from "./database/connection.js";
import Unidade from "./models/unidade.js";

await connectDB();

const novaUnidade = new Unidade({ nome_unidade: "Unidade A" });
await novaUnidade.save();

console.log("✅ Unidade criada:", novaUnidade);
