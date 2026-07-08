// Auto-answer loop - answers all questions in a battle
(function autoAnswer() {
  const m = document.querySelector('main');
  const text = m?.innerText || '';
  if (text.includes('VICTORY') || text.includes('KALAH')) {
    console.log('BATTLE ENDED');
    return;
  }
  const romajiMatch = text.match(/Pilih huruf untuk romaji "([aiueo])"/);
  const kanaMatch = text.match(/Huruf apa ini\?\s*([あいうえお])/);
  const romajiToKana = {a:'あ',i:'い',u:'う',e:'え',o:'お'};
  const kanaToRomaji = {'あ':'a','い':'i','う':'u','え':'e','お':'o'};
  const buttons = Array.from(document.querySelectorAll('button'));
  const answerBtns = buttons.filter(b => {
    const t = (b.textContent || '').trim();
    return /^[A-D]/.test(t) && t.length > 1 && !b.disabled;
  });
  let target = null;
  if (kanaMatch) target = kanaToRomaji[kanaMatch[1]];
  if (romajiMatch) target = romajiToKana[romajiMatch[1]];
  if (target && answerBtns.length > 0) {
    for (const btn of answerBtns) {
      const content = (btn.textContent || '').trim();
      const value = content.substring(1).trim();
      if (value === target) {
        btn.click();
        console.log('clicked: ' + value);
        // Schedule next answer
        setTimeout(autoAnswer, 2500);
        return;
      }
    }
  }
  // Try again in 500ms if no target found (transition state)
  setTimeout(autoAnswer, 500);
})();
