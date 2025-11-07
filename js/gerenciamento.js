document.addEventListener("DOMContentLoaded", () => {
  const botoesAdicionar = document.querySelectorAll(".btn-adicionar");

  botoesAdicionar.forEach((botao) => {
    botao.addEventListener("click", () => {
      const container = botao.parentElement;
      const lista = container.querySelector(".funcionarios-lista");

      // Cria input e botão de confirmar
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Nome do funcionário";
      input.classList.add("novo-func-input");

      const confirmar = document.createElement("button");
      confirmar.textContent = "Salvar";
      confirmar.classList.add("btn-adicionar");

      // Substitui o botão original temporariamente
      container.replaceChild(input, botao);
      container.appendChild(confirmar);

      confirmar.addEventListener("click", () => {
        const nome = input.value.trim();
        if (nome === "") {
          alert("Digite o nome do funcionário.");
          return;
        }

        // Cria o item de funcionário
        const li = document.createElement("li");
        li.textContent = nome;

        const remover = document.createElement("button");
        remover.innerHTML = '<i class="fa-solid fa-trash"></i>';

        remover.addEventListener("click", () => {
          li.remove();
        });

        li.appendChild(remover);
        lista.appendChild(li);

        // Restaura o botão original
        container.removeChild(input);
        container.removeChild(confirmar);
        container.appendChild(botao);
      });
    });
  });
});
