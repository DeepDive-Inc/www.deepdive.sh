(async () => {
  await window.AppReady;

  document.querySelector("#PageControll").addEventListener("change", (event) => {
    document.querySelector(`[Page="${document.querySelector("#PageControll").value}"]`).scrollIntoView({
      behavior: "smooth"
    });
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
        if (entry.intersectionRatio <= 0.5) {
          // hidden
        } else {
          // show
          document.querySelector("#PageControll").value = entry.target.attributes.Page.value;
          document.querySelector("#PageControll").dispatchEvent(new Event("sync"));
        }
      });
    }, {
    threshold: [0.5]
  }
  );

  [...document.querySelectorAll("[Page]")].forEach((element) => {
    intersectionObserver.observe(element);
  });
})();
