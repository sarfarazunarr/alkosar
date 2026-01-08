document.addEventListener('DOMContentLoaded', () => {
    // Mouse follower light effect
    const cursorLight = document.querySelector('.cursor-light');
    
    document.addEventListener('mousemove', (e) => {
        cursorLight.style.left = e.clientX + 'px';
        cursorLight.style.top = e.clientY + 'px';
    });

    // Form submission simulation
    const form = document.querySelector('.notify-form');
    const button = form.querySelector('button');
    const input = form.querySelector('input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(input.value) {
            const originalText = button.innerText;
            button.innerText = 'Thanks!';
            button.style.color = 'var(--accent-color)';
            input.value = '';
            input.blur();

            setTimeout(() => {
                button.innerText = originalText;
                button.style.color = '';
            }, 3000);
        }
    });
});
