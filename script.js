// 1. Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. SMOOTH ANCHOR LINK HANDLER
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // FIX: Logo & Home Footer leads to Top
        if (targetId === '#home') {
            if (document.body.classList.contains('menu-open')) {
                document.body.classList.remove('menu-open');
                lenis.start();
            }
            lenis.scrollTo(0, { duration: 1.5 });
            return; 
        }

        const targetElem = document.querySelector(targetId);
        if (targetElem) {
            if (document.body.classList.contains('menu-open')) {
                document.body.classList.remove('menu-open');
                lenis.start();
            }

            lenis.scrollTo(targetElem, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// 3. Menu Toggle
const menuBtn = document.querySelector('.menu-toggle-btn');
const body = document.body;

menuBtn.addEventListener('click', () => {
    body.classList.toggle('menu-open');
    if (body.classList.contains('menu-open')) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

// 4. Real-time Clock
function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit', 
            hour12: true,
            timeZone: 'Asia/Kolkata' 
        });
        clockEl.textContent = timeString + " IST";
    }
}
setInterval(updateClock, 1000);
updateClock();

// 5. CONTACT FORM HANDLING (New)
const form = document.getElementById('contact-form');
const toast = document.getElementById('notification-toast');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        
        // Change button text to indicate loading
        submitBtn.textContent = 'SENDING...';
        
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            if (response.status === 200) {
                // Success: Show Toast
                showToast('Message sent successfully!');
                form.reset();
            } else {
                // Error from Web3Forms
                showToast('Something went wrong. Please try again.');
            }
        })
        .catch(error => {
            // Network Error
            showToast('Error connecting. Check your internet.');
        })
        .finally(() => {
            // Reset button text
            submitBtn.textContent = originalBtnText;
        });
    });
}

// Function to show toast
function showToast(message) {
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 10 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 10000);
}

console.log("Portfolio Initialized.");