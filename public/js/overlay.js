// Interactive functionality for the landing page

// Function to show different ML concept sections
function showSection(section) {
    // Create modal or expand section based on the button clicked
    const sections = {
        datos: {
            title: "¿Qué son los Datos en ML?",
            content: "Los datos son la materia prima del Machine Learning. Son conjuntos de información que los algoritmos utilizan para aprender patrones y hacer predicciones. Pueden ser números, texto, imágenes, sonidos, etc.",
            img: "icons/base-de-datos.png"
        },
        algoritmo: {
            title: "¿Qué es un Algoritmo en ML?",
            content: "Un algoritmo de ML es un conjunto de reglas y procedimientos matemáticos que permite a una máquina aprender de los datos. Ejemplos incluyen árboles de decisión, redes neuronales, y algoritmos de clustering.",
            img: "icons/neural.png"
        },
        prediccion: {
            title: "¿Qué es una Predicción en ML?",
            content: "Una predicción es el resultado que produce un modelo de ML después de procesar nuevos datos. Es la 'respuesta' que da el sistema basándose en lo que aprendió durante el entrenamiento.",
            img: "icons/predicciones.png"
        }
    };

    // Show modal with information
    showModal(sections[section]);
}

// Function to create and show modal
function showModal(sectionData) {
    // Remove existing modal if any
    const existingModal = document.getElementById('info-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'info-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${sectionData.title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${sectionData.img}" alt="overlay" class="overlay-icon-img">
                    <p>${sectionData.content}</p>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #E5E7EB;
            }
            .modal-header h3 {
                margin: 0;
                color: #1F2937;
                font-size: 1.25rem;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6B7280;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-close:hover {
                color: #374151;
            }
            .modal-body {
                padding: 1.5rem;
            }
            .modal-body p {
                margin: 0;
                line-height: 1.6;
                color: #4B5563;
            }
        </style>
    `;

    // Add styles to head if not already added
    if (!document.getElementById('modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'modal-styles';
        styleElement.innerHTML = modalStyles;
        document.head.appendChild(styleElement);
    }

    document.body.appendChild(modal);
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.remove();
    }
}

// Function to navigate to different sections
function navigateToSection(section) {
    window.location.href = `/${section}`;
}

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add active state to navigation based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath ||
            (currentPath === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });

    // Add keyboard support for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Add loading animation for buttons
document.querySelectorAll('.ml-button, .learn-button').forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.innerHTML;
        this.style.opacity = '0.7';

        setTimeout(() => {
            this.style.opacity = '1';
        }, 200);
    });
});