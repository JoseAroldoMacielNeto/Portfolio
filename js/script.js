/* ============================================================
   script.js
   Todo o comportamento interativo do portfólio.
   Organizado em blocos, um por funcionalidade, para facilitar
   o estudo e a manutenção.
   ============================================================ */

/* ------------------------------------------------------------
   CORREÇÃO: SITE ABRINDO EM "#CONTATO" (OU OUTRA SEÇÃO) NO CELULAR
   ------------------------------------------------------------
   Causa real: quando a URL do site é aberta já contendo uma âncora
   (ex.: .../index.html#contato — isso acontece quando o celular
   reabre uma aba antiga, um atalho salvo na tela inicial, ou um
   link compartilhado que ficou registrado com a última seção
   visitada), o PRÓPRIO NAVEGADOR pula automaticamente para aquela
   seção. Isso acontece antes (ou depois) do nosso JavaScript
   rodar, então apenas "forçar o topo uma vez" não era suficiente.

   A correção tem duas partes:
   1) Remover o fragmento (#algo) da URL assim que a página carrega,
      sem recarregar a página (history.replaceState). Isso impede
      que o navegador tente pular para essa seção de novo.
   2) Forçar a rolagem para o topo em MAIS DE UM momento do
      carregamento — porque em alguns celulares o navegador refaz
      o salto para a âncora depois que as imagens terminam de
      carregar e a altura da página muda. */

// Desliga a "memória de posição" automática do navegador.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Remove qualquer #âncora que já esteja na URL no momento em que a
// página é aberta. Isso NÃO afeta cliques nos links do menu depois
// que a página já carregou — eles continuam navegando normalmente.
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

// Função reaproveitada nos três momentos do carregamento abaixo.
function forcarTopoDaPagina() {
  window.scrollTo(0, 0);
}

// 1ª chamada: imediatamente, assim que este script é lido pelo navegador.
forcarTopoDaPagina();

/* Só executamos o restante do código depois que o HTML inteiro foi
   carregado, para garantir que os elementos que buscamos
   (getElementById etc.) já existam na página. */
document.addEventListener("DOMContentLoaded", () => {

  // 2ª chamada: quando a estrutura HTML termina de carregar.
  forcarTopoDaPagina();
  window.scrollTo(0, 0);

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
  // O modo escuro é o padrão do portfólio. Se o usuário já escolheu um
  // tema antes (guardado no localStorage), respeitamos essa escolha.
  // Caso contrário, mantemos o escuro (já definido no <body> do HTML),
  // independentemente da preferência de tema do sistema operacional.
  const temaSalvo = localStorage.getItem("portfolio-tema");

  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else {
    aplicarTema("dark");
  }

  botaoTema.addEventListener("click", () => {
    const temaAtual = body.getAttribute("data-theme");
    const novoTema = temaAtual === "dark" ? "light" : "dark";
    aplicarTema(novoTema);
  });


  /* ==========================================================
     2) MENU MOBILE (hambúrguer + botão de fechar)
     ========================================================== */
  const botaoMenu = document.getElementById("menu-toggle");
  const botaoFecharMenu = document.getElementById("menu-close");
  const linksNav = document.getElementById("nav-links");

  // Função reutilizada para fechar o menu, seja pelo botão X,
  // por um clique em um link, ou futuramente por qualquer outra ação.
  function fecharMenuMobile() {
    linksNav.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.querySelector("i").className = "fa-solid fa-bars";
  }

  botaoMenu.addEventListener("click", () => {
    const estaAberto = linksNav.classList.toggle("aberto");
    // aria-expanded avisa leitores de tela se o menu está aberto ou fechado
    botaoMenu.setAttribute("aria-expanded", estaAberto);
    botaoMenu.querySelector("i").className = estaAberto ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  // Botão de fechar (X) dentro do próprio painel do menu mobile
  botaoFecharMenu.addEventListener("click", fecharMenuMobile);

  // Fecha o menu automaticamente ao clicar em algum link (útil no celular)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", fecharMenuMobile);
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
     6) VALIDAÇÃO + ENVIO DO FORMULÁRIO DE CONTATO (via Formspree)
     Primeiro validamos os campos no navegador (client-side).
     Se estiverem válidos, enviamos os dados para o Formspree usando
     fetch(): uma forma do JavaScript fazer uma requisição para um
     servidor sem recarregar a página. O Formspree recebe os dados
     e encaminha para o e-mail cadastrado na conta do Formspree.
     ========================================================== */
  const formulario = document.getElementById("contato-form");
  const feedback = document.getElementById("form-feedback");
  const botaoEnviar = document.getElementById("botao-enviar");

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

    /* --- ENVIO REAL VIA FORMSPREE ---
       FormData(formulario) reúne automaticamente todos os campos
       do <form> (nome, email, mensagem) no formato que o Formspree
       espera receber. */
    const dadosFormulario = new FormData(formulario);

    // Desabilita o botão e avisa que o envio está em andamento,
    // evitando que a pessoa clique duas vezes por engano.
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";
    feedback.textContent = "";
    feedback.className = "form-feedback";

    fetch("https://formspree.io/f/mqpkzdjw", {
      method: "POST",
      body: dadosFormulario,
      headers: {
        "Accept": "application/json" // pede ao Formspree uma resposta em JSON, sem redirecionar de página
      }
    })
      .then((resposta) => {
        if (resposta.ok) {
          feedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`;
          feedback.className = "form-feedback sucesso";
          formulario.reset();
        } else {
          // O Formspree respondeu, mas indicando que algo deu errado
          // (ex.: limite de envios, formulário mal configurado etc.)
          feedback.textContent = "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.";
          feedback.className = "form-feedback erro";
        }
      })
      .catch(() => {
        // Erro de rede: sem internet, servidor fora do ar, etc.
        feedback.textContent = "Não foi possível enviar sua mensagem agora. Verifique sua conexão e tente novamente.";
        feedback.className = "form-feedback erro";
      })
      .finally(() => {
        // Reabilita o botão de envio, com sucesso ou com erro
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar Mensagem";
      });
  });


  /* ==========================================================
     7) ANO ATUAL NO RODAPÉ
     Evita ter que atualizar o ano manualmente todo ano.
     ========================================================== */
  document.getElementById("ano-atual").textContent = new Date().getFullYear();

});

// 3ª chamada: quando a página termina de carregar por completo,
// incluindo imagens e fontes. É o momento em que alguns celulares
// "recalculam" a rolagem por causa da mudança de altura da página —
// por isso forçamos o topo mais uma vez aqui, como rede de segurança.
window.addEventListener("load", forcarTopoDaPagina);
