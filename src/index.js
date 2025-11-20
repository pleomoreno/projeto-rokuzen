import connectDB from "./database/connection.js";
import Unidade from "./models/unidade.js"; // importa o model que você quer testar

// executa a conexão com o MongoDB
await connectDB();

// cria e salva uma unidade de teste
const novaUnidade = new Unidade({ nome_unidade: "Unidade A" });
await novaUnidade.save();

console.log("✅ Unidade criada:", novaUnidade);