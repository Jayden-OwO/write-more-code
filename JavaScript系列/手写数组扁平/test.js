import { myFlat } from "./src/index.js";

let arr = [1, 2, 3, [4, 5, [6, 7, 8, [9, 10]]]];

console.log(myFlat(arr));

console.log(arr.flatten());
