import confetti from 'canvas-confetti';

export function triggerCelebration(palpite?: 'jade' | 'benicio' | 'surpresa') {
  if (typeof window === 'undefined') return;

  const jadeColors = ['#cb6b5c', '#df7f70', '#f4c7c0', '#bfa15f', '#ffffff'];
  const benicioColors = ['#3d6a89', '#5d89a9', '#b8d4e7', '#bfa15f', '#ffffff'];
  const neutralColors = ['#cb6b5c', '#3d6a89', '#bfa15f', '#ffffff', '#e8dec8'];

  const colors = palpite === 'jade' 
    ? jadeColors 
    : palpite === 'benicio' 
    ? benicioColors 
    : neutralColors;

  // Explosão inicial
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: colors,
    disableForReducedMotion: true,
  });

  // Salva lateral dupla
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.7 },
      colors: colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.7 },
      colors: colors,
    });
  }, 250);
}
