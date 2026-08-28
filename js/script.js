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

  function aplicarTema(tema) {
    body.setAttribute("data-theme", tema);
    // A posição da bolinha (esquerda/direita) é resolvida via CSS, a
    // partir do data-theme do <body>. Aqui só atualizamos o estado
    // para leitores de tela: aria-checked="true" significa "modo
    // escuro ativado" (convenção do papel ARIA "switch").
    botaoTema.setAttribute("aria-checked", tema === "dark" ? "true" : "false");
    localStorage.setItem("portfolio-tema", tema);
  }

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

     Melhorias de acessibilidade adicionadas aqui:
     - aria-hidden no painel do menu quando ele está fechado E a
       tela está em modo mobile (evita que o teclado "entre" em
       links que estão visualmente fora da tela);
     - tecla Esc fecha o menu;
     - o foco é movido para dentro do menu ao abrir, e de volta
       para o botão hambúrguer ao fechar (comportamento esperado
       por quem navega só pelo teclado).
     ========================================================== */
  const botaoMenu = document.getElementById("menu-toggle");
  const botaoFecharMenu = document.getElementById("menu-close");
  const linksNav = document.getElementById("nav-links");

  // Detecta se estamos no layout mobile (mesmo breakpoint usado no CSS,
  // em responsive.css). Usamos isso para saber quando o menu deve
  // ficar "escondido de verdade" (aria-hidden) quando fechado.
  const consultaTelaMobile = window.matchMedia("(max-width: 860px)");

  function sincronizarAcessibilidadeMenu() {
    const emTelaMobile = consultaTelaMobile.matches;
    const menuAberto = linksNav.classList.contains("aberto");

    if (emTelaMobile && !menuAberto) {
      // No mobile, com o menu fechado, o painel fica fora da tela
      // visualmente — aria-hidden garante que leitores de tela também
      // o ignorem enquanto ele estiver assim.
      linksNav.setAttribute("aria-hidden", "true");
    } else {
      // No desktop (ou com o menu aberto no mobile), o menu deve
      // estar sempre acessível normalmente.
      linksNav.removeAttribute("aria-hidden");
    }
  }

  function abrirMenuMobile() {
    linksNav.classList.add("aberto");
    botaoMenu.setAttribute("aria-expanded", "true");
    botaoMenu.querySelector("i").className = "fa-solid fa-xmark";
    sincronizarAcessibilidadeMenu();
    botaoFecharMenu.focus(); // leva o foco para dentro do menu recém-aberto
  }

  // Função reutilizada para fechar o menu, seja pelo botão X, pela
  // tecla Esc, por um clique em um link, ou por qualquer outra ação.
  function fecharMenuMobile() {
    const estavaAberto = linksNav.classList.contains("aberto");
    linksNav.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.querySelector("i").className = "fa-solid fa-bars";
    sincronizarAcessibilidadeMenu();

    // Só devolve o foco ao botão hambúrguer se o menu realmente
    // estava aberto (evita "roubar" o foco em outras situações).
    if (estavaAberto) {
      botaoMenu.focus();
    }
  }

  botaoMenu.addEventListener("click", () => {
    const estaFechado = !linksNav.classList.contains("aberto");
    if (estaFechado) {
      abrirMenuMobile();
    } else {
      fecharMenuMobile();
    }
  });

  // Botão de fechar (X) dentro do próprio painel do menu mobile
  botaoFecharMenu.addEventListener("click", fecharMenuMobile);

  // Tecla Esc fecha o menu mobile quando ele estiver aberto
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && linksNav.classList.contains("aberto")) {
      fecharMenuMobile();
    }
  });

  // Fecha o menu automaticamente ao clicar em algum link (útil no celular)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", fecharMenuMobile);
  });

  // Mantém o aria-hidden correto: no carregamento da página e
  // sempre que a tela cruzar o breakpoint mobile/desktop (ex.:
  // girar o celular, ou redimensionar a janela no computador).
  sincronizarAcessibilidadeMenu();
  consultaTelaMobile.addEventListener("change", sincronizarAcessibilidadeMenu);


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
    campo.setAttribute("aria-invalid", "true"); // avisa leitores de tela que o campo está inválido
    erro.textContent = mensagem;
  }

  function limparErro(campoId) {
    const campo = document.getElementById(campoId);
    const erro = document.getElementById(`erro-${campoId}`);
    campo.classList.remove("input-invalido");
    campo.removeAttribute("aria-invalid");
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
    // aria-busy comunica esse estado de "carregando" para leitores de tela.
    botaoEnviar.disabled = true;
    botaoEnviar.setAttribute("aria-busy", "true");
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
        botaoEnviar.removeAttribute("aria-busy");
        botaoEnviar.textContent = "Enviar Mensagem";
      });
  });


  /* ==========================================================
     7) FORMULÁRIO DE FEEDBACK SOBRE O PORTFÓLIO
     Reaproveita o MESMO endpoint do Formspree do formulário de
     contato — só o campo oculto "_subject" (já definido no HTML)
     muda o assunto do e-mail recebido, para diferenciar um
     feedback de uma mensagem de contato comum. Nome e e-mail são
     opcionais aqui, por isso só validamos a mensagem.
     ========================================================== */
  const formularioFeedback = document.getElementById("feedback-form");
  const feedbackDoFeedback = document.getElementById("feedback-form-feedback");
  const botaoEnviarFeedback = document.getElementById("botao-enviar-feedback");

  formularioFeedback.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("feedback-nome").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const tipo = document.getElementById("feedback-tipo").value;
    const mensagem = document.getElementById("feedback-mensagem").value.trim();

    // Mesma expressão regular usada no formulário de Contato, para
    // manter a validação de e-mail consistente em todo o site.
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let formularioValido = true;

    ["feedback-nome", "feedback-email", "feedback-tipo", "feedback-mensagem"].forEach(limparErro);

    if (nome.length < 3) {
      mostrarErro("feedback-nome", "Digite seu nome.");
      formularioValido = false;
    }

    if (!regexEmail.test(email)) {
      mostrarErro("feedback-email", "Digite um e-mail válido.");
      formularioValido = false;
    }

    if (!tipo) {
      mostrarErro("feedback-tipo", "Selecione o tipo de feedback.");
      formularioValido = false;
    }

    if (mensagem.length < 5) {
      mostrarErro("feedback-mensagem", "Escreva uma mensagem antes de enviar.");
      formularioValido = false;
    }

    if (!formularioValido) {
      feedbackDoFeedback.textContent = "Por favor, corrija os campos destacados.";
      feedbackDoFeedback.className = "form-feedback";
      return;
    }

    const dadosFeedback = new FormData(formularioFeedback);

    botaoEnviarFeedback.disabled = true;
    botaoEnviarFeedback.setAttribute("aria-busy", "true");
    botaoEnviarFeedback.textContent = "Enviando...";
    feedbackDoFeedback.textContent = "";
    feedbackDoFeedback.className = "form-feedback";

    fetch("https://formspree.io/f/mqpkzdjw", {
      method: "POST",
      body: dadosFeedback,
      headers: { "Accept": "application/json" }
    })
      .then((resposta) => {
        if (resposta.ok) {
          feedbackDoFeedback.textContent = "Obrigado pelo seu feedback! Ele foi enviado com sucesso.";
          feedbackDoFeedback.className = "form-feedback sucesso";
          formularioFeedback.reset();
        } else {
          feedbackDoFeedback.textContent = "Não foi possível enviar seu feedback agora. Tente novamente em instantes.";
          feedbackDoFeedback.className = "form-feedback erro";
        }
      })
      .catch(() => {
        feedbackDoFeedback.textContent = "Não foi possível enviar seu feedback agora. Verifique sua conexão e tente novamente.";
        feedbackDoFeedback.className = "form-feedback erro";
      })
      .finally(() => {
        botaoEnviarFeedback.disabled = false;
        botaoEnviarFeedback.removeAttribute("aria-busy");
        botaoEnviarFeedback.textContent = "Enviar Feedback";
      });
  });


  /* ==========================================================
     8) ANO ATUAL NO RODAPÉ
     Evita ter que atualizar o ano manualmente todo ano.
     ========================================================== */
  document.getElementById("ano-atual").textContent = new Date().getFullYear();

});

// 3ª chamada: quando a página termina de carregar por completo,
// incluindo imagens e fontes. É o momento em que alguns celulares
// "recalculam" a rolagem por causa da mudança de altura da página —
// por isso forçamos o topo mais uma vez aqui, como rede de segurança.
window.addEventListener("load", forcarTopoDaPagina);
