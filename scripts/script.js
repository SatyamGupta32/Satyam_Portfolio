// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Locomotive Scroll and ScrollTrigger Setup
function locoScrollTrigger() {
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector(".main"),
        smooth: true,
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector(".main").style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    return locoScroll;
}

// Smooth Scroll to Section
function smoothScrollToSection(locoScroll) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute("href"); // Get target ID
            const targetElement = document.querySelector(targetId); // Get target element

            if (targetElement) {
                locoScroll.scrollTo(targetElement); // Use Locomotive Scroll for scrolling
            }
        });
    });
}

// Page 1 Loader Animation
function page1Loader() {
    const tl = gsap.timeline();
    tl.from(".loader span", {
        x: 40,
        opacity: 0,
        duration: 2,
        stagger: 0.1,
    })
        .to(".loader span, .loader", {
            opacity: 0,
            duration: 0.5,
            display: "none",
            stagger: 0.1,
        })
        .from("nav div", { x: 40, opacity: 0, duration: 0.5 })
        .from(".page1 video", { opacity: 0, duration: 0.5 })
        .from(".intro", {
            y: 150,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
        });
}

// Menu Bar Logic with Smooth Scroll Integration
function menuBar(locoScroll) {
    const tl = gsap.timeline({ paused: true, reversed: true });
    let isMenuOpen = false;

    // Define GSAP timeline for menu animations
    tl.to(".one", {
        y: 6,
        rotation: 45,
        duration: 0.8,
        ease: "power2.out",
    })
        .to(".two", {
            y: -6,
            rotation: -45,
            duration: 0.8,
            ease: "power2.out",
        }, "<")
        .to(".menu", {
            top: "0%",
            duration: 1.4,
            ease: "power2.out",
        }, "<")
        .from(".menu ul li", {
            x: -200,
            opacity: 0,
            stagger: 0.3,
            ease: "power2.out",
        }, "-=1.5");

    // Toggle menu open/close
    document.querySelector(".menu-list").addEventListener("click", () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            tl.play(); // Open menu
        } else {
            tl.reverse(); // Close menu
        }
    });

    // Close menu when clicking on a navigation link
    document.querySelectorAll(".menu ul li a").forEach(link => {
        link.addEventListener("click", () => {
            isMenuOpen = false; // Set state to closed
            tl.reverse(); // Reverse GSAP animation to close menu
        });
    });

    smoothScrollToSection(locoScroll); // Attach smooth scroll to menu links
}

// Cursor Effect for Page 1
function cursorEffect1() {
    const page1Content = document.querySelector(".page1-content");
    const cursor = document.querySelector(".page1 .cursor");

    page1Content.addEventListener("mousemove", (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, scale: 1, opacity: 1, display: "flex" });
    });

    page1Content.addEventListener("mouseleave", () => {
        gsap.to(cursor, { scale: 0, opacity: 0 });
    });
}

// Combine and Initialize All Functions
document.addEventListener("DOMContentLoaded", () => {
    const locoScroll = locoScrollTrigger(); // Initialize Locomotive Scroll
    page1Loader(); // Loader animation
    menuBar(locoScroll); // Menu bar with smooth scrolling
    cursorEffect1(); // Cursor effect
});

function typeEffect(element, text, speed) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

function showTextSequentially() {
    const listItems = document.querySelectorAll('.iconDetail li');
    let current = 0;

    function showNext() {
        if (current < listItems.length) {
            const text = listItems[current].getAttribute('data-text');
            typeEffect(listItems[current], text, 100); // Adjust speed as needed
            current++;
            setTimeout(showNext, text.length * 100 + 500); // Delay before next item
        }
    }

    showNext();
}


const form = document.querySelector('.contact-form form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = form.first_name.value.trim();
    const lastName = form.last_name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Client-side validation
    if (!firstName || !lastName || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    const data = { first_name: firstName, last_name: lastName, email, message };
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true; // Disable the submit button to prevent multiple clicks

    try {
        const res = await fetch('http://localhost:3000/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Network response was not ok');

        form.reset();
        alert('Thanks for reaching out! We’ll get back to you soon.');
    } catch (err) {
        console.error(err);
        alert('Sorry, something went wrong. Please try again later.');
    } finally {
        submitButton.disabled = false; // Re-enable the submit button after processing
    }
});


// Run on page load or call when needed
document.addEventListener('DOMContentLoaded', () => {
    showTextSequentially();

});