import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Importando os modelos
import Cliente from "./src/models/cliente.js";
import Servico from "./src/models/servico.js";
import Unidade from "./src/models/unidade.js";
import Atendimento from "./src/models/atendimento.js";

dotenv.config();

const popularBanco = async () => {
  try {
    console.log("⏳ Conectando ao MongoDB Atlas...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Conectado!");

    // 1. Limpar dados antigos
    console.log("🧹 Limpando coleções antigas...");
    await Cliente.deleteMany({});
    await Servico.deleteMany({});
    await Unidade.deleteMany({});
    await Atendimento.deleteMany({});

    // 2. Criar Unidades (Baseado na sua imagem 1)
    console.log("buildings Criando Unidades...");
    const unidades = await Unidade.insertMany([
      { nome_unidade: "Golden Square Shopping - São Bernardo" },
      { nome_unidade: "Grand Plaza Shopping - Santo André" },
      { nome_unidade: "Mooca Plaza Shopping - São Paulo" },
      { nome_unidade: "Shopping West Plaza - São Paulo" }
    ]);

    // Vamos vincular os serviços a todas as unidades para facilitar o teste
    // (Na prática, você pode filtrar depois se alguma unidade não tiver algum serviço)

    // 3. Definir os Serviços e Preços (Baseado no seu texto)
    const servicosData = [
      {
        nome_servico: "Quick Massage",
        opcoes: [
          { duracao: 15, preco: 52.00, titulo: "15 minutos - R$ 52,00" },
          { duracao: 25, preco: 73.00, titulo: "25 minutos - R$ 73,00" },
          { duracao: 35, preco: 92.00, titulo: "35 minutos - R$ 92,00" }
        ]
      },
      {
        nome_servico: "Maca", // Massagem na Maca
        opcoes: [
          { duracao: 30, preco: 114.00, titulo: "30 minutos - R$ 114,00" },
          { duracao: 45, preco: 160.00, titulo: "45 minutos - R$ 160,00" },
          { duracao: 60, preco: 198.00, titulo: "60 minutos - R$ 198,00" },
          { duracao: 90, preco: 292.00, titulo: "90 minutos - R$ 292,00" },
          { duracao: 120, preco: 379.00, titulo: "120 minutos - R$ 379,00" }
        ]
      },
      {
        nome_servico: "Reflexologia Podal",
        opcoes: [
          { duracao: 20, preco: 83.00, titulo: "20 minutos - R$ 83,00" },
          { duracao: 30, preco: 99.00, titulo: "30 minutos - R$ 99,00" },
          { duracao: 40, preco: 118.00, titulo: "40 minutos - R$ 118,00" },
          { duracao: 60, preco: 159.00, titulo: "60 minutos - R$ 159,00" }
        ]
      },
      {
        nome_servico: "Auriculoterapia",
        opcoes: [
          { duracao: 10, preco: 69.00, titulo: "10 minutos - R$ 69,00" }
        ]
      },
      // Adicionando o Combo como um "Serviço Especial" para facilitar o agendamento no banco
      // Se o usuário aceitar o popup, o front-end pode mandar esse ID
      {
        nome_servico: "Auriculoterapia - COMBO PROMO",
        ativo: "S", // Pode deixar visível ou tratar no front para ser oculto na lista principal
        opcoes: [
          { duracao: 10, preco: 48.00, titulo: "10 minutos - R$ 48,00 (Promo)" }
        ]
      }
    ];

    console.log("💆 Criando Serviços para cada unidade...");

    // Loop para criar os serviços dentro de CADA unidade
    for (const unidade of unidades) {
      const servicosParaUnidade = servicosData.map(s => ({
        ...s,
        unidade_id: unidade._id
      }));
      await Servico.insertMany(servicosParaUnidade);
    }

    // 4. Criar Admin e Usuário
    console.log("👑 Criando Usuários...");
    const salt = await bcrypt.genSalt(10);
    const senhaAdmin = await bcrypt.hash("12345", salt);
    const senhaUser = await bcrypt.hash("12345", salt);

    await Cliente.create({
      nome_cliente: "Admin Rokuzen",
      email_cliente: "admin@rokuzen.com",
      telefone_cliente: "11999999999",
      senha: senhaAdmin,
      isAdmin: true
    });

    await Cliente.create({
      nome_cliente: "Cliente Teste",
      email_cliente: "cliente@teste.com",
      telefone_cliente: "11988888888",
      senha: senhaUser,
      isAdmin: false
    });

    console.log("------------------------------------------------");
    console.log("🎉 DADOS ATUALIZADOS COM SUCESSO!");
    console.log("------------------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
};

popularBanco();