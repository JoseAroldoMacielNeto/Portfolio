/* ============================================================
   i18n.js
   Sistema de tradução PT/EN do portfólio — HTML/CSS/JS puro,
   sem bibliotecas externas e sem serviços de tradução (Google
   Tradutor etc.). Toda a tradução está definida aqui mesmo.

   COMO FUNCIONA:
   - Cada texto traduzível no HTML recebe um atributo data-i18n="chave"
     (ou data-i18n-placeholder / data-i18n-aria-label para atributos).
   - Este arquivo guarda duas "tabelas" de texto: traducoes.pt e
     traducoes.en, uma chave por texto.
   - A função aplicarIdioma(idioma) percorre todos os elementos com
     esses atributos e troca o conteúdo pelo texto do idioma escolhido.
   - script.js usa window.t("chave") para pegar mensagens de erro/
     sucesso traduzidas no momento em que valida/envia os formulários
     (porque essas mensagens são geradas dinamicamente, não são texto
     fixo no HTML).
   ============================================================ */

const traducoes = {

  pt: {
    // Acessibilidade / navegação
    skip_link: "Pular para o conteúdo principal",
    menu_close_label: "Fechar menu de navegação",
    menu_open_label: "Abrir menu de navegação",
    menu_label: "Menu",
    theme_switch_label: "Alternar entre tema claro e escuro",
    lang_switch_label: "Alternar idioma do site",
    nav_inicio: "Início",
    nav_sobre: "Sobre",
    nav_experiencia: "Experiência",
    nav_skills: "Skills",
    nav_projetos: "Projetos",
    nav_contato: "Contato",
    nav_feedback: "Feedback",

    // Hero
    hero_eyebrow: "&gt; Olá, seja bem-vindo(a)",
    hero_greeting: "Prazer, eu me chamo",
    hero_subtitle: "Estudante de Análise e Desenvolvimento de Sistemas | Em formação na área de Tecnologia",
    hero_description: "Em transição de carreira da área administrativa e de atendimento para a Tecnologia. Estou construindo minha base em programação na Unifor e, por fora, em um curso de Algoritmos e Lógica de Programação — em busca da minha primeira oportunidade de estágio em TI.",
    hero_btn_projetos: "Ver Projetos",
    hero_btn_visualizar_curriculo: "Visualizar Currículo",
    hero_btn_baixar_curriculo: "Baixar Currículo",
    hero_socials_hint: "Clique nos ícones para acessar",
    linkedin_label: "LinkedIn",
    github_label: "GitHub",
    email_label: "E-mail",
    foto_alt: "Foto de perfil de José Arôldo Maciel Neto",

    // Sobre
    sobre_eyebrow: "// sobre-mim",
    sobre_title: "Quem eu sou",
    sobre_p1: "Sou José Arôldo Maciel Neto, cursando Tecnólogo em Análise e Desenvolvimento de Sistemas na Universidade de Fortaleza (Unifor), com previsão de conclusão em fevereiro de 2029. Antes de ingressar em ADS, construí experiência profissional nas áreas administrativa, comercial e de atendimento — e hoje estou em transição de carreira para a Tecnologia.",
    sobre_p2: "Estou no início da minha jornada em programação: por fora da faculdade, faço um curso de Algoritmos e Lógica de Programação para fortalecer minha base antes de avançar em linguagens e frameworks. Este portfólio também é meu principal projeto de estudo — estou aprendendo a entender e evoluir o código à medida que ele é construído.",
    sobre_p3: "No médio/longo prazo, tenho interesse em direcionar minha carreira para Dados, Inteligência Artificial e Ciência de Dados — mas meu foco agora é construir uma base sólida em programação e conquistar minha primeira oportunidade de estágio em TI.",
    code_card_body: '<span class="tk-key">const</span> <span class="tk-var">estudante</span> = {\n  <span class="tk-prop">nome</span>: <span class="tk-str">"José Arôldo Maciel Neto"</span>,\n  <span class="tk-prop">curso</span>: <span class="tk-str">"Tecnólogo em ADS"</span>,\n  <span class="tk-prop">instituicao</span>: <span class="tk-str">"Unifor"</span>,\n  <span class="tk-prop">periodo</span>: <span class="tk-str">"ago/2026 - fev/2029"</span>,\n  <span class="tk-prop">vindoDe</span>: <span class="tk-str">"Administrativo &amp; Atendimento"</span>,\n  <span class="tk-prop">objetivoAtual</span>: <span class="tk-str">"Estágio em TI"</span>,\n  <span class="tk-prop">objetivoFuturo</span>: <span class="tk-str">"Dados / IA"</span>\n};',

    // Experiência
    exp_eyebrow: "// experiência",
    exp_title: "Experiência Profissional",
    exp_subtitle: "Antes de migrar para Tecnologia, construí experiência nas áreas administrativa, comercial e de atendimento — uma base que hoje aplico também em projetos de tecnologia.",
    exp1_period: "Dez/2025 – Jan/2026",
    exp1_title: "Organização Administrativa",
    exp1_empresa: "Escritório Fulgêncio Cruz Advocacia — Freelance",
    exp1_li1: "Organização administrativa e documental",
    exp1_li2: "Planilhas para controle de atendimentos, contratos e demandas",
    exp1_li3: "Organização do Google Drive e estruturação de links de acesso aos documentos dos clientes",
    exp2_period: "Jun/2025 – Out/2025",
    exp2_title: "Bolsista (Bolsa Trabalho) &rarr; Assessor Especial de Gestão",
    exp2_empresa: "Secretaria de Desenvolvimento Econômico",
    exp2_li1: "Atividades administrativas e apoio às atividades da Secretaria",
    exp2_li2: "Organização de informações e de demandas",
    exp3_period: "Jul/2024 – Dez/2024",
    exp3_title: "Atendimento Comercial Online",
    exp3_empresa: "Escritório de Advocacia Cid Lira Braga — Estágio",
    exp3_li1: "Atendimento de leads pelo WhatsApp e atendimento comercial",
    exp3_li2: "Análise inicial das necessidades dos clientes e negociação",
    exp3_li3: "Fechamento de contratos e organização de documentos e informações",
    exp3_li4: "Inserção de dados em sistema e entrada de solicitações relacionadas a benefícios",

    // Skills
    skills_eyebrow: "// habilidades",
    skills_title: "O que eu sei (e o que estou aprendendo)",
    skills_subtitle: "Venho de uma base administrativa e de atendimento, e agora estou construindo, do zero, minha base em tecnologia — por isso separei o que já domino do que ainda estou aprendendo.",
    skills_g1_title: "Organização &amp; Administração",
    skills_g1_i1: "Organização Administrativa",
    skills_g1_i2: "Organização de Documentos e Informações",
    skills_g1_i3: "Introdução à Administração",
    skills_g1_i4: "Estratégia de Negócios",
    skills_g2_title: "Comunicação &amp; Atendimento",
    skills_g2_i1: "Comunicação Interpessoal",
    skills_g2_i2: "Comunicação Empresarial",
    skills_g2_i3: "Atendimento ao Cliente",
    skills_g2_i4: "Gestão de Atendimento",
    skills_g3_title: "Ferramentas",
    skills_g4_title: "Idiomas",
    skills_g4_i1: "Português — Nativo",
    skills_g4_i2: "Inglês — Básico",
    skills_g5_title: "Em aprendizado — Tecnologia",
    skills_g5_i1: "Lógica de Programação",
    skills_g5_i2: "Algoritmos",
    skills_g5_i3: "HTML (iniciando)",
    skills_g5_i4: "CSS (básico)",
    skills_g5_i5: "JavaScript (em breve)",
    skills_g5_i6: "IA como Ferramenta de Produtividade",

    // Projetos
    projetos_eyebrow: "// projetos",
    projetos_title: "Projetos",
    projetos_subtitle: 'Esta seção vai crescer ao longo da minha graduação. Cada card abaixo segue o mesmo padrão — para adicionar um novo projeto no futuro, basta copiar um bloco "project-card" e trocar o conteúdo.',
    proj1_title: "Este Portfólio",
    proj1_desc: "Site pessoal construído com HTML, CSS e JavaScript, com apoio de IA para acelerar o aprendizado, com modo escuro e design responsivo.",
    proj_link_codigo: "Código",
    proj_link_demo: "Demo",
    proj_placeholder_title: "Próximo Projeto",
    proj_placeholder_desc: "Espaço reservado para o próximo projeto da graduação. Substitua por um projeto real assim que concluído.",
    proj_placeholder_tag: "Em breve",
    proj_placeholder_codigo: "Código em breve",
    proj_placeholder_demo: "Demo em breve",

    // Contato
    contato_eyebrow: "// contato",
    contato_title: "Vamos conversar?",
    contato_desc: "Estou disponível para oportunidades de estágio em TI. Envie uma mensagem pelo formulário ou me encontre nas redes abaixo.",
    contato_location: "Itapajé, Ceará, Brasil",
    contato_icons_hint: "Clique nos ícones para acessar",
    copy_email_label: "Copiar endereço de e-mail",
    copy_email_success: "E-mail copiado!",
    copy_email_error: "Não foi possível copiar. Copie manualmente.",

    // Formulário (Contato + Feedback compartilham as mesmas chaves de campo)
    label_nome: "Nome",
    label_email: "E-mail",
    label_mensagem: "Mensagem",
    label_tipo: "Tipo de feedback",
    placeholder_nome: "Seu nome completo",
    placeholder_email: "seu@e-mail.com",
    placeholder_mensagem_contato: "Escreva sua mensagem...",
    placeholder_mensagem_feedback: "Conte o que achou do portfólio...",
    opt_select: "Selecione uma opção",
    opt_elogio: "Elogio",
    opt_sugestao: "Sugestão de melhoria",
    opt_critica: "Crítica construtiva",
    opt_acessibilidade: "Observação sobre acessibilidade",
    opt_navegacao: "Dificuldade na navegação",
    opt_outro: "Outro",
    btn_enviar_mensagem: "Enviar Mensagem",
    btn_enviar_feedback: "Enviar Feedback",
    btn_enviando: "Enviando...",

    // Mensagens de validação/envio (usadas via window.t() no script.js)
    erro_nome: "Digite seu nome completo.",
    erro_email: "Digite um e-mail válido.",
    erro_mensagem: "Escreva uma mensagem com pelo menos 10 caracteres.",
    erro_tipo: "Selecione um tipo de feedback.",
    erro_generico: "Por favor, corrija os campos destacados.",
    sucesso_contato: "Obrigado, {nome}! Sua mensagem foi enviada com sucesso.",
    sucesso_feedback: "Obrigado, {nome}. Seu feedback foi enviado com sucesso.",
    erro_envio_contato: "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.",
    erro_conexao_contato: "Não foi possível enviar sua mensagem agora. Verifique sua conexão e tente novamente.",
    erro_envio_feedback: "Não foi possível enviar seu feedback agora. Tente novamente em instantes.",
    erro_conexao_feedback: "Não foi possível enviar seu feedback agora. Verifique sua conexão e tente novamente.",

    // Feedback (seção)
    feedback_eyebrow: "// feedback",
    feedback_title: "Seu feedback é importante",
    feedback_desc: "Sugestões, elogios, críticas construtivas ou observações sobre a usabilidade e a acessibilidade deste portfólio são muito bem-vindas — ajudam a melhorar o projeto.",

    // Agradecimento
    agradecimento_eyebrow: "// até já",
    agradecimento_title: "Obrigado por chegar até aqui",
    agradecimento_text: 'Se este portfólio despertou alguma dúvida, sugestão ou interesse em conversar, ficarei feliz em receber sua mensagem pelo formulário de <a href="#contato" class="link-inline">contato</a> ou de <a href="#feedback" class="link-inline">feedback</a> acima.',

    // Footer
    footer_rights: "Todos os direitos reservados.",
    back_to_top_label: "Voltar ao topo",

    // SEO / metadados
    meta_title: "José Arôldo Maciel Neto | Portfólio",
    meta_description: "Portfólio de José Arôldo Maciel Neto, estudante de Análise e Desenvolvimento de Sistemas na Unifor, em transição de carreira para Tecnologia.",
    og_locale: "pt_BR",
    html_lang: "pt-BR"
  },

  en: {
    // Accessibility / navigation
    skip_link: "Skip to main content",
    menu_close_label: "Close navigation menu",
    menu_open_label: "Open navigation menu",
    menu_label: "Menu",
    theme_switch_label: "Toggle between light and dark theme",
    lang_switch_label: "Switch site language",
    nav_inicio: "Home",
    nav_sobre: "About",
    nav_experiencia: "Experience",
    nav_skills: "Skills",
    nav_projetos: "Projects",
    nav_contato: "Contact",
    nav_feedback: "Feedback",

    // Hero
    hero_eyebrow: "&gt; Hi, welcome",
    hero_greeting: "I'm",
    hero_subtitle: "Computer Science Student | Building a Career in Technology",
    hero_description: "Transitioning from an administrative and customer service background into Technology. I'm building my programming foundation at Unifor and, alongside it, taking a Programming Logic and Algorithms course — looking for my first IT internship opportunity.",
    hero_btn_projetos: "View Projects",
    hero_btn_visualizar_curriculo: "View Resume",
    hero_btn_baixar_curriculo: "Download Resume",
    hero_socials_hint: "Click the icons to reach out",
    linkedin_label: "LinkedIn",
    github_label: "GitHub",
    email_label: "Email",
    foto_alt: "Profile photo of José Arôldo Maciel Neto",

    // About
    sobre_eyebrow: "// about-me",
    sobre_title: "Who I Am",
    sobre_p1: "I'm José Arôldo Maciel Neto, currently pursuing an Associate Degree in Systems Analysis and Development at Universidade de Fortaleza (Unifor), expected to graduate in February 2029. Before starting my degree, I built professional experience in administrative, sales, and customer service roles — and I'm now transitioning my career into Technology.",
    sobre_p2: "I'm at the beginning of my programming journey: outside of school, I'm taking a Programming Logic and Algorithms course to strengthen my foundation before moving on to languages and frameworks. This portfolio is also my main learning project — I'm studying and evolving the code as it's built.",
    sobre_p3: "In the medium to long term, I'm interested in moving my career toward Data, AI, and Data Science — but my focus right now is building a solid programming foundation and landing my first IT internship.",
    code_card_body: '<span class="tk-key">const</span> <span class="tk-var">student</span> = {\n  <span class="tk-prop">name</span>: <span class="tk-str">"José Arôldo Maciel Neto"</span>,\n  <span class="tk-prop">degree</span>: <span class="tk-str">"Systems Analysis and Development"</span>,\n  <span class="tk-prop">institution</span>: <span class="tk-str">"Unifor"</span>,\n  <span class="tk-prop">period</span>: <span class="tk-str">"Aug/2026 - Feb/2029"</span>,\n  <span class="tk-prop">background</span>: <span class="tk-str">"Admin &amp; Customer Service"</span>,\n  <span class="tk-prop">currentGoal</span>: <span class="tk-str">"IT Internship"</span>,\n  <span class="tk-prop">futureGoal</span>: <span class="tk-str">"Data / AI"</span>\n};',

    // Experience
    exp_eyebrow: "// experience",
    exp_title: "Professional Experience",
    exp_subtitle: "Before moving into Technology, I built experience in administrative, sales, and customer service roles — a foundation I now apply to technology projects as well.",
    exp1_period: "Dec/2025 – Jan/2026",
    exp1_title: "Administrative Organization",
    exp1_empresa: "Fulgêncio Cruz Advocacia Law Office — Freelance",
    exp1_li1: "Administrative and document organization",
    exp1_li2: "Spreadsheets to track client interactions, contracts, and requests",
    exp1_li3: "Google Drive organization and access-link structuring for client documents",
    exp2_period: "Jun/2025 – Oct/2025",
    exp2_title: "Work-Study Intern &rarr; Special Management Advisor",
    exp2_empresa: "Secretariat of Economic Development",
    exp2_li1: "Administrative tasks and support for the Secretariat's activities",
    exp2_li2: "Organization of information and requests",
    exp3_period: "Jul/2024 – Dec/2024",
    exp3_title: "Online Sales Support",
    exp3_empresa: "Cid Lira Braga Law Office — Internship",
    exp3_li1: "Lead handling via WhatsApp and sales support",
    exp3_li2: "Initial assessment of client needs and negotiation",
    exp3_li3: "Contract closing and document organization",
    exp3_li4: "System data entry and benefit-related requests processing",

    // Skills
    skills_eyebrow: "// skills",
    skills_title: "What I Know (and What I'm Learning)",
    skills_subtitle: "I come from an administrative and customer service background, and I'm now building my technology foundation from scratch — that's why I separate what I already have from what I'm still learning.",
    skills_g1_title: "Organization &amp; Administration",
    skills_g1_i1: "Administrative Organization",
    skills_g1_i2: "Document and Information Management",
    skills_g1_i3: "Introduction to Business Administration",
    skills_g1_i4: "Business Strategy",
    skills_g2_title: "Communication &amp; Customer Service",
    skills_g2_i1: "Interpersonal Communication",
    skills_g2_i2: "Business Communication",
    skills_g2_i3: "Customer Service",
    skills_g2_i4: "Service Management",
    skills_g3_title: "Tools",
    skills_g4_title: "Languages",
    skills_g4_i1: "Portuguese — Native",
    skills_g4_i2: "English — Basic",
    skills_g5_title: "Currently Learning — Technology",
    skills_g5_i1: "Programming Logic",
    skills_g5_i2: "Algorithms",
    skills_g5_i3: "HTML (getting started)",
    skills_g5_i4: "CSS (basic)",
    skills_g5_i5: "JavaScript (coming soon)",
    skills_g5_i6: "AI as a Productivity Tool",

    // Projects
    projetos_eyebrow: "// projects",
    projetos_title: "Projects",
    projetos_subtitle: 'This section will grow throughout my degree. Each card below follows the same pattern — adding a new project in the future is as simple as copying a "project-card" block and swapping the content.',
    proj1_title: "This Portfolio",
    proj1_desc: "Personal website built with HTML, CSS, and JavaScript, with AI support to speed up learning, featuring dark mode and a responsive design.",
    proj_link_codigo: "Code",
    proj_link_demo: "Demo",
    proj_placeholder_title: "Next Project",
    proj_placeholder_desc: "Placeholder for my next project during the degree. Will be replaced with a real project once completed.",
    proj_placeholder_tag: "Coming soon",
    proj_placeholder_codigo: "Code coming soon",
    proj_placeholder_demo: "Demo coming soon",

    // Contact
    contato_eyebrow: "// contact",
    contato_title: "Let's Talk?",
    contato_desc: "I'm available for IT internship opportunities. Send a message through the form or find me on the networks below.",
    contato_location: "Itapajé, Ceará, Brazil",
    contato_icons_hint: "Click the icons to reach out",
    copy_email_label: "Copy email address",
    copy_email_success: "Email copied!",
    copy_email_error: "Couldn't copy it. Please copy it manually.",

    // Form (Contact + Feedback share the same field keys)
    label_nome: "Name",
    label_email: "Email",
    label_mensagem: "Message",
    label_tipo: "Feedback type",
    placeholder_nome: "Your full name",
    placeholder_email: "you@email.com",
    placeholder_mensagem_contato: "Write your message...",
    placeholder_mensagem_feedback: "Tell me what you thought of the portfolio...",
    opt_select: "Select an option",
    opt_elogio: "Compliment",
    opt_sugestao: "Suggestion for improvement",
    opt_critica: "Constructive criticism",
    opt_acessibilidade: "Accessibility note",
    opt_navegacao: "Navigation issue",
    opt_outro: "Other",
    btn_enviar_mensagem: "Send Message",
    btn_enviar_feedback: "Send Feedback",
    btn_enviando: "Sending...",

    // Validation/submission messages (used via window.t() in script.js)
    erro_nome: "Please enter your full name.",
    erro_email: "Please enter a valid email address.",
    erro_mensagem: "Write a message with at least 10 characters.",
    erro_tipo: "Please select a feedback type.",
    erro_generico: "Please fix the highlighted fields.",
    sucesso_contato: "Thank you, {nome}! Your message has been sent successfully.",
    sucesso_feedback: "Thank you, {nome}. Your feedback has been sent successfully.",
    erro_envio_contato: "We couldn't send your message right now. Please try again shortly.",
    erro_conexao_contato: "We couldn't send your message right now. Please check your connection and try again.",
    erro_envio_feedback: "We couldn't send your feedback right now. Please try again shortly.",
    erro_conexao_feedback: "We couldn't send your feedback right now. Please check your connection and try again.",

    // Feedback (section)
    feedback_eyebrow: "// feedback",
    feedback_title: "Your Feedback Matters",
    feedback_desc: "Suggestions, compliments, constructive criticism, or notes on this portfolio's usability and accessibility are very welcome — they help improve the project.",

    // Thank-you
    agradecimento_eyebrow: "// see you soon",
    agradecimento_title: "Thanks for Making It This Far",
    agradecimento_text: 'If this portfolio raised any questions, suggestions, or interest in getting in touch, I\'d be glad to hear from you through the <a href="#contato" class="link-inline">contact</a> or <a href="#feedback" class="link-inline">feedback</a> form above.',

    // Footer
    footer_rights: "All rights reserved.",
    back_to_top_label: "Back to top",

    // SEO / metadata
    meta_title: "José Arôldo Maciel Neto | Portfolio",
    meta_description: "Portfolio of José Arôldo Maciel Neto, Systems Analysis and Development student at Unifor, transitioning his career into Technology.",
    og_locale: "en_US",
    html_lang: "en"
  }
};

