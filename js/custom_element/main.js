// © BlueFoxEnterprise
// https://github.com/xoFeulB
window.customElements.define("sync-view", class extends HTMLElement {
  getProperty(_path, _obj, _sep = ".") {
    let _key = _path.split(_sep)[0];
    let _next_path = _path.split(_sep).slice(1).join(_sep);
    if (_obj[_key] != undefined) {
      let R = this.getProperty(_next_path, _obj[_key], _sep);
      if (R === true) {
        return {
          object: _obj,
          property: _key,
          path: _path,
          separator: _sep,
          value: _obj[_key],
        };
      } else {
        return R;
      }
    } else {
      if (_path == _next_path) {
        return true;
      } else {
        return false;
      }
    }
  }
  connectedCallback() {
    let syncer = {
      separator: this.attributes.separator ? this.attributes.separator.value : ".",
      from: this.attributes.from.value,
      to: this.attributes.to.value,
      events: this.attributes.events ? JSON.parse(this.attributes.events.value) : ["sync"],
      entryNop: !!this.attributes.entryNop,
      waitActivate: !!this.attributes.waitActivate,
    };

    let init = (syncer) => {
      __init__(syncer);
    };
    let __init__ = (syncer) => {
      let separator = syncer.separator ? syncer.separator : ".";
      let from = syncer.from.split(separator);
      let to = syncer.to.split(separator);

      let from_element = (() => {
        if (from[0] == "this") {
          return this;
        }
        if (from[0] == "window") {
          return window;
        }
        return document.querySelector(from[0]);
      })();
      let to_element = (() => {
        if (to[0] == "this") {
          return this;
        }
        if (to[0] == "window") {
          return window;
        }
        return document.querySelector(to[0]);
      })();

      let SyncView = {
        separator: separator,
        from: from_element,
        fromProperty: from.slice(1).join(separator),
        to: to_element,
        toProperty: to.slice(1).join(separator),
        events: syncer.events,
        entryNop: syncer.entryNop,
        init: init,
      };

      SyncView.sync = () => {
        let fromObj = this.getProperty(
          SyncView.fromProperty,
          SyncView.from,
          SyncView.separator
        );
        let toObj = this.getProperty(
          SyncView.toProperty,
          SyncView.to,
          SyncView.separator
        );
        try {
          toObj.object[toObj.property] = fromObj.object[fromObj.property];
        } catch { }
      };

      SyncView.events.forEach((eventType) => {
        SyncView.from.addEventListener(eventType, (event) => {
          SyncView.sync();
          SyncView.to.dispatchEvent(new Event("sync"));
        });
      });
      SyncView.entryNop ? null : SyncView.sync();
      this.SyncView = SyncView;
    };

    if (syncer.waitActivate) {
      this.activate = () => {
        init(syncer);
      };
    } else {
      init(syncer);
    }
  }
});

window.customElements.define("set-value-on-click", class extends HTMLElement {
  getProperty(_path, _obj, _sep = ".") {
    let _key = _path.split(_sep)[0];
    let _next_path = _path.split(_sep).slice(1).join(_sep);
    if (_obj[_key] != undefined) {
      let R = this.getProperty(_next_path, _obj[_key], _sep);
      if (R === true) {
        return {
          object: _obj,
          property: _key,
          path: _path,
          separator: _sep,
          value: _obj[_key],
        };
      } else {
        return R;
      }
    } else {
      if (_path == _next_path) {
        return true;
      } else {
        return false;
      }
    }
  }
  connectedCallback() {
    let target = {};
    target.separator = this.attributes.separator ? this.attributes.separator.value : ".";
    target.path = this.attributes.target.value.split(target.separator);
    target.element = (() => {
      if (target.path[0] == "this") {
        return this;
      }
      if (target.path[0] == "window") {
        return window;
      }
      return document.querySelector(target.path[0]);
    })();
    target.property = target.path.slice(1).join(target.separator);
    target.object = this.getProperty(
      target.property,
      target.element,
      target.separator
    );

    this.addEventListener("click", async (event) => {
      if (target.object.object[target.object.property] != this.attributes.value.value) {
        try {
          await Promise.all([
            ...document.querySelectorAll("show-when")
          ].map((_) => {
            return new Promise((resolve, reject) => {
              if (_.animating) {
                let onshow = (event) => {
                  _.removeEventListener("show", onshow);
                  resolve();
                };
                _.addEventListener("show", onshow);
                setTimeout(() => {
                  _.removeEventListener("show", onshow);
                  reject();
                }, 1000);
              } else {
                resolve();
              }
            });
          }));
          target.object.object[target.object.property] = this.attributes.value.value;
          target.element.dispatchEvent(new Event("change"));
        } catch (e) { }
      }
    });
  }
});

