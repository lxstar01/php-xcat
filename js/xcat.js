var code_JYS = 0;
var code_PZ = 0;
var code_YF = 0;


function alert_audio() {
	audio = new Audio("audio/alert.mp3");
	audio.play();
}

function add_box() {

}

function load_code_JYS() {
	str = "";
	for (i in JYS) {
		str += "<option value=" + i + ">" + JYS[i] + "</option>"
	}
	$("select[name=exchange]")[0].innerHTML = str;
}

function load_code_PZ(j) {
	code_JYS = parseInt(j);
	if (j != 0) {
		str = "<option value=-1>品种</option>";
	} else {
		str = "";
	}
	for (i in PZ[j]) {
		str += "<option value=" + i + ">" + PZ[j][i] + "</option>"
	}
	$("select[name=variety]")[0].innerHTML = str;
	$("select[name=contract]")[0].innerHTML = "<option value=-1>合约</option>";
}

function load_code_YF(j) {
	code_PZ = parseInt(j);
	str = "";
	if (j == -1) {
		str = "<option value=-1>合约</option>"
	} else {
		for (i in YF[code_JYS][code_PZ]) {
			str += "<option value=" + i + ">" + YF[code_JYS][code_PZ][i][0] + "</option>"
		}
	}

	$("select[name=contract]")[0].innerHTML = str;
}

function load_list() {
	html_str = "";
	if (localStorage.length == 0) {
		$("table tbody")[0].innerHTML = "<tr style='text-align:center;'><td colspan=7>未添加任何数据</td></tr>";
	} else {
		name_array = localStorage.name_list.split(",");
		code_array = localStorage.yf_list.split(",");
		alert_type_array = localStorage.alert_type_list.split(",");
		alert_text_array = localStorage.alert_text_list.split(",");

		for (i = 0; i < name_array.length; i++) {
			html_str += "<tr><td>" + name_array[i] + " [" + code_array[i] + "]";
			html_str += "</td><td>-</td><td>-</td><td>-</td><td>-</td>";

			html_str += "<td>" + $("select[name=alert]")[0].options[parseInt(alert_type_array[i]) - 1].innerHTML;
			html_str += " " + alert_text_array[i];
			if (parseInt(alert_type_array[i]) > 2) {
				html_str += "元</td>";
			} else {
				html_str += "%</td>";
			}

			html_str += "<td><a href='#' onclick='del(" + i + ");'>删除</a></td>";
			html_str += "</tr>";
		}
		$("table tbody")[0].innerHTML = html_str;
	}

}

function del(i) {
	name_array = localStorage.name_list.split(",");
	code_array = localStorage.yf_list.split(",");
	alert_type_array = localStorage.alert_type_list.split(",");
	alert_text_array = localStorage.alert_text_list.split(",");

	name_array.pop(i);
	code_array.pop(i);
	alert_type_array.pop(i);
	alert_text_array.pop(i);

	if (name_array.length > 0) {
		localStorage.name_list = name_array.join(',');
		localStorage.yf_list = code_array.join(',');
		localStorage.alert_type_list = alert_type_array.join(',');
		localStorage.alert_text_list = alert_text_array.join(',');
	} else {
		localStorage.clear();
	}
	//alert("删除成功");
	load_list();

}

function add_handle() {
	//console.log(YF[code_JYS][code_PZ][code_YF][0]);
	//console.log(YF[code_JYS][code_PZ][code_YF][1]);
	//return ;

	if ($("select[name=contract]")[0].value == -1) {
		alert_mgs("未选择合约");
		return;
	}

	if (isNaN($("input[name=alert_text]")[0].value) || $("input[name=alert_text]")[0].value.length == 0) {
		alert_mgs("告警条件应为数字且不能为空");
		return;
	}

	//add yf num
	if (localStorage.yf_list == undefined) {
		localStorage.yf_list = YF[code_JYS][code_PZ][code_YF][1];
		localStorage.name_list = YF[code_JYS][code_PZ][code_YF][0];
		localStorage.alert_type_list = $("select[name=alert]")[0].value;
		localStorage.alert_text_list = $('input[name=alert_text]')[0].value;
	} else {
		localStorage.yf_list += "," + YF[code_JYS][code_PZ][code_YF][1];
		localStorage.name_list += "," + YF[code_JYS][code_PZ][code_YF][0];
		localStorage.alert_type_list += "," + $("select[name=alert]")[0].value;
		localStorage.alert_text_list += "," + $('input[name=alert_text]')[0].value;
	}

	//alert("添加成功!");
	init_select();
	load_list();
}

function init_select() {
	code_JYS = 0;
	code_PZ = 0;
	code_YF = 0;

	load_code_JYS();
	$("select[name=variety]")[0].innerHTML = "<option value=-1>品种</option>";
	$("select[name=contract]")[0].innerHTML = "<option value=-1>合约</option>";
	$("select[name=alert]")[0].value = 1;
	$("input[name=alert_text]")[0].value = "";
}

function alert_option_change(option_value) {
	if (option_value > "2") {
		$("#alert_point").hide();
	} else {
		$("#alert_point").show();
	}
}

function get_hq_data() {
	$.getScript(
		"http://hq.sinajs.cn/?_=" + new Date().getTime() + "&list=" + localStorage.yf_list,
		function(data) {
			
		});
}

function alert_mgs(content) {
	//alert(content);
}


function init() {
	load_code_JYS();
	load_list();
}

jQuery(document).ready(function($) {
	init();
});