const cacheName='v2';

//call install event
self.addEventListener('install',e =>{
    console.log('Servicer Worker : Installed');
  
}); 

//call activate event
self.addEventListener('activate',e =>{
    console.log('Servicer Worker : Activated');
    //remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheName=>{
            return Promise.all(
                cacheName.map(cache =>{
                    if (cache != cacheName)
                    {
                        console.log('Service Worker : Clearing Old Cache')
                        return caches.delete(cache);
                    }
                }
                    )
            ) 
        }
            )
    )
}); 

//call fetch event
self.addEventListener('fetch', e=>{
    console.log('Service Worker: Fetching');
    e.respondWith(
      fetch(e.request)
      .then(res =>{
          // make a clone/copy of respond
          const resClone = res.clone();
          //open cache
          caches.open(cacheName).then(cache =>{
              // add respond to cache
              cache.put(e.request, resClone);
          });
         return res; 
      })
      .catch(err => caches.match(e.request).then(res => res))
    );
});