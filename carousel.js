const interval = 6*1000;

const carousels = document.querySelectorAll('.carousel');

carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.carousel__button--right');
    const prevButton = carousel.querySelector('.carousel__button--left');
    const dotsNav = carousel.querySelector('.carousel__nav');
    const dots = Array.from(dotsNav.children);
    let slideInterval;


    const slideWidth = slides[0].getBoundingClientRect().width;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.left = i * slideWidth + "px";
    }

    nextButton.addEventListener('click', e => {
        nextSlide();
        resetSlideshow();
    })
    
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        let prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        let prevDot = currentDot.previousElementSibling;
        if (!prevSlide) {
            prevSlide = slides[slides.length-1];
            prevDot = dots[slides.length-1];
        }
        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        resetSlideshow();
    })
    
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest("button");
        if (!targetDot) return;
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-slide');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        resetSlideshow();
    })

    const resetSlideshow = () => {
        clearInterval(slideInterval);
        startSlideshow();
    }
    
    const startSlideshow = () => {
        slideInterval = setInterval(nextSlide, interval);
    }
    
    const nextSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        let nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        let nextDot = currentDot.nextElementSibling;
        if (!nextSlide) {
            nextSlide = slides[0];
            nextDot = dots[0];
        }
        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    }

    startSlideshow();
})

const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = "translateX(-" + targetSlide.style.left + ")";
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
}

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
}