import fs from 'fs';

const categories = [
  { id: 'c1', name: { en: 'Alertness', bn: 'সতর্কতা' }, icon: 'Eye' },
  { id: 'c2', name: { en: 'Attitude', bn: 'মনোভাব' }, icon: 'Brain' },
  { id: 'c3', name: { en: 'Safety and your vehicle', bn: 'নিরাপত্তা এবং আপনার যান' }, icon: 'ShieldCheck' },
  { id: 'c4', name: { en: 'Safety margins', bn: 'নিরাপত্তা মার্জিন' }, icon: 'Ruler' },
  { id: 'c5', name: { en: 'Hazard awareness', bn: 'বিপদ সচেতনতা' }, icon: 'AlertTriangle' },
  { id: 'c6', name: { en: 'Vulnerable road users', bn: 'ঝুঁকিপূর্ণ রাস্তা ব্যবহারকারী' }, icon: 'Users' },
  { id: 'c7', name: { en: 'Other types of vehicle', bn: 'অন্যান্য ধরণের যান' }, icon: 'Truck' },
  { id: 'c8', name: { en: 'Road conditions and vehicle handling', bn: 'রাস্তার অবস্থা এবং যান পরিচালনা' }, icon: 'CloudRain' },
  { id: 'c9', name: { en: 'Motorway rules', bn: 'মোটরওয়ে নিয়ম' }, icon: 'Milestone' },
  { id: 'c10', name: { en: 'Rules of the road', bn: 'রাস্তার নিয়ম' }, icon: 'BookOpen' },
  { id: 'c11', name: { en: 'Road and traffic signs', bn: 'রাস্তা এবং ট্রাফিক চিহ্ন' }, icon: 'Signpost' },
  { id: 'c12', name: { en: 'Documents', bn: 'নথিপত্র' }, icon: 'FileText' },
  { id: 'c13', name: { en: 'Incidents, accidents and emergencies', bn: 'ঘটনা, দুর্ঘটনা এবং জরুরি অবস্থা' }, icon: 'Ambulance' },
  { id: 'c14', name: { en: 'Vehicle loading', bn: 'যানবাহন লোডিং' }, icon: 'Package' }
];

function assignCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('sign') || lower.includes('light') || lower.includes('marking')) return 'c11';
  if (lower.includes('motorway') || lower.includes('dual carriageway')) return 'c9';
  if (lower.includes('pedestrian') || lower.includes('cyclist') || lower.includes('horse')) return 'c6';
  if (lower.includes('skid') || lower.includes('rain') || lower.includes('fog') || lower.includes('snow') || lower.includes('weather') || lower.includes('wet')) return 'c8';
  if (lower.includes('accident') || lower.includes('emergency') || lower.includes('casualty') || lower.includes('burn')) return 'c13';
  if (lower.includes('document') || lower.includes('licence') || lower.includes('insurance') || lower.includes('mot')) return 'c12';
  if (lower.includes('load') || lower.includes('roof rack')) return 'c14';
  if (lower.includes('lorry') || lower.includes('bus') || lower.includes('tram') || lower.includes('tractor')) return 'c7';
  if (lower.includes('speed') || lower.includes('distance') || lower.includes('gap')) return 'c4';
  if (lower.includes('tired') || lower.includes('alcohol') || lower.includes('drug') || lower.includes('medicine')) return 'c1';
  if (lower.includes('brake') || lower.includes('tyre') || lower.includes('steering') || lower.includes('battery') || lower.includes('oil')) return 'c3';
  if (lower.includes('hazard') || lower.includes('danger')) return 'c5';
  if (lower.includes('attitude') || lower.includes('upset') || lower.includes('horn')) return 'c2';
  return 'c10'; // Default to rules of the road
}

const parsed = JSON.parse(fs.readFileSync('parsed_questions.json', 'utf8'));

const formattedQuestions = parsed.map(q => {
  return {
    id: q.id,
    categoryId: assignCategory(q.text),
    text: {
      en: q.text,
      bn: q.text // Fallback to English for now
    },
    options: q.options.map(o => ({
      id: o.id,
      text: {
        en: o.text,
        bn: o.text // Fallback to English
      }
    })),
    correctOptionId: q.correctOptionId || q.options[0].id, // fallback
    explanation: {
      en: q.explanation || 'No explanation available.',
      bn: q.explanation || 'No explanation available.' // Fallback
    },
    imageUrl: q.imageUrl || undefined
  };
});

const fileContent = `export type Language = 'en' | 'bn';

export interface Option {
  id: string;
  text: {
    en: string;
    bn: string;
  };
}

export interface Question {
  id: string;
  categoryId: string;
  text: {
    en: string;
    bn: string;
  };
  options: Option[];
  correctOptionId: string;
  explanation: {
    en: string;
    bn: string;
  };
  imageUrl?: string;
}

export const categories = ${JSON.stringify(categories, null, 2)};

export const questions: Question[] = ${JSON.stringify(formattedQuestions, null, 2)};
`;

fs.writeFileSync('src/data/questions.ts', fileContent);
console.log('Successfully generated src/data/questions.ts');
