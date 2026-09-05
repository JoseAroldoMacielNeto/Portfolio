/* ============================================================
   script.js
   ============================================================
   Todo o comportamento INTERATIVO do portfólio (tudo que reage a
   cliques, digitação, rolagem da página etc). Organizado em blocos
   numerados, um por funcionalidade — os números aparecem nos
   comentários "1)", "2)", "3)"... ao longo do arquivo.

   ------------------------------------------------------------
   MAPA GERAL DO PROJETO (como os arquivos se conectam)
   ------------------------------------------------------------
   index.html          → página em português (estrutura/conteúdo)
   en/index.html        → cópia da página em inglês (mesma estrutura,
                           textos traduzidos — ver js/i18n.js)
   css/style.css        → cores, tipografia, layout "base" (desktop)
   css/responsive.css   → ajustes de layout para tablet/celular
                           (usa @media queries — telas menores)
   js/script.js          → ESTE arquivo: cliques, formulários, menu,
                           scroll, tema, cópia de e-mail etc.
   js/i18n.js           → dicionário de textos PT/EN + a função
                           window.t("chave") que este arquivo usa
                           para pegar textos traduzidos (ex.: mensagens
                           de erro/sucesso dos formulários)
   assets/img/, assets/docs/ → imagens, ícones e o PDF do currículo

   Tanto index.html quanto en/index.html carregam os MESMOS dois
   arquivos de JavaScript (js/i18n.js primeiro, depois este). Por
   isso o comportamento é idêntico nas duas páginas — só o texto
   inicial (em português ou inglês) já vem pronto no HTML de cada uma.

   ------------------------------------------------------------
   COMO ESTE ARQUIVO ENCONTRA OS ELEMENTOS DA PÁGINA (conceito-chave)
   ------------------------------------------------------------
   `document.getElementById("algum-id")` é o comando mais usado aqui.
   Ele procura, no HTML, um elemento com `id="algum-id"` e devolve
   esse elemento para o JavaScript poder ler ou alterar. É assim que
   este arquivo "encontra" o botão de tema, os formulários, o menu
   etc. — cada `getElementById` abaixo tem um `id` correspondente
   em algum lugar do HTML (index.html / en/index.html).

   `document.querySelector(".alguma-classe")` faz algo parecido, mas
   busca por CLASSE CSS (ou qualquer seletor CSS) em vez de id — usado
   quando um mesmo tipo de elemento se repete na página (ex.: todos
   os links do menu, `.nav-link`).

   `addEventListener("evento", funcao)` é como "ligamos" uma ação a
   um elemento: "quando o evento X acontecer neste elemento, execute
   esta função". Os eventos mais usados aqui são "click" (clique/toque),
   "input" (a pessoa digitou algo num campo), "submit" (formulário
   enviado) e "keydown" (uma tecla foi pressionada).

   `const` e `let` guardam valores em "variáveis" (caixinhas com nome).
   `const` é usada quando o valor não vai ser trocado depois (ex.: uma
   referência a um botão); `let` quando o valor pode mudar ao longo do
   código. Praticamente tudo neste arquivo usa `const`.

   As funções `() => { ... }` (com essa "seta") são "arrow functions" —
   uma forma mais curta de escrever uma função em JavaScript moderno.
   `function nome() { ... }` (sem seta) é a forma "clássica", usada
   aqui quando a função precisa ser chamada por nome em vários lugares.

   ------------------------------------------------------------
   SE ALGO NÃO FUNCIONAR, COMECE POR AQUI
   ------------------------------------------------------------
   - Menu não abre/fecha → bloco "2) MENU MOBILE" abaixo, e confira se
     o HTML ainda tem `id="menu-toggle"` e `id="nav-links"`.
   - Tema claro/escuro não troca → bloco "1) MODO ESCURO/CLARO", e
     confira `id="theme-toggle"` no HTML e a variável CSS `--color-*`
     em css/style.css.
   - Formulário não envia / mensagem de erro errada → blocos "6)" e
     "7)" abaixo, e confira se js/i18n.js está sendo carregado ANTES
     deste arquivo no HTML (senão `window.t()` não vai existir ainda).
   - Textos aparecem em português quando deveriam estar em inglês (ou
     vice-versa) → isso é controlado por js/i18n.js, não por este
     arquivo.
   - Algo funciona no computador mas não no celular → normalmente é
     regra de CSS em css/responsive.css, não deste arquivo — mas o
     bloco "2)" abaixo tem lógica específica de mobile (o
     `matchMedia("(max-width: 860px)")`), então confira aqui também.
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
// `history` é um objeto que o navegador já disponibiliza (não é algo
// que criamos) — ele controla o histórico de navegação da aba.
// `"scrollRestoration" in history` é uma forma seguranca de checar se
// o navegador atual suporta essa propriedade antes de usá-la.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Remove qualquer #âncora que já esteja na URL no momento em que a
// página é aberta. Isso NÃO afeta cliques nos links do menu depois
// que a página já carregou — eles continuam navegando normalmente.
// `history.replaceState(...)` troca a URL na barra de endereço SEM
// recarregar a página e sem criar uma nova entrada no histórico do
// navegador (diferente de simplesmente mudar `window.location`).
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

// Função reaproveitada nos três momentos do carregamento abaixo.
// Ser uma função separada (em vez de repetir `window.scrollTo(0, 0)`
// três vezes) facilita mudar o comportamento num lugar só, se
// precisar no futuro.
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

     LIGAÇÃO COM O HTML: o botão é `<button id="theme-toggle">`
     (dentro de <header>, nas duas páginas). Se esse `id` mudar no
     HTML, a linha `getElementById("theme-toggle")` abaixo para de
     encontrar o botão e o tema para de funcionar.

     LIGAÇÃO COM O CSS: a aparência de claro/escuro é toda feita em
     css/style.css através de variáveis CSS (`--color-bg`,
     `--color-text` etc.) que mudam de valor conforme o atributo
     `data-theme` do <body> — é exatamente esse atributo que a
     função abaixo (`aplicarTema`) troca. Procure por
     `[data-theme="dark"]` em style.css para ver essas variáveis.
     ========================================================== */
  const body = document.body;
  const botaoTema = document.getElementById("theme-toggle");

  // Função "aplicarTema": recebe "dark" ou "light" como parâmetro
  // (a palavra entre parênteses) e aplica esse tema na página inteira.
  function aplicarTema(tema) {
    // `setAttribute` adiciona ou troca um atributo HTML via JavaScript
    // — aqui, equivalente a mudar manualmente `<body data-theme="dark">`
    // para `<body data-theme="light">` no código-fonte.
    body.setAttribute("data-theme", tema);
    // A posição da bolinha (esquerda/direita) é resolvida via CSS, a
    // partir do data-theme do <body>. Aqui só atualizamos o estado
    // para leitores de tela: aria-checked="true" significa "modo
    // escuro ativado" (convenção do papel ARIA "switch").
    botaoTema.setAttribute("aria-checked", tema === "dark" ? "true" : "false");
    // `localStorage` é uma "gaveta" de armazenamento que o navegador
    // guarda por conta própria, associada a este site — o valor
    // salvo aqui continua disponível mesmo depois de fechar a aba ou
    // desligar o computador, até a pessoa limpar os dados do navegador.
    localStorage.setItem("portfolio-tema", tema);
  }

  // O modo escuro é o padrão do portfólio. Se o usuário já escolheu um
  // tema antes (guardado no localStorage), respeitamos essa escolha.
  // Caso contrário, mantemos o escuro (já definido no <body> do HTML),
  // independentemente da preferência de tema do sistema operacional.
  // `localStorage.getItem(...)` devolve `null` se nada foi salvo ainda
  // — por isso o `if` abaixo funciona como "se existir algo salvo".
  const temaSalvo = localStorage.getItem("portfolio-tema");

  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else {
    aplicarTema("dark");
  }

  // Liga um clique no botão de tema à troca entre "dark" e "light".
  botaoTema.addEventListener("click", () => {
    const temaAtual = body.getAttribute("data-theme");
    const novoTema = temaAtual === "dark" ? "light" : "dark";
    aplicarTema(novoTema);
  });


  /* ==========================================================
     2) MENU MOBILE (um único botão: ☰ Menu ↔ ✕)

     LIGAÇÃO COM O HTML: o botão é `<button id="menu-toggle">` e o
     painel de links é `<ul id="nav-links">` (dentro de <nav>, no
     <header>). Os itens do menu são os `<a class="nav-link">`
     dentro dessa lista.

     LIGAÇÃO COM O CSS: em telas grandes, `#nav-links` aparece como
     uma barra horizontal normal (regra em css/style.css). Em telas
     pequenas, css/responsive.css redefine `.nav-links` para virar um
     painel que desliza — e é a classe `"aberto"` (adicionada abaixo,
     via `classList.add`) que aciona esse painel a aparecer. Ou seja:
     este arquivo só ADICIONA/REMOVE a classe "aberto"; TODA a
     aparência do painel (posição, animação de deslizar, cor de fundo)
     está definida no CSS, procurando por `.nav-links.aberto`.

     Melhorias de acessibilidade adicionadas aqui:
     - aria-hidden no painel do menu quando ele está fechado E a
       tela está em modo mobile (evita que o teclado "entre" em
       links que estão visualmente fora da tela);
     - tecla Esc fecha o menu;
     - o foco é movido para dentro do menu ao abrir, e de volta
       para o botão ao fechar (comportamento esperado por quem
       navega só pelo teclado).

     O mesmo botão cuida de abrir E fechar (clique alterna entre os
     dois estados) — ele nunca muda de tamanho/posição, só o ícone
     (☰/✕) e o rótulo "Menu" (visível só quando fechado) mudam,
     via a classe "aberto" adicionada/removida nele mesmo. Assim a
     fileira de controles do cabeçalho nunca se move ao abrir/fechar.

     SE O MENU NÃO ABRIR/FECHAR: confira se os `id`s abaixo
     (`menu-toggle`, `nav-links`) ainda existem no HTML, e se a
     classe `.nav-links.aberto` ainda existe em css/responsive.css.
     ========================================================== */
  const botaoMenu = document.getElementById("menu-toggle");
  const linksNav = document.getElementById("nav-links");

  // Detecta se estamos no layout mobile (mesmo breakpoint usado no CSS,
  // em responsive.css). Usamos isso para saber quando o menu deve
  // ficar "escondido de verdade" (aria-hidden) quando fechado.
  // `window.matchMedia(...)` é a versão em JavaScript de uma media
  // query CSS — devolve um objeto com `.matches` (true/false, se a
  // condição bate agora) e permite "escutar" quando isso muda (linha
  // `.addEventListener("change", ...)`, mais abaixo), por exemplo
  // quando a pessoa gira o celular ou redimensiona a janela.
  const consultaTelaMobile = window.matchMedia("(max-width: 860px)");

  function sincronizarAcessibilidadeMenu() {
    const emTelaMobile = consultaTelaMobile.matches;
    // `classList.contains("aberto")` verifica se o elemento tem essa
    // classe CSS aplicada no momento — devolve true ou false.
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
    // `classList.add("aberto")` acrescenta essa classe ao elemento —
    // é o "interruptor" que o CSS observa para mudar a aparência.
    linksNav.classList.add("aberto");
    botaoMenu.classList.add("aberto"); // troca ☰+"Menu" por ✕ via CSS, sem mudar o tamanho do botão
    botaoMenu.setAttribute("aria-expanded", "true");
    // Troca o ícone do Font Awesome mudando a própria classe CSS do
    // <i> dentro do botão (de "fa-bars", as 3 linhas, para "fa-xmark", o X).
    botaoMenu.querySelector("i").className = "fa-solid fa-xmark";
    sincronizarAcessibilidadeMenu();
    // Leva o foco para o primeiro link do painel recém-aberto (não há
    // mais um botão de fechar dedicado dentro do painel — o próprio
    // botão do cabeçalho, sempre visível, cuida de fechar também).
    const primeiroLink = linksNav.querySelector(".nav-link");
    if (primeiroLink) primeiroLink.focus();
  }

  // Função reutilizada para fechar o menu, seja pelo próprio botão, pela
  // tecla Esc, por um clique em um link, ou por qualquer outra ação.
  function fecharMenuMobile() {
    const estavaAberto = linksNav.classList.contains("aberto");
    // `classList.remove("aberto")` faz o oposto de `.add(...)`.
    linksNav.classList.remove("aberto");
    botaoMenu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.querySelector("i").className = "fa-solid fa-bars";
    sincronizarAcessibilidadeMenu();

    // Só devolve o foco ao botão se o menu realmente estava aberto
    // (evita "roubar" o foco em outras situações).
    if (estavaAberto) {
      botaoMenu.focus();
    }
  }

  // Um clique no botão decide se deve abrir ou fechar, verificando o
  // estado atual do painel antes de agir.
  botaoMenu.addEventListener("click", () => {
    const estaFechado = !linksNav.classList.contains("aberto");
    if (estaFechado) {
      abrirMenuMobile();
    } else {
      fecharMenuMobile();
    }
  });

  // Tecla Esc fecha o menu mobile quando ele estiver aberto.
  // O evento "keydown" dispara sempre que QUALQUER tecla é pressionada
  // em QUALQUER lugar da página; por isso verificamos, dentro da
  // função, se a tecla é "Escape" E se o menu está de fato aberto.
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && linksNav.classList.contains("aberto")) {
      fecharMenuMobile();
    }
  });

  // Fecha o menu automaticamente ao clicar em algum link (útil no celular).
  // `querySelectorAll(".nav-link")` devolve uma LISTA de todos os
  // elementos com essa classe (não só um, como `querySelector` no
  // singular) — por isso usamos `.forEach(...)` para repetir a mesma
  // ação (ligar o evento de clique) em cada um deles.
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

     LIGAÇÃO COM O HTML: o elemento é `<header id="header">`.
     LIGAÇÃO COM O CSS: a sombra/aparência em si está na classe
     `.scrolled` em css/style.css — este script só ADICIONA ou
     REMOVE essa classe; a aparência visual fica 100% no CSS.
     ========================================================== */
  const header = document.getElementById("header");

  // O evento "scroll" dispara toda vez que a página é rolada.
  // `classList.toggle("scrolled", condição)` é um atalho: se a
  // condição for `true`, adiciona a classe "scrolled"; se for
  // `false`, remove — sem precisar escrever um if/else manual.
  // `window.scrollY` é a distância (em pixels) que a página já
  // rolou a partir do topo.
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });


  /* ==========================================================
     4) DESTACAR O LINK DO MENU CORRESPONDENTE À SEÇÃO VISÍVEL
     Usamos IntersectionObserver: uma API do navegador que "observa"
     elementos e avisa quando eles entram ou saem da tela,
     sem precisar calcular posições manualmente a cada scroll.

     LIGAÇÃO COM O HTML: observa todo `<section>` que tenha um `id`
     (Hero, Sobre, Experiência, Skills, Projetos, Contato, Feedback,
     Agradecimento) e compara com o `href="#algumId"` de cada
     `<a class="nav-link">` do menu.
     LIGAÇÃO COM O CSS: a classe `.active` (adicionada abaixo) é o
     que estiliza o link "destacado" no menu — ver `.nav-link.active`
     ou similar em css/style.css.
     ========================================================== */
  const secoes = document.querySelectorAll("section[id]");
  const linksMenu = document.querySelectorAll(".nav-link");

  // `new IntersectionObserver(funcao, opcoes)` cria um "observador".
  // A função passada é chamada automaticamente pelo navegador sempre
  // que algum elemento observado entra ou sai da área visível da
  // tela — não precisamos ficar checando isso manualmente a cada
  // pixel rolado (o que seria caro em performance).
  const observerMenu = new IntersectionObserver(
    (entradas) => {
      // "entradas" é uma lista com um item por elemento observado que
      // mudou de estado (entrou ou saiu da tela) desde a última vez.
      entradas.forEach((entrada) => {
        // `entrada.isIntersecting` é `true` quando o elemento está
        // (pelo menos parcialmente) visível na tela agora.
        if (entrada.isIntersecting) {
          const idAtual = entrada.target.getAttribute("id");
          linksMenu.forEach((link) => {
            // Um "template string" (as crases `` `...` ``) permite
            // montar um texto inserindo uma variável dentro dele com
            // `${idAtual}` — aqui, monta algo como "#sobre" para
            // comparar com o `href` de cada link.
            link.classList.toggle("active", link.getAttribute("href") === `#${idAtual}`);
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" } // considera "ativa" a seção que passa pelo meio da tela
  );

  // Manda o observador acima "vigiar" cada seção da página.
  secoes.forEach((secao) => observerMenu.observe(secao));


  /* ==========================================================
     5) ANIMAÇÃO DE ENTRADA DOS ELEMENTOS (scroll reveal)
     Elementos com a classe "reveal" começam invisíveis (ver CSS)
     e ganham a classe "ativo" quando entram na tela.

     LIGAÇÃO COM O HTML: qualquer elemento com `class="reveal"`
     no HTML (várias seções e cards têm essa classe).
     LIGAÇÃO COM O CSS: `.reveal` (estado inicial, invisível) e
     `.reveal.ativo` (estado final, visível, com transição) estão
     definidos em css/style.css — a "animação" em si (opacidade e
     deslocamento suave) é toda feita por `transition` no CSS; este
     script só adiciona a classe "ativo" na hora certa.
     ========================================================== */
  const elementosReveal = document.querySelectorAll(".reveal");

  const observerReveal = new IntersectionObserver(
    // Aqui a função recebe DOIS parâmetros: "entradas" (a lista de
    // mudanças, igual ao observer acima) e "observer" (uma referência
    // a este próprio observador, usada logo abaixo para "desligar" a
    // vigilância depois que o elemento já apareceu uma vez).
    (entradas, observer) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("ativo");
          // `unobserve` para de vigiar ESTE elemento específico —
          // assim a animação acontece só na primeira vez que ele
          // aparece na tela, não toda vez que a pessoa rola para
          // cima e para baixo passando por ele de novo.
          observer.unobserve(entrada.target); // anima só uma vez
        }
      });
    },
    { threshold: 0.15 } // dispara quando 15% do elemento já estiver visível
  );

  elementosReveal.forEach((elemento) => observerReveal.observe(elemento));


  /* ==========================================================
     6) VALIDAÇÃO + ENVIO DO FORMULÁRIO DE CONTATO (via Formspree)
     Primeiro validamos os campos no navegador (client-side).
     Se estiverem válidos, enviamos os dados para o Formspree usando
     fetch(): uma forma do JavaScript fazer uma requisição para um
     servidor sem recarregar a página. O Formspree recebe os dados
     e encaminha para o e-mail cadastrado na conta do Formspree.

     LIGAÇÃO COM O HTML: `<form id="contato-form">`, os campos
     `id="nome"`, `id="email"`, `id="mensagem"`, o botão
     `id="botao-enviar"` e a área de mensagem `id="form-feedback"`.
     Cada campo tem também um `<span id="erro-nome">` (e equivalentes)
     onde a mensagem de erro específica daquele campo é escrita.
     LIGAÇÃO COM CSS: a classe `.input-invalido` (borda vermelha) e
     `.form-feedback.erro` / `.form-feedback.sucesso` (cor da
     mensagem final) estão em css/style.css.
     LIGAÇÃO COM js/i18n.js: as mensagens (`window.t("erro_nome")`
     etc.) vêm do dicionário de traduções desse outro arquivo — se o
     texto de erro parecer "errado", o texto em si mora lá, não aqui.

     SE O FORMULÁRIO NÃO ENVIAR: abra o Console do navegador
     (botão direito → Inspecionar → aba Console) e veja se aparece
     algum erro relacionado a "formspree.io" — normalmente indica
     problema de conexão ou configuração no lado do Formspree, não
     neste código.
     ========================================================== */
  const formulario = document.getElementById("contato-form");
  const feedback = document.getElementById("form-feedback");
  const botaoEnviar = document.getElementById("botao-enviar");

  // Função "mostrarErro": recebe o `id` do campo com problema e o
  // texto da mensagem, e aplica os dois (borda vermelha + texto)
  // de uma vez. Ter isso como função evita repetir essas 4 linhas
  // para cada campo de cada formulário.
  function mostrarErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    // Um "template string" (crases) monta o id do <span> de erro
    // correspondente — ex.: campoId "nome" vira "erro-nome".
    const erro = document.getElementById(`erro-${campoId}`);
    campo.classList.add("input-invalido");
    campo.setAttribute("aria-invalid", "true"); // avisa leitores de tela que o campo está inválido
    erro.textContent = mensagem;
  }

  // Função oposta: remove a marcação de erro de um campo.
  function limparErro(campoId) {
    const campo = document.getElementById(campoId);
    const erro = document.getElementById(`erro-${campoId}`);
    campo.classList.remove("input-invalido");
    campo.removeAttribute("aria-invalid");
    erro.textContent = "";
  }

  // Uma "regex" (expressão regular) é um padrão de texto usado para
  // validar/buscar formatos específicos — aqui, um formato básico de
  // e-mail (algo@algo.algo). `.test(valor)` devolve true/false
  // dizendo se o texto bate com o padrão.
  // Mesma expressão usada nas duas validações de envio (Contato e
  // Feedback) — reaproveitada aqui para a checagem "ao vivo".
  const regexEmailAoVivo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Liga um campo a uma função de "está válido?": assim que o valor
     do campo atender à regra, o erro daquele campo some imediatamente
     — sem esperar um novo envio do formulário. Funciona com o evento
     "input" (campos de texto) ou "change" (o <select> do Feedback).

     Repare que o terceiro parâmetro, `estaValido`, é uma FUNÇÃO — em
     JavaScript, funções podem ser passadas como valor para outras
     funções, assim como um número ou um texto. Isso permite usar a
     MESMA função `limparErroAoDigitar` para regras de validação
     diferentes (nome, e-mail, mensagem, select), só trocando qual
     "função de validação" é passada em cada chamada logo abaixo. */
  function limparErroAoDigitar(campoId, evento, estaValido) {
    const campo = document.getElementById(campoId);
    campo.addEventListener(evento, () => {
      // `estaValido(...)` executa a função que foi passada como
      // parâmetro, com o valor atual do campo.
      if (estaValido(campo.value.trim())) {
        limparErro(campoId);
      }
    });
  }

  // Cada linha abaixo "liga" um campo à sua regra de validação
  // específica — a parte `(valor) => ...` é a função passada como
  // terceiro parâmetro, explicada no comentário acima.

  // Vamos conversar
  limparErroAoDigitar("nome", "input", (valor) => valor.length >= 3);
  limparErroAoDigitar("email", "input", (valor) => regexEmailAoVivo.test(valor));
  limparErroAoDigitar("mensagem", "input", (valor) => valor.length >= 10);

  // Feedback
  limparErroAoDigitar("feedback-nome", "input", (valor) => valor.length >= 3);
  limparErroAoDigitar("feedback-email", "input", (valor) => regexEmailAoVivo.test(valor));
  limparErroAoDigitar("feedback-tipo", "change", (valor) => valor !== "");
  limparErroAoDigitar("feedback-mensagem", "input", (valor) => valor.length >= 10);

  // O evento "submit" dispara quando o formulário é enviado (clique
  // no botão "Enviar Mensagem" ou tecla Enter dentro de um campo).
  formulario.addEventListener("submit", (evento) => {
    // `preventDefault()` cancela o comportamento padrão do navegador
    // para este evento — sem isso, o navegador recarregaria a página
    // inteira ao enviar o formulário (o jeito "antigo", sem JavaScript).
    evento.preventDefault(); // impede o recarregamento padrão da página

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    // Expressão regular simples para validar o formato do e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let formularioValido = true;

    ["nome", "email", "mensagem"].forEach(limparErro);

    if (nome.length < 3) {
      mostrarErro("nome", window.t("erro_nome"));
      formularioValido = false;
    }

    if (!regexEmail.test(email)) {
      mostrarErro("email", window.t("erro_email"));
      formularioValido = false;
    }

    if (mensagem.length < 10) {
      mostrarErro("mensagem", window.t("erro_mensagem"));
      formularioValido = false;
    }

    if (!formularioValido) {
      feedback.textContent = window.t("erro_generico");
      feedback.className = "form-feedback";
      // Move o foco para o primeiro campo com erro, na mesma ordem em
      // que aparecem no formulário — essencial para quem usa teclado
      // ou leitor de tela encontrar rapidamente o que precisa corrigir.
      const primeiroCampoInvalido = formulario.querySelector(".input-invalido");
      if (primeiroCampoInvalido) {
        primeiroCampoInvalido.focus();
      }
      return;
    }

    /* --- ENVIO REAL VIA FORMSPREE ---
       `new FormData(formulario)` é um recurso do navegador que lê
       automaticamente TODOS os campos preenchidos dentro do <form>
       (pelo atributo `name` de cada `<input>`/`<textarea>`) e monta
       um "pacote de dados" pronto para enviar — sem precisar montar
       esse pacote campo por campo manualmente. */
    const dadosFormulario = new FormData(formulario);

    // Desabilita o botão e avisa que o envio está em andamento,
    // evitando que a pessoa clique duas vezes por engano.
    // aria-busy comunica esse estado de "carregando" para leitores de tela.
    botaoEnviar.disabled = true;
    botaoEnviar.setAttribute("aria-busy", "true");
    botaoEnviar.textContent = window.t("btn_enviando");
    feedback.textContent = "";
    feedback.className = "form-feedback";

    /* `fetch(url, opções)` é a forma padrão do JavaScript moderno de
       fazer uma requisição a um servidor (aqui, o Formspree) sem
       recarregar a página. Ela devolve uma "Promise" — uma promessa
       de que, no futuro, teremos uma resposta (sucesso ou falha).
       As três funções encadeadas abaixo lidam com essa promessa:
       - `.then(...)`   → roda quando o servidor RESPONDEU (mesmo que
                          a resposta indique erro, como "resposta.ok"
                          sendo `false` — por isso checamos isso dentro);
       - `.catch(...)`  → roda só se a requisição nem chegou a
                          completar (sem internet, servidor fora do ar);
       - `.finally(...)` → roda sempre, em qualquer um dos dois casos
                          acima — por isso é o lugar certo para
                          "reabilitar o botão", que deve acontecer
                          independente do resultado. */
    fetch("https://formspree.io/f/mqpkzdjw", {
      method: "POST",
      body: dadosFormulario,
      headers: {
        "Accept": "application/json" // pede ao Formspree uma resposta em JSON, sem redirecionar de página
      }
    })
      .then((resposta) => {
        if (resposta.ok) {
          feedback.textContent = window.t("sucesso_contato").replace("{nome}", nome);
          feedback.className = "form-feedback sucesso";
          // Limpa só a Mensagem — Nome e E-mail permanecem preenchidos,
          // para o caso da pessoa querer enviar outra mensagem depois.
          document.getElementById("mensagem").value = "";
        } else {
          // O Formspree respondeu, mas indicando que algo deu errado
          // (ex.: limite de envios, formulário mal configurado etc.)
          feedback.textContent = window.t("erro_envio_contato");
          feedback.className = "form-feedback erro";
        }
      })
      .catch(() => {
        // Erro de rede: sem internet, servidor fora do ar, etc.
        feedback.textContent = window.t("erro_conexao_contato");
        feedback.className = "form-feedback erro";
      })
      .finally(() => {
        // Reabilita o botão de envio, com sucesso ou com erro
        botaoEnviar.disabled = false;
        botaoEnviar.removeAttribute("aria-busy");
        botaoEnviar.textContent = window.t("btn_enviar_mensagem");
      });
  });


  /* ==========================================================
     7) FORMULÁRIO DE FEEDBACK SOBRE O PORTFÓLIO
     Reaproveita o MESMO endpoint do Formspree do formulário de
     Contato — a lógica de validação e envio segue exatamente o
     mesmo padrão explicado em detalhe no bloco "6)" acima (fetch,
     Promises .then/.catch/.finally, FormData); os comentários aqui
     focam só no que é DIFERENTE deste formulário.

     LIGAÇÃO COM O HTML: `<form id="feedback-form">`, campos
     `id="feedback-nome"`, `id="feedback-email"`,
     `id="feedback-tipo"` (um `<select>`, não um campo de texto) e
     `id="feedback-mensagem"`.

     DIFERENÇAS em relação ao formulário de Contato:
     - Todos os 4 campos (nome, e-mail, tipo, mensagem) são
       obrigatórios aqui também — validados um a um logo abaixo.
     - Existe um campo extra a validar: "Tipo de feedback", que é
       um `<select>` (lista suspensa) em vez de um campo de texto —
       por isso sua validação verifica `!tipo` (string vazia) em vez
       de contar caracteres.
     - O `<form>` tem um campo oculto `<input type="hidden"
       name="_subject">` no HTML (não neste arquivo) que muda o
       assunto do e-mail que chega no Formspree, para diferenciar um
       feedback de uma mensagem de contato comum.
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
      mostrarErro("feedback-nome", window.t("erro_nome"));
      formularioValido = false;
    }

    if (!regexEmail.test(email)) {
      mostrarErro("feedback-email", window.t("erro_email"));
      formularioValido = false;
    }

    if (!tipo) {
      mostrarErro("feedback-tipo", window.t("erro_tipo"));
      formularioValido = false;
    }

    if (mensagem.length < 10) {
      mostrarErro("feedback-mensagem", window.t("erro_mensagem"));
      formularioValido = false;
    }

    if (!formularioValido) {
      feedbackDoFeedback.textContent = window.t("erro_generico");
      feedbackDoFeedback.className = "form-feedback";
      // Mesmo comportamento do formulário de Contato: foco vai para o
      // primeiro campo com erro (funciona também para o <select> do
      // Tipo de feedback, já que ele recebe a mesma classe de erro).
      const primeiroCampoInvalidoFeedback = formularioFeedback.querySelector(".input-invalido");
      if (primeiroCampoInvalidoFeedback) {
        primeiroCampoInvalidoFeedback.focus();
      }
      return;
    }

    const dadosFeedback = new FormData(formularioFeedback);

    botaoEnviarFeedback.disabled = true;
    botaoEnviarFeedback.setAttribute("aria-busy", "true");
    botaoEnviarFeedback.textContent = window.t("btn_enviando");
    feedbackDoFeedback.textContent = "";
    feedbackDoFeedback.className = "form-feedback";

    fetch("https://formspree.io/f/mqpkzdjw", {
      method: "POST",
      body: dadosFeedback,
      headers: { "Accept": "application/json" }
    })
      .then((resposta) => {
        if (resposta.ok) {
          feedbackDoFeedback.textContent = window.t("sucesso_feedback").replace("{nome}", nome);
          feedbackDoFeedback.className = "form-feedback sucesso";
          // Nome e E-mail permanecem preenchidos. Só o Tipo volta para a
          // opção inicial ("Selecione uma opção") e a Mensagem é limpa.
          document.getElementById("feedback-tipo").value = "";
          document.getElementById("feedback-mensagem").value = "";
        } else {
          feedbackDoFeedback.textContent = window.t("erro_envio_feedback");
          feedbackDoFeedback.className = "form-feedback erro";
        }
      })
      .catch(() => {
        feedbackDoFeedback.textContent = window.t("erro_conexao_feedback");
        feedbackDoFeedback.className = "form-feedback erro";
      })
      .finally(() => {
        botaoEnviarFeedback.disabled = false;
        botaoEnviarFeedback.removeAttribute("aria-busy");
        botaoEnviarFeedback.textContent = window.t("btn_enviar_feedback");
      });
  });


  /* ==========================================================
     8) SINCRONIZAÇÃO DE NOME/E-MAIL ENTRE OS DOIS FORMULÁRIOS
     Quando a pessoa digita o Nome ou o E-mail em um formulário
     (Contato ou Feedback), o mesmo valor é copiado automaticamente
     para o campo equivalente no outro — assim ela não precisa
     redigitar. Funciona nos dois sentidos, só enquanto a página
     está aberta: nada é salvo (sem localStorage/sessionStorage) e
     nada é enviado para fora até o envio real do formulário.

     LIGAÇÃO COM O HTML: os 4 campos são `id="nome"`, `id="email"`
     (formulário de Contato) e `id="feedback-nome"`,
     `id="feedback-email"` (formulário de Feedback).
     ========================================================== */
  const campoNomeContato = document.getElementById("nome");
  const campoEmailContato = document.getElementById("email");
  const campoNomeFeedback = document.getElementById("feedback-nome");
  const campoEmailFeedback = document.getElementById("feedback-email");

  // Função genérica: liga um campo de "origem" a um campo de
  // "destino", copiando o valor digitado sempre que o de origem
  // mudar. É chamada 4 vezes logo abaixo, com os campos invertidos
  // nas duas últimas chamadas — é assim que a sincronização funciona
  // "nos dois sentidos" (Contato → Feedback E Feedback → Contato).
  function sincronizarCampo(origem, destino) {
    // O evento "input" dispara a cada tecla digitada no campo — mais
    // "ao vivo" do que esperar a pessoa sair do campo (evento "blur")
    // ou enviar o formulário.
    origem.addEventListener("input", () => {
      destino.value = origem.value;
    });
  }

  sincronizarCampo(campoNomeContato, campoNomeFeedback);
  sincronizarCampo(campoNomeFeedback, campoNomeContato);
  sincronizarCampo(campoEmailContato, campoEmailFeedback);
  sincronizarCampo(campoEmailFeedback, campoEmailContato);


  /* ==========================================================
     9) COPIAR E-MAIL (seção Contato)
     Botão discreto ao lado do e-mail: copia o endereço para a área
     de transferência usando a Clipboard API nativa do navegador —
     sem nenhuma biblioteca externa. O link mailto: continua
     funcionando normalmente ao lado, sem nenhuma alteração.

     LIGAÇÃO COM O HTML: `<button id="copiar-email"
     data-email="...">`. O endereço de e-mail está guardado no
     ATRIBUTO PERSONALIZADO `data-email` do próprio botão (não em
     texto visível) — `data-*` é a forma padrão em HTML de guardar
     um dado extra num elemento, que só o JavaScript usa. A área
     `id="copiar-email-feedback"` mostra a confirmação ("E-mail
     copiado!") por alguns segundos.
     ========================================================== */
  const botaoCopiarEmail = document.getElementById("copiar-email");
  const feedbackCopiarEmail = document.getElementById("copiar-email-feedback");

  // O `if` abaixo é uma proteção: só liga o evento de clique se o
  // botão realmente existir na página naquele momento — evita erro
  // caso este trecho de código seja usado em alguma página sem esse
  // botão específico.
  if (botaoCopiarEmail) {
    botaoCopiarEmail.addEventListener("click", () => {
      // `getAttribute("data-email")` lê o valor guardado nesse
      // atributo personalizado, explicado no comentário acima.
      const email = botaoCopiarEmail.getAttribute("data-email");

      // `navigator.clipboard` é a API do navegador para ler/escrever
      // na área de transferência do sistema operacional.
      // `.writeText(...)` também devolve uma Promise (igual o
      // `fetch` do bloco 6) — por isso usa o mesmo padrão
      // `.then/.catch/.finally`.
      navigator.clipboard.writeText(email)
        .then(() => {
          feedbackCopiarEmail.textContent = window.t("copy_email_success");
        })
        .catch(() => {
          // Alguns navegadores/contextos (ex.: sem HTTPS) podem bloquear
          // a Clipboard API — avisa a pessoa para copiar manualmente.
          feedbackCopiarEmail.textContent = window.t("copy_email_error");
        })
        .finally(() => {
          // `setTimeout(funcao, milissegundos)` agenda a execução de
          // uma função depois de um tempo — aqui, apaga a mensagem de
          // confirmação depois de 2500ms (2,5 segundos), então a
          // confirmação some sozinha, sem a pessoa precisar fazer nada.
          setTimeout(() => {
            feedbackCopiarEmail.textContent = "";
          }, 2500);
        });
    });
  }


  /* ==========================================================
     10) ANO ATUAL NO RODAPÉ
     Evita ter que atualizar o ano manualmente todo ano.

     LIGAÇÃO COM O HTML: `<span id="ano-atual">`, dentro do
     `<footer>` — o texto "© <span id="ano-atual"></span> José..."
     já existe pronto no HTML; este código só preenche o número.
     ========================================================== */
  // `new Date()` cria um objeto representando a data/hora ATUAL do
  // computador de quem está vendo a página. `.getFullYear()` extrai
  // só o ano desse objeto (ex.: 2026).
  document.getElementById("ano-atual").textContent = new Date().getFullYear();

}); // fim da função que roda em "DOMContentLoaded" (ver o início do arquivo)

