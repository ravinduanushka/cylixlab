const fs = require('fs');
const { PDFParse } = require('pdf-parse');

function extractPreformattedMcqs(fullText) {
  if (!fullText) return [];
  const questions = [];
  const regex = /(?:^|\n)(?:Q|Question\s*)(\d+)[\s\.:\-_A-Za-z0-9]*\n([\s\S]*?)(?=(?:\n(?:Q|Question\s*)\d+|\n-- \d+ of \d+ --|$))/gi;
  let match;
  while ((match = regex.exec(fullText)) !== null) {
    const qNum = parseInt(match[1]);
    const body = match[2];

    const optA = body.match(/(?:^|\n)A\.\s*([\s\S]*?)(?=\nB\.\s+|$)/i);
    const optB = body.match(/(?:^|\n)B\.\s*([\s\S]*?)(?=\nC\.\s+|$)/i);
    const optC = body.match(/(?:^|\n)C\.\s*([\s\S]*?)(?=\nD\.\s+|$)/i);
    const optD = body.match(/(?:^|\n)D\.\s*([\s\S]*?)(?=\n(?:Correct\s*answer|Why\s*it\s*is|--|\n\n|$))/i);

    const correctMatch = body.match(/Correct\s*answer\s*:\s*([A-D])/i);
    const correctLetter = correctMatch ? correctMatch[1].toUpperCase() : 'A';
    const correctNum = { A: 1, B: 2, C: 3, D: 4 }[correctLetter] || 1;

    const qPrompt = body.split(/\n[A-D]\.\s+/)[0].trim().replace(/\s+/g, ' ');

    if (optA && optB && optC && optD && qPrompt) {
      questions.push({
        id: qNum,
        label: `Question ${String(qNum).padStart(2, '0')}`,
        question: qPrompt,
        options: [
          optA[1].trim().replace(/\s+/g, ' '),
          optB[1].trim().replace(/\s+/g, ' '),
          optC[1].trim().replace(/\s+/g, ' '),
          optD[1].trim().replace(/\s+/g, ' '),
        ],
        correctAnswer: correctNum,
      });
    }
  }
  return questions;
}

(async () => {
  const parser = new PDFParse({ data: fs.readFileSync('./uploads/assignment_01.pdf') });
  const { text } = await parser.getText();
  const res = extractPreformattedMcqs(text);
  console.log('Total extracted:', res.length);
  if (res.length > 0) {
    console.log('Q1:', JSON.stringify(res[0], null, 2));
    console.log('Q15:', JSON.stringify(res[14], null, 2));
    console.log('Q30:', JSON.stringify(res[res.length - 1], null, 2));
  }
})();
