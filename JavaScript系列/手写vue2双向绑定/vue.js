class Vue {
  constructor(option) {
    this.$el = document.querySelector(option.el); // 获取页面在新建Vue实例的时候传进来的对象
    this.$data = option.data;
    this.$option = option;
    this.$watchEvent = {};
    this.proxyData();
    this.observe();
    this.compile(this.$el); // 这个时候需要一个方法来解析这个模版
  }
  compile(node) {
    node.childNodes.forEach((item, index) => {
      // 这一步主要是为了把模版中的 {{str}} 替换成data中的str
      console.log(item.nodeType); // 3,1,3 nodeType:3代表是文本节点 1代表元素节点
      // 如果是文本节点，需要匹配正则看看是不是{{}}包裹着的
      if (item.nodeType === 3) {
        let reg = /\{\{(.*?)\}\}/g; // 匹配{{}}
        let text = item.textContent; // 获取模版中的文本内容
        item.textContent = text.replace(reg, (match, vmKey) => {
          console.log(match, vmKey); // {{str}} str
          vmKey = vmKey.trim(); // 兼容{{ str }}中间有空格的情况
          let watcher = new Watch(this, vmKey, item, "textContent");
          if (this.$watchEvent[vmKey]) {
            this.$watchEvent[vmKey].push(watcher);
          } else {
            this.$watchEvent[vmKey] = [];
            this.$watchEvent[vmKey].push(watcher);
          }
          return this.$data[vmKey]; // 把textContent中的模版数据 替换成 data中与之相匹配的数据
        });
      }
      // 如果是元素节点 即html中写的<h1>{{str}}</h1>,则需要再进行一次递归调用
      if (item.nodeType === 1) {
        // 事件绑定
        if (item.hasAttribute("@click")) {
          let vmKey = item.getAttribute("@click"); // 找到元素节点中包含click方法传入的值
          vmKey = vmKey.trim(); // 去空格
          item.addEventListener("click", () => {
            this.$option.methods[vmKey].call(this); // 从传过来的方法中找到与方法名相匹配的方法，并执行
            // 原本视图层中定义的方法，this指向是指向了methods  在方法中无法获取到data中的值，所以需要在执行的时候，把this指向data
          });
          console.log(vmKey);
        }

        if (item.hasAttribute("v-model")) {
          let vmKey = item.getAttribute("v-model"); // 如果元素中存在v-model 获取到v-model绑定的值   把input中的value赋值为data中v-model绑定的key值
          vmKey = vmKey.trim(); // 去空格
          item.value = this[vmKey];
          item.addEventListener("input", () => {
            this[vmKey] = item.value;
          });
        }
        if (item.childNodes.length) {
          // 子节点大于0再进行递归
          this.compile(item);
        }
      }
    });
  }
  // 对data中的数据进行劫持，这里的作用是为了视图层可以通过this.xxx直接访问data中的参数，而不需要通过this.data.xxx
  // 实际就是把data中的属性，挂载到this
  proxyData() {
    for (let key in this.$data) {
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(val) {
          this.$data[key] = val;
        },
      });
    }
  }
  observe() {
    for (let key in this.$data) {
      let value = this.$data[key];
      let _this = this;
      Object.defineProperty(this.$data, key, {
        get() {
          return value;
        },
        set(val) {
          value = val;
          _this.$watchEvent[key].forEach((item, index) => {
            item.update();
          });
        },
      });
    }
  }
}

class Watch {
  constructor(vm, key, node, attr) {
    this.vm = vm;
    this.key = key;
    this.node = node;
    this.attr = attr;
  }
  update() {
    this.node[this.attr] = this.vm[this.key];
  }
}
