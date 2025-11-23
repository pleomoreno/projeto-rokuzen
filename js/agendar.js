let agendamento = {
  unidade_id: null,
  servico_id: null,
  valor_servico: null,
  data_hora: null,
  cliente_id: null,
  observacao_extra: "",
};

let todosServicosCache = [];
let unidadesCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioLogado = localStorage.getItem("usuario");

  if (!usuarioLogado) {
    alert("Você precisa fazer login antes de agendar!");
    window.location.href = "login.html";
    return;
  }

  const usuarioObj = JSON.parse(usuarioLogado);
  agendamento.cliente_id = usuarioObj.id;

  await carregarUnidades();
});

async function carregarUnidades() {
  try {
    const response = await fetch("http://localhost:3000/unidades");
    unidadesCache = await response.json();

    const container = document.getElementById("container-unidades");
    container.innerHTML = "";

    unidadesCache.forEach((unidade) => {
      const divOpcao = document.createElement("div");
      divOpcao.className = "opcoes-unidades__opcao";

      const label = document.createElement("label");
      label.className = "opcao__unidade-texto";
      label.style.cursor = "pointer";

      const input = document.createElement("input");
      input.type = "radio";
      input.className = "opcao__radio-personalizado";
      input.name = "unidade";
      input.value = unidade._id;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + unidade.nome_unidade));
      divOpcao.appendChild(label);

      input.addEventListener("change", () => {
        agendamento.unidade_id = unidade._id;
        atualizarWhatsapp(unidade.whatsapp);
        resetarSelecoes();
        carregarServicos();
      });

      container.appendChild(divOpcao);
    });
  } catch (error) {
    console.error("Erro:", error);
    container.innerHTML = `<label class="opcao__unidade-texto" style="color:red">Erro ao carregar opções.</label>`;
  }
}

function atualizarWhatsapp(numero) {
  const elementoTexto = document.getElementById("texto-whatsapp");
  if (elementoTexto) {
    elementoTexto.textContent = `Para essa data entre em contato com a unidade pelo WhatsApp: ${numero}`;
  }
}

function resetarSelecoes() {
  agendamento.servico_id = null;
  agendamento.valor_servico = null;
  agendamento.observacao_extra = "";
  document.getElementById("duracao-container").innerHTML = "";
  document.getElementById("btn-confirmar").textContent =
    "Confirmar Pré-agendamento";
}

async function carregarServicos() {
  try {
    const response = await fetch("http://localhost:3000/servicos");
    const todosServicos = await response.json();
    todosServicosCache = todosServicos;

    const container = document.getElementById("container-servicos");
    container.innerHTML = "";

    const servicosDaUnidade = todosServicos.filter(
      (s) =>
        s.unidade_id === agendamento.unidade_id &&
        !s.nome_servico.toUpperCase().includes("COMBO")
    );

    if (servicosDaUnidade.length === 0) {
      container.innerHTML = `<div class="opcoes-unidades__opcao"><label class="opcao__unidade-texto" style="cursor: default;">Nenhum serviço disponível.</label></div>`;
      return;
    }

    servicosDaUnidade.forEach((servico) => {
      const divOpcao = document.createElement("div");
      divOpcao.className = "opcoes-unidades__opcao";

      const label = document.createElement("label");
      label.className = "opcao__unidade-texto";
      label.style.cursor = "pointer";

      const input = document.createElement("input");
      input.type = "radio";
      input.className = "opcao__radio-personalizado";
      input.name = "servico";
      input.value = servico._id;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + servico.nome_servico));
      divOpcao.appendChild(label);

      input.addEventListener("change", () => {
        if (servico.nome_servico.toLowerCase().includes("reflexologia")) {
          verificarPromo(servico);
        } else {
          agendamento.observacao_extra = "";
          selecionarServico(servico);
        }
      });

      container.appendChild(divOpcao);
    });
  } catch (error) {
    console.error(error);
  }
}

function selecionarServico(servicoObjeto) {
  agendamento.servico_id = servicoObjeto._id;
  mostrarOpcoesDuracao(servicoObjeto.opcoes);
}

