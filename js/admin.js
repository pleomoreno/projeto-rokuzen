document.addEventListener("DOMContentLoaded", () => {
  verificarPermissao();
  carregarAgendamentos();

  document.getElementById("btn-sair-admin").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});

function verificarPermissao() {
  const usuarioLogado = localStorage.getItem("usuario");
  if (!usuarioLogado) {
    alert("Acesso restrito. Faça login.");
    window.location.href = "login.html";
    return;
  }
  const usuario = JSON.parse(usuarioLogado);
  if (!usuario.isAdmin) {
    alert("Você não tem permissão de administrador.");
    window.location.href = "index.html";
  }
}

async function carregarAgendamentos() {
  const tabela = document.getElementById("tabela-agendamentos");

  try {
    const response = await fetch("http://localhost:3000/admin/agendamentos");
    if (!response.ok) throw new Error("Falha na comunicação com o servidor");

    const agendamentos = await response.json();
    tabela.innerHTML = "";

    if (agendamentos.length === 0) {
      tabela.innerHTML = `<tr><td colspan="7" class="text-center p-4">Nenhum agendamento encontrado.</td></tr>`;
      return;
    }

    agendamentos.forEach((item) => {
      // Datas
      let dataFormatada = "Data Inválida";
      if (item.inicio_atendimento) {
        const dataObj = new Date(item.inicio_atendimento);
        dataFormatada =
          dataObj.toLocaleDateString("pt-BR") +
          " <br> " +
          dataObj.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
      }

      // Dados do Cliente (Com proteção contra nulos)
      const cliente = item.cliente_id || {};
      const nomeCliente = cliente.nome_cliente || "Cliente Removido";
      const emailCliente = cliente.email_cliente || "";
      const telCliente = cliente.telefone_cliente || "Sem telefone"; // <--- AQUI O TELEFONE

      // Outros dados
      const nomeServico = item.servico_id?.nome_servico || "Serviço Removido";
      const nomeUnidade = item.unidade_id?.nome_unidade || "Unidade Removida";

      // Formatação do Valor (Se não tiver valor salvo, mostra 0,00)
      const valorFormatado = item.valor_servico
        ? `R$ ${item.valor_servico.toFixed(2).replace(".", ",")}`
        : "R$ 0,00";

      const obs = item.observacao_cliente
        ? `<br><small style="color:#d63384; font-weight:bold;">${item.observacao_cliente}</small>`
        : "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${dataFormatada}</td>
              <td>
                  <strong>${nomeCliente}</strong>
              </td>
              <td>
                  <div style="font-size: 0.9rem;">${emailCliente}</div>
                  <div style="font-size: 0.9rem; color: #285129; font-weight: bold;">
                      <i class="fa-solid fa-phone"></i> ${telCliente}
                  </div>
              </td>
              <td>${nomeUnidade}</td>
              <td>
                  <span class="badge bg-success">${nomeServico}</span>
                  ${obs}
              </td>
              <td style="font-weight: bold; color: #285129;">${valorFormatado}</td>
              <td><span class="badge bg-secondary">Agendado</span></td>
          `;
      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    tabela.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados.</td></tr>`;
  }
}
