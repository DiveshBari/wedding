const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('is-open');
  });
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

const heroSlides = document.querySelectorAll('.hero-slide');
let heroIdx = 0;
setInterval(() => {
  heroSlides[heroIdx].classList.remove('is-active');
  heroIdx = (heroIdx + 1) % heroSlides.length;
  heroSlides[heroIdx].classList.add('is-active');
}, 5200);

const albumData = {
  prewedding: [
    {
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden hour pre-wedding portrait.'
    },
    {
      src: 'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21f?auto=format&fit=crop&w=1200&q=80',
      caption: 'A quiet moment before forever.'
    },
    {
      src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Romance in timeless elegance.'
    }
  ],
  engagement: [
    {
      src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
      caption: 'The promise begins.'
    },
    {
      src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      caption: 'A ring, a smile, a lifetime.'
    },
    {
      src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
      caption: 'Engagement celebration in style.'
    }
  ],
  haldi: [
    {
      src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80',
      caption: 'Haldi hues and heartfelt blessings.'
    },
    {
      src: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80',
      caption: 'Colorful laughter in every frame.'
    },
    {
      src: 'https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sacred rituals with joyful energy.'
    }
  ],
  wedding: [
    {
      src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80',
      caption: 'The sacred vows.'
    },
    {
      src: 'https://images.unsplash.com/photo-1594736797933-d0df51d49c46?auto=format&fit=crop&w=1200&q=80',
      caption: 'A grand walk into forever.'
    },
    {
      src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      caption: 'An evening of regal celebration.'
    }
  ]
};

const tabs = document.querySelectorAll('.tab');
const viewer = document.querySelector('.album-photo');
const viewerImg = viewer.querySelector('img');
const viewerCaption = viewer.querySelector('figcaption');
const prevBtn = document.querySelector('.album-nav.prev');
const nextBtn = document.querySelector('.album-nav.next');
const thumbRow = document.querySelector('.thumb-row');
const albumViewer = document.querySelector('.album-viewer');

let currentCategory = 'prewedding';
let currentIndex = 0;

function buildThumbs() {
  thumbRow.innerHTML = '';
  albumData[currentCategory].forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = `thumb ${idx === currentIndex ? 'is-active' : ''}`;
    btn.type = 'button';
    btn.setAttribute('aria-label', `Open image ${idx + 1}`);

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = item.src;
    img.alt = item.caption;

    btn.append(img);
    btn.addEventListener('click', () => updateImage(idx, idx > currentIndex ? 'right' : 'left'));
    thumbRow.append(btn);
  });
}

function updateImage(nextIndex, direction = 'right') {
  viewer.classList.remove('flip-left', 'flip-right');
  void viewer.offsetWidth;
  viewer.classList.add(direction === 'right' ? 'flip-right' : 'flip-left');

  setTimeout(() => {
    currentIndex = (nextIndex + albumData[currentCategory].length) % albumData[currentCategory].length;
    const item = albumData[currentCategory][currentIndex];
    viewerImg.src = item.src;
    viewerImg.alt = item.caption;
    viewerCaption.textContent = item.caption;
    viewer.classList.remove('flip-left', 'flip-right');

    thumbRow.querySelectorAll('.thumb').forEach((thumb, idx) => {
      thumb.classList.toggle('is-active', idx === currentIndex);
    });
  }, 250);
}

function setCategory(category) {
  currentCategory = category;
  currentIndex = 0;
  tabs.forEach((tab) => {
    const active = tab.dataset.category === category;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  buildThumbs();
  updateImage(0, 'right');
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setCategory(tab.dataset.category));
});

prevBtn.addEventListener('click', () => updateImage(currentIndex - 1, 'left'));
nextBtn.addEventListener('click', () => updateImage(currentIndex + 1, 'right'));

let startX = 0;
albumViewer.addEventListener('touchstart', (event) => {
  startX = event.changedTouches[0].clientX;
});
albumViewer.addEventListener('touchend', (event) => {
  const endX = event.changedTouches[0].clientX;
  const delta = endX - startX;
  if (Math.abs(delta) < 40) return;
  if (delta > 0) {
    updateImage(currentIndex - 1, 'left');
  } else {
    updateImage(currentIndex + 1, 'right');
  }
});

setCategory(currentCategory);
