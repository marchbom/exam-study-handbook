# Handbook 작업 안내

## 제품과 사용자 요구

- 6과목의 학습 자료, 자체 제작 퀴즈, 오답 복습, 진도 기록을 제공하는 모바일 우선 웹앱이다.
- 공개 문구와 README, 커밋 메시지에 사용자의 학교·재학 여부를 드러내는 학교명, 학년도, 학기, 기말, 학년 표현을 넣지 않는다.
- 학습 내용의 정확성과 범위 확인에 필요한 출처는 일반적인 링크 이름으로 제공한다. 기존 출처 주소는 public/courses/catalog.js와 shared.js에 있다.
- 본문은 Noto Sans KR을 사용한다. 상단은 책 아이콘과 Handbook 워드마크다.
- 사용자가 선택한 초록색 터미널 모양 파비콘은 별도로 관리한다.
- 장식적인 소개 배너와 반복 안내를 줄이고 과목, 이어 읽기, 학습 내용을 우선 배치한다.
- 읽기 편한 디자인의 세부 조정도 구현 범위에 포함한다. 패딩, 문단 간격, 표의 셀 간격, 아이콘 정렬, hover와 키보드 포커스를 확인한다.

## 참고 자료와 적용 방향

### Apple Human Interface Guidelines

- Design principles — 필요한 정보와 조작을 중심으로 위계를 정하고 간결한 문구를 사용한다.
  https://developer.apple.com/design/human-interface-guidelines/design-principles/
- Layout — 정렬, 그룹화, 일관된 간격으로 관계를 표현하고 작은 화면과 글자 확대에 대응한다.
  https://developer.apple.com/design/human-interface-guidelines/layout
- Typography — 글꼴 종류를 절제하고 크기와 굵기로 정보 위계를 표현한다.
  https://developer.apple.com/design/human-interface-guidelines/typography

이 프로젝트는 위 공식 가이드를 참고한 웹 UI다. Apple 전용 스킬을 설치하거나 네이티브 UI를 구현한 것은 아니다.

### 접근성과 학습 자료 배치

- WCAG 2.2 Contrast Minimum — 일반 텍스트는 배경과 최소 4.5:1 대비를 확보한다.
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG Visual Presentation — 줄 길이와 정렬, 간격 조절을 검토한다. CJK 40자 이내 및 1.5배 행간 관련 항목은 AAA 기준이며 모든 웹 UI의 필수 규칙으로 해석하지 않는다.
  https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
- Mayer, Spatial Contiguity Principle — 관련 설명과 그림을 가깝게 배치한다.
  https://www.cambridge.org/core/books/multimedia-learning/spatial-contiguity-principle/0824E3ABE3556D77AADBE7714EFA7BCD
- Mayer, Coherence Principle — 학습과 관련 없는 장식과 내용을 줄인다.
  https://www.cambridge.org/core/books/multimedia-learning/coherence-principle/4E80B70CB76E2166B76E5653EBDE7D3E
- 색과 인지 수행 연구 — 특정 색이 보편적으로 집중력을 높인다고 주장하지 않는다.
  https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00784/full

### 현재 디자인 설정

- 밝은 배경 #F7F8FA, 본문 #20252B, 강조 #365B8C.
- 본문은 모바일 17px, 화면 폭 660px 이상에서 18px. 행간 1.75, 읽기 영역 최대 640px, 모바일 바깥 여백 20px.
- 이 수치는 연구에서 확정한 최적값이 아니라 사용자 요청과 가독성 기준을 바탕으로 선택한 디자인 값이다.
- 내부 링크는 얇고 둥근 Lucide chevron을 사용한다. 아이콘을 문자 화살표로 그리지 않는다.
- 아이콘은 공식 저장소에서 받은 SVG를 로컬에 보관하고 라이선스를 함께 유지한다. 선 두께를 1.5로 조정했다.
  https://github.com/lucide-icons/lucide
  https://lucide.dev/license
