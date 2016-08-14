// 彩票开奖配置
var localhost = exports.localhost = 'localhost';
exports.cp=[
	{
		title:'新疆时时彩',
		source:'香雨娱乐平台',
		name:'xjssc',
		enable:false,
		timer:'xjssc',

		option:{
			host:"119.29.94.216",
			timeout:30000,
			path: '/cxssc.xml',
			headers:{
				"User-Agent": "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0"
			}
		},
		
		parse:function(str){
			//return getFromCalilecWeb(str,7);
			try{
				str=str.substr(0,200);
				var reg=/<row expect="(\d+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 
				//<row expect="13072178" opencode="06,03,05,08,01" opentime="2013-07-21 21:55:30" />
				var m;
	
				if(m=str.match(reg)){
					return {
						type:12,
						time:m[3],
						number:m[1].replace(/^(\d{8})(\d{2})$/, '$1-$2'),
                        m1 : m[1],
						data:m[2]
					};
				}					
			}catch(err){
				throw('xj时时彩解析数据不正确');
			}
		}
	},
	
	{
		title:'重庆时时彩',
		source:'网站',
		name:'cqssc',
		enable:false,
		timer:'cqssc',

		option:{
			host:"119.29.94.216",
			timeout:50000,
			path: '/cqssc2.xml',
			headers:{
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/28.0.1271.64 Safari/537.11"
			}
		},
		
		parse:function(str){
			try{
				//return getFromCaileWeb(str,15);
				str=str.substr(0,200);
				var reg=/<row expect="(\d+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 
				var m;
	
				if(m=str.match(reg)){
  					if(m[2]=='255,255,255,255,255') throw('重庆时时彩解析数据不正确');
					return {
						type:1,
						time:m[3],
						number:m[1].replace(/^(\d{8})(\d{3})$/, '$1-$2'),
						data:m[2]
					};
				}					
			}catch(err){
				throw('重庆时时彩解析数据不正确');
			}
		}
	},  



	{
		title:'北京PK10',
		source:'香雨娱乐平台',
		name:'bjpk10',
		enable:false,
		timer:'bjpk10',


		option:{
			host:"119.29.94.216",
			timeout:30000,
			path: '/pk10.xml',
			headers:{
				"User-Agent": "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0"
			}
		},
		
		parse:function(str){
			try{
				//return getFromShishicaiWeb(str,3);
				str=str.substr(0,200);
				var reg=/<row expect="(\d+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 
				//<row expect="20130719084" opencode="3,0,6,3,6" opentime="2013-07-19 23:12:25"/>
				var m;
	
				if(m=str.match(reg)){
					return {
						type:20,
						time:m[3],
						number:m[1].replace(/^(\d{8})\d(\d{2})$/, '$1-$2'),
						data:m[2]
					};
				}	
			}catch(err){
				throw('PK10解析数据不正确');
			}
		}
	},
	    
	{
		title:'重庆11选5',
		source:'彩乐乐',
		name:'cq11x5',
		enable:false,
		timer:'cq11x5',
		option:{
			host:"www.cailele.com",
			timeout:30000,
			path: '/static/cq11x5/newlyopenlist.xml',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				str=str.substr(0,500);
				var m;
				var reg=/<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 
                                        
				if(m=str.match(reg)){
					return {
						type:15,
						time:m[3],
						number:m[1],
						data:m[2]
					};
				}
			}catch(err){
				throw('重庆11选5解析数据不正确');
			}
		}
	},

	{
		title:'蒙古快3',
		source:'彩乐乐',
		name:'mgk3',
		enable:false,
		timer:'mgk3',

		option:{
			host:"www.cailele.com",
			timeout:30000,
			path: '/static/nmgk3/newlyopenlist.xml',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		
		parse:function(str){
			try{
				str=str.substr(0,500);
				var m;
				var reg=/<item id="([\d\-]+?)" dateline="([\d\:\- ]+?)">([\d\,]+?)<\/item>/; 
                                        
				if(m=str.match(reg)){
					return {
						type:51,
						time:m[2],
						number:m[1],
						data:m[3]
					};
				}
			}catch(err){
				throw('蒙古快3解析数据不正确');
			}
		}
	},

	{   
        title:'吉林快3',
		source:'百度乐彩',
		name:'jlk3',
		enable:false,
		timer:'jlk3',
 
		option:{
			host:"baidu.lecai.com",
			timeout:30000,
			path: '/lottery/draw/view/560?phase=150729051&agentId=5563',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		
		parse:function(str){
			try{
				var exp_data = /var latest_draw_result = {"red":\[([0-9\[\]\,\s"]+)\]/;
				var exp_phase = /var latest_draw_phase = '(\d+)';/;
				var exp_time = /var latest_draw_time = '([0-9\-\:\s]+)';/;
				var m_data = str.match(exp_data);
				var m_phase = str.match(exp_phase);
				var m_time = str.match(exp_time);
				if(m_data && m_phase && m_time){
					return {
						type:30,
						time:m_time[1],
						number:'20' + m_phase[1],
						data:m_data[1].replace(/"/g, '')
					};
				}
			}catch(err){
				throw('吉林快3解析数据不正确');
			}
		}
	},

	{
		title:'江西时时彩',
		source:'官方网站',
		name:'jxssc',
		enable:false,
		timer:'jxssc_official',
		option: {
			host: 'data.shishicai.cn',
			timeout: 30000,
			path: '/jxssc/haoma/',
			headers: {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)'},
		},
		parse: function(str) {
			try {
				var exp = /江西时时彩第(\d+\-\d+)期开奖号码\:(\d+)\,开奖时间\:([\d\:\- ]+?)\./;
				var match = str.match(exp);
				if (match) {
					var data = '';
					var max = match[2].length;
					for (var i=0;i<max;i++) data += match[2][i] + ',';
					return {
						type: 3,
						time: match[3],
						number: match[1],
						data: data.substr(0, max * 2 - 1)
					};
				}
			} catch(err) {
				throw('江西时时彩解析数据不正确');
			}
		},
	},
	
	{
		title:'江西时时彩',
		source:'360彩票',
		name:'jxssc',
		enable:false,
		timer:'jxssc_360',
		option: {
			host: 'cp.360.cn',
			timeout: 30000,
			path: '/sscjx/',
			headers: {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)'},
		},
		parse: function(str) {
			try{
				return getFrom360CP(str, 3);
			} catch(err) {
				throw('江西时时彩解析数据不正确');
			}
		},
	},
	
	{
		title:'江西时时彩',
		source:'百度乐彩',
		name:'jxssc',
		enable:false,
		timer:'jxssc_baidu',
		option: {
			host: 'baidu.lecai.com',
			timeout: 30000,
			path: '/lottery/ajax_latestdrawn.php?lottery_type=202',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Referer': 'http://baidu.lecai.com/lottery/draw/view/202?phase=20150821084&agentId=5621',
				'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)',
				'X-Requested-With': 'XMLHttpRequest',
			},
		},
		parse: function(str) {
			try {
				var data = JSON.parse(str);
				if (typeof data.data[0].result.result[0].data === 'object') {
					var time = data.data[0].time_endticket;
					var number = data.data[0].phase;
					var data = data.data[0].result.result[0].data.join(',');
					return {
						type: 3,
						time: time,
						number: number,
						data: data,
					};
				}
			} catch(err) {
				throw('江西时时彩解析数据不正确');
			}
		},
	},

	{
		title:'新疆时时彩',
		source:'新疆福利彩票网',
		name:'xjssc',
		enable:false,
		timer:'xjssc',

		option:{
			host:"www.xjflcp.com",
			timeout:30000,
			path: '/ssc/',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				return getFromXJFLCPWeb(str,12);
			}catch(err){
				throw('新疆时时彩解析数据不正确');
			}
		}
	},

	{
		title:'福彩3D',
		source:'500万彩票网',
		name:'fc3d',
		enable:false,
		timer:'fc3d',

		option:{
			host:"www.500wan.com",
			timeout:30000,
			path: '/static/info/kaijiang/xml/sd/list10.xml',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		
		parse:function(str){
			try{
				str=str.substr(0,300);
				var m;
				var reg=/<row expect="(\d+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)" trycode="[\d\,]*?" tryinfo="" \/>/;
				if(m=str.match(reg)){
					return {
						type:9,
						time:m[3],
						number:m[1],
						data:m[2]
					};
				}
			}catch(err){
				throw('福彩3D解析数据不正确');
			}
		}
	},

	{
		title:'排列3',
		source:'500万彩票网',
		name:'pai3',
		enable:false,
		timer:'pai3',

		option:{
			host:"www.500wan.com",
			timeout:30000,
			path: '/static/info/kaijiang/xml/pls/list10.xml',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		
		parse:function(str){
			try{
				str=str.substr(0,300);
				var m;	 
				var reg=/<row expect="(\d+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;
				if(m=str.match(reg)){
					return {
						type:10,
						time:m[3],
						number:20+m[1],
						data:m[2]
					};
				}
			}catch(err){
				throw('排3解析数据不正确');
			}
		}
	},
	
	{
		title:'广东11选5',
		source:'官方网站',
		name:'gd11x5',
		enable:false,
		timer:'gd11x5_official',

		option:{
			host:"data.shishicai.cn",
			timeout:30000,
			path: '/gd11x5/haoma/',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try {
				var exp = /广东11选5第(\d+\-\d+)期开奖号码\:([0-9\,]+)\,开奖时间\:([\d\:\- ]+?)\./;
				var match = str.match(exp);
				if (match) {
					return {
						type: 6,
						time: match[3],
						number: match[1].replace('-0', ''),
						data: match[2]
					};
				}
			} catch(err) {
				throw('广东11选5解析数据不正确');
			}
		}
	},

	{
		title:'广东11选5',
		source:'360彩票',
		name:'gd11x5',
		enable:false,
		timer:'gd11x5_360',

		option:{
			host:"cp.360.cn",
			timeout:30000,
			path: '/gd11/',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				return getFrom360CP(str,6);
			}catch(err){
				throw('广东11选5解析数据不正确');
			}
		}
	},
	
	{
		title:'广东11选5',
		source:'百度乐彩',
		name:'gd11x5',
		enable:false,
		timer:'gd11x5_baidu',

		option:{
			host:"baidu.lecai.com",
			timeout:30000,
			path: '/lottery/draw/view/23?phase=15082462&agentId=5563',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				var exp_data = /var latest_draw_result = {"red":\[([0-9\[\]\,\s"]+)\]/;
				var exp_phase = /var latest_draw_phase = '(\d+)';/;
				var exp_time = /var latest_draw_time = '([0-9\-\:\s]+)';/;
				var m_data = str.match(exp_data);
				var m_phase = str.match(exp_phase);
				var m_time = str.match(exp_time);
				if(m_data && m_phase && m_time){
					return {
						type:6,
						time:m_time[1],
						number:'20' + m_phase[1],
						data:m_data[1].replace(/"/g, '')
					};
				}
			}catch(err){
				throw('广东11选5解析数据不正确');
			}
		}
	},
	
	{
		title:'江西11选5',
		source:'官方网站',
		name:'jx11x5',
		enable:false,
		timer:'jx11x5_official',
 
		option:{
			host:"data.shishicai.cn",
			timeout:30000,
			path: '/jx11x5/haoma/',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try {
				var exp = /江西11选5第(\d+\-\d+)期开奖号码\:([0-9\,]+)\,开奖时间\:([\d\:\- ]+?)\./;
				var match = str.match(exp);
				if (match) {
					return {
						type: 16,
						time: match[3],
						number: match[1].replace('-0', ''),
						data: match[2]
					};
				}
			} catch(err) {
				throw('江西11选5解析数据不正确');
			}
		}
	},

	{
		title:'江西11选5',
		source:'360彩票',
		name:'jx11x5',
		enable:false,
		timer:'jx11x5_360',
 
		option:{
			host:"cp.360.cn",
			timeout:30000,
			path: '/dlcjx/',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				return getFrom360CP(str,16);
			}catch(err){
				throw('江西11选5解析数据不正确');
			}
		}
	},
	
	{
		title:'江西11选5',
		source:'百度乐彩',
		name:'jx11x5',
		enable:false,
		timer:'jx11x5_baidu',
 
		option:{
			host:"baidu.lecai.com",
			timeout:30000,
			path: '/lottery/draw/view/22?phase=2015082464&agentId=5563',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				var exp_data = /var latest_draw_result = {"red":\[([0-9\[\]\,\s"]+)\]/;
				var exp_phase = /var latest_draw_phase = '(\d+)';/;
				var exp_time = /var latest_draw_time = '([0-9\-\:\s]+)';/;
				var m_data = str.match(exp_data);
				var m_phase = str.match(exp_phase);
				var m_time = str.match(exp_time);
				if(m_data && m_phase && m_time){
					return {
						type:16,
						time:m_time[1],
						number:m_phase[1],
						data:m_data[1].replace(/"/g, '')
					};
				}
			}catch(err){
				throw('江西11选5解析数据不正确');
			}
		}
	},
	
	{
		title:'山东11选5',
		source:'官方网站',
		name:'sd11x5',
		enable:false,
		timer:'sd11x5_official', 

		option:{
			host:"data.shishicai.cn",
			timeout:30000,
			path: '/sd11x5/haoma/',
			headers:{
				"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; Sleipnir/2.9.8) "
			}
		},
		parse:function(str){
			try {
				var exp = /十一运夺金第(\d+\-\d+)期开奖号码\:([0-9\,]+)\,开奖时间\:([\d\:\- ]+?)\./;
				var match = str.match(exp);
				if (match) {
					return {
						type: 7,
						time: match[3],
						number: match[1].replace('-0', ''),
						data: match[2]
					};
				}
			} catch(err) {
				throw('山东11选5解析数据不正确');
			}
		}
	},

	{
		title:'山东11选5',
		source:'360彩票网',
		name:'sd11x5',
		enable:false,
		timer:'sd11x5_360', 

		option:{
			host:"cp.360.cn",
			timeout:30000,
			path: '/yun11/',
			headers:{
				"User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; Sleipnir/2.9.8) "
			}
		},
		parse:function(str){
			try{
				return getFrom360sd11x5(str,7);
			}catch(err){
				throw('山东11选5解析数据不正确');
			}
		}
	},
	
	{
		title:'山东11选5',
		source:'百度乐彩',
		name:'sd11x5',
		enable:false,
		timer:'sd11x5_baidu', 

		option:{
			host:"baidu.lecai.com",
			timeout:30000,
			path: '/lottery/ajax_latestdrawn.php?lottery_type=20',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Referer': 'http://baidu.lecai.com/lottery/draw/view/20?phase=15082465&agentId=5622',
				'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)',
				'X-Requested-With': 'XMLHttpRequest',
			},
		},
		parse:function(str){
			try {
				var data = JSON.parse(str);
				if (typeof data.data[0].result.result[0].data === 'object') {
					var time = data.data[0].time_endticket;
					var number = data.data[0].phase;
					var data = data.data[0].result.result[0].data.join(',');
					return {
						type: 7,
						time: time,
						number: number.substr(0, 2) !== '20' ? '20' + number : number,
						data: data,
					};
				}
			} catch(err) {
				throw('山东11选5解析数据不正确');
			}
		}
	},

	{
		title:'江苏快3',
		source:'360彩票',
		name:'jsk3',
		enable:true,
		timer:'jsk3',
 
		option:{
			host:"cp.360.cn",
			timeout:30000,
			path: '/k3js/',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		parse:function(str){
			try{
				return getFrom360CPK3(str,25);
			}catch(err){
				throw('江苏快3解析数据不正确');
			}
		}
	},

	{
		title:'北京PK10',
		source:'百度乐彩',
		name:'bjpk10',
		enable:false,
		timer:'bjpk10',

		option:{
			host:"baidu.lecai.com",
			timeout:30000,
			path: '/lottery/draw/view/557?phase=503062&agentId=5563',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
			}
		},
		
		parse:function(str){
			try{
				var exp_data = /var latest_draw_result = {"red":\[([0-9\[\]\,\s"]+)\]/;
				var exp_phase = /var latest_draw_phase = '(\d+)';/;
				var exp_time = /var latest_draw_time = '([0-9\-\:\s]+)';/;
				var m_data = str.match(exp_data);
				var m_phase = str.match(exp_phase);
				var m_time = str.match(exp_time);
				if(m_data && m_phase && m_time){
					return {
						type:20,
						time:m_time[1],
						number:m_phase[1],
						data:m_data[1].replace(/"/g, '')
					};
				}					
			}catch(err){
				throw('北京PK10解析数据不正确');
			}
		}
	},
	
	{
		title:'全天快三',
		source:'系统彩',
		name:'qtks',
		enable:false,
		timer:'qtks',

		option:{
			host: "127.1.1.1",
			timeout:30000,
			path: '/self/index?id=60',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0) "
			}
		},
		parse:function(str){
			try{
				str=str.substr(0,200);
				var reg=/<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;
				var m;
				if(m=str.match(reg)){
					return {
						type:60,
						time:m[3],
						number:m[1],
						data:m[2]
					};
				}
			}catch(err){
				throw('全天快三解析数据不正确');
			}
		}
	},

	{
		title:'五分彩',
		source:'系统彩',
		name:'qtllc',
		enable:false,
		timer:'qtllc',

		option:{
			host: "127.1.1.1",
			timeout:30000,
			path: '/self/index?id=14',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0) "
			}
		},
		parse:function(str){
			try{
				str=str.substr(0,200);
				var reg=/<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 			
				var m;
				if(m=str.match(reg)){
					return {
						type:14,
						time:m[3],
						number:m[1],
						data:m[2]
					};
				}
			}catch(err){
				throw('五分彩解析数据不正确');
			}
		}
	},

	{
		title:'二分彩',
		source:'系统彩',
		name:'lfc',
		enable:false,
		timer:'lfc',
		option:{
			host: "127.1.1.1",
			timeout:30000,
			path: '/self/index?id=26',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0) "
			}
		},
		parse:function(str){
			try{
				str=str.substr(0,200);	
				var reg=/<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 
				var m;
				if(m=str.match(reg)){
					return {
						type:26,
						time:m[3],
						number:m[1],
						data:m[2]
					};
				}					
			}catch(err){
				throw('二分彩解析数据不正确');
			}
		}
	},

	{
		title:'分分彩',
		source:'系统彩',
		name:'ffc',
		enable:false,
		timer:'ffc',
		option:{
			host: "127.1.1.1",
			timeout:30000,
			path: '/self/index?id=5',
			headers:{
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0) "
			}
		},
		parse:function(str){
			try{
				str=str.substr(0,200);	
				var reg=/<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/; 
				var m;
				if(m=str.match(reg)){
					return {
						type:5,
						time:m[3],
						number:m[1],
						data:m[2]
					};
				}					
			}catch(err){
				throw('分分彩解析数据不正确');
			}
		}
	}

];

// 出错时等待 15
exports.errorSleepTime=15;

// 重启时间间隔，单位：秒
exports.restartTime = {
	0: 60, //采集互联网进程半小时重启一次
	1: 60, //采集本机进程1分钟重启一次
};

exports.submit={
	host: localhost,
	path:'/admin/index.php/dataSource/kj'
}

exports.dbinfo={
	host: 'localhost',
	user: 'root',
	password: '123456@',
	database:'lottery',
	port: 3307
}

global.log=function(log){
	var date=new Date();
	console.log('['+date.toDateString() +' '+ date.toLocaleTimeString()+'] '+log)
}

function getFromXJFLCPWeb(str, type){
	str=str.substr(str.indexOf('<td><a href="javascript:detatilssc'), 300).replace(/[\r\n]+/g,'');
         
	var reg=/(\d{10}).+(\d{2}\:\d{2}).+<p>([\d ]{9})<\/p>/,
	match=str.match(reg);
	
	if(!match) throw new Error('数据不正确');
	//console.log('期号：%s，开奖时间：%s，开奖数据：%s', match[1], match[2], match[3]);
	
	try{
		var data={
			type:type,
			time:match[1].replace(/^(\d{4})(\d{2})(\d{2})\d{2}/, '$1-$2-$3 ')+match[2],
			number:match[1].replace(/^(\d{8})(\d{2})$/, '$10$2'),
			data:match[3].split(' ').join(',')
		};
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
}


function getFromCaileleWeb(str, type, slen){
	if(!slen) slen=380;
	str=str.substr(str.indexOf('<tr bgcolor="#FFFAF3">'),slen);
	//console.log(str);
	var reg=/<td.*?>(\d+)<\/td>[\s\S]*?<td.*?>([\d\- \:]+)<\/td>[\s\S]*?<td.*?>((?:[\s\S]*?<div class="ball_yellow">\d+<\/div>){3,5})\s*<\/td>/,
	match=str.match(reg);
	if(match.length>1){
		
		if(match[1].length==7) match[1]='2015'+match[1].replace(/(\d{4})(\d{3})/,'$1-$2');
		if(match[1].length==8){
			if(parseInt(type)!=11){
				match[1]='20'+match[1].replace(/(\d{6})(\d{2})/,'$1-0$2');
			}else{match[1]='20'+match[1].replace(/(\d{6})(\d{2})/,'$1-$2');}
		}
		if(match[1].length==9) match[1]='20'+match[1].replace(/(\d{6})(\d{2})/,'$1-$2');
		if(match[1].length==10) match[1]=match[1].replace(/(\d{8})(\d{2})/,'$1-0$2');
		var mynumber=match[1].replace(/(\d{8})(\d{3})/,'$1$2');
	try{
		var data={
			type:type,
			time:match[2],
			number:mynumber
		}
		
		reg=/<div.*>(\d+)<\/div>/g;
		data.data=match[3].match(reg).map(function(v){
			var reg=/<div.*>(\d+)<\/div>/;
			return v.match(reg)[1];
		}).join(',');
		
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
   }
}

function getFrom360CP(str, type){
	str=str.substr(str.indexOf('<em class="red" id="open_issue">'),380);
	//console.log(str);
	var reg=/[\s\S]*?(\d+)<\/em>[\s\S].*?<ul id="open_code_list">((?:[\s\S]*?<li class=".*?">\d+<\/li>){3,5})[\s\S]*?<\/ul>/,
	match=str.match(reg);
	var myDate = new Date();
	var year = myDate.getFullYear();       //年   
    var month = myDate.getMonth() + 1;     //月   
    var day = myDate.getDate();            //日
	if(month < 10) month="0"+month;
	if(day < 10) day="0"+day;
	var mytime=year + "-" + month + "-" + day + " " +myDate.toLocaleTimeString();
	//console.log(match);
	if(match.length>1){
		if(match[1].length==7) match[1]=year+match[1].replace(/(\d{8})(\d{3})/,'$1$2');
		if(match[1].length==6) match[1]=year+match[1].replace(/(\d{4})(\d{2})/,'$1$2');
		if(match[1].length==9) match[1]='20'+match[1].replace(/(\d{6})(\d{2})/,'$1$2');
		if(match[1].length==10) match[1]=match[1].replace(/(\d{8})(\d{2})/,'$1$2');
		var mynumber=match[1].replace(/(\d{8})(\d{3})/,'$1$2');
		
		try{
			var data={
				type:type,
				time:mytime,
				number:mynumber
			}
			
			reg=/<li class=".*?">(\d+)<\/li>/g;
			data.data=match[2].match(reg).map(function(v){
				var reg=/<li class=".*?">(\d+)<\/li>/;
				return v.match(reg)[1];
			}).join(',');
			
			//console.log(data);
			return data;
		}catch(err){
			throw('解析数据失败');
		}
	}
}

function getFrom360CPK3(str, type){

	str=str.substr(str.indexOf('<em class="red" id="open_issue">'),380);
	//console.log(str);
	var reg=/[\s\S]*?(\d+)<\/em>[\s\S].*?<ul id="open_code_list">((?:[\s\S]*?<li class=".*?">\d+<\/li>){3,5})[\s\S]*?<\/ul>/,
	match=str.match(reg);
	var myDate = new Date();
	var year = myDate.getFullYear();       //年   
    var month = myDate.getMonth() + 1;     //月   
    var day = myDate.getDate();            //日
	if(month < 10) month="0"+month;
	if(day < 10) day="0"+day;
	var mytime=year + "-" + month + "-" + day + " " +myDate.toLocaleTimeString();
	//console.log(match);
	match[1]=match[1].replace(/(\d{4})(\d{2})/,'$10$2');
		
		try{
			var data={
				type:type,
				time:mytime,
				number:year+match[1]
			}
			
			reg=/<li class=".*?">(\d+)<\/li>/g;
			data.data=match[2].match(reg).map(function(v){
				var reg=/<li class=".*?">(\d+)<\/li>/;
				return v.match(reg)[1];
			}).join(',');
			
			console.log(data);
			return data;
		}catch(err){
			throw('解析数据失败');
		}
}

function getFromPK10(str, type){
	str=str.substr(str.indexOf('<td class="winnumLeft">'),350).replace(/[\r\n]+/g,'');
	var reg=/<td class=".*?">(\d+)<\/td>[\s\S]*?<td>(.*)<\/td>[\s\S]*?<td class=".*?">([\d\:\- ]+?)<\/td>[\s\S]*?<\/tr>/,
	match=str.match(reg);
	if(!match) throw new Error('数据不正确');
	var myDate = new Date();
	var year = myDate.getFullYear();
	var mytime=year + "-" + match[3];
	try{
		var data={
			type:type,
			time:mytime,
			number:match[1],
			data:match[2]
		};
		return data;
	}catch(err){
		throw('解析数据失败');
	}
	
}

function getFromK8(str, type){

	str=str.substr(str.indexOf('<div class="lott_cont">'),450).replace(/[\r\n]+/g,'');
    //console.log(str);
	var reg=/<tr class=".*?">[\s\S]*?<td>(\d+)<\/td>[\s\S]*?<td>(.*)<\/td>[\s\S]*?<td>(.*)<\/td>[\s\S]*?<td>([\d\:\- ]+?)<\/td>[\s\S]*?<\/tr>/,
	match=str.match(reg);
	if(!match) throw new Error('数据不正确');
	//console.log(match);
	try{
		var data={
			type:type,
			time:match[4],
			number:match[1],
			data:match[2]+'|'+match[3]
		};
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
	
}


function getFromCJCPWeb(str, type){

	//console.log(str);
	str=str.substr(str.indexOf('<table class="qgkj_table">'),1200);
	
	//console.log(str);
	
	var reg=/<tr>[\s\S]*?<td class=".*">(\d+).*?<\/td>[\s\S]*?<td class=".*">([\d\- \:]+)<\/td>[\s\S]*?<td class=".*">((?:[\s\S]*?<input type="button" value="\d+" class=".*?" \/>){3,5})[\s\S]*?<\/td>/,
	match=str.match(reg);
	
	//console.log(match);
	
	if(!match) throw new Error('数据不正确');
	try{
		var data={
			type:type,
			time:match[2],
			number:match[1].replace(/(\d{8})(\d{2})/,'$10$2')
		}
		
		reg=/<input type="button" value="(\d+)" class=".*?" \/>/g;
		data.data=match[3].match(reg).map(function(v){
			var reg=/<input type="button" value="(\d+)" class=".*?" \/>/;
			return v.match(reg)[1];
		}).join(',');
		
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
	
}

function getFromCaileleWeb_1(str, type){
	str=str.substr(str.indexOf('<tbody id="openPanel">'), 120).replace(/[\r\n]+/g,'');
         
	var reg=/<tr.*?>[\s\S]*?<td.*?>(\d+)<\/td>[\s\S]*?<td.*?>([\d\:\- ]+?)<\/td>[\s\S]*?<td.*?>([\d\,]+?)<\/td>[\s\S]*?<\/tr>/,
	match=str.match(reg);
	if(!match) throw new Error('数据不正确');
	//console.log(match);
	var number,_number,number2;
	var d = new Date();
	var y = d.getFullYear();
	if(match[1].length==9 || match[1].length==8){number='20'+match[1];}else if(match[1].length==7){number='2015'+match[1];}else{number=match[1];}
	_number=number;
	if(number.length==11){number2=number.replace(/^(\d{8})(\d{3})$/, '$1$2');}else{number2=number.replace(/^(\d{8})(\d{2})$/, '$1-0$2');_number=number.replace(/^(\d{8})(\d{2})$/, '$10$2');}
	try{
		var data={
			type:type,
			time:_number.replace(/^(\d{4})(\d{2})(\d{2})\d{3}/, '$1-$2-$3 ')+match[2],
			number:number2,
			data:match[3]
		};
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
}

function getFrom360sd11x5(str, type){

	str=str.substr(str.indexOf('<em class="red" id="open_issue">'),380);
	//console.log(str);
	var reg=/[\s\S]*?(\d+)<\/em>[\s\S].*?<ul id="open_code_list">((?:[\s\S]*?<li class=".*?">\d+<\/li>){3,5})[\s\S]*?<\/ul>/,
	match=str.match(reg);
	var myDate = new Date();
	var year = myDate.getFullYear();       //年   
    var month = myDate.getMonth() + 1;     //月   
    var day = myDate.getDate();            //日
	if(month < 10) month="0"+month;
	if(day < 10) day="0"+day;
	var mytime=year + "-" + month + "-" + day + " " +myDate.toLocaleTimeString(); 
	//console.log(mytime);
	//console.log(match);
	
	if(!match) throw new Error('数据不正确');
	try{
		var data={
			type:type,
			time:mytime,
			number:year+match[1].replace(/(\d{4})(\d{2})/,'$1$2')
		}
		
		reg=/<li class=".*?">(\d+)<\/li>/g;
		data.data=match[2].match(reg).map(function(v){
			var reg=/<li class=".*?">(\d+)<\/li>/;
			return v.match(reg)[1];
		}).join(',');
		
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
}

function getFromCaileleWeb_2(str, type){

	str=str.substr(str.indexOf('<tbody id="openPanel">'), 500).replace(/[\r\n]+/g,'');
	//console.log(str);
	var reg=/<tr>[\s\S]*?<td>(\d+)<\/td>[\s\S]*?<td>([\d\:\- ]+?)<\/td>[\s\S]*?<td>([\d\,]+?)<\/td>[\s\S]*?<\/tr>/,
	match=str.match(reg);
	if(!match) throw new Error('数据不正确');
	//console.log(match);
	var number,_number,number2;
	var d = new Date();
	var y = d.getFullYear();
	if(match[1].length==9 || match[1].length==8){number='20'+match[1];}else if(match[1].length==7){number='2015'+match[1];}else{number=match[1];}
	_number=number;
	if(number.length==11){number2=number.replace(/^(\d{8})(\d{3})$/, '$1$2');}else{number2=number.replace(/^(\d{8})(\d{2})$/, '$10$2');_number=number.replace(/^(\d{8})(\d{2})$/, '$10$2');}
	try{
		var data={
			type:type,
			time:_number.replace(/^(\d{4})(\d{2})(\d{2})\d{3}/, '$1-$2-$3 ')+match[2],
			number:number2,
			data:match[3]
		};
		//console.log(data);
		return data;
	}catch(err){
		throw('解析数据失败');
	}
}