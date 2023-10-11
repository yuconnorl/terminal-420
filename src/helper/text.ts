export function categoryTextFormatter (word: string){
  if (/-/.test(word)) return word.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return word.charAt(0).toUpperCase() + word.slice(1)
}
        