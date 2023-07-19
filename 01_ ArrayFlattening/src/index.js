export function myFlat(arr) {
  if (!Array.isArray(arr)) {
    return new Error("params is not array!!");
  }
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? myFlat(cur) : cur);
  }, []);
}

// 模拟es6 flatApi实现
Array.prototype.flatten = function (depth = 1) {
  // 默认铺平1层
  if (depth <= 0) return this; // 处理小于等于0的depth 返回原数组
  return this.reduce((pre, cur) => {
    return pre.concat(
      Array.isArray(cur) && depth > 1 ? cur.flatten(depth - 1) : cur
    );
  }, []);
};
