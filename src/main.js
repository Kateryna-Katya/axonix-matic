document.addEventListener('DOMContentLoaded', () => {

  // 1. Lenis Smooth Scroll Init
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Mobile Menu Toggle
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const links = document.querySelectorAll('.header__link');

  burger.addEventListener('click', () => {
      nav.classList.toggle('is-active');
      // Меняем иконку при клике (опционально, можно добавить анимацию)
  });

  // Закрытие меню при клике на ссылку
  links.forEach(link => {
      link.addEventListener('click', () => {
          nav.classList.remove('is-active');
      });
  });

  console.log('Axonix-Matic: Global styles & Navigation loaded.');
});