(function($) {
/**
 * 任务原型
 * 参数:
 *		callback 结束回调
 */
function Task(callback) {
	this.callback = callback;
	this.taskNum = 0;
	this.isStart = false;
	this.tasks = [];
};
Task.prototype.addTask = function(callback) {
	this.taskNum ++;
	this.tasks.push(callback);
};
Task.prototype.startTask = function() {
	if(this.isStart) return;
	this.isStart = true;
	if(this.taskNum === 0) {
		this.callback();
		return;
	}
	for(var i=0;i<this.tasks.length;i++) {
		this.tasks[i].call(this);
	}
};
Task.prototype.ready = function() {
	this.taskNum --;
	if(this.taskNum === 0) this.callback();
};
$.startTask = function(tasks,callback) {
	var task = new Task(function() {
		if($.isFunction(callback)) callback.call(task);
		task = null;
	});
	if($.isFunction(tasks)) {
		task.addTask(tasks);
	} else if($.isArray(tasks)) {
		for(var i=0;i<tasks.length;i++) task.addTask(tasks[i]);
	}
	task.startTask();
};
})(jMelon);
