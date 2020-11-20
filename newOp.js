function myNew(f) {
	var obj, ret, proto;

	proto = Object(f.prototype) === f.prototype ? f.prototype : Object.prototype;
  
	obj = Object.create(proto);
  
	ret = f.apply(obj, Array.prototype.slice.call(arguments, 1));
  
	if (Object(ret) === ret) { 
		return ret;
	}
	return obj;
}

function SampleClass (arg) {
	this.param1 = arg;
}
  
var obj = myNew(SampleClass, 'assignment-1');
console.log(obj.param1);
