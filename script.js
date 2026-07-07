const questions = [
  {
    axis: "EI",
    text: "새로운 모임에 가면 나는...",
    options: [
      { text: "여러 사람과 자연스럽게 어울린다", value: "E" },
      { text: "친한 몇 명과 조용히 이야기한다", value: "I" }
    ]
  },
  {
    axis: "EI",
    text: "주말을 보낼 때 나는...",
    options: [
      { text: "밖에서 사람들을 만나며 에너지를 얻는다", value: "E" },
      { text: "집에서 혼자만의 시간으로 에너지를 얻는다", value: "I" }
    ]
  },
  {
    axis: "EI",
    text: "대화할 때 나는...",
    options: [
      { text: "생각을 말하면서 정리하는 편이다", value: "E" },
      { text: "충분히 생각한 후에 말하는 편이다", value: "I" }
    ]
  },
  {
    axis: "SN",
    text: "새로운 일을 배울 때 나는...",
    options: [
      { text: "구체적인 사실과 경험을 중시한다", value: "S" },
      { text: "전체적인 그림과 가능성을 중시한다", value: "N" }
    ]
  },
  {
    axis: "SN",
    text: "더 끌리는 대화 주제는...",
    options: [
      { text: "현실적이고 실용적인 이야기", value: "S" },
      { text: "상상력과 아이디어가 담긴 이야기", value: "N" }
    ]
  },
  {
    axis: "SN",
    text: "문제를 해결할 때 나는...",
    options: [
      { text: "이미 검증된 방법을 따른다", value: "S" },
      { text: "새로운 방식을 시도해본다", value: "N" }
    ]
  },
  {
    axis: "TF",
    text: "결정을 내릴 때 나에게 더 중요한 것은...",
    options: [
      { text: "논리와 원칙", value: "T" },
      { text: "감정과 관계", value: "F" }
    ]
  },
  {
    axis: "TF",
    text: "친구가 고민을 털어놓으면 나는...",
    options: [
      { text: "해결책을 먼저 제시한다", value: "T" },
      { text: "먼저 공감하고 위로한다", value: "F" }
    ]
  },
  {
    axis: "TF",
    text: "비판을 받을 때 나는...",
    options: [
      { text: "객관적인 피드백으로 받아들인다", value: "T" },
      { text: "감정적으로 먼저 반응하게 된다", value: "F" }
    ]
  },
  {
    axis: "JP",
    text: "여행 계획을 세울 때 나는...",
    options: [
      { text: "일정을 미리 세세하게 정한다", value: "J" },
      { text: "즉흥적으로 정하는 걸 즐긴다", value: "P" }
    ]
  },
  {
    axis: "JP",
    text: "일을 처리하는 방식은...",
    options: [
      { text: "마감 전에 미리 끝내둔다", value: "J" },
      { text: "마감이 임박해야 집중이 잘 된다", value: "P" }
    ]
  },
  {
    axis: "JP",
    text: "나의 하루는...",
    options: [
      { text: "계획대로 흘러가는 게 편하다", value: "J" },
      { text: "상황에 따라 유연하게 바뀌는 게 편하다", value: "P" }
    ]
  }
];

const typeDescriptions = {
  ISTJ: "청렴결백한 논리주의자 - 신중하고 책임감 있는 원칙주의자",
  ISFJ: "용감한 수호자 - 헌신적이고 따뜻한 보호자",
  INFJ: "선의의 옹호자 - 신비로운 통찰력을 지닌 이상주의자",
  INTJ: "용의주도한 전략가 - 치밀하고 독창적인 완벽주의자",
  ISTP: "만능 재주꾼 - 대담하고 실용적인 탐구자",
  ISFP: "호기심 많은 예술가 - 유연하고 매력적인 감성주의자",
  INFP: "열정적인 중재자 - 따뜻한 이상주의자이자 낭만적인 사색가",
  INTP: "논리적인 사색가 - 지적 호기심이 넘치는 혁신가",
  ESTP: "모험을 즐기는 사업가 - 에너지 넘치는 현실주의자",
  ESFP: "자유로운 영혼의 연예인 - 즉흥적이고 사교적인 분위기 메이커",
  ENFP: "재기발랄한 활동가 - 열정적이고 창의적인 자유로운 영혼",
  ENTP: "뜨거운 논쟁을 즐기는 변론가 - 영리하고 도전을 즐기는 혁신가",
  ESTJ: "엄격한 관리자 - 체계적이고 실용적인 리더",
  ESFJ: "사교적인 외교관 - 배려심 많고 협력적인 조력자",
  ENFJ: "정의로운 사회운동가 - 카리스마 있고 영감을 주는 지도자",
  ENTJ: "대담한 통솔자 - 결단력 있고 카리스마 넘치는 리더"
};

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const resultType = document.getElementById("resultType");
const resultDescription = document.getElementById("resultDescription");
const scoreBars = document.getElementById("scoreBars");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let currentQuestionIndex = 0;
let answers = [];

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
  showQuestion();
});

function showQuestion() {
  const question = questions[currentQuestionIndex];

  progressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
  questionText.textContent = question.text;

  optionsContainer.innerHTML = "";

  question.options.forEach((option) => {
    const optionBtn = document.createElement("button");
    optionBtn.className = "option-btn";
    optionBtn.textContent = option.text;
    optionBtn.addEventListener("click", () => selectAnswer(option.value));
    optionsContainer.appendChild(optionBtn);
  });
}

function selectAnswer(value) {
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => (btn.disabled = true));

  answers.push(value);
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const type = calculateType();

  questionScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultType.textContent = type;
  resultDescription.textContent = typeDescriptions[type];
  showScoreBars();
}

function getCounts() {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach((answer) => {
    counts[answer]++;
  });

  return counts;
}

function calculateType() {
  const counts = getCounts();

  const result =
    (counts.E >= counts.I ? "E" : "I") +
    (counts.S >= counts.N ? "S" : "N") +
    (counts.T >= counts.F ? "T" : "F") +
    (counts.J >= counts.P ? "J" : "P");

  return result;
}

function showScoreBars() {
  const counts = getCounts();
  const axisPairs = [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"]
  ];

  scoreBars.innerHTML = "";

  axisPairs.forEach(([left, right]) => {
    const total = counts[left] + counts[right];
    const leftPercent = Math.round((counts[left] / total) * 100);
    const rightPercent = 100 - leftPercent;

    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `
      <div class="score-label">
        <span>${left} ${leftPercent}%</span>
        <span>${right} ${rightPercent}%</span>
      </div>
      <div class="score-bar-track">
        <div class="score-bar-fill" style="width: ${leftPercent}%"></div>
      </div>
    `;

    scoreBars.appendChild(row);
  });
}

restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  answers = [];

  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
