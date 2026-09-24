window.TitanfyOpening=(()=>{
 function prepare(){const hero=document.querySelector('.hero');if(!hero)return;hero.classList.add('portrait-home');if(hero.querySelector('.home-portrait'))return;const photo=document.createElement('img');photo.className='home-portrait';photo.src='assets/portrait.jpg';photo.alt='涂腾辉';photo.fetchPriority='high';hero.append(photo);}
 function mount(){return()=>{};}
 return{prepare,mount};
})();
