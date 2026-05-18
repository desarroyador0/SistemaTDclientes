document.addEventListener('DOMContentLoaded', ()=>{
  const signBtn = document.getElementById('signInBtn');
  const loader = document.querySelector('.loader');

  // Mostrar botón después de animación corta
  setTimeout(()=>{
    loader && (loader.style.display = 'none');
    signBtn && signBtn.classList.add('visible');
  }, 1800);

  // Pequeña interacción: efecto de foco al pasar el ratón
  if(signBtn){
    signBtn.addEventListener('mouseenter', ()=> signBtn.style.transform = 'translateY(-3px)');
    signBtn.addEventListener('mouseleave', ()=> signBtn.style.transform = 'translateY(0)');
  }

  // En dispositivos táctiles, permitir tap en logo para animación
  const logo = document.querySelector('.logo');
  if(logo){
    logo.addEventListener('click', ()=>{
      logo.animate([
        {transform: 'scale(1)'},
        {transform: 'scale(1.08)'},
        {transform: 'scale(1)'}
      ], {duration:420, easing:'cubic-bezier(.2,.8,.2,1)'});
    });
  }
});
