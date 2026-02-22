// ===== ROSTER PAGE FUNCTIONALITY =====

// Toggle profile expansion
function toggleProfile(button) {
    const expandedContent = button.nextElementSibling;
    const isOpen = expandedContent.classList.contains('open');

    // Close all other open profiles
    document.querySelectorAll('.expanded-content.open').forEach(content => {
        if (content !== expandedContent) {
            content.classList.remove('open');
            content.previousElementSibling.classList.remove('active');
        }
    });

    // Toggle current
    if (isOpen) {
        expandedContent.classList.remove('open');
        button.classList.remove('active');
        button.querySelector('span:first-child').textContent = 'ACCESS FILE';
    } else {
        expandedContent.classList.add('open');
        button.classList.add('active');
        button.querySelector('span:first-child').textContent = 'CLOSE FILE';
    }
}

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const rosterCards = document.querySelectorAll('.roster-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        rosterCards.forEach(card => {
            const categories = card.dataset.category.split(' ');

            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
    });
});

// Animate cards on scroll
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

rosterCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s, transform 0.4s';
    cardObserver.observe(card);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Keyboard navigation for cards
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.expanded-content.open').forEach(content => {
            content.classList.remove('open');
            content.previousElementSibling.classList.remove('active');
            content.previousElementSibling.querySelector('span:first-child').textContent = 'ACCESS FILE';
        });
    }
});

// Console message
console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║   ZERO_COOL // Crew Roster Database               ║
    ║                                                   ║
    ║   47 Active Runners                               ║
    ║   3 Missing                                       ║
    ║   1 Legend                                        ║
    ║                                                   ║
    ║   Remember the fallen. Hunt the traitors.         ║
    ╚═══════════════════════════════════════════════════╝
`);
