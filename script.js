// =========================================
        // PRELOADER
        // =========================================
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.getElementById('preloader').classList.add('hidden');
            }, 800);
        });

        // Fallback: hide preloader after 3s max
        setTimeout(function() {
            document.getElementById('preloader').classList.add('hidden');
        }, 3000);

        // =========================================
        // PARTICLES
        // =========================================
        (function() {
            const container = document.getElementById('particles');
            if (!container) return;
            const count = window.innerWidth < 768 ? 30 : 60;
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = (Math.random() * 2 + 1) + 'px';
                particle.style.height = particle.style.width;
                particle.style.opacity = Math.random() * 0.15 + 0.05;
                particle.style.animation = 'particleFloat ' + (Math.random() * 10 + 8) + 's ease-in-out infinite';
                particle.style.animationDelay = (Math.random() * 5) + 's';
                container.appendChild(particle);
            }
        })();

        // =========================================
        // NAVBAR SCROLL
        // =========================================
        (function() {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        })();

        // =========================================
        // MOBILE MENU
        // =========================================
        (function() {
            const btn = document.getElementById('mobileMenuBtn');
            const menu = document.getElementById('mobileMenu');
            const links = menu.querySelectorAll('.mobile-nav-link');

            btn.addEventListener('click', function() {
                btn.classList.toggle('active');
                menu.classList.toggle('open');
            });

            links.forEach(function(link) {
                link.addEventListener('click', function() {
                    btn.classList.remove('active');
                    menu.classList.remove('open');
                });
            });
        })();

        // =========================================
        // SMOOTH SCROLL (anchor links)
        // =========================================
        (function() {
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const offset = 80;
                        const top = target.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                });
            });
        })();

        // =========================================
        // INTERSECTION OBSERVER (Scroll Animations)
        // =========================================
        (function() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');

                        // Handle staggered children
                        const staggerChildren = entry.target.querySelectorAll('.feature-card');
                        if (staggerChildren.length) {
                            staggerChildren.forEach(function(child, index) {
                                setTimeout(function() {
                                    child.classList.add('visible');
                                }, index * 120);
                            });
                        }
                    }
                });
            }, observerOptions);

            // Observe all elements with animation classes
            document.querySelectorAll(
                '.section-label, .glow-line, .section-title, .section-subtitle, ' +
                '.about-text, ' +
                '.waitlist-form, .waitlist-trust, ' +
                '.contact-info, .contact-map, ' +
                '.fade-in, .fade-in-left, .fade-in-right'
            ).forEach(function(el) {
                observer.observe(el);
            });

            // Observe feature cards individually
            document.querySelectorAll('.feature-card').forEach(function(card) {
                // Use a separate observer for cards that might be inside a parent container
                const cardObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.15 });
                cardObserver.observe(card);
            });

            // Observe waitlist success
            const successEl = document.getElementById('waitlistSuccess');
            if (successEl) {
                observer.observe(successEl);
            }
        })();

        // =========================================
        // DASHBOARD CHART ANIMATION
        // =========================================
        (function() {
            const charts = document.querySelectorAll('.dash-chart');
            charts.forEach(function(chart) {
                const bars = chart.querySelectorAll('.bar');
                bars.forEach(function(bar) {
                    const targetHeight = (bar.dataset.height || 0) + '%';
                    bar.style.height = '0%';
                    setTimeout(function() {
                        bar.style.height = targetHeight;
                    }, 100);
                });
            });
        })();

        // =========================================
        // WAITLIST FORM
        // =========================================
        (function() {
            const form = document.getElementById('waitlistForm');
            const nameInput = document.getElementById('waitlistName');
            const emailInput = document.getElementById('waitlistEmail');
            const companyInput = document.getElementById('waitlistCompany');
            const challengeInput = document.getElementById('waitlistChallenge');
            const submitBtn = document.getElementById('waitlistSubmit');
            const successEl = document.getElementById('waitlistSuccess');
            const formEl = document.querySelector('.waitlist-form');
            const trustEl = document.getElementById('waitlistTrust');
            const allInputs = [nameInput, emailInput, companyInput, challengeInput];

            function clearErrors() {
                allInputs.forEach(function(input) {
                    if (input) input.classList.remove('error');
                });
            }

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                clearErrors();

                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                let hasError = false;

                if (!name) {
                    nameInput.classList.add('error');
                    hasError = true;
                }

                if (!email) {
                    emailInput.classList.add('error');
                    if (!hasError) emailInput.focus();
                    hasError = true;
                } else if (!emailRegex.test(email)) {
                    emailInput.classList.add('error');
                    if (!hasError) emailInput.focus();
                    hasError = true;
                }

                if (hasError) {
                    if (!name) nameInput.focus();
                    return;
                }

                // Loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                // Send to Supabase
                const supabaseUrl = 'https://nvxmcimtlrljzxpzrjxu.supabase.co';
                const supabaseKey = 'sb_publishable_o88DzXGhoIZA6JjG33MmXQ_bO_wuEie';

                fetch(supabaseUrl + '/rest/v1/Waitlist_Data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': supabaseKey,
                        'Authorization': 'Bearer ' + supabaseKey,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        Name: name,
                        Email: email,
                        Company_Name: companyInput.value.trim(),
                        Financial_Problem: challengeInput.value.trim()
                    })
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Failed to submit: ' + response.status);
                    }
                    // Success
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;

                    formEl.style.display = 'none';
                    trustEl.style.display = 'none';
                    successEl.classList.add('visible');

                    nameInput.value = '';
                    emailInput.value = '';
                    companyInput.value = '';
                    challengeInput.value = '';
                })
                .catch(function(error) {
                    console.error('Supabase error:', error);
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    alert('Something went wrong. Please try again.');
                });
            });

            // Remove error state on input
            allInputs.forEach(function(input) {
                if (input) {
                    input.addEventListener('input', function() {
                        input.classList.remove('error');
                    });
                    input.addEventListener('change', function() {
                        input.classList.remove('error');
                    });
                }
            });
        })();

        // =========================================
        // PARALLAX ON SCROLL (Hero Visual)
        // =========================================
        (function() {
            const heroVisual = document.querySelector('.hero-visual-inner');
            if (!heroVisual) return;

            window.addEventListener('scroll', function() {
                const scrollY = window.scrollY;
                const heroSection = document.querySelector('.hero');
                const heroHeight = heroSection ? heroSection.offsetHeight : 800;
                const progress = Math.min(scrollY / (heroHeight * 0.5), 1);

                const rotateX = 2 - progress * 2;
                const rotateY = -1 + progress * 1;
                const translateY = -scrollY * 0.08;

                heroVisual.style.transform =
                    'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(' + translateY + 'px)';
            });
        })();

        // =========================================
        // SMOOTH REVEAL ON FEATURE CARDS (refresh)
        // =========================================
        // Ensure cards are re-evaluated after page load
        window.addEventListener('load', function() {
            document.querySelectorAll('.feature-card').forEach(function(card) {
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight - 100) {
                    setTimeout(function() {
                        card.classList.add('visible');
                    }, 300);
                }
            });
        });

        // =========================================
        // SIGNUP COUNTER
        // =========================================
        (function() {
            const numberEl = document.getElementById('signupNumber');
            if (!numberEl) return;

            const supabaseUrl = 'https://nvxmcimtlrljzxpzrjxu.supabase.co';
            const supabaseKey = 'sb_publishable_o88DzXGhoIZA6JjG33MmXQ_bO_wuEie';

            function fetchCount() {
                fetch(supabaseUrl + '/rest/v1/rpc/get_waitlist_count', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': supabaseKey,
                        'Authorization': 'Bearer ' + supabaseKey
                    },
                    body: '{}'
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Failed to fetch count');
                    }
                    return response.text();
                })
                .then(function(count) {
                    numberEl.textContent = count;
                })
                .catch(function() {
                    numberEl.textContent = '—';
                });
            }

            fetchCount();

            // Increment after successful form submission
            var origSubmit = document.getElementById('waitlistForm');
            if (origSubmit) {
                origSubmit.addEventListener('submit', function() {
                    // After a short delay to let Supabase process
                    setTimeout(fetchCount, 2000);
                });
            }
        })();

        // =========================================
        // COPY EMAIL TO CLIPBOARD
        // =========================================
        (function() {
            const copyBtn = document.getElementById('copyEmailBtn');
            const toast = document.getElementById('toast');
            if (!copyBtn || !toast) return;

            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const email = 'hello@infinityuae.ai';

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(email).then(function() {
                        showToast();
                    }).catch(function() {
                        fallbackCopy(email);
                    });
                } else {
                    fallbackCopy(email);
                }
            });

            function fallbackCopy(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showToast();
                } catch (err) {
                    console.error('Failed to copy email');
                }
                document.body.removeChild(textarea);
            }

            function showToast() {
                toast.classList.add('show');
                setTimeout(function() {
                    toast.classList.remove('show');
                }, 2000);
            }
        })();

        // =========================================
        // CONSOLE BRANDING
        // =========================================
        console.log(
            '%c inFINity %c AI-Powered Financial Intelligence ',
            'background:#10b981;color:#0a0a0b;font-size:16px;font-weight:700;padding:8px 12px;border-radius:4px 0 0 4px;',
            'background:#1c1c1e;color:#f4f4f5;font-size:16px;font-weight:400;padding:8px 12px;border-radius:0 4px 4px 0;'
        );
        console.log('🚀 Built for UAE businesses. Financial clarity, powered by AI.');
