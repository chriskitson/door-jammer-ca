if (!customElements.get('lookbook-cards')) {
  customElements.define(
    'lookbook-cards',
    class LookbookCards extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.selectors = {
          sliderWrapper: '.grid-and-slider',
        };

        this.classes = {
          grid: 'f-grid',
          swiper: 'swiper',
          swiperWrapper: 'swiper-wrapper',
        };

        this.enableSlider = this.dataset.enableSlider === 'true';
        if (!this.enableSlider) return;

        this.sliderWrapper = this.querySelector(this.selectors.sliderWrapper);
        this.tabletItems = parseInt(this.dataset.tabletItems);
        this.sliderInstance = false;

        const mql = window.matchMedia(FoxTheme.config.mediaQueryMobile);
        mql.onchange = this.init.bind(this);
        this.init();
      }

      init() {
        if (FoxTheme.config.mqlMobile) {
          this.destroySlider();
        } else {
          this.initSlider();
        }
      }

      initSlider() {
        if (typeof this.sliderInstance === 'object') return;

        const columnGap = window.getComputedStyle(this.sliderWrapper).getPropertyValue('--column-gap');
        const spaceBetween = parseFloat(columnGap.replace('rem', '')) * 10;

        this.sliderOptions = {
          slidesPerView: this.tabletItems > 3 ? 3 : parseInt(this.tabletItems),
          spaceBetween: spaceBetween,
          breakpoints: {
            1024: {
              slidesPerView: this.dataset.items, // Number or auto
            },
          },
          loop: true,
          threshold: 2,
        };

        if (this.dataset.sliderControls == '1') {
          const section = this.closest('#shopify-section-' + this.dataset.sectionId);

          this.sliderOptions.navigation = {
            nextEl: section.querySelector('.swiper-button-next'),
            prevEl: section.querySelector('.swiper-button-prev'),
          };
        }

        this.classList.add(this.classes.swiper);
        this.sliderWrapper.classList.remove(this.classes.grid);
        this.sliderWrapper.classList.add(this.classes.swiperWrapper);

        this.sliderInstance = new window.FoxTheme.Carousel(this, this.sliderOptions);
        this.sliderInstance.init();
      }

      destroySlider() {
        if (typeof this.sliderInstance !== 'object') return;

        this.classList.remove(this.classes.swiper);
        this.sliderWrapper.classList.remove(this.classes.swiperWrapper);
        this.sliderWrapper.classList.add(this.classes.grid);
        this.sliderInstance.slider.destroy();
        this.sliderInstance = false;
      }
    }
  );
}
