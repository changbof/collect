var cluster = require('cluster');
if (cluster.isMaster) {
	cluster.fork({coType: 0}); //互联网采集进程
	cluster.fork({coType: 1}); //本机采集进程
	cluster.on('exit', function(worker, code, signal) {
		console.log('----------------[' + (code == 0 ? '互联网采集进程2' : '本机采集进程2') + ']重启生效----------------');
		cluster.fork({coType: code});
	});
} else {
	var http = require('http');
	var url = require('url');
	var crypto = require('crypto');
	var querystring = require('querystring');
	var exec = require('child_process').exec;
	var mysql = require('mysql');
	var played = {};
	var playcount = "";
	var LiRuncount = "";
	var config = require('./config.js');
	var calc = require('./kj-data/kj-calc-time.js');
	var execPath = process.argv.join(" ");
	var parse = require('./kj-data/parse-calc-count.js');
	var retask_times = {};
	var exit = function() {
		process.exit(process.env.coType);
	};
	require('./String-ext.js');
	// 抛出未知出错时处理
	process.on('uncaughtException', function(e){
		console.log(e.stack);
		exit();
	});
	// 自动重启
	if(config.restartTime[process.env.coType]){
		setTimeout(function() {
			exit();
		}, config.restartTime[process.env.coType] * 1000);
	}
	var timers={};		// 任务记时器列表
	var encrypt_key='ee92d325bb142dae8ede38aadc7882ac';
	http.request=(function(_request){
		return function(options,callback){
			var timeout=options['timeout'],
				timeoutEventId;
			var req=_request(options,function(res){
				res.on('end',function(){
					clearTimeout(timeoutEventId);
				});
				res.on('close',function(){
					clearTimeout(timeoutEventId);
				});
				res.on('abort',function(){
				});
				callback(res);
			});
			//超时
			req.on('timeout',function(){
				req.end();
			});
			//如果存在超时
			timeout && (timeoutEventId=setTimeout(function(){
				req.emit('timeout',{message:'have been timeout...'});
			},timeout));
			return req;
		};
	})(http.request);
	getPlayedFun(runTask);
	function getPlayedFun(cb){
		try{
			var client=createMySQLClient();
		}catch(err){
			log(err);
			exit();
		}
		client.query("select id, ruleFun from lottery_played", function(err, data){
			if(err){
				log('读取玩法配置出错2：'+err.message);
				exit();
			}else{
				data.forEach(function(v){
					played[v.id]=v.ruleFun;
				});
				if(cb) cb();
			}
		});
		client.end();
	}

	function runTask(){
		if(config.cp.length) {
			for (var i=0,j=config.cp.length;i<j;i++) {
				var conf = config.cp[i];
				if (
					(process.env.coType == 0 && conf.option.host == config.localhost) ||
					(process.env.coType == 1 && conf.option.host != config.localhost)
				) continue;
				timers[conf.name]={};
				timers[conf.name][conf.timer]={timer:null, option:conf};
				try{
					if(conf.enable) run(conf);
				}catch(err){
					restartTask(conf, config.errorSleepTime);
				}
			}
		}
	}

	/**
	*  重启任务
	*
	*/
	function restartTask(conf, sleep, flag){ 
		if(sleep<=0) sleep=config.errorSleepTime;
		if(!timers[conf.name]) timers[conf.name]={};
		if(!timers[conf.name][conf.timer]) timers[conf.name][conf.timer]={timer:null,option:conf};
		
		if(flag){
			var opt;
			for(var t in timers[conf.name]){
				opt=timers[conf.name][t].option;
				clearTimeout(timers[opt.name][opt.timer].timer);
				timers[opt.name][opt.timer].timer=setTimeout(run, sleep*1000, opt);
				log('休眠'+sleep+'秒后从'+opt.source+'采集'+opt.title+'数据...');
			}
		}else{
			clearTimeout(timers[conf.name][conf.timer].timer);
			timers[conf.name][conf.timer].timer=setTimeout(run, sleep*1000, conf);
			log('休眠'+sleep+'秒后从'+conf.source+'采集'+conf.title+'数据...');
		}
	}

	function run(conf){
		if(timers[conf.name][conf.timer].timer) clearTimeout(timers[conf.name][conf.timer].timer);
		log('开始从'+conf.source+'采集'+conf.title+'数据');
		var option=JSON.parse(JSON.stringify(conf.option));
		http.request(option, function(res){
			var data="";
			res.on("data", function(_data){
				data+=_data.toString();
			});
			res.on("end", function(){
				try{
					try{
						data=conf.parse(data);
					}catch(err){
						throw('解析'+conf.title+'数据出错：'+err);
					}
					if (!data || !data.hasOwnProperty('number')) throw('采集时出现错误，稍后重试');
					data.number = data.number.replace('-', '');
					data.number = data.number.replace(/[0]{2,}(\d{1,})$/, '0$1');
					if (data.hasOwnProperty('data') && data.data.indexOf('255') > -1) throw(conf.title + '卡奖，终止后续处理');
					try{
						if(data.type=='26' || data.type=='5' || data.type=='30' || data.type=='14' || data.type=='25'){
							liRunData(data, conf);
						}else{
							submitData(data, conf);
						}
					}catch(err){
						throw('提交出错：'+err);
					}
				}catch(err){
					log('运行出错：%s，休眠%f秒'.format(err, config.errorSleepTime));
					restartTask(conf, config.errorSleepTime);
				}
			});
			
			res.on("error", function(err){
				log(err);
				restartTask(conf, config.errorSleepTime);
			});
			
		}).on('timeout', function(err){
			log('从'+conf.source+'采集'+conf.title+'数据超时');
			restartTask(conf, config.errorSleepTime);
		}).on("error", function(err){
			// 一般网络出问题会引起这个错
			log(err);
			restartTask(conf, config.errorSleepTime);
			
		}).end();
	}

	function submitData(data, conf){
		log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
		log('提交从'+conf.source+'采集的'+conf.title+'第'+data.number+'数据：'+data.data);
		try{
			var client=mysql.createClient(config.dbinfo);
		}catch(err){
			throw('连接数据库失败');
		}
		data.time=Math.floor((new Date(data.time)).getTime()/1000);
		client.query("insert into lottery_data(type, time, number, data) values(?,?,?,?)", [data.type, data.time, data.number, data.data], function(err, result){
			if(err){
				// 普通出错
				if(err.number==1062){
					// 数据已经存在
					// 正常休眠
					try{
						sleep=calc[conf.name](data);
						if(sleep<0) sleep=config.errorSleepTime*1000;
					}catch(err){
						restartTask(conf, config.errorSleepTime);
						return;
					}
					log(conf['title']+'第'+data.number+'期数据已经存在数据');
					restartTask(conf, sleep/1000, true);

				}else{
					log('运行出错：'+err.message);
					restartTask(conf, config.errorSleepTime);
				}
			}else if(result){
				setTimeout(calcJ, 500, data);
				// 正常
				try{
					sleep=calc[conf.name](data);
				}catch(err){
					log('解析下期数据出错：'+err);
					restartTask(conf, config.errorSleepTime);
					return;
				}
				log('写入'+conf['title']+'第'+data.number+'期数据成功');
				restartTask(conf, sleep/1000, true);
			}else{
				global.log('未知运行出错');
				restartTask(conf, config.errorSleepTime);
			}
		});
		client.end();
	}

	function getLiRunLv(){
		var client=createMySQLClient();
		client.query("select value from lottery_params where name='LiRunLv'", function(err, data){
			if(err){
				LiRunLv=0;
				exit();
			}else{
				data.forEach(function(v){
					LiRunLv=v.value;
				});
			}
		});
		client.end();
	}

	function getLiRuncount(){
		var client=createMySQLClient();
		client.query("select value from lottery_params where name='LiRuncount'", function(err, data){
			if(err){
				LiRuncount=0;
				exit();
			}else{
				data.forEach(function(v){
					LiRuncount=v.value;
				});
			}
		});
		client.end();
	}

	function getplaycount(data){
		var client=createMySQLClient();
		client.query("select count(distinct(username)) AS s from lottery_bets where actionNo=?", [data.number], function(err, data){
			if(err){
				playcount=0;
				exit();
			}else{
				data.forEach(function(v){
					playcount=v.s;
				});
			}
		});
		client.end();
	}

	/**
	*
	* 利润保障计算
	*     少于设置值,则不插入官方开奖号码,而重启任务
	*
	*/
	function liRunData(data, conf){
		var bjAmount = 0,zjAmount = 0;
		getLiRunLv();
		var client=createMySQLClient();
		client.query("select actionNum,playedId,actionData,weiShu,mode,beiShu,bonusProp from lottery_bets where isDelete=0 and lotteryNo='' and type=? and actionNo=?", [data.type, data.number], function(err, bets){
			if(err){
				log("读取投注出错："+err);
			}else{
				bets.forEach(function(bet){
					var fun;
					try{
						fun=parse[played[bet.playedId]];
						if(typeof fun!='function') throw new Error('算法不是可用的函数');
					}catch(err){
						log('计算玩法[%f]中奖号码算法不可用：%s'.format(bet.playedId, err.message));
						return;
					}
					try{
						var zjCount=fun(bet.actionData, data.data, bet.weiShu)||0; //中奖注数
						bjAmount+=Math.floor(bet.actionNum)*bet.mode*Math.floor(bet.beiShu); //投注金额:投注注数* 模式 * 倍数
						zjAmount+=bet.bonusProp*Math.floor(zjCount)*Math.floor(bet.beiShu)*(bet.mode/2); //中奖金额: 奖金比例(赔率) * 中奖注数 * 倍数 * (模式/2)
					}catch(err){
						log('计算中奖号码时出错：'+err);
						return;
					}
				});
				if(bjAmount*(1-LiRunLv/100)<zjAmount){   // 投注金额*(1-利润) < 中奖金额
					restartTask(conf, 1);
				}else{
					submitData(data, conf);
				}
			}
		});
		client.end();
	}
	
	function is_need_retask(t) {
		if (!retask_times.hasOwnProperty(t)) retask_times[t] = 0;
		retask_times[t]++;
		if (retask_times[t] > 3) {
			retask_times[t] = 0;
			return false;
		} else {
			return true;
		}
	}

	function requestKj(type,number){
		var option={
			host:config.submit.host,
			path:'%s/%s/%s/%'.format(config.submit.path, type, number)
		}
		http.get(config.submit,function(res){
		});
	}

	function createMySQLClient(){
		try{
			return mysql.createClient(config.dbinfo).on('error', function(err){
				throw('连接数据库失败');
			});
		}catch(err){
			log('连接数据库失败：'+err);
			return false;
		}
	}
	// 计算中奖注数并开奖:每条投注中奖注数
	function calcJ(data, flag){
		var client=createMySQLClient();
		sql="select id,playedId,actionData,weiShu,actionName,type from lottery_bets where isDelete=0 and type=? and actionNo=?";
		if(flag) sql+=" and lotteryNo=''";
		client.query(sql, [data.type, data.number], function(err, bets){
			if(err){
				log("读取投注出错："+err);
				exit();
			}else{
				var sql, sqls=[];
				sql='call kanJiang(?, ?, ?, ?)';
				
				bets.forEach(function(bet){
					var fun;
					try{
						fun=parse[played[bet.playedId]];
						if(typeof fun!='function') throw new Error('算法不是可用的函数');
					}catch(err){
						log('-----------------------------------------计算玩法[%f]中奖号码算法不可用：%s'.format(bet.playedId, err.message));
						return;
					}
					if (bet.actionData.indexOf('|') > -1) {
						var zjCount = 0;
						bet.actionData.split('|').map(function(_actionData){
							try{
								var tmp_zjCount=fun(_actionData, data.data, bet.weiShu)||0;
								zjCount += tmp_zjCount;
							}catch(err){
								log('计算中奖号码时出错：'+err);
								return;
							}
						});
					} else {
						try{
							var zjCount=fun(bet.actionData, data.data, bet.weiShu)||0;
						}catch(err){
							log('计算中奖号码时出错：'+err);
							return;
						}
						
					}
					sqls.push(client.format(sql, [bet.id, zjCount, data.data, 'lottery_running']));
				});
				try{
					setPj(sqls, data); // 设置赔奖
				}catch(err){
					log(err);
				}
			}
		});
		client.end();
	}

	function setPj(sqls, data){
		if(sqls.length==0) throw('彩种[%f]第%s期没有投注'.format(data.type, data.number));
		var client=createMySQLClient();
		if(client==false){
			log('连接数据库出错，休眠%f秒继续...'.format(config.errorSleepTime));
			setTimeout(setPj, config.errorSleepTime*1000, sqls, data);
		}else{
			client.query(sqls.join(';'), function(err,result){
				if(err){
					console.log(err);
				}else{
					log('成功');
				}
			});
			client.end();
		}	
	}

	// 前台添加数据接口
	http.createServer(function(req, res){
		log('前台访问'+req.url);
		var data='';
		req.on('data', function(_data){
			data+=_data;
		}).on('end', function(){
			data=querystring.parse(data);
			var msg={},
				hash=crypto.createHash('md5');
			hash.update(data.key);
			if(encrypt_key==hash.digest('hex')){
				delete data.key;
				if(req.url=='/data/add'){
					submitDataInput(data);
				}else if(req.url=='/data/kj'){
					calcJ(data, true)
				}
			}else{
				msg.errorCode=1;
				msg.errorMessage='校验不通过';
			}
			res.writeHead(200, {"Content-Type": "text/json"});
			res.write(JSON.stringify(msg));
			res.end();
		});
	}).listen(65531);

	function submitDataInput(data){
		log('提交从前台录入第'+data.number+'数据：'+data.data);
		try{
			var client=mysql.createClient(config.dbinfo);
		}catch(err){
			throw('连接数据库失败');
		}
		data.time=Math.floor((new Date(data.time)).getTime()/1000);
		client.query("insert into lottery_data(type, time, number, data) values(?,?,?,?)", [data.type, data.time, data.number, data.data], function(err, result){
			if(err){
				// 普通出错
				if(err.number==1062){
					// 数据已经存在
					log('第'+data.number+'期数据已经存在数据');
				}else{
					log('运行出错：'+err.message);
				}
			}else if(result){
				// 正常
				log('写入第'+data.number+'期数据成功');
				// 计算奖品
				setTimeout(calcJ, 500, data);
			}else{
				global.log('未知运行出错');
			}
		});
		client.end();
	}

	//
		/**
	*
	* 利润保障计算
	*     少于设置值,则不插入官方开奖号码,而重启任务
	*
	*/
	function calcLotteryNo(data){
		
		var bjAmount = 0,zjAmount = 0;
		getLiRunLv();
		var client=createMySQLClient();
		// 获取玩法可能中奖的组合号码表,循环计算每一组号码的利润率,更新到测算表中,系统再根据设置自动将最接近的号码开奖
		client.query("select id,lotteryNo from lottery_budget where status=0 and type=? and actionNo=?",[data.type, data.number],function(err,budgets){
			if(err){
				log("读取试算表出错："+err);
			}else{
				budgets.forEach(function(budget){
					
				})
			}
		})
		client.query("select actionNum,playedId,actionData,weiShu,mode,beiShu,bonusProp from lottery_bets where isDelete=0 and lotteryNo='' and type=? and actionNo=?", [data.type, data.number], function(err, bets){
			if(err){
				log("读取投注出错："+err);
			}else{
				bets.forEach(function(bet){
					var fun;
					try{
						fun=parse[played[bet.playedId]];
						if(typeof fun!='function') throw new Error('算法不是可用的函数');
					}catch(err){
						log('计算玩法[%f]中奖号码算法不可用：%s'.format(bet.playedId, err.message));
						return;
					}
					try{
						var zjCount=fun(bet.actionData, data.data, bet.weiShu)||0; //中奖注数
						bjAmount+=Math.floor(bet.actionNum)*bet.mode*Math.floor(bet.beiShu); //投注金额:投注注数* 模式 * 倍数
						zjAmount+=bet.bonusProp*Math.floor(zjCount)*Math.floor(bet.beiShu)*(bet.mode/2); //中奖金额: 奖金比例(赔率) * 中奖注数 * 倍数 * (模式/2)
					}catch(err){
						log('计算中奖号码时出错：'+err);
						return;
					}
				});
				if(bjAmount*(1-LiRunLv/100)<zjAmount){   // 投注金额*(1-利润) < 中奖金额
					restartTask(conf, 1);
				}else{
					submitData(data, conf);
				}
			}
		});
		client.end();
	}

	function getLiRunLv(){
		var bjAmount = 0,zjAmount = 0;
		var profits;
		var client=createMySQLClient();
		client.query("select actionNum,playedId,actionData,weiShu,mode,beiShu,bonusProp from lottery_bets where isDelete=0 and lotteryNo='' and type=? and actionNo=?", [data.type, data.number], function(err, bets){
			if(err){
				log("读取投注出错："+err);
			}else{
				bets.forEach(function(bet){
					var fun;
					try{
						fun=parse[played[bet.playedId]];
						if(typeof fun!='function') throw new Error('算法不是可用的函数');
					}catch(err){
						log('计算玩法[%f]中奖号码算法不可用：%s'.format(bet.playedId, err.message));
						return;
					}
					try{
						var zjCount=fun(bet.actionData, data.data, bet.weiShu)||0; //中奖注数
						bjAmount+=Math.floor(bet.actionNum)*bet.mode*Math.floor(bet.beiShu); //投注金额:投注注数* 模式 * 倍数
						zjAmount+=bet.bonusProp*Math.floor(zjCount)*Math.floor(bet.beiShu)*(bet.mode/2); //中奖金额: 奖金比例(赔率) * 中奖注数 * 倍数 * (模式/2)
					}catch(err){
						log('计算中奖号码时出错：'+err);
						return;
					}
				});
				profits = ( (1 - zjAmount / bjAmount)*100 ).toFixed(2);
				setBudget(data, profits); 
			}
		});
		client.end();
	}

	//
	function setBudget(data,profits){
		
	}
}