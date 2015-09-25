

(function($,global) {

	$(function(){
		var $create = {};
		$creatArea = $('#creatArea');

		$create.table = {};
		$create.table.tag = $creatArea.append('<table id="createTable"></table>').find('#createTable');
		
		var width  = $('#width')[0].value;
		
		var tr = {
			length:$('#tr')[0].value
		},
		td = {
			length:$('#td')[0].value
		};

		var create = {
			tr : function(num){
				for(var i  = 0 ; i < num ;i++) {
					$create.table['tr' + i]= {};
					$create.table['tr' + i].tag = $create.table.tag.append('<tr></tr>').find('tr').eq(i);
				};
			},
			td : function(num) {
				this.tag('td',num);
			},
			th : function(num) {
				this.tag('th',num);
			},
			tag : function(tagName,num) {
				var trLength = $create.table.tag.find('tr').length;
				
				for(var i  = 0 ; i < trLength ;i++) {
					for(var j  = 0 ; j < num ;j++) {
						$create.table['tr' + i][tagName + j] = {};
						$create.table['tr' + i][tagName + j].tag = $create.table['tr' + i].tag.append('<' + tagName  +  '>　</' + tagName + '>').find(tagName).eq(j);
					};
				};
				
				$create.table.tag.find(tagName).width(width);
			},
			join : function() {
				var numList = [];
				var arguments = arguments[0];
				
				var flg = true;
				for(var i  = 1 ; i < arguments.length ;i++) {
					if(flg) {
						flg = arguments[i - 1].parent().index() === arguments[i].parent().index();
					} else {
						flg = false;
					}
				}
				
				for(var i  = 0 ; i < arguments.length ;i++) {
					numList.push(arguments[i].parent().index());
				}
				
				for(var i  = 0 ; i < arguments.length ;i++) {
					if(i === numList.indexOf(Math.min.apply(null, numList))) {
						arguments[i].attr((flg ? 'col' : 'row') + 'span',arguments.length);
					} else {
						arguments[i].remove();
					}
					numList.push(arguments[i].parent().index());
				}
				
			}
		};
		
		
		var createHTML = function() {
				$("#code").html('<xmp >' + format_xml($creatArea.html()) + '</xmp>');
		};
		
		create.tr(tr.length);
		create.td(td.length);
		createHTML();
		
		create.join([
		$create.table.tr0.td0.tag,
		$create.table.tr0.td1.tag
		]);
		
		
		
		$('.join').on('click', function(){
			var joinList = [];
			$create.table.tag.find('.selected').each(function(){
				joinList.push($(this))
			});
			
			create.join(joinList);
		});
		
		
		$('body').on('click', function(){
			if(!keyDownFlg.command) {
				if(!keyDownFlg.shift) {
					$create.table.tag.find('td,th').removeClass('selected');
				}
			}
		});
		
		$(document).on('click','#creatArea td, #creatArea th', function(){
		
			if($(this).text() === '　') {
			//	$(this).text('');
			}
			$(this).addClass('selected');
			
			
			if(keyDownFlg.shift) {
				var numList = {};
				
				var flg = true;
				for(var i  = 1 ; i < $create.table.tag.find('.selected').length ;i++) {
					if(flg) {
						flg = $create.table.tag.find('.selected').eq(i - 1).parent().index() === $create.table.tag.find('.selected').eq(i).parent().index();
					} else {
						flg = false;
					}
				}

				numList.td = [],numList.tr = [];
				for(var i  = 0 ; i < $create.table.tag.find('.selected').length ;i++) {
					numList.td.push($create.table.tag.find('.selected').eq(i).index());
					numList.tr.push($create.table.tag.find('.selected').eq(i).parent().index());
				}

				
				for(var i  = Math.min.apply(null, numList[flg ? 'td' : 'tr']) ;i < Math.max.apply(null, numList[flg ? 'td' : 'tr']) ;i++) {
					if(flg){
						$create.table['tr' + numList.tr[0]]['td' + i].tag.addClass('selected');
					} else {
						var colNum = 0;
						$create.table['tr' + i].tag.find('td').each(function(i) {
							if(i < Math.max.apply(null, numList.td)) {
								if($(this).attr('colspan') !== undefined) {
									colNum = colNum + Number($(this).attr('colspan')) - 1;
								}
							}
						});
						console.log(colNum);
						
						$create.table['tr' + i]['td' + (numList.td[0] + colNum)].tag.addClass('selected');
					}
				}
			}
		});
		
		$(document).on('keydown keyup',function(e){
				keyDownFlg.action('command','Meta',e);
				keyDownFlg.action('shift','Shift',e);
		});
		
		var keyDownFlg = {
			action : function(subscript,name,e) {
				var downFlg = e.type === 'keydown' ? true : false,
					KeyFlg = e.originalEvent.keyIdentifier === name ? true : false;
	
				this[subscript] = downFlg && KeyFlg ? true : false;
				
				//console.log(subscript +' : ' + this[subscript]);
			}
		}
				
		$('.control input').change(function(){
			$create.table.tag.find('>*').remove();
			$create.table = {};
			$create.table.tag = $('#createTable');
			
			tr.length = $('#tr')[0].value;
			td.length = $('#td')[0].value;
			
			create.tr(tr.length);
			create.td(td.length);
		});

		$("body").on("input focus blur DOMCharacterDataModified", function(event){ 
			createHTML();
		
			if ("input" == event.originalEvent.type) {
				$("#log").append("<li>input</li>" );
			}
			if ("focus" == event.originalEvent.type) {
				$("#log").append("<li>focus</li>");
			}
			if ("blur" == event.originalEvent.type) {
				$("#log").append("<li>blur</li>");
			}
			if ("DOMCharacterDataModified" == event.originalEvent.type) {
			}
		});
	});
}(jQuery,this));


/**
 * 指定した数のスペースを返す
 * ※インデント用
 */ 
function spaces(len) {
  var s = '';
  var indent = len*4;
  for (i=0;i<indent;i++) {s += " ";}
 
  return s;
}
 
/**
 * XMLフォーマットの文字列を渡すと
 * 整形した文字列を返す
 */
function format_xml(str) {
  var xml = '';
 
  // タグの区切りで改行コードを挿入
  str = str.replace(/(>)(<)(\/*)/g,"$1\n$2$3");
 
  // インデント周りの値
  var pad = 0;
  var indent;
  var node;
 
  // 改行コードで分割
  var strArr = str.split("\n");
 
  for (var i = 0; i < strArr.length; i++) {
    indent = 0;
    node = strArr[i];
 
    if(node.match(/.+<\/\w[^>]*>$/)) { //一行で完結しているタグはそのまま
      indent = 0;
    } else if(node.match(/^<\/\w/)) { // 閉じタグ時はインデントを減らす
      if (pad > 0){pad -= 1;}
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)){ // 開始タグはインデントを増やす
      indent = 1;
    } else {
      indent = 0;
    }
    xml += spaces(pad) + node + "\n";
    pad += indent;
  }
  return xml;
}