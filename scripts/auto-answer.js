// Auto-answer helper - reads question and clicks correct answer
console.log((function(){
  const m = document.querySelector('main');
  const text = m?.innerText || '';
  const romajiMatch = text.match(/Pilih huruf untuk romaji "([aiueo]+)"/);
  const kanaMatch = text.match(/Huruf apa ini\?\s+([あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん])/);
  const typingMatch = text.match(/Romaji:/);
  const romajiToKana = {a:'あ',i:'い',u:'う',e:'え',o:'お',ka:'か',ki:'き',ku:'く',ke:'け',ko:'こ',sa:'さ',shi:'し',su:'す',se:'せ',so:'そ',ta:'た',chi:'ち',tsu:'つ',te:'て',to:'と',na:'な',ni:'に',nu:'ぬ',ne:'ね',no:'の',ha:'は',hi:'ひ',fu:'ふ',he:'へ',ho:'ほ',ma:'ま',mi:'み',mu:'む',me:'め',mo:'も',ya:'や',yu:'ゆ',yo:'よ',ra:'ら',ri:'り',ru:'る',re:'れ',ro:'ろ',wa:'わ',wo:'を',n:'ん'};
  const kanaToRomaji = Object.fromEntries(Object.entries(romajiToKana).map(([k,v])=>[v,k]));
  
  // Find answer buttons
  const buttons = Array.from(document.querySelectorAll('button'));
  const answerBtns = buttons.filter(b => {
    const t = b.textContent || '';
    return /^[A-D] /.test(t) && !b.disabled;
  });
  
  if (answerBtns.length === 0) return 'no answer buttons';
  
  let target = null;
  if (kanaMatch) target = kanaToRomaji[kanaMatch[1]];
  if (romajiMatch) target = romajiToKana[romajiMatch[1]];
  
  if (!target) return 'no target found in: ' + text.substring(0, 100);
  
  for (const btn of answerBtns) {
    const content = btn.textContent || '';
    const value = content.substring(2).trim();
    if (value === target) {
      btn.click();
      return 'clicked: ' + value;
    }
  }
  return 'not found, target=' + target + ', buttons=' + answerBtns.map(b=>b.textContent).join('|');
})())
