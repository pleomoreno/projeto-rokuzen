// js/gift-card.js

let giftSelection = {
  servico_nome: null,
  valor: null,
  duracao: null,
};

document.addEventListener("DOMContentLoaded", async () => {
  await carregarServicosGift();
});

async function carregarServicosGift() {
  try {
    // Busca unidades para pegar o ID da primeira
    const respUnidades = await fetch("http://localhost:3000/unidades");
    const unidades = await respUnidades.json();

    if (unidades.length === 0) return;
    const unidadeExemploId = unidades[0]._id;

    // Busca serviços
    const respServicos = await fetch("http://localhost:3000/servicos");
    const todosServicos = await respServicos.json();

    // Filtra serviços dessa unidade e remove COMBO
    const servicosUnicos = todosServicos.filter(
      (s) =>
        s.unidade_id === unidadeExemploId &&
        !s.nome_servico.toUpperCase().includes("COMBO")
    );

    const container = document.getElementById("container-servicos");
    container.innerHTML = "";

    servicosUnicos.forEach((servico) => {
      const divOpcao = document.createElement("div");
      divOpcao.className = "opcoes-unidades__opcao";

      divOpcao.innerHTML = `
              <label class="opcao__unidade-texto" style="cursor: pointer;">
                  <input class="opcao__radio-personalizado" type="radio" name="servico" value="${servico._id}">
                  ${servico.nome_servico}
              </label>
          `;

      divOpcao.addEventListener("click", () => {
        divOpcao.querySelector("input").checked = true;
        giftSelection.servico_nome = servico.nome_servico;
        mostrarOpcoesDuracao(servico.opcoes);
      });

      container.appendChild(divOpcao);
    });
  } catch (error) {
    console.error(error);
  }
}

function mostrarOpcoesDuracao(opcoes) {
  const container = document.getElementById("duracao-container");
  container.innerHTML = "";

  // CORREÇÃO: Removido a criação do <h2> aqui dentro.
  // O HTML já tem o título fora da caixa.

  const formContainer = document.createElement("div");
  // Usa apenas classes de layout interno, sem bordas extras se não necessário
  formContainer.className = "col-12";

  opcoes.forEach((opcao) => {
    const divOpcao = document.createElement("div");
    divOpcao.className = "opcoes-unidades__opcao";

    divOpcao.innerHTML = `
          <label class="opcao__unidade-texto" style="cursor: pointer;">
              <input class="opcao__radio-personalizado" type="radio" name="duracao" value="${
                opcao.preco
              }">
              ${opcao.duracao} minutos - R$ ${opcao.preco.toFixed(2)}
          </label>
      `;

    divOpcao.addEventListener("click", () => {
      divOpcao.querySelector("input").checked = true;
      giftSelection.valor = opcao.preco;
      giftSelection.duracao = opcao.duracao;
      console.log("Selecionado:", giftSelection);
    });

    formContainer.appendChild(divOpcao);
  });

  container.appendChild(formContainer);
}

document.getElementById("btn-comprar").addEventListener("click", async () => {
  if (!giftSelection.valor) return alert("Selecione o serviço e o valor.");

  const nomePres = document.getElementById("nomePresenteado").value;
  const emailPres = document.getElementById("emailPresenteado").value;
  const seuNome = document.getElementById("seuNome").value;
  const seuEmail = document.getElementById("seuEmail").value;
  const celular = document.getElementById("seuCelular").value;

  if (!nomePres || !emailPres || !seuNome || !seuEmail) {
    return alert("Preencha todos os dados.");
  }

  const dadosCompra = {
    nome_comprador: seuNome,
    email_comprador: seuEmail,
    celular_comprador: celular,
    nome_presenteado: nomePres,
    email_presenteado: emailPres,
    servico_escolhido: giftSelection.servico_nome,
    duracao: giftSelection.duracao,
    valor: giftSelection.valor,
  };

  try {
    const response = await fetch("http://localhost:3000/comprar-gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosCompra),
    });

    if (response.ok) {
      const res = await response.json();
      alert(`Compra realizada! Código do Gift Card: ${res.codigo}`);
      window.location.href = "index.html";
    } else {
      alert("Erro ao processar compra.");
    }
  } catch (error) {
    console.error(error);
    alert("Erro de conexão.");
  }
});
