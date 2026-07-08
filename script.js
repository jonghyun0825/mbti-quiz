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
googleProvider.setCustomParameters({ prompt: "select_account" });

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
  { label: "매우 그렇다", weight: 2 },
  { label: "그렇다", weight: 1 },
  { label: "중립", weight: 0 },
  { label: "아니다", weight: -1 },
  { label: "매우 아니다", weight: -2 }
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

const typeDetails = {
  ISTJ: "ISTJ는 사실과 경험을 바탕으로 신중하게 판단하며, 한번 맡은 일은 끝까지 책임지고 완수하는 성실함을 지녔습니다. 정해진 규칙과 절차를 존중하고 체계적으로 일을 처리하기 때문에 조직 내에서 신뢰받는 존재가 되는 경우가 많습니다. 다만 변화나 즉흥적인 상황에는 다소 불편함을 느낄 수 있어, 유연성을 기르는 것이 성장의 열쇠가 됩니다. 감정 표현에 서툰 편이라 가까운 사람에게는 의식적으로 마음을 표현하는 연습이 도움이 됩니다.",
  ISFJ: "ISFJ는 주변 사람을 세심하게 살피고 헌신적으로 돌보는 따뜻한 성격의 소유자입니다. 조용히 맡은 역할을 성실하게 수행하며, 신뢰를 바탕으로 한 관계를 소중히 여깁니다. 갈등을 피하려는 경향이 강해 자신의 욕구를 뒤로 미루기 쉬우므로, 스스로의 의견을 표현하는 연습이 필요합니다. 안정적인 환경에서 꾸준히 노력할 때 가장 큰 힘을 발휘합니다.",
  INFJ: "INFJ는 깊은 통찰력과 강한 신념을 바탕으로 세상을 더 나은 곳으로 만들고자 하는 이상주의자입니다. 타인의 감정을 직관적으로 이해하는 공감 능력이 뛰어나며, 소수의 사람과 깊고 의미 있는 관계를 맺는 것을 선호합니다. 완벽주의 성향과 높은 이상 때문에 스스로를 지치게 만들기 쉬워, 적절한 휴식과 현실적인 목표 설정이 중요합니다. 자신의 신념이 확고한 만큼, 타인의 다른 관점도 열린 마음으로 받아들이는 연습이 도움이 됩니다.",
  INTJ: "INTJ는 장기적인 비전을 세우고 체계적인 전략으로 목표를 달성해 나가는 완벽주의적 성향의 소유자입니다. 독립적이고 논리적인 사고를 바탕으로 효율성을 중시하며, 불필요한 절차나 감정적인 접근을 답답하게 여기는 경우가 많습니다. 자신의 능력에 대한 확신이 강한 만큼 타인의 감정이나 사회적 관계에 소홀해지지 않도록 균형을 잡는 노력이 필요합니다. 스스로 설정한 기준이 매우 높아, 실패에 지나치게 엄격해지지 않는 여유도 중요합니다.",
  ISTP: "ISTP는 손으로 직접 만지고 경험하며 문제를 해결하는 실용적이고 논리적인 탐구자입니다. 위기 상황에서도 침착하게 핵심을 파악해 즉각적으로 대응하는 능력이 뛰어나며, 자유롭고 독립적인 생활 방식을 선호합니다. 감정을 언어로 표현하는 데 서툴러 가까운 관계에서 오해를 사기도 하므로, 자신의 감정을 조금 더 적극적으로 나누는 연습이 도움이 됩니다. 틀에 얽매이는 것을 싫어하는 만큼, 장기적인 계획을 세우는 습관을 기르면 큰 도움이 됩니다.",
  ISFP: "ISFP는 자신만의 미적 감각과 가치관을 바탕으로 삶을 조용히, 그러나 충실하게 살아가는 감성적인 성격입니다. 새로운 경험과 다양한 감각적 자극에 열려 있으며, 타인에게 자신의 가치를 강요하기보다 있는 그대로 존중하는 태도를 지녔습니다. 갈등을 극도로 꺼려 자신의 의견을 숨기는 경우가 많아, 필요할 때는 솔직하게 의사를 표현하는 연습이 필요합니다. 즉흥적인 매력이 있는 반면, 장기 목표를 꾸준히 추진하는 힘을 기르면 더 큰 성취를 이룰 수 있습니다.",
  INFP: "INFP는 자신의 가치관과 이상을 소중히 여기며, 그것을 실현하기 위해 진심을 다하는 낭만적인 이상주의자입니다. 타인의 감정에 깊이 공감하고 창의적인 방식으로 자신을 표현하는 것을 즐기며, 의미 없는 일에는 쉽게 동기를 잃는 편입니다. 내면의 기준이 높아 스스로를 자주 비판하게 되므로, 완벽하지 않아도 괜찮다는 자기 수용이 필요합니다. 혼자만의 시간을 통해 에너지를 충전한 뒤, 자신의 이상을 현실적인 단계로 나누어 실행하는 습관을 기르면 좋습니다.",
  INTP: "INTP는 끊임없는 호기심으로 세상의 원리를 탐구하고 논리적 체계를 세우는 것을 즐기는 지적인 사색가입니다. 독창적인 아이디어를 떠올리는 능력이 뛰어나지만, 이를 실행에 옮기는 단계에서는 흥미를 잃고 미루는 경향이 있습니다. 감정보다 논리를 우선시하다 보니 인간관계에서 무심하다는 오해를 받기도 하므로, 의식적으로 관계에 신경 쓰는 노력이 도움이 됩니다. 완벽한 이론을 추구하기보다 작은 실행부터 시작하는 습관이 성장에 큰 도움이 됩니다.",
  ESTP: "ESTP는 현재 순간에 몰입하며 빠른 판단력과 실행력으로 상황을 주도하는 에너지 넘치는 현실주의자입니다. 위험을 두려워하지 않고 새로운 도전을 즐기며, 사람들과 어울리는 활동적인 자리에서 특유의 매력을 발휘합니다. 즉흥적인 성향이 강해 장기적인 계획이나 세부적인 절차를 소홀히 하기 쉬우므로, 중요한 일에는 조금 더 신중함을 더하는 것이 좋습니다. 감정보다 행동이 앞서는 편이라, 결정을 내리기 전 타인의 입장을 한 번 더 헤아리는 습관이 관계에 도움이 됩니다.",
  ESFP: "ESFP는 주변에 활기와 즐거움을 불어넣는 사교적이고 낙천적인 분위기 메이커입니다. 감각적이고 현재 지향적인 성향으로 삶을 적극적으로 즐기며, 타인과의 교류에서 큰 에너지를 얻습니다. 즉흥적인 매력이 강한 반면 계획성이나 장기적인 몰입이 부족할 수 있어, 중요한 목표에는 꾸준함을 더하는 노력이 필요합니다. 비판이나 갈등 상황에 예민하게 반응하는 편이므로, 감정을 조절하며 건설적으로 받아들이는 연습이 도움이 됩니다.",
  ENFP: "ENFP는 무한한 가능성을 탐색하며 사람과 아이디어에 대한 열정으로 가득 찬 자유로운 영혼입니다. 뛰어난 공감 능력과 창의력으로 주변 사람들에게 영감을 주며, 새로운 것을 시작하는 데 거침이 없습니다. 다만 여러 관심사에 에너지를 분산시키다 보니 하나를 끝까지 마무리하는 데 어려움을 겪기도 하므로, 우선순위를 정하는 습관이 필요합니다. 감정 기복이 있는 편이라, 스스로의 감정을 다스리는 루틴을 만들면 안정감을 유지하는 데 도움이 됩니다.",
  ENTP: "ENTP는 새로운 아이디어를 즐기고 기존의 틀에 도전하는 것을 두려워하지 않는 영리한 혁신가입니다. 뛰어난 순발력과 논리로 토론을 즐기며, 문제의 허점을 빠르게 찾아내는 능력이 탁월합니다. 흥미로운 것을 좇다 보니 반복적이거나 세부적인 작업에는 쉽게 지루함을 느끼므로, 마무리하는 힘을 기르는 것이 중요한 과제입니다. 논쟁을 즐기는 성향이 때로 타인에게 공격적으로 느껴질 수 있어, 상대의 감정을 배려하는 태도가 관계에 도움이 됩니다.",
  ESTJ: "ESTJ는 명확한 기준과 체계를 바탕으로 조직을 효율적으로 이끄는 타고난 관리자입니다. 책임감이 강하고 결단력이 있어 맡은 일을 신속하고 정확하게 처리하며, 주변 사람들에게 신뢰를 줍니다. 원칙을 중시하는 만큼 융통성이 부족하다는 평가를 받기도 하므로, 다양한 의견을 수용하는 유연함을 기르는 것이 좋습니다. 효율성을 우선시하다 보니 타인의 감정을 놓치기 쉬워, 의식적으로 공감의 언어를 더하는 노력이 관계에 큰 도움이 됩니다.",
  ESFJ: "ESFJ는 주변 사람들의 필요를 세심하게 챙기고 조화로운 관계를 만드는 데 뛰어난 배려심 많은 조력자입니다. 사람들과 함께할 때 에너지를 얻으며, 공동체 안에서 신뢰받는 역할을 자처하는 경우가 많습니다. 타인의 평가에 민감하게 반응하는 편이라 자신의 욕구를 뒤로 미루기 쉬우므로, 자기 자신을 돌보는 시간도 중요하게 여겨야 합니다. 변화나 비판에 마음이 쉽게 흔들릴 수 있어, 스스로의 기준을 단단히 세우는 연습이 도움이 됩니다.",
  ENFJ: "ENFJ는 타인의 성장을 진심으로 응원하며 공동체를 이끄는 카리스마 있는 지도자형입니다. 뛰어난 공감 능력과 소통 능력으로 사람들의 마음을 하나로 모으는 데 탁월하며, 의미 있는 목표를 향해 사람들을 이끄는 데서 큰 보람을 느낍니다. 타인의 필요를 살피는 데 집중하다 보니 정작 자신의 감정과 필요는 소홀히 하기 쉬우므로, 자기 돌봄의 시간을 의식적으로 마련해야 합니다. 모두를 만족시키려는 마음이 클수록 지치기 쉬우니, 우선순위를 정하고 적절히 거절하는 연습도 필요합니다.",
  ENTJ: "ENTJ는 명확한 목표를 세우고 강한 추진력으로 이를 실현해 나가는 타고난 리더입니다. 전략적 사고와 결단력이 뛰어나 복잡한 상황에서도 효율적인 해결책을 빠르게 찾아내며, 도전적인 목표에서 오히려 동기부여를 얻습니다. 목표 지향적인 성향이 강한 만큼 주변 사람들에게도 높은 기준을 요구해 부담을 줄 수 있으므로, 타인의 속도와 감정을 배려하는 여유가 필요합니다. 강한 확신을 가진 만큼, 다른 의견에 귀 기울이는 열린 태도를 기르면 더욱 신뢰받는 리더로 성장할 수 있습니다."
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
const resultDetail = document.getElementById("resultDetail");
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

function formatHistoryDate(date) {
  const datePart = date.toLocaleDateString("ko-KR");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${datePart} ${hours}:${minutes}`;
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
      .get();

    if (snapshot.empty) {
      historyList.innerHTML = `<p class="history-empty">아직 저장된 기록이 없어요.</p>`;
      return;
    }

    historyList.innerHTML = "";

    const results = snapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));

    results.forEach((data) => {
      const date = data.createdAt ? formatHistoryDate(data.createdAt.toDate()) : "";
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
  resultDetail.textContent = typeDetails[type];
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
