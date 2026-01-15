// class Carousel {
//   constructor(containerSelector = ".carousel-container") {
//     this.container = document.querySelector(containerSelector);
//     if (!this.container) {
//       console.error("Carousel container não encontrado!");
//       return;
//     }

//     this.carousel = this.container.querySelector(".carousel");
//     this.cards = Array.from(this.container.querySelectorAll(".Card"));
//     this.prevBtn = this.container.querySelector(".prev");
//     this.nextBtn = this.container.querySelector(".next");
//     this.dotsContainer = this.container.querySelector(".carousel-dots");

//     this.currentIndex = 0;
//     this.touchStartX = 0;
//     this.touchEndX = 0;
//     this.autoplayInterval = null;
//     this.isAnimating = false;

//     this.init();
//   }

//   init() {
//     console.log("Inicializando carrossel com", this.cards.length, "cards");

//     // Verificar se elementos existem
//     if (!this.carousel || !this.prevBtn || !this.nextBtn) {
//       console.error("Elementos do carrossel não encontrados!");
//       return;
//     }

//     // Adicionar badges aos cards
//     this.addBadges();

//     // Criar indicadores de página
//     this.createDots();

//     // Adicionar eventos
//     this.prevBtn.addEventListener("click", () => this.prev());
//     this.nextBtn.addEventListener("click", () => this.next());

//     // Evento de redimensionamento
//     window.addEventListener("resize", () => this.handleResize());

//     // Evento para os dots
//     if (this.dotsContainer) {
//       this.dotsContainer.addEventListener("click", (e) => {
//         if (e.target.classList.contains("dot")) {
//           const index = parseInt(e.target.dataset.index);
//           this.goToPage(index);
//         }
//       });
//     }

//     // Suporte a touch para dispositivos móveis
//     this.addTouchEvents();

//     // Inicializar
//     this.updateCarousel();

//     // Atualizar a cada 5 segundos (autoplay)
//     this.startAutoplay();
//   }

//   addBadges() {
//     this.cards.forEach((card) => {
//       const titleElement = card.querySelector("h3");
//       if (!titleElement) return;

//       const title = titleElement.textContent;
//       let badgeText = "";

//       if (title.includes("PRINCIPAL")) badgeText = "Principal";
//       else if (title.includes("SOBREMESA")) badgeText = "Sobremesa";
//       else if (title.includes("ACOMPANHAMENTO")) badgeText = "Acompanhamento";

//       if (badgeText) {
//         // Remover badge existente se houver
//         const existingBadge = card.querySelector(".card-badge");
//         if (existingBadge) existingBadge.remove();

//         const badge = document.createElement("div");
//         badge.className = "card-badge";
//         badge.textContent = badgeText;
//         card.appendChild(badge);
//       }
//     });
//   }

//   createDots() {
//     if (!this.dotsContainer) return;

//     this.dotsContainer.innerHTML = "";
//     const totalPages = Math.ceil(this.cards.length / this.getCardsPerView());

//     for (let i = 0; i < totalPages; i++) {
//       const dot = document.createElement("div");
//       dot.className = `dot ${i === 0 ? "active" : ""}`;
//       dot.dataset.index = i;
//       this.dotsContainer.appendChild(dot);
//     }
//   }

//   getCardsPerView() {
//     const width = window.innerWidth;
//     if (width < 768) return 1;
//     if (width < 1200) return 2;
//     return 3;
//   }

//   updateCarousel() {
//     if (this.isAnimating || this.cards.length === 0) return;

//     this.isAnimating = true;
//     const cardsPerView = this.getCardsPerView();

//     // Usar o estilo calculado
//     const cardStyle = window.getComputedStyle(this.cards[0]);
//     const gap = 40; // gap definido no CSS
//     const cardWidth = this.cards[0].offsetWidth + gap;

//     const translateX = -this.currentIndex * cardWidth * cardsPerView;
//     this.carousel.style.transform = `translateX(${translateX}px)`;

//     // Atualizar dots
//     this.updateDots();

//     // Atualizar estado dos botões
//     this.updateButtons();

//     // Resetar flag de animação
//     setTimeout(() => {
//       this.isAnimating = false;
//     }, 600); // Tempo da transição do CSS
//   }

//   updateDots() {
//     if (!this.dotsContainer) return;

//     const dots = this.dotsContainer.querySelectorAll(".dot");
//     const currentPage = Math.floor(this.currentIndex);

//     dots.forEach((dot, index) => {
//       dot.classList.toggle("active", index === currentPage);
//     });
//   }

//   updateButtons() {
//     const cardsPerView = this.getCardsPerView();
//     const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

//     this.prevBtn.disabled = this.currentIndex === 0;
//     this.nextBtn.disabled = this.currentIndex >= maxIndex;
//   }

//   next() {
//     if (this.isAnimating) return;

//     const cardsPerView = this.getCardsPerView();
//     const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

//     if (this.currentIndex < maxIndex) {
//       this.currentIndex++;
//     } else {
//       this.currentIndex = 0; // Volta ao início
//     }

//     this.updateCarousel();
//   }

//   prev() {
//     if (this.isAnimating) return;

//     const cardsPerView = this.getCardsPerView();
//     const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//     } else {
//       this.currentIndex = maxIndex; // Vai para o final
//     }

//     this.updateCarousel();
//   }

//   goToPage(index) {
//     if (this.isAnimating) return;

//     const cardsPerView = this.getCardsPerView();
//     const maxIndex = Math.ceil(this.cards.length / cardsPerView) - 1;

//     if (index >= 0 && index <= maxIndex) {
//       this.currentIndex = index;
//       this.updateCarousel();
//     }
//   }

//   handleResize() {
//     this.createDots(); // Recriar dots porque o número de páginas pode mudar
//     this.currentIndex = 0; // Voltar para a primeira página
//     this.updateCarousel();
//   }

//   addTouchEvents() {
//     this.carousel.addEventListener("touchstart", (e) => {
//       this.touchStartX = e.changedTouches[0].screenX;
//     });

//     this.carousel.addEventListener("touchend", (e) => {
//       this.touchEndX = e.changedTouches[0].screenX;
//       this.handleSwipe();
//     });
//   }

//   handleSwipe() {
//     const swipeThreshold = 50;
//     const diff = this.touchStartX - this.touchEndX;

//     if (Math.abs(diff) > swipeThreshold) {
//       if (diff > 0) {
//         this.next();
//       } else {
//         this.prev();
//       }
//     }
//   }

//   startAutoplay() {
//     // Limpar intervalo anterior se existir
//     if (this.autoplayInterval) {
//       clearInterval(this.autoplayInterval);
//     }

//     this.autoplayInterval = setInterval(() => {
//       this.next();
//     }, 5000); // Muda a cada 5 segundos

//     // Pausar autoplay ao interagir
//     this.container.addEventListener("mouseenter", () => {
//       if (this.autoplayInterval) {
//         clearInterval(this.autoplayInterval);
//         this.autoplayInterval = null;
//       }
//     });

//     this.container.addEventListener("mouseleave", () => {
//       if (!this.autoplayInterval) {
//         this.startAutoplay();
//       }
//     });
//   }
// }

// // Inicializar quando o DOM estiver pronto
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM carregado, inicializando carrossel...");
//   const carousel = new Carousel();

//   // Adicionar classe para debug
//   document.querySelector(".carousel-section").classList.add("carousel-loaded");
// });
