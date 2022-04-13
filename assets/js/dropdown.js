const dropdowns = document.querySelectorAll('[data-dropdown]');
function dropdown (parent) {
  const menu = parent.querySelector('[data-menu]');

  let timer;
  
  const showMenu = (e) => {
    menu.style.top = `${parent.offsetBottom}px`;
    menu.style.left = `${parent.offsetLeft}px`;
    menu.style.display = 'block';
    menu.style.opacity = '1';
  }
  const hideMenu = () => {
    menu.style.opacity = 0;
    menu.style.display = 'none';
  }
  parent.addEventListener('mouseover', showMenu);
  parent.addEventListener('mouseleave', () => {
    timer = setTimeout(hideMenu, 500);
  });

  menu.addEventListener('mouseover', () => {
    clearTimeout(timer);
  });
  menu.addEventListener('mouseleave', hideMenu);
}

dropdowns.forEach(elem => {
  dropdown(elem);
})