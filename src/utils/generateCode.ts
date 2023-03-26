const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
const alphabet = Array.from(Array(26)).map((e, i) => String.fromCharCode(i + 65));
const chars = [...numbers, ...alphabet].join('');

export function generateCode(length = 6) {
  const result = [];
  for (let i = length; i > 0; --i) result.push(chars[Math.floor(Math.random() * chars.length)]);

  result.splice(3, 0, '-');
  return result.join('');
}
