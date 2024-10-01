const fs = require('fs');
const path = require('path');

// Path to your JSON file
const exercisesFilePath = path.join(__dirname, './data/exercises.json');
const outputFilePath = path.join(__dirname, './utils/imageUtils.tsx');

// Read the JSON file
const exercises = JSON.parse(fs.readFileSync(exercisesFilePath, 'utf8'));

// Create a mapping object for images
const imageMapping = {};

exercises.forEach((exercise) => {
  exercise.images.forEach((imagePath, index) => {
    // Create a unique key based on the exercise ID and image index
    const imageName = `${exercise.id}/${index}.jpg`;
    imageMapping[imageName] = imagePath;
  });
});

// Create a TypeScript file with the mapping
const outputContent = `const exerciseImageMap: Record<string, string> = ${JSON.stringify(
  imageMapping,
  null,
  2
)};

export default exerciseImageMap;`;

fs.writeFileSync(outputFilePath, outputContent);

console.log('Image mapping file created successfully!');
