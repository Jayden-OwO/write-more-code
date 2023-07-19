Function.prototype.myCall = function (context) {
  context = context || window;
  context.fn = this;
  let args = [...arguments].slice(1);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};

let obj = {
  name: "测试name",
  value: "测试value",
};

function testMyCall(...args) {
  console.log(this.name, "其他参数", args);
}

testMyApply.myCall(obj, 1, 2, 444);
