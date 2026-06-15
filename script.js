// ===== Typed Text Effect =====
const roles = [
  'Cybersecurity Student',
  'Full-Stack Developer',
  'Competitive Programmer',
  'Problem Solver',
];

const typedEl = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

// ===== Navbar Scroll =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 50);
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== Counter Animation =====
const statNums = document.querySelectorAll('.stat__num');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNums.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

const statsSection = document.querySelector('.hero__stats');
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
    }
  },
  { threshold: 0.5 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

// ===== Resume Download (works on mobile) =====
const downloadBtn = document.getElementById('downloadResume');

if (downloadBtn) {
  const resumeUrl = downloadBtn.dataset.resume;
  const resumeFilename = 'Bhavadharani_R_Resume.pdf';
  const labelEl = downloadBtn.querySelector('.btn__label');
  const defaultLabel = labelEl ? labelEl.textContent : 'Download Resume';

  downloadBtn.addEventListener('click', async () => {
    if (downloadBtn.disabled) return;

    downloadBtn.disabled = true;
    if (labelEl) labelEl.textContent = 'Downloading...';

    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error('Resume not found');

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = resumeFilename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      window.open(resumeUrl, '_blank');
    } finally {
      downloadBtn.disabled = false;
      if (labelEl) labelEl.textContent = defaultLabel;
    }
  });
}

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.querySelectorAll('a').forEach((link) => {
        link.style.color =
          link.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
      });
    }
  });
});
