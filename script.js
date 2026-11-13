const STORAGE_KEY = "catapultes-lego-work-v1";

const hypothesesCatalog = [
  {
    id: "arm_length",
    category: "Mecànica",
    title: "Longitud del braç",
    question: "Què passarà si modifiqueu la longitud del braç?",
    effects: ["Pot canviar la distància", "Pot modificar la velocitat de l'extrem", "Pot afectar l'estabilitat", "Pot modificar la precisió"]
  },
  {
    id: "fulcrum_position",
    category: "Mecànica",
    title: "Posició del fulcre",
    question: "Què passarà si desplaceu el punt de gir?",
    effects: ["Pot modificar la força disponible", "Pot canviar el recorregut del braç", "Pot afectar la velocitat", "Pot modificar la precisió"]
  },
  {
    id: "base",
    category: "Estructura",
    title: "Base i estabilitat",
    question: "Com afectarà una base més ampla o més reforçada?",
    effects: ["Pot reduir el moviment de l'estructura", "Pot millorar la precisió", "Pot permetre més força", "Pot fer el prototip més estable"]
  },
  {
    id: "start_position",
    category: "Moviment",
    title: "Posició inicial del braç",
    question: "Què passa si el braç comença des d'una altra posició?",
    effects: ["Canviarà el recorregut", "Pot canviar la força del llançament", "Pot modificar la trajectòria"]
  },
  {
    id: "end_position",
    category: "Moviment",
    title: "Posició final del braç",
    question: "Què passa si el braç s'atura en un altre punt?",
    effects: ["Pot modificar l'angle de sortida", "Pot afectar la precisió", "Pot canviar la trajectòria"]
  },
  {
    id: "motor_speed",
    category: "Motor",
    title: "Velocitat del motor",
    question: "Com afectarà la velocitat programada del motor?",
    effects: ["Pot augmentar la velocitat del braç", "Pot modificar la força del llançament", "Pot reduir el control", "Pot afectar la repetibilitat"]
  },
  {
    id: "motor_connection",
    category: "Motor",
    title: "Punt de connexió del motor",
    question: "Què passarà si el motor actua en un altre punt del mecanisme?",
    effects: ["Pot canviar la força", "Pot modificar el recorregut", "Pot canviar la velocitat", "Pot afectar el control"]
  },
  {
    id: "transmission",
    category: "Transmissió",
    title: "Engranatges i transmissió",
    question: "Com afectarà canviar la transmissió?",
    effects: ["Pot augmentar la força", "Pot augmentar o reduir la velocitat", "Pot modificar el control del mecanisme"]
  },
  {
    id: "projectile_position",
    category: "Projectil",
    title: "Posició del projectil",
    question: "Què passa si el projectil es col·loca en una altra posició?",
    effects: ["Pot modificar la trajectòria", "Pot canviar la distància", "Pot afectar la precisió"]
  }
];

const quizQuestions = [
  {
    id: "q1",
    question: "Quina funció té el fulcre en una catapulta?",
    options: ["Donar color a l'estructura", "Permetre que el braç giri", "Mesurar la distància", "Activar el Hub"],
    correct: 1
  },
  {
    id: "q2",
    question: "Quina és la funció principal del motor LEGO en aquest repte?",
    options: ["Decorar la catapulta", "Aportar moviment al mecanisme", "Mesurar el projectil", "Substituir el Hub"],
    correct: 1
  },
  {
    id: "q3",
    question: "Quina seqüència representa millor el funcionament del sistema?",
    options: [
      "Projectil → Motor → Botó → Braç",
      "Botó → Programa → Motor → Mecanisme → Braç → Projectil",
      "Hub → Projectil → Base → Motor",
      "Braç → Botó → Motor → Projectil"
    ],
    correct: 1
  },
  {
    id: "q4",
    question: "Per investigar una hipòtesi correctament, què és recomanable?",
    options: [
      "Canviar moltes coses alhora",
      "No registrar els resultats",
      "Modificar una variable i observar què passa",
      "Construir només una vegada"
    ],
    correct: 2
  },
  {
    id: "q5",
    question: "Per què és important que la catapulta sigui estable?",
    options: [
      "Perquè pot afectar el moviment i la precisió",
      "Només perquè sigui més bonica",
      "Perquè el motor funcioni més ràpid",
      "No és important"
    ],
    correct: 0
  }
];

