const fs = require('fs');
const path = require('path');
const exercisesFilePath = path.join(__dirname, './data/exercises.json');
const outputFilePath = path.join(__dirname, './utils/imageUtils.tsx');
const exercises = JSON.parse(fs.readFileSync(exercisesFilePath, 'utf8'));
const imageMapping = {};

exercises.forEach((exercise) => {
  exercise.images.forEach((imagePath, index) => {
    const imageName = `${exercise.id}/${index}.jpg`;
    imageMapping[imageName] = imagePath;
  });
});

const outputContent = `const exerciseImageMap: Record<string, string> = ${JSON.stringify(
  imageMapping,
  null,
  2
)};

export default exerciseImageMap;`;

fs.writeFileSync(outputFilePath, outputContent);

console.log('Image mapping file created successfully!');
