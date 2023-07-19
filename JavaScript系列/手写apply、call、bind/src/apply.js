Function.prototype.myApply = function (context) {
  context = context || window;
  context.fn = this;
  let result = null;
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};

let obj = {
  name: "测试name",
  value: "测试value",
};

function testMyApply(...args) {
  console.log(this.name, "其他参数", args);
}

testMyApply.myApply(obj, [1, 2, 3]);
