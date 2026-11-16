const courses = [
  {slug:'intro', title:'컴퓨터과학개론', year:1, scope:'교재 1–8장 전체와 해당 멀티미디어 강의', chapters:introChapters,
    sources:[[textbook('9788920039553'),'교재 목차'],['https://professor.knou.ac.kr/kylee/8732/subview.do','강의 안내']]},
  {slug:'ai', title:'AI리터러시', year:1, scope:'멀티미디어 1–15강 전체', chapters:aiChapters,
    sources:[['https://www.knou.ac.kr/learningInformation/korean/view.do?deptCd=34&sbjtNo=34103&seme=2&shgr=1&year=2026','공식 강의 계획']]},
  {slug:'c', title:'C프로그래밍', year:1, scope:'교재 1–9장 전체와 해당 강의 · 4–6장 중점', chapters:cChapters,
    sources:[[textbook('9788920035197'),'교재 목차']]},
  {slug:'english', title:'대학영어', year:1, scope:'강의 3–14강 중 교재 Unit 2·4·7·9·11·13', chapters:englishChapters,
    sources:[['https://press.knou.ac.kr/goods/ebookView.m?condCmdtCode=9788920051111&condLscValue=201','교재 목차']]},
  {slug:'structures', title:'자료구조', year:2, scope:'교재 1–15장 전체와 해당 멀티미디어 강의', chapters:structureChapters,
    sources:[['https://press.knou.ac.kr/goods/ebookView.do?condCmdtCode=9788920047077&condLscValue=201','교재 목차']]},
  {slug:'architecture', title:'컴퓨터구조', year:3, scope:'교재 1장, 3–9장과 해당 강의 · 2장 제외', chapters:architectureChapters,
    sources:[[textbook('9788920039706'),'교재 목차']]}
];
