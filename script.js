document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav ul li a');

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            alert(`You clicked on ${e.target.textContent}`);
        });
    });
});