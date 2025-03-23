// Debounce function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 300);
});

// Optimized scroll handling
const handleScroll = debounce(() => {
    // Navbar background
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
    
    // Scroll progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}, 10);

window.addEventListener('scroll', handleScroll);

// Scroll to top functionality
const scrollToTopBtn = document.getElementById('scroll-to-top');

const handleScrollToTop = () => {
    const scrolled = window.scrollY;
    if (scrolled > 200) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
};

window.addEventListener('scroll', debounce(handleScrollToTop, 100));

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced intersection observer with optimized thresholds
const observerOptions = {
    threshold: [0, 0.2, 0.4, 0.6],
    rootMargin: '0px 0px -10% 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('show');
                if (entry.target.classList.contains('feature-box')) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .feature-box').forEach(el => {
    animationObserver.observe(el);
});

// Optimized form handling
const form = document.getElementById('contact-form');
if (form) {
    const inputs = form.querySelectorAll('input');
    const inputHandler = debounce((e) => {
        const parent = e.target.parentElement;
        if (e.type === 'focus') {
            parent.classList.add('focused');
        } else if (e.type === 'blur' && !e.target.value) {
            parent.classList.remove('focused');
        }
    }, 100);

    inputs.forEach(input => {
        input.addEventListener('focus', inputHandler);
        input.addEventListener('blur', inputHandler);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            form.innerHTML = `
                <div class="alert alert-success animate__animated animate__fadeIn">
                    <h4 class="alert-heading">Thank you!</h4>
                    <p>Your free e-books will be sent to your email shortly.</p>
                </div>
            `;
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3 animate__animated animate__fadeIn';
            errorDiv.textContent = 'Something went wrong. Please try again.';
            form.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        }
    });
}

// Optimized button ripple effect
const addRippleEffect = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    ripple.className = 'ripple';
    
    button.appendChild(ripple);
    requestAnimationFrame(() => {
        ripple.style.transform = 'scale(4)';
        ripple.style.opacity = '0';
        setTimeout(() => ripple.remove(), 600);
    });
};

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', addRippleEffect);
});

// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Initialize testimonial carousel with options
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const carousel = new bootstrap.Carousel(testimonialCarousel, {
            interval: 5000,
            touch: true,
            ride: 'carousel',
            pause: 'hover'
        });

        // Add swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialCarousel.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, false);
        
        testimonialCarousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, false);
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    carousel.next();
                } else {
                    carousel.prev();
                }
            }
        };

        // Pause carousel on hover
        testimonialCarousel.addEventListener('mouseenter', () => {
            carousel.pause();
        });

        testimonialCarousel.addEventListener('mouseleave', () => {
            carousel.cycle();
        });
    }
});

// Product cards animation
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, entry.target.dataset.delay || 0);
                });
                productObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    // Add delay for staggered animation
    productCards.forEach((card, index) => {
        card.dataset.delay = index * 200;
        productObserver.observe(card);
    });
});

// Enhanced form validation for contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        const email = contactForm.querySelector('input[type="email"]').value;
        const name = contactForm.querySelector('input[type="text"]').value;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message with selected products
            contactForm.innerHTML = `
                <div class="alert alert-success animate__animated animate__fadeIn">
                    <h4 class="alert-heading">Thank you, ${name}!</h4>
                    <p>Your free fitness guides will be sent to ${email} shortly.</p>
                    <hr>
                    <p class="mb-0">Get ready to transform your life with our comprehensive guides!</p>
                </div>
            `;
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3 animate__animated animate__fadeIn';
            errorDiv.textContent = 'Something went wrong. Please try again.';
            contactForm.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        }
    });
}

// Transform cards animation
document.addEventListener('DOMContentLoaded', () => {
    const transformCards = document.querySelectorAll('.transform-card');
    
    const transformObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150); // Staggered animation delay
                });
                transformObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    transformCards.forEach((card) => {
        transformObserver.observe(card);
    });
});

// Booking form handling
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const formData = new FormData(bookingForm);
        const name = formData.get('name');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            bookingForm.innerHTML = `
                <div class="alert alert-success animate__animated animate__fadeIn">
                    <h4 class="alert-heading">Thanks ${name}!</h4>
                    <p>Your consultation has been scheduled. We'll contact you shortly to confirm the details.</p>
                    <hr>
                    <p class="mb-0">Get ready to start your transformation journey!</p>
                </div>
            `;
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Schedule My Free Call';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3 animate__animated animate__fadeIn';
            errorDiv.textContent = 'Something went wrong. Please try again.';
            bookingForm.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        }
    });
    
    // Form field validation and animation
    const formFields = bookingForm.querySelectorAll('.form-control, .form-select');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.closest('.mb-3').classList.add('focused');
        });
        
        field.addEventListener('blur', () => {
            if (!field.value) {
                field.closest('.mb-3').classList.remove('focused');
            }
        });
    });
}

// Smooth scroll for navigation and booking buttons
document.addEventListener('DOMContentLoaded', () => {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
});

// Initialize particles.js for hero background
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                opacity: {
                    value: 0.1,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    // Hero achievements animation
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateX(0)';
            card.style.opacity = '1';
        }, 1000 + (index * 200));
    });
});

// Mobile menu handling
document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNavbar = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
        if (!isClickInsideNavbar && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Add slide animation to mobile menu
    navbarToggler.addEventListener('click', () => {
        requestAnimationFrame(() => {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.style.maxHeight = navbarCollapse.scrollHeight + 'px';
                setTimeout(() => {
                    navbarCollapse.style.maxHeight = '0px';
                }, 10);
            } else {
                navbarCollapse.style.maxHeight = '0px';
                setTimeout(() => {
                    navbarCollapse.style.maxHeight = navbarCollapse.scrollHeight + 'px';
                }, 10);
            }
        });
    });
});