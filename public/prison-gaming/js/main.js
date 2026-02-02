/**
 * Digital Rehabilitation Initiative - Main JavaScript
 * Department of Corrections & Rehabilitation - 2026 Digital Reform Act
 */

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    initAccordions();
    initSmoothScroll();
    initPrintStyles();
    updateLastModified();
});

// Accordion Functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all accordions
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.classList.remove('active');
            });

            // Open clicked accordion if it was closed
            if (!isActive) {
                content.classList.add('active');
            }
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Print Optimization
function initPrintStyles() {
    // Add print button functionality if exists
    const printBtns = document.querySelectorAll('[data-print]');
    printBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.print();
        });
    });
}

// Update Last Modified Date in Footer
function updateLastModified() {
    const lastModified = document.querySelector('.last-modified');
    if (lastModified) {
        const date = new Date(document.lastModified);
        lastModified.textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Copy to Clipboard Function
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#27ae60';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please select and copy manually.');
    });
}

// Table of Contents Generator (if needed)
function generateTOC() {
    const toc = document.querySelector('#table-of-contents');
    if (!toc) return;

    const headings = document.querySelectorAll('h2, h3');
    const list = document.createElement('ul');

    headings.forEach((heading, index) => {
        const id = heading.id || `section-${index}`;
        heading.id = id;

        const li = document.createElement('li');
        li.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;

        li.appendChild(a);
        list.appendChild(li);
    });

    toc.appendChild(list);
}

// Statistics Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-box .number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;

                // Simple animation effect
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    stat.style.transition = 'all 0.5s ease';
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Initialize stats animation if stats exist
if (document.querySelector('.stat-box')) {
    animateStats();
}

// Form Validation (if any forms are added)
function validateForm(form) {
    const required = form.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Utility: Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Utility: Format Percentage
function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// Console message for developers
console.log('%c Digital Rehabilitation Initiative ', 'background: #002868; color: white; padding: 10px; font-size: 16px;');
console.log('%c Department of Corrections & Rehabilitation - 2026 ', 'background: #bf0a30; color: white; padding: 5px;');
console.log('For technical inquiries, please refer to the Infrastructure documentation.');
