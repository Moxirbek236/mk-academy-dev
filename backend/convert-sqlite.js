const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// 1. Change Provider
schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');

// 2. Add SQLite datasource URL
// Ensure URL is there or replace it
if (schema.includes('env("DATABASE_URL")')) {
  schema = schema.replace('env("DATABASE_URL")', '"file:./dev.db"');
}

// 3. Convert all Enums to models or remove them, but wait!
// To keep types, Prisma doesn't support enums in SQLite. We just replace the enum definitions with nothing,
// and replace enum usages in models with String.

const enums = [
  'Role', 'CefrLevel', 'Language', 'VocabStatus', 'TaskType', 'StudentTaskStatus',
  'TestType', 'QuestionType', 'QuestionInputType', 'QuestionSkill', 'LeaderboardScope',
  'GroupMemberStatus', 'BookCategory', 'RatingTargetType'
];

enums.forEach(e => {
  // Replace enum usage in models (e.g. role Role@default(STUDENT))
  // Regex looks for fieldName e followed by spaces, then e
  // e.g. "role Role" -> "role String"
  // Needs to be careful with trailing spaces or arrays
  
  // Actually, replacing global word boundary is safer
  const usageRegex = new RegExp(`\\b${e}(\\[\\]|\\?)?\\b`, 'g');
  schema = schema.replace(usageRegex, match => {
    if (match.includes('[]')) return 'String'; // SQLite doesn't support scalar arrays, so change String[] to String
    if (match.includes('?')) return 'String?';
    return 'String';
  });
});

// Remove enum blocks
const enumBlockRegex = /enum \w+ \{[^}]*\}/g;
schema = schema.replace(enumBlockRegex, '');

// Also SQLite doesn't support JSONB, change to String
schema = schema.replace(/\bJSONB\b/g, 'String');
schema = schema.replace(/\bJson\b/g, 'String');
schema = schema.replace(/\bString\[\]\b/g, 'String');

fs.writeFileSync(schemaPath, schema);
console.log('Schema converted to SQLite successfully.');
