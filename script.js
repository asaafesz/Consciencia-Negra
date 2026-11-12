
const INICIATIVAS = [
  {
    nome: "PretaLab",
    categoria: "ong",
    descricao:
      "Iniciativa que incentiva a presença de mulheres negras e indígenas na tecnologia e na inovação.",
    site: "",
  },
  {
    nome: "AfroPython",
    categoria: "comunidade",
    descricao:
      "Comunidade que ensina programação em Python com foco em ampliar a participação de pessoas negras na área.",
    site: "",
  },
  {
    nome: "Black Rocks Startups",
    categoria: "startup",
    descricao:
      "Iniciativa voltada ao fortalecimento de empreendedores e startups de fundadores negros.",
    site: "",
  },
];

const ROTULOS = {
  ong: "ONG",
  comunidade: "Comunidade",
  startup: "Startup",
};


const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => document.querySelectorAll(seletor);


function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (e) {

  }
}
function carregar(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (e) {
    return null;
  }
}


function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


let filtroAtual = "todos";
let termoBusca = "";

function criarCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  const etiqueta = document.createElement("span");
  etiqueta.className = "card__etiqueta";
  etiqueta.textContent = ROTULOS[item.categoria] || item.categoria;

  const titulo = document.createElement("h3");
  titulo.className = "card__titulo";
  titulo.textContent = item.nome;

  const texto = document.createElement("p");
  texto.className = "card__texto";
  texto.textContent = item.descricao;

  card.append(etiqueta, titulo, texto);

  if (item.site) {
    const link = document.createElement("a");
    link.href = item.site;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "card__link";
    link.textContent = "Conhecer " + item.nome;
    link.setAttribute("aria-label", "Conhecer " + item.nome + " (abre em nova aba)");
    card.append(link);
  }

  return card;
}

function renderizarCards() {
  const lista = $("#lista-iniciativas");
  if (!lista) return;

  const busca = normalizar(termoBusca);
  const filtradas = INICIATIVAS.filter((item) => {
    const passaFiltro = filtroAtual === "todos" || item.categoria === filtroAtual;
    const passaBusca =
      busca === "" || normalizar(item.nome + " " + item.descricao).includes(busca);
    return passaFiltro && passaBusca;
  });

  lista.replaceChildren();
  filtradas.forEach((item) => lista.append(criarCard(item)));


  const contador = $("#contador-resultados");
  if (contador) {
    contador.textContent =
      filtradas.length === 0
        ? "Nenhuma iniciativa encontrada."
        : filtradas.length + (filtradas.length === 1 ? " iniciativa encontrada." : " iniciativas encontradas.");
  }
}

function iniciarFiltros() {
  $$("[data-filtro]").forEach((botao) => {
    botao.addEventListener("click", () => {
      filtroAtual = botao.dataset.filtro;
      $$("[data-filtro]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === botao))
      );
      renderizarCards();
    });
  });

  const campoBusca = $("#busca");
  if (campoBusca) {
    campoBusca.addEventListener("input", (evento) => {
      termoBusca = evento.target.value;
      renderizarCards();
    });
  }
}


let tamanhoFonte = 100;

function aplicarTamanhoFonte() {
  document.documentElement.style.fontSize = tamanhoFonte + "%";
  salvar("cn-fonte", String(tamanhoFonte));
}

function iniciarAcessibilidade() {

  const btnContraste = $("#btn-contraste");
  if (carregar("cn-contraste") === "1") {
    document.body.classList.add("alto-contraste");
    if (btnContraste) btnContraste.setAttribute("aria-pressed", "true");
  }
  if (btnContraste) {
    btnContraste.addEventListener("click", () => {
      const ativo = document.body.classList.toggle("alto-contraste");
      btnContraste.setAttribute("aria-pressed", String(ativo));
      salvar("cn-contraste", ativo ? "1" : "0");
    });
  }


  const salvo = parseInt(carregar("cn-fonte"), 10);
  if (!isNaN(salvo) && salvo >= 80 && salvo <= 150) {
    tamanhoFonte = salvo;
    aplicarTamanhoFonte();
  }

  const btnMais = $("#btn-aumentar");
  const btnMenos = $("#btn-diminuir");
  if (btnMais) {
    btnMais.addEventListener("click", () => {
      tamanhoFonte = Math.min(150, tamanhoFonte + 10);
      aplicarTamanhoFonte();
    });
  }
  if (btnMenos) {
    btnMenos.addEventListener("click", () => {
      tamanhoFonte = Math.max(80, tamanhoFonte - 10);
      aplicarTamanhoFonte();
    });
  }
}


