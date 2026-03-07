import fs from 'fs';
import * as cheerio from 'cheerio';

async function fetchAndParse() {
  const res = await fetch('https://www.drivinginstructorwebsites.co.uk/uk-driving-theory-test-practice-questions-and-answers');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const questions = [];
  let currentQuestion = null;
  
  $('.fr-view').children().each((i, el) => {
    const tag = $(el).prop('tagName').toLowerCase();
    
    if (tag === 'h3') {
      if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
      }
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const match = text.match(/^(\d+)\.\s*(.*)/);
      if (match) {
        currentQuestion = {
          id: `q${match[1]}`,
          text: match[2],
          options: [],
          correctOptionId: '',
          imageUrl: null,
          explanation: ''
        };
      }
    } else if (tag === 'p' && currentQuestion) {
      const img = $(el).find('img').attr('src');
      if (img && !currentQuestion.imageUrl) {
        currentQuestion.imageUrl = img;
      }
      
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const isBold = $(el).find('strong').length > 0;
      
      const optionMatch = text.match(/^([A-E])\.\s*(.*)/);
      if (optionMatch) {
        const optId = optionMatch[1].toLowerCase();
        currentQuestion.options.push({
          id: optId,
          text: optionMatch[2]
        });
        if (isBold) {
          currentQuestion.correctOptionId = optId;
        }
      } else if (text && !img) {
        currentQuestion.explanation += text + ' ';
      }
    }
  });
  
  if (currentQuestion && currentQuestion.options.length > 0) {
    questions.push(currentQuestion);
  }
  
  fs.writeFileSync('parsed_questions.json', JSON.stringify(questions, null, 2));
  console.log(`Parsed ${questions.length} questions.`);
}

fetchAndParse().catch(console.error);