- 라이선스 파일은 public/icons/LICENSE에 있다.
- 학습 삽화는 기본 이미지 생성 기능으로 제작하고 `public/illustrations/`에 WebP로 보관한다. 이미지에는 글자를 넣지 않고, 한국어 설명과 대체 텍스트는 HTML에서 제공한다. 수치와 절차를 확인하는 도식은 별도로 유지한다.
- 생성 프롬프트는 아래 공통 스타일과 주제별 지시를 사용했다.

<details>
<summary>학습 삽화 생성 프롬프트</summary>

- 공통 스타일: A polished landscape educational editorial illustration for a quiet Korean computer science handbook. 3:2 wide composition, large simple forms readable at a phone width, gentle tactile screen-printed paper texture with crisp edges, warm ivory background, muted navy and terracotta accents, plenty of margin. Simple near frontal view, no heading, no lettering, no numerals, no watermarks, no people, no decoration unrelated to the concept. Treat the metaphor literally and keep spatial relationships clear.
- 배열과 포인터: Show an address-reference metaphor: exactly three adjacent same-sized blue-gray memory compartments in a single horizontal rail, each holding one contrasting object. Below are exactly two small terracotta pointers that are visually separate objects, with two thin independent clean arrows from the separate pointers toward the first and second compartments respectively. No arrow to the third compartment, no links between compartments. The array stays in place; pointers are separate from contents.
- AVL 회전: Show an educational illustration of balancing a binary tree, in two separate scenes left and right, one subtle connecting arrow from left scene to right scene. Use exactly three colored circles per tree with straight thin branch lines and ample spacing. In the left scene the chain slopes left: navy node at top, terracotta node below and to its left, pale-blue node below and to the left again; connect navy to terracotta, terracotta to pale-blue. In the right scene the same three nodes form a symmetrical tree: terracotta at top, pale-blue bottom left, navy bottom right, two branches from the terracotta node. No other nodes or branches. Clear centered composition.
- 캐시: Show a quiet studio reading desk as a memory locality metaphor, no person. An open unmarked notebook in the foreground, then a small tidy tray holding four plain, similarly colored index cards side by side with visible separation close to the notebook. A larger clearly distant cabinet stores many cards in rows across the room, far behind the desk. Emphasize spatial contrast between quick-access few cards at arm's reach and the large backing collection farther away. Clean spatial depth and natural soft shadow.

</details>

## 구조와 검증

- 빌드 없이 실행되는 HTML, CSS, JavaScript 구조다.
- public/courses/는 과목 데이터, public/app.js는 화면 이동과 기록, public/quiz.js는 문항 표시와 즉시 채점, public/diagrams.js는 학습 도식이다.
- 기존 학습 기록과 과목별 문항 ID의 호환성을 유지한다.
- 사용자 수정 파일을 덮어쓰거나 무관한 변경을 커밋하지 않는다.
- 실제 브라우저에서 모바일 크기, 가로 넘침, 링크, 채점, 오답 복습, 기록 유지를 변경 범위에 맞춰 확인한다.
- 과목 행은 행 자체에 패딩을 주고 hover 배경이 그 패딩 전체를 포함하게 한다. 구분선의 inset과 내부 패딩을 혼동하지 않는다.
- 로컬 개발 도구의 Node 버전은 .node-version을 따른다.
- 로컬 미리보기는 `npx --yes serve@14.2.8 public --listen tcp://127.0.0.1:8000`으로 실행한다.
- 포맷은 Prettier 3.7.4를 사용한다. `npx --yes prettier@3.7.4 --check public README.md AGENTS.md vercel.json`으로 확인한다.

## 커밋 규칙

- Conventional Commits 형식인 `type(scope): summary`를 사용한다. 범위를 명시할 필요가 없으면 `type: summary`로 작성한다.
- 기능은 `feat`, 버그 수정은 `fix`, 문서는 `docs`, 동작을 유지하는 구조 변경은 `refactor`, 포맷만 바꾸는 작업은 `style`을 사용한다.
- 제목은 짧은 영어 명령형으로 작성한다. 예: `fix(quiz): save answers before advancing`.
- 기능, 수정, 문서, 포맷 변경을 작업 목적에 따라 커밋으로 나눈다. 이미 푸시한 커밋의 제목을 바꾸기 위해 이력을 재작성하지 않는다.
