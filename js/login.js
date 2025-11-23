document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const erroMsg = document.getElementById("erro-msg");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        if (data.usuario.isAdmin) {
          window.location.href = "../html/admin.html";
        } else {
          window.location.href = "../html/agendar.html";
        }
      } else {
        erroMsg.textContent = data.message;
        erroMsg.style.display = "block";
      }
    } catch (error) {
      console.error("Erro:", error);
      erroMsg.textContent = "Erro ao conectar com o servidor.";
      erroMsg.style.display = "block";
    }
  });
