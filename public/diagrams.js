const conceptFigures = {
  stack: {
    title: "먼저 나오는 원소 비교",
    rows: [
      ["입력 순서", ["A", "B", "C"]],
      ["스택 · 최근 입력부터", ["C 꺼내기", "B", "A"]],
      ["큐 · 먼저 입력부터", ["A 꺼내기", "B", "C"]],
    ],
    caption:
      "A, B, C를 차례로 넣었습니다. 스택에서는 C가, 큐에서는 A가 먼저 나옵니다.",
  },
  search: {
    title: "이진 탐색에서 후보가 줄어드는 과정",
    rows: [
      ["8 찾기 · 가운데 5와 비교", ["1", "3", "5", "8", "11"]],
      ["5보다 크므로 오른쪽만 남김", ["8", "11"]],
      ["남은 구간의 가운데를 확인", ["8 발견"]],
    ],
    caption:
      "정렬된 배열에서 가운데 값과 비교해 후보를 좁힙니다. 가운데 인덱스는 내림으로 계산합니다.",
  },
  pointer: {
    title: "포인터와 배열을 함께 보기",
    rows: [
      ["배열 a의 값", ["a[0] = 4", "a[1] = 7", "a[2] = 9"]],
      ["p = a일 때", ["p", "첫 원소 a[0]"]],
      ["p + 1일 때", ["p + 1", "다음 원소 a[1]"]],
    ],
    caption:
      "p에 1을 더하면 int 원소 한 개 크기만큼 이동합니다. *(p + 1)의 값은 7입니다.",
  },
  memory: {
    title: "기억장치 계층",
    rows: [
      ["CPU 가까이 · 작은 용량 · 빠른 접근", ["레지스터"]],
      ["최근·인접 데이터를 재사용", ["캐시"]],
      ["실행 중인 프로그램과 데이터", ["주기억장치"]],
      ["큰 용량 · 상대적으로 느린 접근", ["보조기억장치"]],
    ],
    caption:
      "위에서 아래로 내려갈수록 일반적으로 용량과 접근 시간이 늘어납니다.",
  },
  avl: {
    title: "LR 불균형에서 중간 키를 위로",
    rows: [
      ["삽입 경로", ["30", "왼쪽 10", "오른쪽 20"]],
      ["10을 좌회전", ["30", "왼쪽 20", "왼쪽 10"]],
      ["30을 우회전", ["루트 20", "왼쪽 10 · 오른쪽 30"]],
    ],
    caption: "10·20·30의 정렬 순서는 유지하면서 트리의 높이 차를 줄입니다.",
  },
  shortest: {
    title: "D까지의 잠정 거리",
    rows: [
      ["C까지 2를 확정하고 C의 간선 확인", ["2 + 7 = 9"]],
      ["B까지 3을 확정하고 B의 간선 확인", ["3 + 2 = 5"]],
      ["더 작은 거리 선택", ["D = 5"]],
    ],
    caption:
      "각 정점의 현재 거리와 그 정점에서 나가는 간선 비용을 더해 새로운 후보를 만듭니다.",
  },
  network: {
    title: "웹 요청이 전달되는 계층",
    rows: [
      ["응용 · 요청의 의미", ["HTTP 요청"]],
      ["전송 · 프로세스 간 전달", ["TCP (HTTP/1.1·2의 일반적인 경우)"]],
      ["인터넷 · 네트워크 사이 경로", ["IP 패킷"]],
      ["링크 · 인접 장치 사이 전달", ["Ethernet 프레임"]],
    ],
    caption:
      "각 계층이 전달에 필요한 정보를 덧붙입니다. HTTP/3는 UDP 위의 QUIC을 사용합니다.",
  },
};

function conceptDiagram(chapter) {
  if (chapter.title === "CPU·명령어 사이클·파이프라인") {
    const stages = ["인출", "해독", "실행", "저장"];
    return `<figure class="panel concept-figure"><h2>파이프라인의 실행 겹치기</h2>
      <div class="pipeline" role="region" aria-label="파이프라인 시간표" tabindex="0">
      <table><thead><tr><th scope="col">명령</th>${Array.from({ length: 6 }, (_, i) => `<th scope="col">${i + 1}</th>`).join("")}</tr></thead>
      <tbody>${[0, 1, 2].map((row) => `<tr><th scope="row">${String.fromCharCode(65 + row)}</th>${Array.from({ length: 6 }, (_, col) => `<td class="${col >= row && col < row + 4 ? "active-stage" : ""}">${stages[col - row] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <figcaption>4단계가 각각 1사이클 걸리는 이상적인 예입니다. 세 명령이 6사이클에 끝납니다. 의존성이나 자원 충돌이 생기면 기다리는 단계가 추가됩니다.</figcaption></figure>`;
  }
  const topic = {
    자료구조: "stack",
    "스택·수식·원형 큐": "stack",
    알고리즘: "search",
    "배열과 포인터": "pointer",
    "컴퓨터 구조": "memory",
    "기억장치 계층과 캐시": "memory",
    "이진 탐색 트리와 균형": "avl",
    "그래프 표현·순회·최적 경로": "shortest",
    "컴퓨터 네트워크": "network",
  }[chapter.title];
  const figure = conceptFigures[topic];
  if (!figure) return "";
  return `<figure class="panel concept-figure"><h2>${figure.title}</h2>
    ${figure.rows.map(([label, cells]) => `<div class="figure-step"><p>${label}</p><div class="figure-cells">${cells.map((cell, i) => `${i ? icon("arrow-right") : ""}<span class="figure-cell">${cell}</span>`).join("")}</div></div>`).join("")}
    <figcaption>${figure.caption}</figcaption></figure>`;
}
