// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-active');
    }
});

// Neural Network Animation Class
class NeuralNetwork {
    constructor() {
        this.layers = [
            { neurons: 1, positions: [] },
            { neurons: 3, positions: [] },
            { neurons: 2, positions: [] },
            { neurons: 3, positions: [] },
            { neurons: 1, positions: [] }
        ];
        this.connections = [];
        this.weights = {};
    }

    async init() {
        await this.delay(100);
        
        const neurons = document.querySelectorAll('.neuron');
        neurons.forEach(neuron => {
            const layer = parseInt(neuron.dataset.layer);
            const neuronIndex = parseInt(neuron.dataset.neuron);
            const rect = neuron.getBoundingClientRect();
            const containerRect = document.querySelector('.neural-network').getBoundingClientRect();
            
            if (!this.layers[layer].positions) {
                this.layers[layer].positions = [];
            }
            
            this.layers[layer].positions[neuronIndex] = {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
                element: neuron
            };
        });
    }

    async createConnections() {
        const container = document.querySelector('.neural-network');
        if (!container) return;
        
        for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
            const currentLayer = this.layers[layerIndex];
            const nextLayer = this.layers[layerIndex + 1];
            
            for (let i = 0; i < currentLayer.neurons; i++) {
                for (let j = 0; j < nextLayer.neurons; j++) {
                    const startPos = currentLayer.positions[i];
                    const endPos = nextLayer.positions[j];
                    
                    if (!startPos || !endPos) continue;
                    
                    const dx = endPos.x - startPos.x;
                    const dy = endPos.y - startPos.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    const weight = 1;
                    this.weights[`${layerIndex}-${i}-${j}`] = 1;
                    
                    const connection = document.createElement('div');
                    connection.className = 'connection';
                    connection.style.left = startPos.x + 'px';
                    connection.style.top = startPos.y + 'px';
                    connection.style.width = length + 'px';
                    connection.style.transform = `rotate(${angle}deg)`;
                    
                    const weightDisplay = document.createElement('div');
                    weightDisplay.className = 'weight-display';
                    weightDisplay.textContent = weight;
                    connection.appendChild(weightDisplay);
                    
                    container.appendChild(connection);
                    this.connections.push({
                        element: connection,
                        startPos,
                        endPos,
                        length,
                        fromLayer: layerIndex,
                        fromNeuron: i,
                        toLayer: layerIndex + 1,
                        toNeuron: j,
                        weight: parseFloat(weight)
                    });
                }
            }
        }
    }

    fireNeuron(layer, neuron) {
        const neuronElement = this.layers[layer].positions[neuron]?.element;
        if (!neuronElement) return;
        
        neuronElement.classList.add('firing');
        
        setTimeout(() => {
            neuronElement.classList.remove('firing');
        }, 800);
    }

    activateConnection(connection) {
        connection.element.classList.add('active');
        
        setTimeout(() => {
            connection.element.classList.remove('active');
        }, 1000);
    }

    createSignal(connection) {
        const signal = document.createElement('div');
        signal.className = 'signal';
        signal.style.left = connection.startPos.x + 'px';
        signal.style.top = connection.startPos.y + 'px';
        
        const container = document.querySelector('.neural-network');
        if (!container) return;
        
        container.appendChild(signal);
        
        requestAnimationFrame(() => {
            signal.classList.add('traveling');
            
            const dx = connection.endPos.x - connection.startPos.x;
            const dy = connection.endPos.y - connection.startPos.y;
            
            signal.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        
        setTimeout(() => {
            if (signal.parentNode) {
                signal.parentNode.removeChild(signal);
            }
        }, 1000);
    }

    async propagateForward() {
        this.fireNeuron(0, 0);
        await this.delay(200);
        
        for (let layer = 0; layer < this.layers.length - 1; layer++) {
            const layerConnections = this.connections.filter(c => c.fromLayer === layer);
            
            layerConnections.forEach(connection => {
                this.activateConnection(connection);
                this.createSignal(connection);
            });
            
            await this.delay(400);
            
            const nextLayer = layer + 1;
            for (let neuron = 0; neuron < this.layers[nextLayer].neurons; neuron++) {
                this.fireNeuron(nextLayer, neuron);
            }
            
            await this.delay(600);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startAnimation() {
        await this.delay(1000);
        
        while (true) {
            await this.propagateForward();
            await this.delay(2000);
        }
    }
}

// Initialize Neural Network
let neuralNetwork;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Email copy to clipboard functionality - UPDATED
document.querySelector('.copy-btn').addEventListener('click', function() {
    const email = document.querySelector('.email-address').textContent;
    navigator.clipboard.writeText(email).then(function() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.textContent = 'Email copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(167, 85, 255, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(167, 85, 255, 0.3);
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 2000);
    }).catch(function() {
        // Fallback for older browsers
        const notification = document.createElement('div');
        notification.textContent = 'Please copy the email manually';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 85, 85, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });
});

// Dynamic navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(26, 10, 31, 0.95)';
    } else {
        nav.style.background = 'rgba(26, 10, 31, 0.9)';
    }
});

// Initialize Neural Network on load
window.addEventListener('load', async () => {
    neuralNetwork = new NeuralNetwork();
    await neuralNetwork.init();
    await neuralNetwork.createConnections();
    neuralNetwork.startAnimation();
});

// Neural Network Mouse Interaction
document.addEventListener('mousemove', (e) => {
    const neurons = document.querySelectorAll('.neuron');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    neurons.forEach(neuron => {
        const rect = neuron.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        
        if (distance < 150) {
            const intensity = 1 - (distance / 150);
            neuron.style.boxShadow = `0 0 ${25 + intensity * 50}px rgba(167, 85, 255, ${0.5 + intensity * 0.5})`;
        } else {
            neuron.style.boxShadow = '0 0 25px rgba(167, 85, 255, 0.5)';
        }
    });
});