if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/CoffeeTimer/sw.js').then((registration) => {
      console.log('ServiceWorker registration successful')
    }).catch((err) => {
      console.log('ServiceWorker registration failed: ', err)
    })
  })
} 
