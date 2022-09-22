const {debounceTime, distinctUntilChanged, filter, map} =  require('rxjs/operators');

let data = [
    {
    name:'SMAK',
    age:12,
},
{name:'SMAK021',
age:24
}]
let type = "hello"
const debounced = type.pipe(debounceTime(200),distinctUntilChanged())
let res = data.filter(v=>v.name.toLowerCase().indexOf(type.toLowerCase())>-1)

console.log(res);