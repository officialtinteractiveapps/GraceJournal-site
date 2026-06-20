export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (path.startsWith("/d/") && path !== "/d/" && !path.endsWith("/index.html")) {
    return context.env.ASSETS.fetch(new Request(new URL("/d/index.html", url), context.request));
  }

  if (path.startsWith("/q/") && path !== "/q/" && !path.endsWith("/index.html")) {
    return context.env.ASSETS.fetch(new Request(new URL("/q/index.html", url), context.request));
  }

  return context.next();
}