/* Idioma ativo no momento (começa sempre em português, sem persistência
   entre visitas — comportamento explicitamente pedido). */
let idiomaAtual = "pt";

/* Busca uma chave de tradução no idioma atual. Usada pelo script.js
   para montar mensagens de erro/sucesso dos formulários dinamicamente. */
function t(chave) {
  return traducoes[idiomaAtual][chave] !== undefined
    ? traducoes[idiomaAtual][chave]
    : traducoes.pt[chave];
}

/* Aplica o idioma escolhido a toda a página: percorre os elementos
   marcados com data-i18n (texto), data-i18n-placeholder (placeholder
   de campos) e data-i18n-aria-label (aria-label de botões/links),
   além do <html lang>, <title> e das metatags de SEO/Open Graph. */
function aplicarIdioma(idioma) {
  idiomaAtual = idioma;

  document.querySelectorAll("[data-i18n]").forEach((elemento) => {
    const chave = elemento.getAttribute("data-i18n");
    if (traducoes[idioma][chave] !== undefined) {
      elemento.innerHTML = traducoes[idioma][chave];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((elemento) => {
    const chave = elemento.getAttribute("data-i18n-placeholder");
    if (traducoes[idioma][chave] !== undefined) {
      elemento.setAttribute("placeholder", traducoes[idioma][chave]);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((elemento) => {
    const chave = elemento.getAttribute("data-i18n-aria-label");
    if (traducoes[idioma][chave] !== undefined) {
      elemento.setAttribute("aria-label", traducoes[idioma][chave]);
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((elemento) => {
    const chave = elemento.getAttribute("data-i18n-alt");
    if (traducoes[idioma][chave] !== undefined) {
      elemento.setAttribute("alt", traducoes[idioma][chave]);
    }
  });

  // <html lang="...">, importante para leitores de tela e mecanismos de busca
  document.documentElement.setAttribute("lang", traducoes[idioma].html_lang);

  // <title> e metatags de SEO/Open Graph/Twitter Card
  document.title = traducoes[idioma].meta_title;
  const metaDescricao = document.getElementById("meta-description");
  if (metaDescricao) metaDescricao.setAttribute("content", traducoes[idioma].meta_description);
  const ogTitle = document.getElementById("og-title");
  if (ogTitle) ogTitle.setAttribute("content", traducoes[idioma].meta_title);
  const ogDescricao = document.getElementById("og-description");
  if (ogDescricao) ogDescricao.setAttribute("content", traducoes[idioma].meta_description);
  const ogLocale = document.getElementById("og-locale");
  if (ogLocale) ogLocale.setAttribute("content", traducoes[idioma].og_locale);
  const twitterTitle = document.getElementById("twitter-title");
  if (twitterTitle) twitterTitle.setAttribute("content", traducoes[idioma].meta_title);
  const twitterDescricao = document.getElementById("twitter-description");
  if (twitterDescricao) twitterDescricao.setAttribute("content", traducoes[idioma].meta_description);

  // Estado visual/acessível do próprio controle PT/EN: agora é um botão
  // circular único que mostra o idioma ativo no centro (em vez de uma
  // chave com bolinha deslizante) — atualiza o texto e o aria-pressed.
  const botaoIdioma = document.getElementById("lang-toggle");
  const rotuloIdioma = document.getElementById("lang-toggle-label");
  if (botaoIdioma) {
    botaoIdioma.setAttribute("aria-pressed", idioma === "en" ? "true" : "false");
  }
  if (rotuloIdioma) {
    rotuloIdioma.textContent = idioma === "en" ? "EN" : "PT";
  }
}

/* Liga o botão de idioma assim que o HTML estiver pronto. Fica em um
   listener separado do restante do script.js para manter a lógica de
   idioma isolada e fácil de manter. */
document.addEventListener("DOMContentLoaded", () => {
  const botaoIdioma = document.getElementById("lang-toggle");
  if (botaoIdioma) {
    botaoIdioma.addEventListener("click", () => {
      aplicarIdioma(idiomaAtual === "pt" ? "en" : "pt");
    });
  }
});

// Exposto para o script.js usar nas mensagens dinâmicas dos formulários
window.t = t;
