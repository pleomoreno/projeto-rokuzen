document.addEventListener("DOMContentLoaded", () => {
  carregarColaboradores();

  // Botão de Adicionar (Abre os inputs)
  const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
  botoesAdicionar.forEach((botao) => {
    botao.addEventListener("click", () => {
      criarFormularioAdicao(botao);
    });
  });
});

// --- 1. LISTAR COLABORADORES ---
async function carregarColaboradores() {
  const lista = document.querySelector(".funcionarios-lista");
  lista.innerHTML = "Carregando...";

  try {
    const response = await fetch("http://localhost:3000/colaboradores");
    const colaboradores = await response.json();

    lista.innerHTML = ""; // Limpa

    colaboradores.forEach((colab) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <span>${colab.nome} - <strong>${colab.cargo}</strong></span>
          `;

      const btnRemover = document.createElement("button");
      btnRemover.innerHTML = '<i class="fa-solid fa-trash"></i>';
      btnRemover.onclick = () => deletarColaborador(colab._id);

      li.appendChild(btnRemover);
      lista.appendChild(li);
    });
  } catch (error) {
    lista.innerHTML = "Erro ao carregar lista.";
    console.error(error);
  }
}

// --- 2. ADICIONAR COLABORADOR ---
function criarFormularioAdicao(botao) {
  const container = botao.parentElement;

  // Cria inputs
  const inputNome = document.createElement("input");
  inputNome.type = "text";
  inputNome.placeholder = "Nome";
  inputNome.classList.add("novo-func-input");

  const inputCargo = document.createElement("input");
  inputCargo.type = "text";
  inputCargo.placeholder = "Cargo";
  inputCargo.classList.add("novo-func-input");

  const btnSalvar = document.createElement("button");
  btnSalvar.textContent = "Salvar";
  btnSalvar.classList.add("btn", "btn-success", "ms-2");

  const btnCancelar = document.createElement("button");
  btnCancelar.textContent = "Cancelar";
  btnCancelar.classList.add("btn", "btn-secondary", "ms-2");

  // Troca o botão "Adicionar" pelo formulário
  container.innerHTML = "";
  container.appendChild(inputNome);
  container.appendChild(inputCargo);
  container.appendChild(btnSalvar);
  container.appendChild(btnCancelar);

  // Ação Salvar
  btnSalvar.addEventListener("click", async () => {
    const nome = inputNome.value.trim();
    const cargo = inputCargo.value.trim();

    if (!nome || !cargo) return alert("Preencha nome e cargo!");

    try {
      await fetch("http://localhost:3000/colaboradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cargo }),
      });

      // Recarrega a lista e restaura o botão
      carregarColaboradores();
      restaurarBotaoAdicionar(container);
    } catch (error) {
      alert("Erro ao salvar");
    }
  });

  // Ação Cancelar
  btnCancelar.addEventListener("click", () => {
    restaurarBotaoAdicionar(container);
  });
}

function restaurarBotaoAdicionar(container) {
  container.innerHTML = `
      <button class="btn btn-success btn-adicionar">
          <i class="fa-solid fa-plus"></i> Adicionar Funcionário
      </button>
  `;
  // Reativa o evento de click no novo botão criado
  container.querySelector(".btn-adicionar").addEventListener("click", (e) => {
    criarFormularioAdicao(e.target);
  });
}

// --- 3. DELETAR COLABORADOR ---
async function deletarColaborador(id) {
  if (!confirm("Tem certeza que deseja remover este funcionário?")) return;

  try {
    await fetch(`http://localhost:3000/colaboradores/${id}`, {
      method: "DELETE",
    });
    carregarColaboradores();
  } catch (error) {
    alert("Erro ao deletar");
  }
}
