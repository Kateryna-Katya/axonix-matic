document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Инициализация Lenis (Плавный скролл)
  // ==========================================
  // Делает прокрутку страницы инерционной и плавной, как на премиальных сайтах.
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

  // ==========================================
  // 2. Мобильное Меню
  // ==========================================
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const links = document.querySelectorAll('.header__link');
  const body = document.body;

  if (burger && nav) {
      burger.addEventListener('click', () => {
          nav.classList.toggle('is-active');

          // Блокируем скролл страницы, когда меню открыто
          if (nav.classList.contains('is-active')) {
              lenis.stop();
              body.style.overflow = 'hidden';
          } else {
              lenis.start();
              body.style.overflow = '';
          }
      });

      // Закрываем меню при клике на любую ссылку
      links.forEach(link => {
          link.addEventListener('click', () => {
              nav.classList.remove('is-active');
              lenis.start();
              body.style.overflow = '';
          });
      });
  }

  // ==========================================
  // 3. Анимации Hero (GSAP)
  // ==========================================
  if (typeof gsap !== 'undefined') {

      // --- 3.1 Анимация загрузки (Появление элементов) ---
      const heroTitle = document.querySelector('.hero__title');
      const heroSubtitle = document.querySelector('.hero__subtitle');
      const heroActions = document.querySelector('.hero__actions');
      const heroBadge = document.querySelector('.hero__badge');

      if (heroTitle) {
          // Скрываем элементы перед стартом
          gsap.set([heroBadge, heroTitle, heroSubtitle, heroActions], {
              y: 30,
              autoAlpha: 0
          });

          const tlLoad = gsap.timeline({ defaults: { ease: "power2.out" } });

          tlLoad
              .to(heroBadge, { y: 0, autoAlpha: 1, duration: 0.8, delay: 0.2 })
              .to(heroTitle, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.6")
              .to(heroSubtitle, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.6")
              .to(heroActions, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.6");
      }

      // --- 3.2 Ротатор текста (Барабан: вас -> рост -> результат) ---
      const words = document.querySelectorAll('.hero__changing-text');

      if(words.length > 0) {
          gsap.set(words, { y: "100%", opacity: 0, position: "absolute" });
          gsap.set(words[0], { y: "0%", opacity: 1 }); // Первое слово активно

          let currentWordIndex = 0;

          function rotateWords() {
              const nextIndex = (currentWordIndex + 1) % words.length;
              const currentWord = words[currentWordIndex];
              const nextWord = words[nextIndex];

              const tl = gsap.timeline();

              tl.to(currentWord, {
                  y: "-100%",
                  opacity: 0,
                  duration: 0.6,
                  ease: "power3.inOut"
              })
              .fromTo(nextWord, {
                  y: "100%",
                  opacity: 0
              }, {
                  y: "0%",
                  opacity: 1,
                  duration: 0.6,
                  ease: "power3.out"
              }, "-=0.5");

              currentWordIndex = nextIndex;
          }

          setInterval(rotateWords, 3000);
      }

      // --- 3.3 Параллакс эффект (Свечение на фоне) ---
      const glow = document.querySelector('.hero__bg-glow');

      if(glow) {
          window.addEventListener('mousemove', (e) => {
              const xPos = (e.clientX / window.innerWidth) - 0.5;
              const yPos = (e.clientY / window.innerHeight) - 0.5;

              gsap.to(glow, {
                  x: xPos * 250,
                  y: yPos * 250,
                  duration: 2,
                  ease: "power2.out"
              });
          });
      }
  } else {
      console.warn("GSAP не найден. Анимации отключены.");
  }

  // ==========================================
  // 4. FAQ Accordion (Аккордеон вопросов)
  // ==========================================
  const accordions = document.querySelectorAll('.accordion__item');

  accordions.forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      trigger.addEventListener('click', () => {
          // Опционально: закрывать другие при открытии одного
          /*
          accordions.forEach(other => {
              if (other !== item) other.classList.remove('is-open');
          });
          */
          item.classList.toggle('is-open');
      });
  });

  // ==========================================
  // 5. Contact Form Logic (Валидация + Капча)
  // ==========================================
  const form = document.getElementById('contactForm');
  const captchaQ = document.getElementById('captchaQ');
  const captchaAns = document.getElementById('captchaAns');

  if (form) {
      // Генерация простой математической капчи
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);
      const correctAns = num1 + num2;

      if(captchaQ) captchaQ.innerText = `${num1} + ${num2}`;

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // 1. Валидация телефона (Только цифры)
          const phoneInput = document.getElementById('phone');
          const phoneRegex = /^\d+$/;

          if (!phoneRegex.test(phoneInput.value)) {
              phoneInput.parentElement.classList.add('error');
              isValid = false;
          } else {
              phoneInput.parentElement.classList.remove('error');
          }

          // 2. Валидация капчи
          if (parseInt(captchaAns.value) !== correctAns) {
              captchaAns.parentElement.classList.add('error');
              isValid = false;
          } else {
              captchaAns.parentElement.classList.remove('error');
          }

          // 3. Симуляция отправки (AJAX)
          if (isValid) {
              const btn = form.querySelector('button[type="submit"]');
              const originalText = btn.innerHTML;

              btn.innerHTML = 'Отправка...';
              btn.disabled = true;

              // Имитация задержки сервера 1.5 сек
              setTimeout(() => {
                  form.classList.add('success'); // Показываем блок успеха
                  btn.innerHTML = originalText;
                  btn.disabled = false;
                  form.reset();

                  // Обновляем капчу после отправки
                  const n1 = Math.floor(Math.random() * 10);
                  const n2 = Math.floor(Math.random() * 10);
                  if(captchaQ) captchaQ.innerText = `${n1} + ${n2}`;
              }, 1500);
          }
      });

      // Убираем ошибку при вводе
      const inputs = form.querySelectorAll('input');
      inputs.forEach(inp => {
          inp.addEventListener('input', () => {
              inp.parentElement.classList.remove('error');
          });
      });
  }

  // ==========================================
  // 6. Cookie Popup (Сохранение в localStorage)
  // ==========================================
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  // Показываем через 2 секунды, если еще не приняли
  if (!localStorage.getItem('cookiesAccepted') && cookiePopup) {
      setTimeout(() => {
          cookiePopup.classList.add('show');
      }, 2000);
  }

  if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }

  // ==========================================
  // 7. Инициализация иконок Lucide
  // ==========================================
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  } else {
      console.warn("Библиотека иконок Lucide не загружена");
  }

  console.log('Axonix-Matic: All systems operational.');
});