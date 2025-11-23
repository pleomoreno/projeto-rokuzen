import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import Cliente from "./src/models/cliente.js";
import Servico from "./src/models/servico.js";
import Unidade from "./src/models/unidade.js";
import Atendimento from "./src/models/atendimento.js";
import Colaborador from "./src/models/colaborador.js";

dotenv.config();

const popularBanco = async () => {
  try {
    console.log("⏳ Conectando ao MongoDB Atlas...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Conectado!");

    console.log("🧹 Limpando coleções antigas...");
    await Cliente.deleteMany({});
    await Servico.deleteMany({});
    await Unidade.deleteMany({});
    await Atendimento.deleteMany({});
    await Colaborador.deleteMany({});

    console.log("buildings Criando Unidades...");
    const unidades = await Unidade.insertMany([
      {
        nome_unidade: "Golden Square Shopping - São Bernardo",
        whatsapp: "+55 11 91111-1111",
      },
      {
        nome_unidade: "Grand Plaza Shopping - Santo André",
        whatsapp: "+55 11 92222-2222",
      },
      {
        nome_unidade: "Mooca Plaza Shopping - São Paulo",
        whatsapp: "+55 11 95084-1087",
      },
      {
        nome_unidade: "Shopping West Plaza - São Paulo",
        whatsapp: "+55 11 94444-4444",
      },
    ]);

    const servicosData = [
      {
        nome_servico: "Quick Massage",
        opcoes: [
          { duracao: 15, preco: 52.0, titulo: "15 minutos - R$ 52,00" },
          { duracao: 25, preco: 73.0, titulo: "25 minutos - R$ 73,00" },
          { duracao: 35, preco: 92.0, titulo: "35 minutos - R$ 92,00" },
        ],
      },
      {
        nome_servico: "Maca",
        opcoes: [
          { duracao: 30, preco: 114.0, titulo: "30 minutos - R$ 114,00" },
          { duracao: 45, preco: 160.0, titulo: "45 minutos - R$ 160,00" },
          { duracao: 60, preco: 198.0, titulo: "60 minutos - R$ 198,00" },
          { duracao: 90, preco: 292.0, titulo: "90 minutos - R$ 292,00" },
          { duracao: 120, preco: 379.0, titulo: "120 minutos - R$ 379,00" },
        ],
      },
      {
        nome_servico: "Reflexologia Podal",
        opcoes: [
          { duracao: 20, preco: 83.0, titulo: "20 minutos - R$ 83,00" },
          { duracao: 30, preco: 99.0, titulo: "30 minutos - R$ 99,00" },
          { duracao: 40, preco: 118.0, titulo: "40 minutos - R$ 118,00" },
          { duracao: 60, preco: 159.0, titulo: "60 minutos - R$ 159,00" },
        ],
      },
      {
        nome_servico: "Auriculoterapia",
        opcoes: [{ duracao: 10, preco: 69.0, titulo: "10 minutos - R$ 69,00" }],
      },
      {
        nome_servico: "Auriculoterapia - COMBO PROMO",
        ativo: "S",
        opcoes: [
          { duracao: 10, preco: 48.0, titulo: "10 minutos - R$ 48,00 (Promo)" },
        ],
      },
    ];

    console.log("💆 Criando Serviços...");
    for (const unidade of unidades) {
      const servicosParaUnidade = servicosData.map((s) => ({
        ...s,
        unidade_id: unidade._id,
      }));
      await Servico.insertMany(servicosParaUnidade);
    }

    console.log("👷 Criando Colaboradores...");
    await Colaborador.insertMany([
      { nome: "Carlos Silva", cargo: "Massoterapeuta" },
      { nome: "Ana Souza", cargo: "Reflexologista" },
    ]);

    console.log("👑 Criando Usuários...");
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash("12345", salt);

    await Cliente.create({
      nome_cliente: "Admin Rokuzen",
      email_cliente: "admin@rokuzen.com",
      telefone_cliente: "11999999999",
      senha: senhaHash,
      isAdmin: true,
    });

    await Cliente.create({
      nome_cliente: "Cliente Teste",
      email_cliente: "cliente@teste.com",
      telefone_cliente: "11988888888",
      senha: senhaHash,
      isAdmin: false,
    });

    console.log("🎉 DADOS ATUALIZADOS COM SUCESSO!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
};

popularBanco();
