const officialScope = "https://knou.ac.kr/bbs/knou/51/283218/download.do";
const textbook = (isbn) =>
  "https://press.knou.ac.kr/goods/textBookView.do?condLscValue=001&condCmdtCode=" +
  isbn;

function lesson(label, title, topics, compare, example, notes, quiz) {
  return {
    label,
    title,
    lead: topics[0][0],
    topics,
    compare,
    example,
    notes,
    quiz,
  };
}

// Append practice so saved answers keep their existing question indices.
function addPractice(chapters, practice) {
  chapters.forEach((chapter, index) => {
    const [worked, walkthroughs, application] = practice[index];
    chapter.worked = worked;
    chapter.quiz.forEach((question, qi) => {
      question[3] = [question[3], walkthroughs[qi]];
    });
    chapter.quiz.push(application);
  });
}
