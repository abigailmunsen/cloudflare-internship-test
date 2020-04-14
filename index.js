addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const url = "https://cfw-takehome.developers.workers.dev/api/variants"

const rewriter = new HTMLRewriter()
  .on('body', { element(e) { e.setAttribute("style", "background-color:#ff3389")}})
  .on('title', { element (e) { e.prepend("Welcome to "); e.append("!") }})
  .on('h1#title', { element(e) { e.prepend("Welcome to"); e.append("!") }})
  .on('p#description', { element(e) { e.append("Isn't that great?") }})
  .on('svg', { element(e) { e.setAttribute("viewBox", "0 0 100 100") }})
  .on('path', { element(e) {
    e.setAttribute("d", "M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"); //modified from https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
    e.setAttribute("stroke-width", "10")}})
  .on('a#url', { element (e) { e.setInnerContent("Click here! ;)"); e.setAttribute("href", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")}}) //;)

  /**
   * Respond with one of the variants
   * @param {Request} request
   */
async function handleRequest(request){
  var choice = Math.floor((Math.random() * 2))
  const res = await fetch(url)
    .then(response => response.json())
    .then((json) => {
        var variants = json.variants
        return fetch(variants[choice]);
    });

    return rewriter.transform(res)
}
