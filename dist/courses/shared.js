const officialScope = 'https://knou.ac.kr/bbs/knou/51/283218/download.do';
const textbook = isbn => 'https://press.knou.ac.kr/goods/textBookView.do?condLscValue=001&condCmdtCode=' + isbn;

function lesson(label, title, topics, compare, example, notes, quiz) {
  return { label, title, lead: topics[0][0], topics, compare, example, notes, quiz };
}
