// js/cadastro.js

// Substitua 'form-cadastro' pelo ID real do seu <form> no HTML
// Se o seu form não tem ID, adicione id="form-cadastro" na tag <form> do HTML
const formCadastro = document.querySelector('form');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede a página de recarregar sozinha

    // Pegando os valores dos inputs
    // IMPORTANTE: Verifique se os IDs abaixo batem com o seu HTML
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    // Validação simples
    if (senha !== confirmaSenha) {
        alert("A senha e a confirmação não são iguais!");
        return;
    }

    try {
        // Envia os dados para o Back-End rodando na porta 3000
        const resposta = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Conta criada com sucesso! Você será redirecionado para o login.");
            window.location.href = "login.html"; // Manda o usuário para o login
        } else {
            alert("Erro ao criar conta: " + dados.message);
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("O servidor parece estar desligado. Verifique o terminal!");
    }
});