window.customElements.define("show-when", class extends HTMLElement {
  async sleep(msec) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  };

  getProperty(_path, _obj, _sep = ".") {
    let _key = _path.split(_sep)[0];
    let _next_path = _path.split(_sep).slice(1).join(_sep);
    if (_obj[_key] != undefined) {
      let R = this.getProperty(_next_path, _obj[_key], _sep);
      if (R === true) {
        return {
          object: _obj,
          property: _key,
          path: _path,
          separator: _sep,
          value: _obj[_key],
        };
      } else {
        return R;
      }
    } else {
      if (_path == _next_path) {
        return true;
      } else {
        return false;
      }
    }
  };

  async none() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "1.0",
            }
          ],
          {
            duration: 0,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "0.0",
            }
          ],
          {
            duration: 0,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async fade() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async left() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              transform: "translateX(-10px)",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              transform: "translateX(0px)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              transform: "translateX(0px)",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              transform: "translateX(-10px)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async right() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              transform: "translateX(10px)",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              transform: "translateX(0px)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              transform: "translateX(0px)",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              transform: "translateX(10px)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async bottom() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              transform: "translateY(10px)",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              transform: "translateY(0)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              transform: "translateY(0)",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              transform: "translateY(10px)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async top() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              transform: "translateY(-10px)",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              transform: "translateY(0)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              transform: "translateY(0)",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              transform: "translateY(-10px)",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async roll() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              rotate: "-360deg",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              rotate: "0deg",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              rotate: "0deg",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              rotate: "360deg",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async loll() {
    if (this.regex.test(this.target.object.object[this.target.object.property])) {
      if (this.attributes.hidden) {
        // await this.sleep(this.inDuration + 10);
        this.removeAttribute("hidden");
        this.animate(
          [
            {
              opacity: "0.0",
              rotate: "360deg",
              easing: 'ease-in-out'
            },
            {
              opacity: "1.0",
              rotate: "0deg",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.inDuration,
            delay: this.inDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.inDuration + this.inDelay);
        this.dispatchEvent(new Event("show"));
      }
    } else {
      if (!this.attributes.hidden) {
        this.animate(
          [
            {
              opacity: "1.0",
              rotate: "0deg",
              easing: 'ease-in-out'
            },
            {
              opacity: "0.0",
              rotate: "-360deg",
              easing: 'ease-in-out'
            }
          ],
          {
            duration: this.outDuration,
            delay: this.outDelay,
            fill: "forwards",
          }
        );
        await this.sleep(this.outDuration + 10 + this.outDelay);
        this.setAttribute("hidden", "");
        this.dispatchEvent(new Event("hidden"));
      }
    }
  }
  async connectedCallback() {
    this.animating = new Promise((resolve) => {
      this.setAttribute("hidden", "");
      this.animate(
        [
          {
            opacity: "0.0",
          }
        ],
        {
          duration: 0,
          fill: "forwards",
        }
      );
      let _in = (this.attributes.in ? this.attributes.in.value : "none.0").split(".");
      let _out = (this.attributes.out ? this.attributes.out.value : "none.0").split(".");
      this.in = _in[0];
      this.out = _out[0];
      this.inDuration = Number(_in[1]);
      this.outDuration = Number(_out[1]);
      this.inDelay = Number(this.attributes.inDelay ? this.attributes.inDelay.value : 0);
      this.outDelay = Number(this.attributes.outDelay ? this.attributes.outDelay.value : 0);

      this.target = {};
      this.target.separator = this.attributes.separator ? this.attributes.separator.value : ".";
      this.target.path = this.attributes.target.value.split(this.target.separator);
      this.target.element = (() => {
        if (this.target.path[0] == "this") {
          return this;
        }
        if (this.target.path[0] == "window") {
          return window;
        }
        return document.querySelector(this.target.path[0]);
      })();
      this.target.property = this.target.path.slice(1).join(this.target.separator);
      this.target.object = this.getProperty(
        this.target.property,
        this.target.element,
        this.target.separator
      );
      this.target.events = JSON.parse(
        this.attributes.events
          ? this.attributes.events.value
          : '["change"]'
      );
      this.regex = new RegExp(this.attributes.regex?.value);

      if (!this.target.element.showWhenElements) {
        this.target.element.showWhenElements = [];
      }
      this.target.element.showWhenElements.push(this);
      resolve();
    });

    let eventHandler = async () => {
      await this.animating;
      this.animating = new Promise(async (resolve) => {
        if (this.attributes.hidden) {
          await this[this.in]();
        } else if (!this.attributes.hidden) {
          await this[this.out]();
        }
        resolve();
      });
    };
    this.target.events.forEach((eventType) => {
      this.target.element.addEventListener(eventType, eventHandler);
    });
    this.target.element.addEventListener("noAnimation", async () => {
      await this.none();
    });

    await eventHandler();
  }
});

