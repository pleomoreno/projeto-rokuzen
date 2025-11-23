document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuario");
  const headerButtons = document.querySelector(".header-buttons");

  const logoDiv = document.querySelector(".logo");
  if (logoDiv && !logoDiv.querySelector("a")) {
    const img = logoDiv.querySelector("img");
    const link = document.createElement("a");
    link.href = "index.html";
    link.style.display = "block";
    logoDiv.appendChild(link);
    link.appendChild(img);
  }

  if (usuarioLogado && headerButtons) {
    const usuario = JSON.parse(usuarioLogado);
    const iniciais = getIniciais(usuario.nome || "U");

    // Remove botão de entrar
    const btnLogin = headerButtons.querySelector('a[href="login.html"]');
    if (btnLogin) btnLogin.remove();

    const userContainer = document.createElement("div");
    userContainer.className = "user-profile-container";

    userContainer.innerHTML = `
          <div class="user-icon" title="${usuario.nome}">${iniciais}</div>
          <div class="user-dropdown">
              <div class="dropdown-header">
                  <strong>Olá, ${usuario.nome.split(" ")[0]}</strong>
              </div>

              <div class="dropdown-info">
                  <div class="info-item">
                      <i class="fa-solid fa-user"></i>
                      <span>${usuario.nome}</span>
                  </div>
                  </div>

              <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">

              ${
                usuario.isAdmin
                  ? '<a href="admin.html" class="admin-link"><i class="fa-solid fa-lock"></i> Painel Admin</a>'
                  : ""
              }
              <a href="#" id="action-logout" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Sair da conta</a>
          </div>
      `;

    userContainer.addEventListener("click", (e) => {
      const dropdown = userContainer.querySelector(".user-dropdown");
      dropdown.classList.toggle("active");
    });

    userContainer
      .querySelector("#action-logout")
      .addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "index.html";
      });

    headerButtons.appendChild(userContainer);
  }
});

function getIniciais(nome) {
  const partes = nome.split(" ");
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
