// loader-redirect.js
(function(){
    try{
        const current = (location.pathname.split('/').pop() || 'inicio.html');
        if(current.toLowerCase() === 'pcarga.html') return;
        const key = 'todo_loader_seen_v1';
        if(!sessionStorage.getItem(key)){
            sessionStorage.setItem(key, '1');
            const to = encodeURIComponent(current + location.search + location.hash);
            location.href = 'PCarga.html?to=' + to;
        }
    }catch(e){/* silenciar en entornos viejos */}
})();
