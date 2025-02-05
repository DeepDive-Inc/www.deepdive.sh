(async () => {
  await window.AppReady;

  document.querySelector("#PageControll").addEventListener("change", (event) => {
    document.querySelector(`[Page="${document.querySelector("#PageControll").value}"]`).scrollIntoView({
      behavior: "smooth"
    });
    document.querySelector("#PageControll").dispatchEvent(new Event("sync"));
  });
  document.querySelector("#PageControll").value = 0;
  document.querySelector("#PageControll").dispatchEvent(new Event("sync"));
  await Promise.allSettled(
    [...document.querySelectorAll(`img[is="async-img"]`)].map((element) => {
      return element.whileLoad;
    })
  );
  document.body.removeAttribute("hidden");

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelector("#PageControll").value = entry.target.attributes.Page.value;
          document.querySelector("#PageControll").dispatchEvent(new Event("sync"));
        }
      });
    }, {
    threshold: [0.3]
  }
  );

  [...document.querySelectorAll("[Page]")].forEach((element) => {
    intersectionObserver.observe(element);
  });
})();
