class Carousel {
  constructor(containerSelector = ".carousel-container") {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.carousel = this.container.querySelector(".carousel");
    this.cards = Array.from(this.container.querySelectorAll(".Card"));
    this.prevBtn = this.container.querySelector(".prev");
    this.nextBtn = this.container.querySelector(".next");
    this.dotsContainer = this.container.querySelector(".carousel-dots");

    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Adicionar badges aos cards (opcional)
    this.addBadges();

    // Criar indicadores de página
    this.createDots();

    // Adicionar eventos
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    // Evento de redimensionamento
    window.addEventListener("resize", () => this.handleResize());

    // Evento para os dots
    this.dotsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("dot")) {
        const index = parseInt(e.target.dataset.index);
        this.goToPage(index);
      }
    });

    // Suporte a touch para dispositivos móveis
    this.addTouchEvents();

    // Inicializar
    this.updateCarousel();

    // Atualizar a cada 5 segundos (autoplay)
    this.startAutoplay();
  }

  addBadges() {
    // Adiciona badge baseado no tipo de receita
    this.cards.forEach((card) => {
      const title = card.querySelector("h3").textContent;
      let badgeText = "";

      if (title.includes("PRINCIPAL")) badgeText = "Principal";
      else if (title.includes("SOBREMESA")) badgeText = "Sobremesa";
      else if (title.includes("ACOMPANHAMENTO")) badgeText = "Acompanhamento";

      if (badgeText) {
        const badge = document.createElement("div");
        badge.className = "card-badge";
        badge.textContent = badgeText;
        card.appendChild(badge);
      }
    });
  }

  createDots() {
    this.dotsContainer.innerHTML = "";
    const totalPages = Math.ceil(this.cards.length / this.getCardsPerView());

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.className = `dot ${i === 0 ? "active" : ""}`;
      dot.dataset.index = i;
      this.dotsContainer.appendChild(dot);
    }
  }

  getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1200) return 2;
    return 3;
  }

  updateCarousel() {
    const cardsPerView = this.getCardsPerView();
    const cardWidth = this.cards[0].offsetWidth + 40; // width + gap
    const translateX = -this.currentIndex * cardWidth * cardsPerView;

    this.carousel.style.transform = `translateX(${translateX}px)`;

    // Atualizar dots
    this.updateDots();

    // Atualizar estado dos botões
    this.updateButtons();

    // Adicionar efeito visual ao card ativo
    this.highlightActiveCards();
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll(".dot");
    const currentPage = Math.floor(this.currentIndex);

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  }

  updateButtons() {
    const cardsPerView = this.getCardsPerView();
    const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= maxIndex;
  }

  highlightActiveCards() {
    const cardsPerView = this.getCardsPerView();
    const startIndex = this.currentIndex * cardsPerView;

    this.cards.forEach((card, index) => {
      if (index >= startIndex && index < startIndex + cardsPerView) {
        card.classList.add("active-card");
      } else {
        card.classList.remove("active-card");
      }
    });
  }

  next() {
    const cardsPerView = this.getCardsPerView();
    const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    } else {
      // Efeito de bounce no final
      this.carousel.style.transform = `translateX(-${
        this.currentIndex * (this.cards[0].offsetWidth + 40) * cardsPerView
      }px)`;
      setTimeout(() => {
        this.carousel.style.transform = `translateX(-${
          this.currentIndex * (this.cards[0].offsetWidth + 40) * cardsPerView
        }px)`;
      }, 100);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    } else {
      // Efeito de bounce no início
      this.carousel.style.transform = `translateX(0)`;
      setTimeout(() => {
        this.carousel.style.transform = `translateX(0)`;
      }, 100);
    }
  }

  goToPage(index) {
    const cardsPerView = this.getCardsPerView();
    const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

    if (index >= 0 && index <= maxIndex) {
      this.currentIndex = index;
      this.updateCarousel();
    }
  }

  handleResize() {
    this.updateCarousel();
    this.createDots(); // Recriar dots porque o número de páginas pode mudar
  }

  addTouchEvents() {
    this.carousel.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.carousel.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  startAutoplay() {
    setInterval(() => {
      this.next();
    }, 5000); // Muda a cada 5 segundos
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new Carousel();
});