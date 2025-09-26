<!-- SliderComponent.vue -->
<template>
  <div class="slider-wrapper">
    <div ref="sliderContainer" class="slider-container">
      <slot />
    </div>
  </div>
</template>

<script>
import { tns } from 'tiny-slider/src/tiny-slider'

export default {
    name: 'SliderComponent',
    props: {
        options: {
            type: Object,
            default: () => ({})
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        items: {
            type: Number,
            default: 1
        },
        slideBy: {
            type: [String, Number],
            default: 1
        },
        autoplayTimeout: {
            type: Number,
            default: 3000
        },
        controls: {
            type: Boolean,
            default: true
        },
        nav: {
            type: Boolean,
            default: true
        },
        responsive: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            slider: null
        }
    },
    computed: {
        sliderOptions() {
            return {
                container: this.$refs.sliderContainer,
                items: this.items,
                slideBy: this.slideBy,
                autoplay: this.autoplay,
                autoplayTimeout: this.autoplayTimeout,
                controls: this.controls,
                nav: this.nav,
                mouseDrag: true,
                touch: true,
                responsive: this.responsive,
                ...this.options
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSlider()
        })
    },
    beforeDestroy() {
        this.destroySlider()
    },
    methods: {
        initSlider() {
            try {
                this.slider = tns(this.sliderOptions)
                this.$emit('slider-created', this.slider)
            } catch (error) {
                console.error('Erreur lors de l\'initialisation du slider:', error)
            }
        },
        destroySlider() {
            if (this.slider) {
                this.slider.destroy()
                this.slider = null
            }
        },
        goTo(index) {
            if (this.slider) {
                this.slider.goTo(index)
            }
        },
        goToNext() {
            if (this.slider) {
                this.slider.goTo('next')
            }
        },
        goToPrev() {
            if (this.slider) {
                this.slider.goTo('prev')
            }
        },
        play() {
            if (this.slider) {
                this.slider.play()
            }
        },
        pause() {
            if (this.slider) {
                this.slider.pause()
            }
        }
    }
}
</script>

<style scoped>
.slider-wrapper {
    position: relative;
}

.slider-container {
    overflow: hidden;
}
</style>

<!-- Exemple d'utilisation du composant -->
<!-- ParentComponent.vue -->
<template>
    <div class="app">
        <h1>Exemples d'utilisation du Slider</h1>

        <!-- Slider simple -->
        <section class="slider-section">
            <h2>Slider Simple</h2>
            <SliderComponent :items="1" :autoplay="true" :autoplay-timeout="3000" @slider-created="onSliderCreated">
                <div v-for="(item, index) in simpleSlides" :key="index" class="slide-item">
                    <div class="slide-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.content }}</p>
                    </div>
                </div>
            </SliderComponent>
        </section>

        <!-- Slider avec images -->
        <section class="slider-section">
            <h2>Slider avec Images</h2>
            <SliderComponent :items="1" :responsive="{
                640: { items: 2 },
                900: { items: 3 }
            }" :autoplay="false" ref="imageSlider">
                <div v-for="(image, index) in imageSlides" :key="index" class="image-slide">
                    <img :src="image.src" :alt="image.alt" />
                    <div class="image-caption">{{ image.caption }}</div>
                </div>
            </SliderComponent>

            <!-- Contrôles personnalisés -->
            <div class="custom-controls">
                <button @click="prevSlide">← Précédent</button>
                <button @click="nextSlide">Suivant →</button>
                <button @click="toggleAutoplay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
            </div>
        </section>

        <!-- Slider avec configuration personnalisée -->
        <section class="slider-section">
            <h2>Slider Personnalisé</h2>
            <SliderComponent :options="customOptions" :items="2" :slide-by="2">
                <div v-for="(card, index) in cardSlides" :key="index" class="card-slide">
                    <div class="card">
                        <div class="card-header" :style="{ backgroundColor: card.color }">
                            <h4>{{ card.title }}</h4>
                        </div>
                        <div class="card-body">
                            <p>{{ card.description }}</p>
                            <div class="card-meta">{{ card.meta }}</div>
                        </div>
                    </div>
                </div>
            </SliderComponent>
        </section>
    </div>
</template>

<script>
import SliderComponent from './SliderComponent.vue'

export default {
  name: 'ParentComponent',
  components: {
    SliderComponent
  },
  data() {
    return {
      isPlaying: false,
      simpleSlides: [
        { title: 'Slide 1', content: 'Contenu du premier slide' },
        { title: 'Slide 2', content: 'Contenu du deuxième slide' },
        { title: 'Slide 3', content: 'Contenu du troisième slide' }
      ],
      imageSlides: [
        { src: 'https://via.placeholder.com/400x250/ff6b6b/ffffff?text=Image+1', alt: 'Image 1', caption: 'Légende 1' },
        { src: 'https://via.placeholder.com/400x250/4ecdc4/ffffff?text=Image+2', alt: 'Image 2', caption: 'Légende 2' },
        { src: 'https://via.placeholder.com/400x250/45b7d1/ffffff?text=Image+3', alt: 'Image 3', caption: 'Légende 3' },
        { src: 'https://via.placeholder.com/400x250/f39c12/ffffff?text=Image+4', alt: 'Image 4', caption: 'Légende 4' }
      ],
      cardSlides: [
        { title: 'Card 1', description: 'Description de la première carte', meta: 'Meta info 1', color: '#e74c3c' },
        { title: 'Card 2', description: 'Description de la deuxième carte', meta: 'Meta info 2', color: '#2ecc71' },
        { title: 'Card 3', description: 'Description de la troisième carte', meta: 'Meta info 3', color: '#3498db' },
        { title: 'Card 4', description: 'Description de la quatrième carte', meta: 'Meta info 4', color: '#9b59b6' },
        { title: 'Card 5', description: 'Description de la cinquième carte', meta: 'Meta info 5', color: '#f39c12' }
      ],
      customOptions: {
        speed: 500,
        autoplayHoverPause: true,
        controlsText: ['‹', '›'],
        autoHeight: true
      }
    }
  },
  methods: {
    onSliderCreated(slider) {
      console.log('Slider créé:', slider)
    },
    nextSlide() {
      if (this.$refs.imageSlider) {
        this.$refs.imageSlider.goToNext()
      }
    },
    prevSlide() {
      if (this.$refs.imageSlider) {
        this.$refs.imageSlider.goToPrev()
      }
    },
    toggleAutoplay() {
      if (this.$refs.imageSlider) {
        if (this.isPlaying) {
          this.$refs.imageSlider.pause()
        } else {
          this.$refs.imageSlider.play()
        }
        this.isPlaying = !this.isPlaying
      }
    }
  }
}
</script>

<style scoped>
.app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.slider-section {
    margin-bottom: 40px;
}

.slider-section h2 {
    color: #2c3e50;
    margin-bottom: 20px;
}

.slide-item {
    padding: 20px;
}

.slide-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.slide-content h3 {
    margin: 0 0 15px;
    font-size: 1.5rem;
}

.image-slide {
    padding: 10px;
}

.image-slide img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
}

.image-caption {
    text-align: center;
    color: #666;
    font-style: italic;
}

.card-slide {
    padding: 10px;
}

.card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.card-header {
    color: white;
    padding: 15px;
    text-align: center;
}

.card-header h4 {
    margin: 0;
}

.card-body {
    padding: 20px;
}

.card-meta {
    color: #888;
    font-size: 0.9rem;
    margin-top: 10px;
}

.custom-controls {
    text-align: center;
    margin-top: 20px;
}

.custom-controls button {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}

.custom-controls button:hover {
    background: #2980b9;
}
</style>