let state = defaultState();

function defaultState() {
  return {
    workId: null,
    team: { name: "", members: [], course: "", classGroup: "" },
    activity: { challenge: "distance" },
    quiz: {},
    hypotheses: [],
    construction: {},
    experiments: [],
    conclusions: {},
    currentStep: 1,
    completedSteps: []
  };
}

function generateWorkId() {
  return "CAT-" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  document.getElementById("saveStatus").textContent = `Desat · ${state.workId || "treball nou"}`;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state = { ...defaultState(), ...JSON.parse(saved) };
      return true;
    } catch (error) {
      console.error(error);
    }
  }
  return false;
}

function showStep(stepNumber) {
  document.querySelectorAll(".step").forEach(step => {
    step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
  });

  document.querySelectorAll(".progress-nav button").forEach(button => {
    const number = Number(button.dataset.step);
    button.classList.toggle("active", number === stepNumber);
    button.classList.toggle("completed", state.completedSteps.includes(number) && number !== stepNumber);
  });

  state.currentStep = stepNumber;
  if (!state.completedSteps.includes(stepNumber)) state.completedSteps.push(stepNumber);
  saveState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateChallenge() {
  const distance = state.activity.challenge === "distance";
  document.getElementById("challengeTitle").textContent = distance
    ? "La catapulta més llunyana"
    : "La catapulta més precisa";

  document.getElementById("challengeDescription").innerHTML = distance
    ? `<h3>🎯 Objectiu: distància</h3>
       <p>Construïu una catapulta amb LEGO SPIKE accionada per un <strong>motor</strong>. El programa haurà de fer que el mecanisme s'activi en prémer un <strong>botó del Hub</strong>.</p>
       <p>Després de construir-la, fareu proves i modificacions per intentar que el projectil arribi <strong>el més lluny possible</strong>.</p>`
    : `<h3>🎯 Objectiu: precisió</h3>
       <p>Construïu una catapulta amb LEGO SPIKE accionada per un <strong>motor</strong>. El programa haurà d'activar el mecanisme en prémer un <strong>botó del Hub</strong>.</p>
       <p>Fareu proves i modificacions per aconseguir que el projectil arribi <strong>tan a prop com sigui possible d'un objectiu</strong>, repetint el resultat de manera controlada.</p>`;
}

function renderQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = quizQuestions.map((q, index) => `
    <article class="quiz-card">
      <h3>${index + 1}. ${q.question}</h3>
      <div class="quiz-options">
        ${q.options.map((option, optionIndex) => `
          <label>
            <input type="radio" name="${q.id}" value="${optionIndex}" ${String(state.quiz[q.id]) === String(optionIndex) ? "checked" : ""}>
            <span>${option}</span>
          </label>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderHypotheses() {
  const selectedIds = state.hypotheses.map(h => h.id);
  const container = document.getElementById("hypothesesContainer");

  container.innerHTML = hypothesesCatalog.map(h => `
    <label class="hypothesis-card ${selectedIds.includes(h.id) ? "selected" : ""}">
      <input type="checkbox" value="${h.id}" ${selectedIds.includes(h.id) ? "checked" : ""}>
      <strong>${h.title}</strong>
      <small>${h.category}</small>
      <p>${h.question}</p>
    </label>
  `).join("");

  container.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", event => {
      const checked = [...container.querySelectorAll("input:checked")];

      if (checked.length > 3) {
        event.target.checked = false;
        alert("Seleccioneu un màxim de 3 variables.");
      }

      event.target.closest(".hypothesis-card").classList.toggle("selected", event.target.checked);
      renderPredictionForms();
    });
  });

  renderPredictionForms();
}

