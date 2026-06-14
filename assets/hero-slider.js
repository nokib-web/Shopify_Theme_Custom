if (!customElements.get('hero-slider')) {
  class HeroSlider extends HTMLElement {
    connectedCallback() {
      const container = this.querySelector('.splide');
      if (!container) return;

      const autoplay = this.getAttribute('data-autoplay') === 'true';
      const interval = parseInt(this.getAttribute('data-autoplay-speed')) * 1000 || 5000;
      const drag = this.getAttribute('data-drag') !== 'false';
      const type = this.getAttribute('data-type') || 'fade';

      let splideType = type;
      let direction = 'ltr';
      let height = undefined;

      if (type === 'slide-vertical') {
        splideType = 'slide';
        direction = 'ttb';
        height = '100%';
      } else if (type === 'loop-vertical') {
        splideType = 'loop';
        direction = 'ttb';
        height = '100%';
      } else if (type === 'scale-fade' || type === 'rotate-fade' || type === 'flip' || type === 'zoom-in-center' || type === 'zoom-out-center' || type === 'blur-fade') {
        splideType = 'fade';
      }

      const config = {
        type: splideType,
        direction: direction === 'ttb' ? 'ttb' : (document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'),
        height: height,
        autoplay: autoplay,
        interval: interval,
        drag: drag,
        arrows: false,
        pagination: false,
        perPage: 1,
        rewind: true,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        speed: 800
      };

      if (typeof Splide !== 'undefined') {
        this.initSplide(container, config);
      } else {
        window.addEventListener('load', () => {
          if (typeof Splide !== 'undefined') {
            this.initSplide(container, config);
          }
        });
      }
    }

    initSplide(container, config) {
      const splide = new Splide(container, config);

      const thumbnails = this.querySelectorAll('.hero-slider__thumbnail-card');
      thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const index = parseInt(thumb.getAttribute('data-index'));
          splide.go(index);
        });
      });

      const prevArrow = this.querySelector('.hero-slider__arrow--prev');
      const nextArrow = this.querySelector('.hero-slider__arrow--next');
      if (prevArrow) prevArrow.addEventListener('click', () => splide.go('<'));
      if (nextArrow) nextArrow.addEventListener('click', () => splide.go('>'));

      splide.on('move', (newIndex) => {
        thumbnails.forEach((thumb) => {
          const index = parseInt(thumb.getAttribute('data-index'));
          thumb.classList.toggle('is-active', index === newIndex);
        });
      });

      const playActiveVideo = () => {
        const activeSlide = container.querySelector('.splide__slide.is-active');
        if (activeSlide) {
          const videos = activeSlide.querySelectorAll('video');
          videos.forEach((video) => {
            if (video.paused) {
              video.play().catch(e => console.log('Autoplay video failed:', e));
            }
          });
        }
      };

      const pauseInactiveVideos = () => {
        const slides = container.querySelectorAll('.splide__slide');
        slides.forEach((slide) => {
          if (!slide.classList.contains('is-active')) {
            const videos = slide.querySelectorAll('video');
            videos.forEach((video) => {
              if (!video.paused) {
                video.pause();
              }
            });
          }
        });
      };

      splide.on('mounted', () => {
        playActiveVideo();
        pauseInactiveVideos();
      });

      splide.on('move', () => {
        const videos = container.querySelectorAll('video');
        videos.forEach((video) => {
          if (!video.paused) {
            video.pause();
          }
        });
      });

      splide.on('moved', () => {
        playActiveVideo();
        pauseInactiveVideos();
      });

      splide.mount();
    }
  }
  customElements.define('hero-slider', HeroSlider);
}
