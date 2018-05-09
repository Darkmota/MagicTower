/*
events.data: 记录events.data
events.ready: 记录是否即时刷新所有事件的动画和执行step
events.touching: 记录目前触发的事件
events.step: 记录事件触发处理的当前步骤
events.waiting: 停止当前事件触发的处理，一般为等待当前事件步骤的结束
                一般来说。触发事件的瞬间，waiting为true，处理完毕后，waiting变为false

events.set(mapData): 从Mapxxx.json得来的mapData中获取事件信息
events.getTouch(event): 设定当前主角开始触发的事件
events.refresh(): 刷新事件动画，执行step（如果waiting为false）
events.eventFind(): 返回地图位置的事件
events.eventRun(): 处理当前step，更改step位置
events.next() jump(int) run(int): step的自增，赋值，增减

touching.imageSrc =string
touching.faceto =int

touching.x =int
touching.y =int
touching.evpau[3] =true
        .rate =int
        .faceto =int;

touching.evpau[0] =boolean
touching.evpau[1] =boolean
*/

function events() {
    this.data = null;
    this.image = [];
    this.ready = false;
    this.touching = null;
    this.step = 0;
    this.waiting = false;
    this.select = false;
}

events.prototype = {
    set:function(eventData) {
        this.data = eventData;
        this.ready = true;
        this.getTouch(this.eventFindByName("firstThing"));
    },
    getTouch:function(event) {
        if (this.touching || ! event || ! event.evpau[0]) return;
        console.warn(event);
        this.touching = event;
        this.step = 0;
    },
    refresh:function() {
        if (!this.ready) return;
        for (i = 0; i < this.data.length; ++i) {
        	if (this.data[i].evpau[0] && this.data[i].evpau[1]) {
        		if (this.data[i].evpau[3]) {
        		ctx.drawImage(mainEventImage.canvas[this.data[i].imageSrc], (Math.floor(frameCount / this.data[i].xyffr[4]) + this.data[i].xyffr[2]) % 4 * 32, this.data[i].xyffr[3] * 32, 32, 32, 64 + this.data[i].xyffr[0] * 32, 32 + this.data[i].xyffr[1] * 32, 32, 32);
        		}
        		else {
        		ctx.drawImage(mainEventImage.canvas[this.data[i].imageSrc], this.data[i].xyffr[2] * 32, this.data[i].xyffr[3] * 32, 32, 32, 64 + this.data[i].xyffr[0] * 32, 32 + this.data[i].xyffr[1] * 32, 32, 32);
        		}
        	}
        }
        if ((this.touching != null) && !this.waiting) {
	    	if (this.touching.evpau[4]) {	
	            if (this.step < mainPublicEvent.data[this.touching.publicEventName].length) {
	                this.eventRun(this.step);
	            }
	            else {
	                this.touching = null;
	            }
	    	}
	    	else {
	    		if (this.step < this.touching.list.length) {
	                this.eventRun(this.step);
	            }
	            else {
	                this.touching = null;
	            }
	    	}
        }
    },
    eventFind:function(xx, yy) {
		for (var i = 0; i < this.data.length; ++i) {
			if (this.data[i].xyffr[1] == yy && this.data[i].xyffr[0] == xx) {
				return this.data[i];
			}
		}
		return false;
    },
    eventFindByName:function(name) {
    	for (var i of this.data) {
    		if (i && i.name == name) {
    			return i;
    		}
    	}
    	return false;
    },
    eventFindById:function(id) {
    	for (var i of this.data) {
    		if (i && i.id == id) {
    			return i;
    		}
    	}
    	return false;
    },
    eventRun:function(step) {
    	if (this.touching.evpau[4]) {
    		var event = mainPublicEvent.data[this.touching.publicEventName][this.step];
    	}
        else {
        	var event = this.touching.list[this.step];
        }

        /*
        mapData.events.data[].list[][X] == event[X]
        event[0] 事件类型
        event[1] [2] [3] [4] [5] [6] 预留的参数
        */
       console.log(step + ":", event);
        switch (event[0]) {
        	case "playSE":
        		mainAudio.playSE(event[1]);
        		this.next();
        		break;

        	case "stopBGM":
        		mainAudio.stopBGM();
        		this.next();
        		break;

        	case "playBGM":
        		mainAudio.playBGM(event[1]);
        		this.next();
        		break;

        	case "teleport"://1z2x3y
        		if (event[1] == mainHero.z || event[1] == "self") {
        			console.log(event[1], mainHero.z);
        			mainHero.x = event[2];
        			mainHero.y = event[3];
        		}
        		else {
        			mainMapMover.set(50, event[1], event[2], event[3]);
        		}
        		this.next();
        		break;

            case "jump"://1事件位置
                this.jump(event[1]);
                break;

            case "textBox"://1文本信息
        		var newBox = new textBox(32, 272, 416, 96);
        		if (event[2]) {
        			newBox.talker = event[1];
        			newBox.set(event[2]);
        		}
        		else {
        			newBox.set(event[1]);
        		}
            	if (mainBox) {
            		for (var b = mainBox; b.include; b = b.include);
            		b.include = newBox;
            	}
            	else {
            		mainBox = newBox;
            	}
//      		var newBox = new textBox(32, 32, 416, 96);
//      		newBox.set("EXTRA!");
//          	if (mainBox) {
//          		for (var b = mainBox; b.include; b = b.include);
//          		b.include = newBox;
//          	}
//          	else {
//          		mainBox = newBox;
//          	}
                this.next();
                break;

            case "dependTextBox"://1依附于下一个文本框的信息
        		var newBox = new textBox(32, 176, 416, 96, true);
        		newBox.set(event[1]);
            	if (mainBox) {
            		for (var b = mainBox; b.include; b = b.include);
            		b.include = newBox;
            	}
            	else {
            		mainBox = newBox;
            	}
                this.next();
                break;

            case "systemMessageBox"://1系统信息
        		addDownMessage(event[1]);
                this.next();
                break;

            case "selectionBox":
            	if (this.select === false) {
	        		var newBox = new selectionBox(32, 272, 416, 96);
	        		console.log(event, event.slice(2, 2 + event[1]));
	        		newBox.set(event[1], event.slice(2, 2 + event[1]));
	            	if (mainBox) {
	            		for (var b = mainBox; b.include; b = b.include);
	            		b.include = newBox;
	            	}
	            	else {
	            		mainBox = newBox;
	            	}
            	}
            	else {
            		this.jump(event[this.select + event[1] + 2]);
            		this.select = false;
            	}
            	break;

            case "battle"://1敌人id
                mainBattleBox.set(event[1]);
                this.next();
                break;

			case "Azreal":
				if (mainHero.hp <= 0) {
	        		var newBox = new textBox(32, 272, 416, 96);
        			newBox.talker = "作者";
        			newBox.set("如果这是在真正的冒险里，你已经翘了，但现在这里是体验中心，没关系接着玩去吧~\\n(其实是因为有些人会卡关导致看不到后面的内容所以直接删掉了死亡事件)");
	            	if (mainBox) {
	            		for (var b = mainBox; b.include; b = b.include);
	            		b.include = newBox;
	            	}
	            	else {
	            		mainBox = newBox;
	            	}
				}
				this.next();
				break;

			case "assign"://123
            	var leftType = event[1].charAt(0);
            	var _left = event[1].substring(1);
            	var leftValue = 0;
            	var rightType = event[3].charAt(0);
            	var _right = event[3].substring(1);
            	var rightValue = 0;
                switch (leftType) {
                	case "v":
                		leftValue = mainGlobal[_left];
                		break;

                	case "i":
                		leftValue = mainHero.bag[_left] == undefined ? 0 : mainHero.bag[_left];
                		break;
                		
                	case "h":
                		leftValue = mainHero.hp;
                		break;
                		
                	case "a":
                		leftValue = mainHero.atk;
                		break;
                		
                	case "d":
                		leftValue = mainHero.def;
                		break;
                		
                	case "g":
                		leftValue = mainHero.gold;
                		break;
                		
                	case "e":
                		leftValue = mainHero.exp;
                		break;
                	
                	default:
                		try {
                			leftValue = eval(event[1]);
                		}
		                catch(exception) {
		                    console.warn(exception);
		                }
                }
                switch (rightType) {
                	case "v":
                		rightValue = mainGlobal[_right];
                		break;
                	
                	case "i":
                		rightValue = mainHero.bag[_right] == undefined ? 0 : mainHero.bag[_right];
                		break;
                		
                	case "h":
                		rightValue = mainHero.hp;
                		break;
                		
                	case "a":
                		rightValue = mainHero.atk;
                		break;
                		
                	case "d":
                		rightValue = mainHero.def;
                		break;
                		
                	case "g":
                		rightValue = mainHero.gold;
                		break;
                		
                	case "e":
                		rightValue = mainHero.exp;
                		break;
                		
                	default:
                		rightValue = parseInt(event[3]);
                		break;
                	
                }
                switch (event[2]) {
                	case "=":
                		leftValue = rightValue;
                		break;
                	case "+=":
                		leftValue += rightValue;
                		break;
                	case "-=":
                		leftValue -= rightValue;
                		break;
                	case "*=":
                		leftValue *= rightValue;
                		break;
                	case "/=":
                		leftValue /= rightValue;
                		break;
                }
                switch (leftType) {
                	case "v":
                		mainGlobal[_left] = leftValue;
                		break;
                	
                	case "i":
                		mainHero.bag[_left] = leftValue;
                		break;
                		
                	case "h":
                		mainHero.hp = leftValue;
                		break;
                		
                	case "a":
                		mainHero.atk = leftValue; 
                		break;
                		
                	case "d":
                		mainHero.def = leftValue; 
                		break;
                		
                	case "g":
                		mainHero.gold = leftValue;
                		break;
                		
                	case "e":
                		mainHero.exp = leftValue;
                		break;
                }
                this.next();
                break;
				
				
            case "getItem"://1物品id 2变化量
                if (event[2] >= 0) {
                    var message = "获得了" + event[2] + mainItem.data[event[1]][1];
                }
                else {
                    var message = "失去了" + (-event[2]) + mainItem.data[event[1]][1];
                }
                mainHero.bag[event[1]] += event[2];
                addDownMessage(message);
                this.next();
                break;

            case "if"://123条件 4不满足条件后的跳转目标
            	var leftType = event[1].charAt(0);
            	var _left = event[1].substring(1);
            	var leftValue = 0;
            	var rightType = event[3].charAt(0);
            	var _right = event[3].substring(1);
            	var rightValue = 0;
                var bool = false;
                switch (leftType) {
                	case "v":
                		leftValue = mainGlobal[_left];
                		break;
                	
                	case "i":
                		leftValue = mainHero.bag[_left] == undefined ? 0 : mainHero.bag[_left];
                		break;
                		
                	case "h":
                		leftValue = mainHero.hp;
                		break;
                		
                	case "a":
                		leftValue = mainHero.atk;
                		break;
                		
                	case "d":
                		leftValue = mainHero.def;
                		break;
                		
                	case "g":
                		leftValue = mainHero.gold;
                		break;
                		
                	case "e":
                		leftValue = mainHero.exp;
                		break;
                	
                	default:
                		leftValue = eval(event[1]);
                }
                switch (rightType) {
                	case "v":
                		rightValue = mainGlobal[_right];
                		break;
                	
                	case "i":
                		rightValue = mainHero.bag[_right] == undefined ? 0 : mainHero.bag[_right];
                		break;
                		
                	case "h":
                		rightValue = mainHero.hp;
                		break;
                		
                	case "a":
                		rightValue = mainHero.atk;
                		break;
                		
                	case "d":
                		rightValue = mainHero.def;
                		break;
                		
                	case "g":
                		rightValue = mainHero.gold;
                		break;
                		
                	case "e":
                		rightValue = mainHero.exp;
                		break;
                	
                	default:
                		rightValue = event[3];
                }
                switch (event[2]) {
                	case ">":
                		bool = leftValue > rightValue;
                		break;
                	case ">=":
                		bool = leftValue >= rightValue;
                		break;
                	case "==":
                		bool = leftValue == rightValue;
                		break;
                	case "<=":
                		bool = leftValue <= rightValue;
                		break;
                	case "<":
                		bool = leftValue > rightValue;
                		break;
                	default:
                		bool = false;
                }
                if (bool) {
                	this.next();
                }
                else {
                	this.jump(event[4]);
                }
                
                break;
            
            case "setFace":
            	if (event[1] == "self") {
            		this.touching.xyffr[3] = event[2];
            	}
            	else {
            		mainEvents.data[event[1]].xyffr[3] = event[2];
            	}
            	this.next();
            	break;

            case "wait":
            	mainWait.set(event[1]);
            	this.next();
            	break;
            	
            case "suicide":
            	this.touching.evpau[0] = false;
		    	if (this.touching.evpau[4]) {
		            this.step = mainPublicEvent.data[this.touching.publicEventName].length;
		        }
		    	else {
		    		this.step = this.touching.list.length;
		    	}
            	break;
            	
            case "escape":
		    	if (this.touching.evpau[4]) {
		            this.step = mainPublicEvent.data[this.touching.publicEventName].length;
		        }
		    	else {
		    		this.step = this.touching.list.length;
		    	}
            	break;

            default: {
                try  {
                    eval(event[1])
                }
                catch(exception) {
                    console.warn(exception);
                }
            	this.next();
            	break;
            }
            
        }
    },
    next:function() {
        this.step += 1;
    },
    jump:function(target) {
        this.step = target;
    },
    run:function(variation) {
        this.step += variation;
    }
}