function verificarPromo(servicoReflexologia) {
  const modalId = "modalPromo";
  const modalExistente = document.getElementById(modalId);
  if (modalExistente) modalExistente.remove();

  const modalHtml = `
  <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" style="border: 2px solid #4a7c59; background-color: #f0f7e6;">
        <div class="modal-header" style="border-bottom: none;">
          <h5 class="modal-title fw-bold" style="color: #2c4a34;">PROMOÇÃO ESPECIAL! 🎉</h5>
          <button type="button" class="btn-close" id="btn-fechar-promo" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <p class="fs-5">Aproveite e acrescente uma sessão de <strong>Auriculoterapia</strong>!</p>
          <div style="background: #fff; padding: 10px; border-radius: 8px; display: inline-block; margin-top: 10px; border: 1px solid #ccc;">
              <strong>COMBO EXCLUSIVO</strong><br>
              Reflexologia + Aurículo<br>
              <span style="color: green; font-weight: bold;">Acréscimo de apenas R$ 48,00</span>
          </div>
        </div>
        <div class="modal-footer justify-content-center" style="border-top: none;">
          <button type="button" class="btn btn-outline-secondary" id="btn-recusar">Não tenho interesse</button>
          <button type="button" class="btn btn-success fw-bold" id="btn-aceitar">QUERO O COMBO!</button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modalBootstrap = new bootstrap.Modal(document.getElementById(modalId));
  modalBootstrap.show();

  document.getElementById("btn-aceitar").onclick = () => {
    modalBootstrap.hide();
    agendamento.servico_id = servicoReflexologia._id;
    agendamento.observacao_extra =
      "COMBO: Reflexologia + Auriculoterapia (Adicional incluso)";

    const opcoesComAcrescimo = servicoReflexologia.opcoes.map((opcao) => {
      const novoPreco = opcao.preco + 48.0;
      return {
        duracao: opcao.duracao,
        preco: novoPreco,
        titulo: `${opcao.duracao} min - R$ ${novoPreco
          .toFixed(2)
          .replace(".", ",")} (+ Aurículo)`,
      };
    });
    mostrarOpcoesDuracao(opcoesComAcrescimo, true);
  };

  const recusar = () => {
    modalBootstrap.hide();
    agendamento.observacao_extra = "";
    selecionarServico(servicoReflexologia);
  };
  document.getElementById("btn-recusar").onclick = recusar;
  document.getElementById("btn-fechar-promo").onclick = recusar;
}

function mostrarOpcoesDuracao(opcoes, isCombo = false) {
  const container = document.getElementById("duracao-container");
  container.innerHTML = "";

  if (!opcoes || opcoes.length === 0) return;

  const rowTitulo = document.createElement("div");
  rowTitulo.className = "row mt-5";
  const h2 = document.createElement("h2");

  h2.className = "container__titulo mb-3";
  h2.style.fontSize = "32px";
  h2.style.color = "#285129";
  h2.style.fontWeight = "bold";
  h2.textContent = "3. Escolha a duração";
  rowTitulo.appendChild(h2);
  container.appendChild(rowTitulo);

  if (isCombo) {
    const avisoRow = document.createElement("div");
    avisoRow.className = "row col-12 col-lg-9 mb-3";
    avisoRow.innerHTML = `
          <div class="alert alert-success text-center fw-bold" style="border: 2px solid #198754; background-color: #d1e7dd; color: #0f5132;">
              ✅ Auriculoterapia adicionada! (+ R$ 48,00 já incluídos)
          </div>
      `;
    container.appendChild(avisoRow);
  }

  const rowForm = document.createElement("div");
  rowForm.className = "row";
  const formContainer = document.createElement("form");
  formContainer.className = "container__opcoes-unidades col-12 col-lg-9";

  opcoes.forEach((opcao) => {
    const divOpcao = document.createElement("div");
    divOpcao.className = "opcoes-unidades__opcao";

    const label = document.createElement("label");
    label.className = "opcao__unidade-texto";
    label.style.cursor = "pointer";

    const input = document.createElement("input");
    input.type = "radio";
    input.className = "opcao__radio-personalizado";
    input.name = "duracao";
    input.value = opcao.preco;

    const textoDisplay =
      opcao.titulo ||
      `${opcao.duracao} minutos - R$ ${opcao.preco
        .toFixed(2)
        .replace(".", ",")}`;

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + textoDisplay));
    divOpcao.appendChild(label);

    input.addEventListener("change", () => {
      agendamento.valor_servico = opcao.preco;
      const btn = document.getElementById("btn-confirmar");
      btn.textContent = `Confirmar Pré-agendamento (R$ ${opcao.preco
        .toFixed(2)
        .replace(".", ",")})`;
    });

    formContainer.appendChild(divOpcao);
  });

  rowForm.appendChild(formContainer);
  container.appendChild(rowForm);
}

document.getElementById("btn-confirmar").addEventListener("click", async () => {
  agendamento.data_hora = new Date();

  if (!agendamento.unidade_id) return alert("Selecione a Unidade.");
  if (!agendamento.servico_id) return alert("Selecione o Serviço.");
  if (!agendamento.valor_servico) return alert("Selecione a Duração/Valor.");

  const emailInput = document.getElementById("email-agendamento");
  const emailConfirmacao = emailInput ? emailInput.value : "";

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/agendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        ...agendamento,
        email_contato: emailConfirmacao,
        observacao_cliente: agendamento.observacao_extra,
        valor_servico: agendamento.valor_servico,
      }),
    });

    const resultado = await response.json();

    if (response.ok) {
      alert(
        `🎉 Agendamento Confirmado! Valor: R$ ${agendamento.valor_servico.toFixed(
          2
        )}`
      );
      window.location.href = "index.html";
    } else {
      alert("Erro ao agendar: " + (resultado.message || resultado.error));
    }
  } catch (error) {
    console.error(error);
    alert("Erro de conexão com o servidor.");
  }
});
