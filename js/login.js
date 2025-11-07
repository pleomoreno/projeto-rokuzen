document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const erroMsg = document.getElementById("erro-msg");

    const adminEmail = "admin@rokuzen.com";
    const adminSenha = "12345";

    if (email === adminEmail && senha === adminSenha) {
      localStorage.setItem("usuarioLogado", "admin");
      window.location.href = "admin.html";
    } else {
      erroMsg.textContent = "E-mail ou senha incorretos.";
      erroMsg.style.display = "block";
    }
  });