const PERGUNTAS = [
  {
    pergunta: "Em que data se comemora o Dia da Consciência Negra no Brasil?",
    opcoes: ["13 de maio", "20 de novembro", "7 de setembro"],
    correta: 1,
    explicacao:
      "20 de novembro lembra a morte de Zumbi dos Palmares, em 1695, símbolo da resistência à escravidão.",
  },
  {
    pergunta: "Quem foi Zumbi dos Palmares?",
    opcoes: [
      "Líder do Quilombo dos Palmares",
      "Primeiro presidente do Brasil",
      "Autor da Lei Áurea",
    ],
    correta: 0,
    explicacao:
      "Zumbi foi um dos principais líderes do Quilombo dos Palmares, na Serra da Barriga (atual Alagoas).",
  },
  {
    pergunta: "Qual o objetivo de iniciativas como PretaLab e AfroPython?",
    opcoes: [
      "Vender computadores",
      "Ampliar a presença de pessoas negras na tecnologia",
      "Criar redes sociais",
    ],
    correta: 1,
    explicacao:
      "Elas oferecem formação, rede de apoio e oportunidades para reduzir a desigualdade racial na TI.",
  },
];

let perguntaAtual = 0;
let acertos = 0;

function mostrarPergunta() {
  const area = $("#quiz");
  if (!area) return;
  area.replaceChildren();


  if (perguntaAtual >= PERGUNTAS.length) {
    const resultado = document.createElement("p");
    resultado.setAttribute("role", "status");
    resultado.textContent = "Você acertou " + acertos + " de " + PERGUNTAS.length + ".";

    const reiniciar = document.createElement("button");
    reiniciar.type = "button";
    reiniciar.textContent = "Jogar novamente";
    reiniciar.addEventListener("click", () => {
      perguntaAtual = 0;
      acertos = 0;
      mostrarPergunta();
    });

    area.append(resultado, reiniciar);
    return;
  }

  const atual = PERGUNTAS[perguntaAtual];

  const enunciado = document.createElement("p");
  enunciado.className = "quiz__pergunta";
  enunciado.textContent = perguntaAtual + 1 + ". " + atual.pergunta;

  const opcoes = document.createElement("div");
  opcoes.className = "quiz__opcoes";

  const feedback = document.createElement("p");
  feedback.className = "quiz__feedback";
  feedback.setAttribute("role", "status");

  const proxima = document.createElement("button");
  proxima.type = "button";
  proxima.textContent = perguntaAtual === PERGUNTAS.length - 1 ? "Ver resultado" : "Próxima";
  proxima.hidden = true;
  proxima.addEventListener("click", () => {
    perguntaAtual++;
    mostrarPergunta();
  });

  atual.opcoes.forEach((texto, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.addEventListener("click", () => {
      const acertou = indice === atual.correta;
      if (acertou) acertos++;
      feedback.textContent = (acertou ? "Correto! " : "Não foi dessa vez. ") + atual.explicacao;
      opcoes.querySelectorAll("button").forEach((b) => (b.disabled = true));
      proxima.hidden = false;
      proxima.focus();
    });
    opcoes.append(botao);
  });

  area.append(enunciado, opcoes, feedback, proxima);
}

function iniciarVoltarAoTopo() {
  const botao = $("#btn-topo");
  if (!botao) return;

  window.addEventListener("scroll", () => {
    botao.hidden = window.scrollY < 300;
  });
  botao.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  iniciarFiltros();
  renderizarCards();
  iniciarAcessibilidade();
  mostrarPergunta();
  iniciarVoltarAoTopo();
});
