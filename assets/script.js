const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const preview = document.getElementById("preview");
const previewGrid = document.getElementById("preview-grid");

const templates = {
  mix: [
    "Explique la notion principale vue dans la page 2.",
    "Quelle définition correspond au terme clé de la page 3 ?",
    "Vrai ou faux : l'exemple de la page 1 illustre la règle principale.",
    "Choisis la bonne réponse : quel élément est indispensable dans le processus ?",
  ],
  qcm: [
    "QCM : quel est l'objectif principal de cette leçon ?",
    "QCM : quelle étape vient juste après l'introduction ?",
    "QCM : quel concept est lié à l'illustration ?",
  ],
  open: [
    "Décris avec tes mots la notion la plus importante.",
    "Pourquoi ce concept est-il essentiel pour le chapitre ?",
    "Donne un exemple appliqué vu dans les notes.",
  ],
  vf: [
    "Vrai ou faux : la formule principale dépend de deux variables.",
    "Vrai ou faux : la conclusion propose une alternative.",
    "Vrai ou faux : le terme souligné est une définition.",
  ],
};

const sections = [
  "Notions clés",
  "Questions de compréhension",
  "Mise en pratique",
];

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

const buildQuestions = (count, type) => {
  const bank = templates[type] ?? templates.mix;
  return Array.from({ length: count }, () => getRandomItem(bank));
};

const buildCards = (questions) =>
  sections.map((sectionTitle, index) => {
    const chunk = questions.slice(index * 3, index * 3 + 3);
    return {
      sectionTitle,
      chunk,
    };
  });

const renderResults = (cards, summary) => {
  results.innerHTML = "";

  const summaryCard = document.createElement("div");
  summaryCard.className = "result-card";
  summaryCard.innerHTML = `
    <h3>Résumé IA</h3>
    <p>${summary}</p>
  `;
  results.appendChild(summaryCard);

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "result-card";
    cardElement.innerHTML = `
      <h3>${card.sectionTitle}</h3>
      <ul>
        ${card.chunk.map((question) => `<li>${question}</li>`).join("")}
      </ul>
    `;
    results.appendChild(cardElement);
  });
};

const renderPreview = (files) => {
  previewGrid.innerHTML = "";
  if (!files.length) {
    preview.classList.remove("preview--has-items");
    return;
  }

  preview.classList.add("preview--has-items");
  Array.from(files).forEach((file) => {
    const item = document.createElement("div");
    item.className = "preview__item";
    const name = document.createElement("span");
    name.textContent = file.name;

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.className = "preview__thumb";
      img.alt = `Aperçu ${file.name}`;
      img.src = URL.createObjectURL(file);
      item.appendChild(img);
    } else {
      const badge = document.createElement("div");
      badge.className = "preview__badge";
      badge.textContent = "PDF";
      item.appendChild(badge);
    }

    item.appendChild(name);
    previewGrid.appendChild(item);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const count = Number.parseInt(document.getElementById("question-count").value, 10) || 10;
  const type = document.getElementById("question-type").value;
  const level = document.getElementById("level").value;
  const language = document.getElementById("language").value;
  const files = document.getElementById("pages").files;

  const questions = buildQuestions(count, type);
  const cards = buildCards(questions);
  const summary = `IA simulée : ${files.length || "Aucune"} page(s) analysée(s). Niveau ${level}, langue ${
    language === "fr" ? "français" : "anglais"
  }, ${count} question(s) générée(s).`;

  renderResults(cards, summary);
});

document.getElementById("pages").addEventListener("change", (event) => {
  renderPreview(event.target.files);
});
