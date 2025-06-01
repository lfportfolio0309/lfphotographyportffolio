document.addEventListener("DOMContentLoaded", function () {
  // Page transition fade effect
  document.body.classList.add('fade');

  setTimeout(() => {
    document.body.classList.remove('fade');
  }, 100);

  document.querySelectorAll('.nav-links a, .logo a').forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.href && this.target !== "_blank" && !this.href.endsWith('#')) {
        e.preventDefault();
        document.body.classList.add('fade');
        setTimeout(() => {
          window.location = this.href;
        }, 500);
      }
    });
  });

  // Rising animation observer
  const risingEls = document.querySelectorAll('.rising');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('rise-up', entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  risingEls.forEach(el => observer.observe(el));

  // Album system
  const albumCards = document.querySelectorAll('.album-card');
  const albumContent = document.getElementById('albumContent');
  const albumList = document.querySelector('.album-list');
  const overlay = document.getElementById('overlay');

  albumCards.forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();

      const albumName = this.getAttribute('data-title');
      const albumId = this.getAttribute('data-album');

      albumContent.innerHTML = `
        <h1>${albumName}</h1>
        <div class="photo-grid">
          ${loadPhotos(albumId)}
        </div>
        <a href="#" class="view-btn back-btn">Back to Albums</a>
        <div id="overlay"></div>
      `;

      // Hide album list
      albumList.style.display = 'none';

      // Back button
      document.querySelector('.back-btn').addEventListener('click', function (e) {
        e.preventDefault();
        albumContent.innerHTML = '';
        albumContent.appendChild(albumList); // Put the album list back into albumContent
       albumList.style.display = 'flex';
      });
    });
  });

  // Delegate zoom events
  albumContent.addEventListener('click', e => {
    if (e.target.matches('.photo-grid img, .photo-grid video')) {
      const media = e.target;
      const overlay = document.getElementById('overlay');

      overlay.innerHTML = '';
      const clone = media.cloneNode(true);

      if (clone.tagName.toLowerCase() === 'video') {
        clone.controls = true;
        clone.autoplay = true;
        clone.loop = true;
      }

      overlay.appendChild(clone);
      overlay.classList.add('active');
    } else if (e.target.id === 'overlay') {
      e.target.classList.remove('active');
      e.target.innerHTML = '';
    }
  });

  // Fade in existing overlay on click (if needed)
  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
    overlay.innerHTML = '';
  });

});

// Function to load photos/videos
function loadPhotos(albumId) {
  let content = '';

  if (albumId === 'album1') {
    for (let i = 3; i <= 20; i++) {
      content += `<img loading="lazy" src="Albums/Album 1/${i}.jpg" alt="Photo ${i - 2}">`;
    }
  } else if (albumId === 'album2') {
    content = `
      <img loading="lazy" src="Albums/Album 2/1.jpg" alt="Photo 1">
      <img loading="lazy" src="Albums/Album 2/2.jpg" alt="Photo 2">
      <img loading="lazy" src="Albums/Album 2/12.jpg" alt="Photo 3">
      <img loading="lazy" src="Albums/Album 2/16.jpg" alt="Photo 4">
      <img loading="lazy" src="Albums/Album 2/18.jpg" alt="Photo 5">
    `;
  } else if (albumId === 'album3') {
    content = `
      <video controls width="240" height="160">
        <source src="Albums/Album 3/video1.mov" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <video controls width="240" height="160">
        <source src="Albums/Album 3/video2.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  }

  return content;
}
document.addEventListener('DOMContentLoaded', function() {
  const trackInner = document.querySelector('.carousel-track-inner');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const slidesToShow = 3;
  let currentIndex = 0;
  let autoScrollTimer;

  function updateCarousel() {
    const slideWidth = slides[0].offsetWidth;
    trackInner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % (slides.length - slidesToShow + 1);
    updateCarousel();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + (slides.length - slidesToShow + 1)) % (slides.length - slidesToShow + 1);
    updateCarousel();
  }

  function resetAutoScroll() {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(() => {
      showNext();
    }, 2000);
  }

  prevBtn.addEventListener('click', () => {
    showPrev();
    resetAutoScroll();
  });

  nextBtn.addEventListener('click', () => {
    showNext();
    resetAutoScroll();
  });

  window.addEventListener('resize', updateCarousel);

  // Initialize
  updateCarousel();
  resetAutoScroll();
});

// Optional: swipe support for touch devices
let startX = 0;
const carouselTrack = document.querySelector('.carousel-track');

carouselTrack.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

carouselTrack.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) {
    document.querySelector('.carousel-btn.prev').click();
    resetAutoScroll();
  }
  if (startX - endX > 50) {
    document.querySelector('.carousel-btn.next').click();
    resetAutoScroll();
  }
});