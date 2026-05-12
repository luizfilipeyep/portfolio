/**
 * ============================================================
 * JavaScript — Portfólio Alex Dev
 * Funcionalidades:
 *  1. Toggle tema claro/escuro (com localStorage)
 *  2. Menu responsivo hamburger (mobile)
 *  3. Navegação por âncora — scroll suave e highlight ativo
 *  4. Animação fade-in ao scroll (Intersection Observer)
 *  5. Validação do formulário de contato
 *  6. Simulação de envio com modal de sucesso
 *  7. Barra de idiomas com animação
 * ============================================================
 */

(function () {
    'use strict';

    /* ==================== CONSTANTES ==================== */
    const BODY = document.body;
    const HEADER = document.getElementById('header');
    const NAV_LINKS = document.querySelectorAll('.nav-link');
    const SECTIONS = document.querySelectorAll('section[id]');
    const MENU_TOGGLE = document.getElementById('menuToggle');
    const THEME_TOGGLE = document.getElementById('themeToggle');

    /* ==================== ESTADO DO TEMA ==================== */
    // Verifica se o usuário já tinha salvo uma preferência de tema
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        BODY.classList.add('dark');
    }

    /**
     * Alterna entre tema claro e escuro
     * Salva a escolha no localStorage para persistir entre sessões
     */
    function toggleTheme() {
        BODY.classList.toggle('dark');
        const isDark = BODY.classList.contains('dark');
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    }

    if (THEME_TOGGLE) {
        THEME_TOGGLE.addEventListener('click', toggleTheme);
    }

    /* ==================== MENU HAMBURGER (MOBILE) ==================== */
    /**
     * Abre/fecha o menu de navegação em dispositivos móveis
     */
    function toggleMenu() {
        BODY.classList.toggle('menu-open');
        const isOpen = BODY.classList.contains('menu-open');

        // Atualiza aria-label para acessibilidade
        MENU_TOGGLE.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    }

    /**
     * Fecha o menu quando um link é clicado
     * Necessário para a experiência mobile — o menu não ficaria
     * aberto após a navegação pela âncora
     */
    function closeMenuOnLink() {
        BODY.classList.remove('menu-open');
    }

    if (MENU_TOGGLE) {
        MENU_TOGGLE.addEventListener('click', toggleMenu);
    }

    NAV_LINKS.forEach(function (link) {
        link.addEventListener('click', closeMenuOnLink);
    });

    /* ==================== NAVEGAÇÃO POR ÂNCORA ==================== */
    /**
     * Destaca o link do menu correspondente à seção visível na tela
     * Usa IntersectionObserver para detectar qual seção está em foco
     */
    let currentSection = '';

    const navObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    currentSection = entry.target.getAttribute('id');

                    // Remove active de todos e adiciona no atual
                    NAV_LINKS.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + currentSection) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        {
            rootMargin: '-40% 0px -50% 0px', // Define a zona de "foco" no centro da tela
            threshold: 0
        }
    );

    SECTIONS.forEach(function (section) {
        navObserver.observe(section);
    });

    /* ==================== HEADER COM SCROLL ==================== */
    let lastScrollY = 0;

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        // Adiciona sombra ao header quando há scroll
        if (scrollY > 10) {
            HEADER.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            HEADER.style.boxShadow = 'none';
        }

        lastScrollY = scrollY;
    });

    /* ==================== ANIMAÇÕES AO SCROLL (Fade-in) ==================== */
    /**
     * Elementos com classe .fade-in são animados quando entram na viewport
     * O CSS já define as transições — o JS só adiciona a classe .visible
     */
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Para de observar após a animação (otimização)
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    }

    /* ==================== ANIMAÇÃO DAS BARRAS DE IDIOMA ==================== */
    const langBars = document.querySelectorAll('.lang-bar-fill');

    function animateLanguageBars() {
        langBars.forEach(function (bar) {
            const width = bar.getAttribute('data-width');
            // Pequeno delay para criar efeito cascata
            const delay = Array.from(langBars).indexOf(bar) * 150;
            setTimeout(function () {
                bar.style.width = width + '%';
            }, delay);
        });
    }

    // Dispara a animação quando a seção de formação entra na tela
    const formationSection = document.getElementById('formacao');
    if (formationSection && langBars.length > 0) {
        const langObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateLanguageBars();
                        langObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        langObserver.observe(formationSection);
    }

    /* ==================== VALIDAÇÃO DO FORMULÁRIO DE CONTATO ==================== */
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const submitBtn = form ? form.querySelector('.btn-submit') : null;

    /**
     * Expressão regular para validação de e-mail
     * Verifica formato: texto@domínio.extensão
     * Aceita subdomínios e TLDs com 2+ caracteres
     */
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /**
     * Remove os estilos de erro de um campo
     * @param {HTMLElement} input - Campo do formulário
     * @param {HTMLElement} errorEl - Elemento de mensagem de erro
     */
    function clearFieldError(input, errorEl) {
        if (input) input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    }

    /**
     * Exibe mensagem de erro em um campo
     * @param {HTMLElement} input - Campo do formulário
     * @param {HTMLElement} errorEl - Elemento de mensagem de erro
     * @param {string} message - Texto da mensagem de erro
     */
    function showFieldError(input, errorEl, message) {
        if (input) input.classList.add('error');
        if (errorEl) errorEl.textContent = message;
    }

    // Remove erros ao digitar
    if (nameInput) nameInput.addEventListener('input', function () { clearFieldError(nameInput, nameError); });
    if (emailInput) emailInput.addEventListener('input', function () { clearFieldError(emailInput, emailError); });
    if (messageInput) messageInput.addEventListener('input', function () { clearFieldError(messageInput, messageError); });

    /**
     * Valida todos os campos do formulário
     * @returns {boolean} - true se válido, false se inválido
     */
    function validateForm() {
        let isValid = true;

        // Validação do nome: não pode estar vazio
        if (!nameInput || !nameInput.value.trim()) {
            showFieldError(nameInput, nameError, 'Por favor, informe seu nome completo.');
            isValid = false;
        } else {
            clearFieldError(nameInput, nameError);
        }

        // Validação do e-mail: não vazio E formato válido
        if (!emailInput || !emailInput.value.trim()) {
            showFieldError(emailInput, emailError, 'Por favor, informe seu e-mail.');
            isValid = false;
        } else if (!EMAIL_REGEX.test(emailInput.value.trim())) {
            showFieldError(emailInput, emailError, 'Digite um e-mail válido (ex: usuario@dominio.com).');
            isValid = false;
        } else {
            clearFieldError(emailInput, emailError);
        }

        // Validação da mensagem: não vazia E mínimo 10 caracteres
        if (!messageInput || !messageInput.value.trim()) {
            showFieldError(messageInput, messageError, 'Por favor, escreva sua mensagem.');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showFieldError(messageInput, messageError, 'Sua mensagem deve ter pelo menos 10 caracteres.');
            isValid = false;
        } else {
            clearFieldError(messageInput, messageError);
        }

        return isValid;
    }

    /**
     * Simula o envio do formulário com feedback visual
     * 1. Coloca o botão em estado de loading
     * 2. Espera 1.5s (simula processamento)
     * 3. Limpa os campos
     * 4. Exibe modal de sucesso
     * 5. Restaura o botão
     */
    function simulateSend() {
        if (!submitBtn) return;

        // Estado de loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simula delay de rede
        setTimeout(function () {
            // Limpa os campos do formulário
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (messageInput) messageInput.value = '';

            // Restaura botão
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Exibe modal de sucesso
            showSuccessModal();
        }, 1500);
    }

    /**
     * Evento de submit do formulário
     * Intercepta o envio padrão, valida os campos e simula o envio
     */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede envio real (não há backend)

            if (validateForm()) {
                simulateSend();
            }
        });
    }

    /* ==================== MODAL DE SUCESSO ==================== */
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');

    /**
     * Exibe o modal de sucesso com animação
     */
    function showSuccessModal() {
        if (successModal) {
            successModal.classList.add('active');
            // Foco no botão de fechar para acessibilidade
            setTimeout(function () {
                if (modalClose) modalClose.focus();
            }, 100);
        }
    }

    /**
     * Fecha o modal de sucesso
     */
    function hideSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
        }
    }

    // Fecha ao clicar no botão "Fechar"
    if (modalClose) {
        modalClose.addEventListener('click', hideSuccessModal);
    }

    // Fecha ao clicar fora do modal (na overlay)
    if (successModal) {
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }

    // Fecha ao pressionar a tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
            hideSuccessModal();
        }
    });

    /* ==================== SCROLL SUAVE PARA ÂNCORAS ==================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Scroll suave com offset para o header fixo
            const headerHeight = HEADER ? HEADER.offsetHeight : 72;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

})();