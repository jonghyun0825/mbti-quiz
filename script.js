const firebaseConfig = {
  apiKey: "AIzaSyD2By37zh78GEZTal10zjhUKpDFsxl3kpA",
  authDomain: "mbti-34069.firebaseapp.com",
  projectId: "mbti-34069",
  storageBucket: "mbti-34069.firebasestorage.app",
  messagingSenderId: "6988497323",
  appId: "1:6988497323:web:1e36c1a4d3ffa1b17212ee"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const questions = [
  { axis: "EI", direction: "E", text: "새로운 모임에 가면 나는 여러 사람과 자연스럽게 어울린다." },
  { axis: "EI", direction: "I", text: "주말에는 집에서 혼자만의 시간을 보내야 에너지가 회복되는 편이다." },
  { axis: "EI", direction: "E", text: "대화할 때 나는 생각을 말로 하면서 정리하는 편이다." },
  { axis: "SN", direction: "S", text: "새로운 것을 배울 때 나는 구체적인 사실과 경험을 중시한다." },
  { axis: "SN", direction: "N", text: "나는 현실적인 이야기보다 상상력과 아이디어가 담긴 이야기에 더 끌린다." },
  { axis: "SN", direction: "S", text: "문제를 해결할 때 나는 이미 검증된 방법을 따르는 편이다." },
  { axis: "TF", direction: "T", text: "결정을 내릴 때 나에게는 감정보다 논리와 원칙이 더 중요하다." },
  { axis: "TF", direction: "F", text: "친구가 고민을 털어놓으면 나는 해결책보다 공감과 위로를 먼저 건넨다." },
  { axis: "TF", direction: "T", text: "비판을 받을 때 나는 감정적으로 반응하기보다 객관적인 피드백으로 받아들이는 편이다." },
  { axis: "JP", direction: "J", text: "여행 계획을 세울 때 나는 일정을 미리 세세하게 정해두는 편이다." },
  { axis: "JP", direction: "P", text: "나는 마감이 임박해야 오히려 집중이 잘 되는 편이다." },
  { axis: "JP", direction: "J", text: "나의 하루는 계획대로 흘러갈 때 더 편안하다." }
];

const likertScale = [
  { label: "아니다", weight: -2 },
  { label: "아닌 것 같다", weight: -1 },
  { label: "중립", weight: 0 },
  { label: "맞는 것 같다", weight: 1 },
  { label: "맞다", weight: 2 }
];

const axisPairs = [
  ["E", "I", "EI"],
  ["S", "N", "SN"],
  ["T", "F", "TF"],
  ["J", "P", "JP"]
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

const compatibilityMap = {
  ISTJ: ["ESFP", "ESTP", "ISFJ"],
  ISFJ: ["ESFP", "ESTP", "ISTJ"],
  INFJ: ["ENFP", "ENTP", "INTJ"],
  INTJ: ["ENFP", "ENTP", "INFJ"],
  ISTP: ["ESFJ", "ESTJ", "ISFP"],
  ISFP: ["ESFJ", "ESTJ", "ISTP"],
  INFP: ["ENFJ", "ENTJ", "INFJ"],
  INTP: ["ENFJ", "ENTJ", "INTJ"],
  ESTP: ["ISFJ", "ISTJ", "ESFP"],
  ESFP: ["ISFJ", "ISTJ", "ESTP"],
  ENFP: ["INFJ", "INTJ", "ENTP"],
  ENTP: ["INFJ", "INTJ", "ENFP"],
  ESTJ: ["ISFP", "ISTP", "ESFJ"],
  ESFJ: ["ISFP", "ISTP", "ESTJ"],
  ENFJ: ["INFP", "INTP", "ENTJ"],
  ENTJ: ["INFP", "INTP", "ENFJ"]
};

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const historyScreen = document.getElementById("history-screen");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const resultType = document.getElementById("resultType");
const resultDescription = document.getElementById("resultDescription");
const scoreBars = document.getElementById("scoreBars");
const compatibilityList = document.getElementById("compatibilityList");
const authBox = document.getElementById("authBox");
const historyList = document.getElementById("historyList");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const historyBackBtn = document.getElementById("historyBackBtn");

let currentQuestionIndex = 0;
let answers = [];
let currentUser = null;

auth.onAuthStateChanged((user) => {
  currentUser = user;
  renderAuthBox(user);
});

function renderAuthBox(user) {
  authBox.innerHTML = "";

  if (user) {
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `
      <span class="user-name">${user.displayName || user.email}님</span>
      <span class="user-actions">
        <button class="btn-small" id="historyBtn">내 기록</button>
        <button class="btn-small" id="logoutBtn">로그아웃</button>
      </span>
    `;
    authBox.appendChild(userInfo);

    document.getElementById("historyBtn").addEventListener("click", showHistory);
    document.getElementById("logoutBtn").addEventListener("click", () => auth.signOut());
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.className = "btn-google";
    loginBtn.textContent = "Google로 로그인";
    loginBtn.addEventListener("click", () => {
      auth.signInWithPopup(googleProvider).catch((error) => {
        alert("로그인에 실패했습니다: " + error.message);
      });
    });
    authBox.appendChild(loginBtn);
  }
}

async function saveResult(type, percentages) {
  if (!currentUser) return;

  try {
    await db.collection("results").add({
      uid: currentUser.uid,
      type,
      percentages,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("결과 저장에 실패했습니다:", error);
  }
}

async function showHistory() {
  if (!currentUser) return;

  startScreen.classList.add("hidden");
  historyScreen.classList.remove("hidden");
  historyList.innerHTML = `<p class="history-empty">불러오는 중...</p>`;

  try {
    const snapshot = await db
      .collection("results")
      .where("uid", "==", currentUser.uid)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      historyList.innerHTML = `<p class="history-empty">아직 저장된 기록이 없어요.</p>`;
      return;
    }

    historyList.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString("ko-KR") : "";
      const percentSummary = axisPairs
        .map(([left, right, axisKey]) => {
          const p = data.percentages[axisKey];
          return `${left} ${p.leftPercent}% / ${right} ${p.rightPercent}%`;
        })
        .join(" · ");

      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
        <div class="history-top">
          <span class="history-type">${data.type}</span>
          <span class="history-date">${date}</span>
        </div>
        <div class="history-percentages">${percentSummary}</div>
      `;
      historyList.appendChild(item);
    });
  } catch (error) {
    historyList.innerHTML = `<p class="history-empty">기록을 불러오지 못했어요.</p>`;
    console.error("기록 조회에 실패했습니다:", error);
  }
}

historyBackBtn.addEventListener("click", () => {
  historyScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

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
  backBtn.disabled = currentQuestionIndex === 0;

  optionsContainer.innerHTML = "";

  likertScale.forEach((scaleItem) => {
    const optionBtn = document.createElement("button");
    optionBtn.className = "option-btn";
    optionBtn.textContent = scaleItem.label;
    optionBtn.addEventListener("click", () => selectAnswer(scaleItem.weight));
    optionsContainer.appendChild(optionBtn);
  });
}

backBtn.addEventListener("click", () => {
  if (currentQuestionIndex === 0) return;

  currentQuestionIndex--;
  answers.pop();
  showQuestion();
});

function selectAnswer(weight) {
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => (btn.disabled = true));

  answers.push(weight);
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const percentages = getAxisPercentages();
  const type = calculateType(percentages);

  questionScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultType.textContent = type;
  resultDescription.textContent = typeDescriptions[type];
  showScoreBars(percentages);
  showCompatibility(type);
  saveResult(type, percentages);
}

function showCompatibility(type) {
  const matches = compatibilityMap[type];

  compatibilityList.innerHTML = "";

  matches.forEach((matchType) => {
    const item = document.createElement("div");
    item.className = "compatibility-item";
    item.innerHTML = `
      <span class="compatibility-type">${matchType}</span>
      <span class="compatibility-desc">${typeDescriptions[matchType]}</span>
    `;
    compatibilityList.appendChild(item);
  });
}

function getAxisScores() {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  questions.forEach((question, index) => {
    const weight = answers[index];
    if (weight === undefined) return;

    const sign = question.direction === question.axis[0] ? 1 : -1;
    scores[question.axis] += weight * sign;
  });

  return scores;
}

function getAxisPercentages() {
  const scores = getAxisScores();
  const percentages = {};

  axisPairs.forEach(([left, right, axisKey]) => {
    const maxScore = questions.filter((q) => q.axis === axisKey).length * 2;
    const leftPercent = Math.round(((scores[axisKey] + maxScore) / (maxScore * 2)) * 100);
    percentages[axisKey] = { left, right, leftPercent, rightPercent: 100 - leftPercent };
  });

  return percentages;
}

function calculateType(percentages) {
  return axisPairs
    .map(([left, right, axisKey]) => (percentages[axisKey].leftPercent >= 50 ? left : right))
    .join("");
}

function showScoreBars(percentages) {
  scoreBars.innerHTML = "";

  axisPairs.forEach(([left, right, axisKey]) => {
    const { leftPercent, rightPercent } = percentages[axisKey];

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
