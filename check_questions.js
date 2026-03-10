
import { questions } from './src/data/questions.js';
const untranslated = questions.filter(q => q.text.bn === q.text.en);
console.log(`Total questions: ${questions.length}`);
console.log(`Untranslated questions: ${untranslated.length}`);
if (untranslated.length > 0) {
  console.log('First untranslated question ID:', untranslated[0].id);
}
