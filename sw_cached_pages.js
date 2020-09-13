const cacheName='v1';
const cacheAssets =[
    'index.html',
    'about.html',
    '/css/style.css',
    '/js/main.js'
];
//call install event
self.addEventListener('install',e =>{
    console.log('Servicer Worker : Installed');
    e.waitUntil(
        caches
        .open(cacheName)
        .then( cache =>{
            console.log('Service Worker : Caching Files');
            cache.addAll(cacheAssets);
        })
        .then(()=>self.skipWaiting())
    );
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
        fetch(e.request).catch(() => caches.match(e.request))
    )
})