function renderPredictionForms() {
  const selected = [...document.querySelectorAll("#hypothesesContainer input:checked")]
    .map(input => hypothesesCatalog.find(h => h.id === input.value));

  const panel = document.getElementById("predictionPanel");
  const forms = document.getElementById("predictionForms");

  if (!selected.length) {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");

  forms.innerHTML = selected.map(h => {
    const saved = state.hypotheses.find(item => item.id === h.id) || {};
    return `
      <article class="prediction-card" data-hypothesis="${h.id}">
        <h4>${h.title}</h4>
        <p>${h.question}</p>

        <label>
          La nostra predicció
          <textarea class="prediction" placeholder="Què creieu que passarà?">${saved.prediction || ""}</textarea>
        </label>

        <label>
          Per què ho creieu?
          <textarea class="reasoning" placeholder="Expliqueu el vostre raonament.">${saved.reasoning || ""}</textarea>
        </label>

        <div class="effects-list">
          <strong>Quines conseqüències espereu observar?</strong>
          ${h.effects.map(effect => `
            <label>
              <input type="checkbox" value="${effect}" ${(saved.expectedEffects || []).includes(effect) ? "checked" : ""}>
              <span>${effect}</span>
            </label>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function saveHypotheses() {
  const cards = document.querySelectorAll("#predictionForms .prediction-card");
  if (!cards.length) {
    alert("Seleccioneu almenys una variable per investigar.");
    return false;
  }

  state.hypotheses = [...cards].map(card => ({
    id: card.dataset.hypothesis,
    prediction: card.querySelector(".prediction").value.trim(),
    reasoning: card.querySelector(".reasoning").value.trim(),
    expectedEffects: [...card.querySelectorAll(".effects-list input:checked")].map(input => input.value),
    validation: null,
    validationConclusion: ""
  }));

  if (state.hypotheses.some(h => !h.prediction)) {
    alert("Escriviu una predicció per a cada hipòtesi seleccionada.");
    return false;
  }

  saveState();
  renderExperimentHypotheses();
  return true;
}

function saveConstruction() {
  const checks = {};
  document.querySelectorAll("[data-check]").forEach(input => {
    checks[input.dataset.check] = input.checked;
  });

  state.construction = {
    ...checks,
    firstDesignNotes: document.getElementById("firstDesignNotes").value.trim()
  };
  saveState();
}

function restoreConstruction() {
  Object.entries(state.construction || {}).forEach(([key, value]) => {
    const input = document.querySelector(`[data-check="${key}"]`);
    if (input) input.checked = Boolean(value);
  });
  document.getElementById("firstDesignNotes").value = state.construction.firstDesignNotes || "";
}

function renderExperimentHypotheses() {
  const select = document.getElementById("experimentHypothesis");
  select.innerHTML = state.hypotheses.length
    ? state.hypotheses.map(h => {
        const catalog = hypothesesCatalog.find(item => item.id === h.id);
        return `<option value="${h.id}">${catalog?.title || h.id}</option>`;
      }).join("")
    : `<option value="">Sense hipòtesis seleccionades</option>`;
}

function renderExperiments() {
  const list = document.getElementById("experimentsList");

  if (!state.experiments.length) {
    list.innerHTML = `<p class="intro">Encara no heu registrat cap prova.</p>`;
    document.getElementById("experimentNumber").value = 1;
    return;
  }

  list.innerHTML = state.experiments.map(exp => {
    const hypothesis = hypothesesCatalog.find(h => h.id === exp.hypothesisId);
    return `
      <article class="experiment-item">
        <strong>Prova ${exp.number} · ${hypothesis?.title || "Variable"}</strong>
        <div class="experiment-meta">
          ${exp.distance !== "" ? `<span>📏 ${exp.distance} cm</span>` : ""}
          ${exp.accuracy !== "" ? `<span>🎯 Error: ${exp.accuracy} cm</span>` : ""}
          ${exp.stability ? `<span>🏗️ ${exp.stability}</span>` : ""}
        </div>
        <p><strong>Canvi:</strong> ${escapeHtml(exp.modification)}</p>
        <p>${escapeHtml(exp.observations)}</p>
      </article>
    `;
  }).join("");

  document.getElementById("experimentNumber").value = state.experiments.length + 1;
}

function renderValidation() {
  const container = document.getElementById("validationContainer");

  if (!state.hypotheses.length) {
    container.innerHTML = "<p>No hi ha hipòtesis seleccionades.</p>";
    return;
  }

  container.innerHTML = state.hypotheses.map(h => {
    const catalog = hypothesesCatalog.find(item => item.id === h.id);
    const relatedExperiments = state.experiments.filter(exp => exp.hypothesisId === h.id);

    return `
      <article class="validation-card" data-validation="${h.id}">
        <h3>${catalog?.title || h.id}</h3>
        <div class="prediction-summary">
          <strong>La vostra predicció:</strong><br>
          ${escapeHtml(h.prediction)}
        </div>

        <p><strong>Proves registrades:</strong> ${relatedExperiments.length}</p>

        <label>
          Com valoreu la hipòtesi?
          <select class="validation-status">
            <option value="">Seleccioneu...</option>
            <option value="confirmed" ${h.validation === "confirmed" ? "selected" : ""}>Confirmada</option>
            <option value="partially_confirmed" ${h.validation === "partially_confirmed" ? "selected" : ""}>Parcialment confirmada</option>
            <option value="not_confirmed" ${h.validation === "not_confirmed" ? "selected" : ""}>No confirmada</option>
            <option value="inconclusive" ${h.validation === "inconclusive" ? "selected" : ""}>Necessitem més proves</option>
          </select>
        </label>

        <label>
          Què heu descobert?
          <textarea class="validation-conclusion">${h.validationConclusion || ""}</textarea>
        </label>
      </article>
    `;
  }).join("");
}

function saveValidations() {
  let valid = true;

  document.querySelectorAll("[data-validation]").forEach(card => {
    const hypothesis = state.hypotheses.find(h => h.id === card.dataset.validation);
    hypothesis.validation = card.querySelector(".validation-status").value;
    hypothesis.validationConclusion = card.querySelector(".validation-conclusion").value.trim();

    if (!hypothesis.validation || !hypothesis.validationConclusion) valid = false;
  });

  if (!valid) {
    alert("Completeu la valoració i la conclusió de cada hipòtesi.");
    return false;
  }

  saveState();
  return true;
}

function renderFinalReport() {
  const report = document.getElementById("finalReport");
  const challengeText = state.activity.challenge === "distance" ? "Distància" : "Precisió";

  const bestDistance = state.experiments
    .map(exp => Number(exp.distance))
    .filter(Number.isFinite)
    .reduce((max, value) => Math.max(max, value), null);

  const bestAccuracy = state.experiments
    .map(exp => Number(exp.accuracy))
    .filter(Number.isFinite)
    .reduce((min, value) => Math.min(min, value), null);

  report.innerHTML = `
    <h2>Informe d'investigació</h2>

    <div class="report-section">
      <h3>Equip</h3>
      <p><strong>${escapeHtml(state.team.name)}</strong></p>
      <p>${state.team.members.map(escapeHtml).join(", ")}</p>
      <p>${escapeHtml(state.team.course)} ${state.team.classGroup ? "· " + escapeHtml(state.team.classGroup) : ""}</p>
      <p><strong>Repte:</strong> ${challengeText}</p>
      <p><strong>Codi del treball:</strong> ${state.workId}</p>
    </div>

    <div class="report-section">
      <h3>Hipòtesis investigades</h3>
      ${state.hypotheses.map(h => {
        const catalog = hypothesesCatalog.find(item => item.id === h.id);
        return `
          <p><strong>${catalog?.title || h.id}</strong><br>
          Predicció: ${escapeHtml(h.prediction)}<br>
          Validació: ${validationLabel(h.validation)}<br>
          Descoberta: ${escapeHtml(h.validationConclusion || "")}</p>
        `;
      }).join("")}
    </div>

    <div class="report-section">
      <h3>Resultats</h3>
      <p><strong>Nombre de proves:</strong> ${state.experiments.length}</p>
      ${bestDistance !== null ? `<p><strong>Millor distància registrada:</strong> ${bestDistance} cm</p>` : ""}
      ${bestAccuracy !== null ? `<p><strong>Millor error de precisió:</strong> ${bestAccuracy} cm</p>` : ""}
    </div>

    <div class="report-section">
      <h3>Conclusions</h3>
      <p><strong>Millora més efectiva:</strong><br>${escapeHtml(state.conclusions.bestImprovement || "")}</p>
      <p><strong>Problema principal:</strong><br>${escapeHtml(state.conclusions.mainProblem || "")}</p>
      <p><strong>Què hem après:</strong><br>${escapeHtml(state.conclusions.mainLearning || "")}</p>
      <p><strong>Següent pas:</strong><br>${escapeHtml(state.conclusions.nextStep || "")}</p>
    </div>
  `;

  report.classList.remove("hidden");
  document.getElementById("reportActions").classList.remove("hidden");
}

function validationLabel(value) {
  return {
    confirmed: "Confirmada",
    partially_confirmed: "Parcialment confirmada",
    not_confirmed: "No confirmada",
    inconclusive: "Necessitem més proves"
  }[value] || "Sense validar";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function restoreIdentification() {
  document.getElementById("teamName").value = state.team.name || "";
  document.getElementById("members").value = (state.team.members || []).join("\n");
  document.getElementById("course").value = state.team.course || "";
  document.getElementById("classGroup").value = state.team.classGroup || "";
  const challenge = document.querySelector(`input[name="challenge"][value="${state.activity.challenge}"]`);
  if (challenge) challenge.checked = true;
}

function initialise() {
  const hasSavedWork = loadState();
  restoreIdentification();
  updateChallenge();
  renderQuiz();
  renderHypotheses();
  restoreConstruction();
  renderExperimentHypotheses();
  renderExperiments();

  document.getElementById("newWorkBtn").addEventListener("click", () => {
    document.getElementById("identificationForm").classList.remove("hidden");
    document.getElementById("recoverPanel").classList.add("hidden");
  });

  document.getElementById("recoverWorkBtn").addEventListener("click", () => {
    const panel = document.getElementById("recoverPanel");
    panel.classList.remove("hidden");
    document.getElementById("identificationForm").classList.add("hidden");
    if (!hasSavedWork || !state.workId) {
      document.getElementById("recoverMessage").textContent = "No hem trobat cap treball desat en aquest navegador.";
      document.getElementById("continueSavedBtn").disabled = true;
    }
  });

  document.getElementById("continueSavedBtn").addEventListener("click", () => {
    if (state.workId) showStep(state.currentStep || 1);
  });

  document.getElementById("identificationForm").addEventListener("submit", event => {
    event.preventDefault();

    state.workId = state.workId || generateWorkId();
    state.team = {
      name: document.getElementById("teamName").value.trim(),
      members: document.getElementById("members").value.split("\n").map(v => v.trim()).filter(Boolean),
      course: document.getElementById("course").value,
      classGroup: document.getElementById("classGroup").value.trim()
    };
    state.activity.challenge = document.querySelector('input[name="challenge"]:checked').value;
    updateChallenge();
    saveState();
    showStep(2);
  });

  document.getElementById("finishQuizBtn").addEventListener("click", () => {
    quizQuestions.forEach(q => {
      const checked = document.querySelector(`input[name="${q.id}"]:checked`);
      if (checked) state.quiz[q.id] = Number(checked.value);
    });

    const unanswered = quizQuestions.filter(q => state.quiz[q.id] === undefined);
    if (unanswered.length) {
      alert("Responeu totes les preguntes abans de continuar.");
      return;
    }

    const correct = quizQuestions.filter(q => state.quiz[q.id] === q.correct).length;
    const feedback = document.getElementById("quizFeedback");
    feedback.textContent = `Heu encertat ${correct} de ${quizQuestions.length} preguntes. Ara veurem què descobriu durant les proves.`;
    feedback.classList.remove("hidden");

    saveState();
    setTimeout(() => showStep(5), 800);
  });

  document.getElementById("saveHypothesesBtn").addEventListener("click", () => {
    if (saveHypotheses()) showStep(6);
  });

  document.getElementById("experimentForm").addEventListener("submit", event => {
    event.preventDefault();

    const experiment = {
      hypothesisId: document.getElementById("experimentHypothesis").value,
      number: Number(document.getElementById("experimentNumber").value),
      modification: document.getElementById("modification").value.trim(),
      distance: document.getElementById("distance").value,
      accuracy: document.getElementById("accuracy").value,
      stability: document.getElementById("stability").value,
      observations: document.getElementById("observations").value.trim()
    };

    state.experiments.push(experiment);
    saveState();
    renderExperiments();

    event.target.reset();
    document.getElementById("experimentNumber").value = state.experiments.length + 1;
    renderExperimentHypotheses();
  });

  document.getElementById("saveValidationBtn").addEventListener("click", () => {
    if (saveValidations()) showStep(9);
  });

  document.getElementById("conclusionsForm").addEventListener("submit", event => {
    event.preventDefault();

    state.conclusions = {
      bestImprovement: document.getElementById("bestImprovement").value.trim(),
      mainProblem: document.getElementById("mainProblem").value.trim(),
      mainLearning: document.getElementById("mainLearning").value.trim(),
      nextStep: document.getElementById("nextStep").value.trim()
    };

    saveState();
    renderFinalReport();
  });

  document.getElementById("printReportBtn").addEventListener("click", () => window.print());

  document.getElementById("resetWorkBtn").addEventListener("click", () => {
    if (!confirm("Voleu eliminar aquest treball d'aquest navegador i començar de nou?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    window.location.reload();
  });

  document.querySelectorAll(".next-step").forEach(button => {
    button.addEventListener("click", () => {
      const current = Number(button.closest(".step").dataset.step);

      if (current === 6) saveConstruction();
      if (current === 7 && state.experiments.length === 0) {
        alert("Registreu almenys una prova abans de continuar.");
        return;
      }

      if (current === 7) renderValidation();

      showStep(Math.min(current + 1, 9));
    });
  });

  document.querySelectorAll(".prev-step").forEach(button => {
    button.addEventListener("click", () => {
      const current = Number(button.closest(".step").dataset.step);
      showStep(Math.max(current - 1, 1));
    });
  });

  document.querySelectorAll(".progress-nav button").forEach(button => {
    button.addEventListener("click", () => {
      if (state.workId || Number(button.dataset.step) === 1) {
        if (Number(button.dataset.step) === 7) renderExperimentHypotheses();
        if (Number(button.dataset.step) === 8) renderValidation();
        showStep(Number(button.dataset.step));
      }
    });
  });

  document.querySelectorAll("[data-check]").forEach(input => {
    input.addEventListener("change", saveConstruction);
  });
  document.getElementById("firstDesignNotes").addEventListener("input", saveConstruction);

  if (hasSavedWork && state.workId) {
    document.getElementById("saveStatus").textContent = `Treball recuperable · ${state.workId}`;
  } else {
    saveState();
  }

  if (state.conclusions && Object.keys(state.conclusions).length) {
    document.getElementById("bestImprovement").value = state.conclusions.bestImprovement || "";
    document.getElementById("mainProblem").value = state.conclusions.mainProblem || "";
    document.getElementById("mainLearning").value = state.conclusions.mainLearning || "";
    document.getElementById("nextStep").value = state.conclusions.nextStep || "";
  }
}

document.addEventListener("DOMContentLoaded", initialise);
