document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Impede recarregar a página

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroMsg = document.getElementById("erro-msg");

  // Credenciais fixas (pode mudar depois)
  const adminEmail = "admin@rokuzen.com";
  const adminSenha = "12345";

  if (email === adminEmail && senha === adminSenha) {
    // Guarda info no navegador (simulação)
    localStorage.setItem("usuarioLogado", "admin");
    window.location.href = "admin.html"; // redireciona
  } else {
    erroMsg.textContent = "E-mail ou senha incorretos.";
    erroMsg.style.display = "block";
  }
});