// 3ª chamada: quando a página termina de carregar por completo,
// incluindo imagens e fontes. É o momento em que alguns celulares
// "recalculam" a rolagem por causa da mudança de altura da página —
// por isso forçamos o topo mais uma vez aqui, como rede de segurança.
// Repare que esta linha está FORA do bloco `DOMContentLoaded` lá em
// cima — ela precisa ficar fora porque o evento "load" (página 100%
// pronta, com imagens) acontece DEPOIS do "DOMContentLoaded" (só o
// HTML pronto); se estivesse dentro, esse listener de "load" nunca
// seria registrado a tempo em alguns casos.
window.addEventListener("load", forcarTopoDaPagina);


/* ============================================================
   GLOSSÁRIO — TERMOS E CONCEITOS USADOS NESTE ARQUIVO
   ============================================================
   (Só para consulta/estudo — não afeta o funcionamento do site.)

   TERMO                    | O QUE É                                                          | ONDE APARECE / PARA QUE SERVE AQUI
   --------------------------|-------------------------------------------------------------------|--------------------------------------------------------------
   const                    | Cria uma variável cujo valor não muda depois de definido          | Quase todas as referências a elementos (ex.: `const header = ...`)
   let                      | Cria uma variável cujo valor PODE mudar depois                    | Não é usada neste arquivo — tudo aqui é `const`
   função "clássica"        | `function nome() { ... }`                                        | `forcarTopoDaPagina`, `aplicarTema`, `mostrarErro`, etc.
   arrow function           | `() => { ... }`, forma curta de escrever função                  | Dentro da maioria dos `addEventListener(..., () => {...})`
   document                 | Objeto que representa a página HTML inteira                       | Usado em quase toda linha para "encontrar" elementos
   window                   | Objeto que representa a janela/aba do navegador                   | `window.scrollTo`, `window.location`, `window.matchMedia`
   getElementById           | Busca UM elemento pelo atributo `id`                              | Ex.: `document.getElementById("theme-toggle")`
   querySelector            | Busca o PRIMEIRO elemento que bate com um seletor CSS              | Ex.: `botaoMenu.querySelector("i")`
   querySelectorAll         | Busca TODOS os elementos que batem com um seletor CSS              | Ex.: `document.querySelectorAll(".nav-link")`
   addEventListener         | "Liga" uma função para rodar quando um evento acontecer            | click, input, submit, keydown, scroll, change, load
   classList.add/remove     | Adiciona/remove uma classe CSS de um elemento via JavaScript        | Ex.: `linksNav.classList.add("aberto")`
   classList.toggle         | Liga/desliga uma classe CSS (com condição opcional)                | Ex.: `header.classList.toggle("scrolled", window.scrollY > 10)`
   setAttribute/getAttribute| Define/lê um atributo HTML via JavaScript                          | `data-theme`, `aria-expanded`, `data-email` etc.
   data-* (atributo)        | Atributo HTML "personalizado" para guardar dados que só o JS usa   | `data-email` no botão de copiar e-mail
   localStorage             | "Gaveta" de armazenamento do navegador, persiste entre visitas     | Guarda o tema escolhido (claro/escuro)
   IntersectionObserver     | API do navegador que avisa quando um elemento entra/sai da tela    | Menu ativo (bloco 4) e animações de entrada (bloco 5)
   fetch                    | Faz uma requisição a um servidor sem recarregar a página            | Envio dos dois formulários para o Formspree
   Promise / .then/.catch/.finally | Forma de lidar com algo que "vai acontecer no futuro" (uma resposta) | Resultado do `fetch` e do `navigator.clipboard.writeText`
   FormData                 | Junta automaticamente os campos de um `<form>` para enviar          | `new FormData(formulario)` nos dois formulários
   regex (expressão regular)| Padrão de texto para validar/buscar formatos                       | `regexEmailAoVivo`, validação de e-mail
   template string          | Texto entre crases `` ` `` que permite inserir variáveis com `${}` | `` `erro-${campoId}` ``, `` `#${idAtual}` ``
   matchMedia                | Versão em JS de uma media query CSS                                | Detecta se a tela está no modo mobile (bloco 2)
   navigator.clipboard       | API do navegador para copiar/colar na área de transferência        | Botão "copiar e-mail" (bloco 9)
   setTimeout                | Executa algo depois de um tempo (em milissegundos)                 | Some a mensagem "E-mail copiado!" depois de 2,5s
   parâmetro de função       | Um "espaço reservado" para um valor que a função vai receber       | `function mostrarErro(campoId, mensagem)`
   função como parâmetro     | Passar uma função para dentro de outra função                     | `limparErroAoDigitar(campoId, evento, estaValido)`
   ============================================================ */