window.customElements.define("anim-text", class extends HTMLElement {
  async sleep(msec) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  };

  getProperty(_path, _obj, _sep = ".") {
    let _key = _path.split(_sep)[0];
    let _next_path = _path.split(_sep).slice(1).join(_sep);
    if (_obj[_key] != undefined) {
      let R = this.getProperty(_next_path, _obj[_key], _sep);
      if (R === true) {
        return {
          object: _obj,
          property: _key,
          path: _path,
          separator: _sep,
          value: _obj[_key],
        };
      } else {
        return R;
      }
    } else {
      if (_path == _next_path) {
        return true;
      } else {
        return false;
      }
    }
  };

  shuffle(array) {
    const cloneArray = [...array];

    const result = cloneArray.reduce((_, cur, idx) => {
      let rand = Math.floor(Math.random() * (idx + 1));
      cloneArray[idx] = cloneArray[rand]
      cloneArray[rand] = cur;
      return cloneArray
    })

    return result;
  }

  async show() {
    await this.animating;
    this.animating = new Promise(async (resolve) => {
      for (let index = 0; index < this.buffer.length; index++) {
        this.textContent = this.buffer[index];
        await this.sleep(this.sleepTime);
      }
      resolve();
    });
    return await this.animating;
  }
  async hide() {
    await this.animating;
    this.animating = new Promise(async (resolve) => {
      for (let index = 0; index < this.buffer.reversed.length; index++) {
        this.textContent = this.buffer.reversed[index];
        await this.sleep(this.sleepTime);
      }
      resolve();
    });
    return await this.animating;
  }
  set index(index) {
    if (this.buffer.length <= index) {
      index = this.buffer.length - 1;
    }
    this.textContent = this.buffer[index];
  }
  get index() {
    return this.buffer.indexOf(this.textContent);
  }

  async connectedCallback() {
    this.animating = new Promise(async (resolve) => {

      this.originalText = this.textContent;
      this.mask = this.attributes.mask ? this.attributes.mask.value : "";
      this.duration = Number(this.attributes.duration ? this.attributes.duration.value : 0);

      let charcterSet = this.shuffle(Array.from(
        new Set(this.originalText.split(""))
      ));
      charcterSet.originalLength = charcterSet.length;

      this.buffer = [];
      for (let count = 0; count <= charcterSet.originalLength; count++) {
        let tmpText = this.originalText;
        charcterSet.forEach((char) => {
          tmpText = tmpText.replaceAll(char, this.mask);
        });
        this.buffer.push(tmpText);
        charcterSet.shift();
      }
      this.buffer.reversed = this.buffer.toReversed();
      this.sleepTime = this.duration / (this.buffer.length - 1);

      if (this.attributes.hide) {
        this.textContent = this.buffer[0];
      }

      if (this.attributes.auto) {
        await this.show();
      }
      if (this.attributes.target) {
        this.target = {};
        this.target.separator = this.attributes.separator ? this.attributes.separator.value : ".";
        this.target.path = this.attributes.target.value.split(this.target.separator);
        this.target.element = (() => {
          if (this.target.path[0] == "this") {
            return this;
          }
          if (this.target.path[0] == "window") {
            return window;
          }
          return document.querySelector(this.target.path[0]);
        })();
        this.target.property = this.target.path.slice(1).join(this.target.separator);
        this.target.object = this.getProperty(
          this.target.property,
          this.target.element,
          this.target.separator
        );
        this.target.events = JSON.parse(
          this.attributes.events
            ? this.attributes.events.value
            : '["change"]'
        );
        this.regex = new RegExp(this.attributes.regex?.value);

        if (!this.target.element.showWhenElements) {
          this.target.element.showWhenElements = [];
        }
        this.target.element.showWhenElements.push(this);

        let eventHandler = async () => {
          if (this.regex.test(this.target.object.object[this.target.object.property])) {
            if (this.index == 0) {
              await this.show();
            } else if (this.index != this.buffer.length - 1) {
              await this.show();
            } else {
              // await this.show();
            }
          } else {
            if (this.index == this.buffer.length - 1) {
              await this.hide();
            } else if (this.index != 0) {
              await this.hide();
            } else {
              // await this.hide();
            }
          }
        };
        this.target.events.forEach((eventType) => {
          this.target.element.addEventListener(eventType, eventHandler);
        });
        await eventHandler();
        if (this.regex.test(this.target.object.object[this.target.object.property])) {
          this.index = this.buffer.length - 1;
        } else {
          this.index = 0;
        }
      }
      resolve();
    });

  }
});

window.customElements.define("async-img", class extends HTMLImageElement {
  constructor() {
    super();
    this.hasLoaded = new Promise((resolve, reject) => {
      this.addEventListener("load", (event) => {
        resolve(event);
      });
      this.addEventListener("error", (event) => {
        reject(event);
      });
    });
  }
}, { extends: "img" });
