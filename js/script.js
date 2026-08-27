/* ============================================================
   script.js
   Todo o comportamento interativo do portfólio.
   Organizado em blocos, um por funcionalidade, para facilitar
   o estudo e a manutenção.
   ============================================================ */

/* Só executamos o código depois que o HTML inteiro foi carregado,
   para garantir que os elementos que buscamos (getElementById etc.)
   já existam na página. */
document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     1) MODO ESCURO / MODO CLARO
     Guarda a preferência do usuário no localStorage do navegador,
     para que o tema escolhido seja lembrado na próxima visita.
     ========================================================== */
  const body = document.body;
  const botaoTema = document.getElementById("theme-toggle");
  const iconeTema = botaoTema.querySelector("i");

  function aplicarTema(tema) {
    body.setAttribute("data-theme", tema);
    // Troca o ícone: lua (modo claro, para ativar o escuro) <-> sol (modo escuro)
    iconeTema.className = tema === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    localStorage.setItem("portfolio-tema", tema);
  }

  // Ao carregar a página: usa o tema salvo, ou a preferência do sistema operacional
  const temaSalvo = localStorage.getItem("portfolio-tema");
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else if (prefereEscuro) {
    aplicarTema("dark");
  }

  botaoTema.addEventListener("click", () => {
    const temaAtual = body.getAttribute("data-theme");
    const novoTema = temaAtual === "dark" ? "light" : "dark";
    aplicarTema(novoTema);
  });


  /* ==========================================================
     2) MENU MOBILE (hambúrguer)
     ========================================================== */
  const botaoMenu = document.getElementById("menu-toggle");
  const linksNav = document.getElementById("nav-links");

  botaoMenu.addEventListener("click", () => {
    const estaAberto = linksNav.classList.toggle("aberto");
    // aria-expanded avisa leitores de tela se o menu está aberto ou fechado
    botaoMenu.setAttribute("aria-expanded", estaAberto);
    botaoMenu.querySelector("i").className = estaAberto ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  // Fecha o menu automaticamente ao clicar em algum link (útil no celular)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      linksNav.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.querySelector("i").className = "fa-solid fa-bars";
    });
  });


  /* ==========================================================
     3) CABEÇALHO COM SOMBRA AO ROLAR A PÁGINA
     ========================================================== */
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });


  /* ==========================================================
     4) DESTACAR O LINK DO MENU CORRESPONDENTE À SEÇÃO VISÍVEL
     Usamos IntersectionObserver: uma API do navegador que "observa"
     elementos e avisa quando eles entram ou saem da tela,
     sem precisar calcular posições manualmente a cada scroll.
     ========================================================== */
  const secoes = document.querySelectorAll("section[id]");
  const linksMenu = document.querySelectorAll(".nav-link");

  const observerMenu = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const idAtual = entrada.target.getAttribute("id");
          linksMenu.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${idAtual}`);
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" } // considera "ativa" a seção que passa pelo meio da tela
  );

  secoes.forEach((secao) => observerMenu.observe(secao));


  /* ==========================================================
     5) ANIMAÇÃO DE ENTRADA DOS ELEMENTOS (scroll reveal)
     Elementos com a classe "reveal" começam invisíveis (ver CSS)
     e ganham a classe "ativo" quando entram na tela.
     ========================================================== */
  const elementosReveal = document.querySelectorAll(".reveal");

  const observerReveal = new IntersectionObserver(
    (entradas, observer) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("ativo");
          observer.unobserve(entrada.target); // anima só uma vez
        }
      });
    },
    { threshold: 0.15 }
  );

  elementosReveal.forEach((elemento) => observerReveal.observe(elemento));


  /* ==========================================================
     6) VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     Validação simples no navegador (client-side). Como este é um
     site estático (sem back-end), aqui simulamos o envio.
     Quando o formulário for conectado a um serviço real (ex:
     Formspree, EmailJS, ou um back-end próprio), substitua o
     bloco "SIMULAÇÃO DE ENVIO" pela chamada real.
     ========================================================== */
  const formulario = document.getElementById("contato-form");
  const feedback = document.getElementById("form-feedback");

  function mostrarErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    const erro = document.getElementById(`erro-${campoId}`);
    campo.classList.add("input-invalido");
    erro.textContent = mensagem;
  }

  function limparErro(campoId) {
    const campo = document.getElementById(campoId);
    const erro = document.getElementById(`erro-${campoId}`);
    campo.classList.remove("input-invalido");
    erro.textContent = "";
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // impede o recarregamento padrão da página

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    // Expressão regular simples para validar o formato do e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let formularioValido = true;

    ["nome", "email", "mensagem"].forEach(limparErro);

    if (nome.length < 3) {
      mostrarErro("nome", "Digite seu nome completo.");
      formularioValido = false;
    }

    if (!regexEmail.test(email)) {
      mostrarErro("email", "Digite um e-mail válido.");
      formularioValido = false;
    }

    if (mensagem.length < 10) {
      mostrarErro("mensagem", "Escreva uma mensagem com pelo menos 10 caracteres.");
      formularioValido = false;
    }

    if (!formularioValido) {
      feedback.textContent = "Por favor, corrija os campos destacados.";
      feedback.className = "form-feedback";
      return;
    }

    /* --- SIMULAÇÃO DE ENVIO ---
       Aqui, futuramente, entraria uma chamada real (fetch) para
       um serviço de envio de e-mail ou back-end. */
    feedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`;
    feedback.className = "form-feedback sucesso";
    formulario.reset();
  });


  /* ==========================================================
     7) ANO ATUAL NO RODAPÉ
     Evita ter que atualizar o ano manualmente todo ano.
     ========================================================== */
  document.getElementById("ano-atual").textContent = new Date().getFullYear();

});
