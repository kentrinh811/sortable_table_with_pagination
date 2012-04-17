var SortableTable =  function(args){
	this.sort_col=null;
	this.order=null;
	this.page = 1;
	this.totalPageNum= null;
	this.id = args.id;
	this.blockNum= args.block_num;
	this.callback = args.call_back;
	this.dataSet = args.data_set;
	this.sortStored = {};
	this.origSortData = [];
	this.sortedData = [];
	this.option = args.option;
	for(var i=0;i<this.dataSet.data.length;i++){
		this.origSortData.push(i);
		this.sortedData.push(i);
	}
	this.makeTable();
};
SortableTable.prototype.makeTable = function(){
	this.makePagination();
	var total = 0;
	var tableStr = "";
	if(this.dataSet.length != 0){
		if($('#' + this.id+'_contents').length < 1){
			tableStr += '<div id="'+this.id+'_contents" ><table '+this.dataSet.option+' >';
			tableStr += '<thead><tr><th style="width:3.2em;" >No.</th>';
			for(var i=0;i<this.dataSet.header.length;i++)
			{
				var header = this.dataSet.header[i];
				var name = header.name;
				if(this.dataSet.header[i].sort)
				{
					tableStr+='<th class="'+this.id+'_column_'+ i + '" style="width:'+header.width+'" ><a id="'+this.id+'_'+i+
						'" href="#" onclick="return false;">'+ name+'</a></th>';
				}
				else
				{
					tableStr+='<th class="'+this.id+'_column_'+ i + '" style="width:'+header.width+'" >'+ name +'</th>';
				}
			}
			tableStr += '</tr></thead><tbody>';
			var cnt=0;
			for(var i=(this.page-1)*this.blockNum;i<this.sortedData.length;i++){
				if(cnt >= this.blockNum) {
					break;
				}
				var odd=""; 
				if(cnt%2) {
					odd=' class="odd" ';
				}
				var idx = this.sortedData[i];
			  var	row = this.dataSet.data[idx];
				tableStr+='<tr id="'+this.id+'_tr_'+cnt+'"'+odd+'>';
				tableStr+='<td id="'+this.id+'_td_'+cnt+'_num" >'+(i+1).toString()+'</td>';
				for(var j=0;j<row.length;j++){
					tableStr+='<td id="'+this.id+"_td_"+cnt+"_"+j+'" class="'+this.id+'_column_'+j+'" >'+row[j]+'</td>';
				}
				tableStr+='</tr>';
				cnt++;
			}
			tableStr += '</tbody></table></div>';
			$('#'+this.id).append(tableStr);
			var self = this;
			for(var i=0;i<this.dataSet.header.length;i++)
			{
				elem = $('#' + this.id+"_"+i.toString());
				if(elem.length > 0)
				{
					elem.click(function(event){self.sortData(event.target);});
				}
			}
		}
		else
		{
			for(var i=0;i<this.dataSet.header.length;i++){
				var header_elem  = $('#' + this.id+"_"+i);
				var title  = this.dataSet.header[i].name;
				if(i==this.sort_col){
					if(this.order=="asc"){
						title = "▲"+title;
					}else{
						title = "▼"+title;
					}
				}
				if(this.dataSet.header[i].sort){
					header_elem.html(title);
				}
			}
			var disp_num=0;
			for(var i=(this.page-1)*this.blockNum;i<this.sortedData.length;i++,disp_num++){
				if(disp_num >= this.blockNum){
					break;
				}
				$('#'+this.id+'_tr_'+disp_num).show();
				$('#'+this.id+'_td_'+disp_num + "_num").html(i+1);
				var idx = this.sortedData[i]
					row = this.dataSet.data[idx];
				for(var j=0;j<row.length;j++) {
					$('#'+this.id+"_td_"+disp_num+"_"+j).html(row[j]);
				}
			}
			for(;disp_num<this.blockNum;disp_num++) {
				if($('#'+this.id+'_tr_'+disp_num).length > 0){
					$('#'+this.id+'_tr_'+disp_num).hide();
				}
			}
		}
	}
	if(this.callback){
		this.callback();
	}
};
SortableTable.prototype.makePagination = function(){
	if(!this.totalPageNum)
	{
		total=0;
		var ids = new Array();
		divStr="<div class='paginate'>";
		total = this.dataSet.data.length;
		divStr+= "<div>全レコード数:<span class='record_count'>"+this.dataSet.data.length.toString() + "</span>件</div>";
		if(total > this.blockNum)
		{
			this.totalPageNum=Math.floor((total-1)/this.blockNum+1);
			divStr+='<a href="#" onclick="return false;" id="'+this.id+'_before">&lt;前へ</a>';
			ids.push(this.id+'_before');
			for(var i=1;i<=this.totalPageNum;i++)
			{
				divStr+='<a href="#" onclick="return false;" id="'+this.id+'_link_'+i+'">'+i+'</a>';
				ids.push(this.id+'_link_'+i);
			}
			divStr+='<a href="#" onclick="return false;" id="'+this.id+'_next">次へ&gt;</a>';
			ids.push(this.id+'_next');
		}
		else
		{
			this.totalPageNum = 1;
		}
		divStr+="</div>";
		$('#'+this.id).html(divStr);
		var self = this;
		for(var i=0;i<ids.length;i++)
		{
			$('#'+ids[i]).click(function(event){self.changePage(event.target)});
		}
	}
	if(this.totalPageNum >1)
	{
		if(this.page == 1)
		{
			$('#'+this.id+'_before').addClass("noLink");
		}
		else
		{
			$('#'+this.id+'_before').removeClass("noLink");
		}
		if(this.page == this.totalPageNum)
		{
			$('#'+this.id+'_next').addClass("noLink");
		}
		else
		{
			$('#'+this.id+'_next').removeClass("noLink");
		}
		for(var i=1;i<=this.totalPageNum;i++)
		{
			if(i==this.page)
				$('#'+this.id+'_link_'+i).addClass("noLink");
			else
				$('#'+this.id+'_link_'+i).removeClass("noLink");
		}
	}
};
SortableTable.prototype.changePage = function(el){
	var elem = $(el);
	if(elem.hasClass("noLink")){
		return;
	}
	index=elem.attr('id').match(/_\d*$/);
	if(!index) {
		var cmd =elem.attr('id').match(/_before$/);
		if(cmd){
			this.page = this.page - 1;
		}
		else
		{
			this.page = this.page + 1;
		}
	}
	else
	{
		this.page=parseInt(index[0].substring(1),10);
	}
	this.makeTable();
};
SortableTable.prototype.compareAsc = function(a,b){
	if(a < b)
	{
		return -1;
	}
	else if(a > b)
	{
		return 1;
	}
	return 0;
};
SortableTable.prototype.compareDesc = function(a,b){
	if(a > b)
	{
		return -1;
	}
	else if(a < b)
	{
		return 1;
	}
	return 0;
};
SortableTable.prototype.compareArrayAsc = function(arr_a,arr_b){
	if(arr_a == null || arr_b == null)
	{
		if(arr_a == null && arr_b == null)
		{
			return 0;
		}
		if(arr_a == null)
		{
			return -1;
		}
		return 1;
	}
	if(arr_a.length < arr_b.length)
	{
		return -1;
	}
	else if(arr_a.length > arr_b.length)
	{
		return 1;
	}
	return 0;
};
SortableTable.prototype.compareArrayDsc = function(arr_a,arr_b){
	if(arr_a == null || arr_b == null)
	{
		if(arr_a == null && arr_b == null)
		{
			return 0;
		}
		if(arr_b == null)
		{
			return -1;
		}
		return 1;
	}
	if(arr_a.length > arr_b.length)
	{
		return -1;
	}
	else if(arr_a.length < arr_b.length)
	{
		return 1;
	}
	return 0;
};
SortableTable.prototype.compareNormal = function(that,order,idx,rec_a,rec_b){
	var a=that.dataSet.data[rec_a];
	var b=that.dataSet.data[rec_b];
	if(order == "asc")
	{
		return that.compareAsc(a[idx],b[idx]);
	}
	return that.compareDesc(a[idx],b[idx]);
};
SortableTable.prototype.compareNumeric = function(that,order,idx,rec_a,rec_b){
	var a= that.dataSet.data[rec_a];
	var b= that.dataSet.data[rec_b];
	var arr_a = a[idx].match(/\d+/g)
		var arr_b = b[idx].match(/\d+/g)
		var ret = null;
	if(order == "asc")
	{
		ret = that.compareArrayAsc(arr_a,arr_b);
	}else
	{
		ret = that.compareArrayDsc(arr_a,arr_b);
	}
	if(ret != 0){
		return ret;
	}
	var int_arr_a = arr_a.map(function(n){ return parseInt(n,10);});
	var int_arr_b = arr_b.map(function(n){ return parseInt(n,10);});
	var compareMethod = null;
	if(order == "asc"){
		compareMethod = that.compareAsc;
	}else
	{
		compareMethod = that.compareDesc;
	}
	for(var i=0;i<arr_a.length;i++)
	{
		ret = compareMethod(int_arr_a[i],int_arr_b[i]);
		if(ret != 0)
		{
			return ret;
		}
	}
	return 0;
};
SortableTable.prototype.sortData = function(el){
	var elem = $(el);
	index=elem.attr('id').match(/_\d*$/);
	if(!index)
		return;
	var idx=parseInt(index[0].substring(1),10);
	if(this.sort_col == idx)
	{
		if(this.order=="asc")
		{
			this.order="desc";
		}
		else
		{
			this.order="asc";
		}
	}
	else
	{
		this.sort_col = idx;
		this.order="asc";
	}
	if(! this.sortStored[this.order + this.sort_col]){
		var compareIndex = null;
		if(this.dataSet.header[idx].sort == "normal"){
			compareIndex = this.curry(this.compareNormal)(this,this.order,this.sort_col);
		}
		else{
			compareIndex = this.curry(this.compareNumeric)(this,this.order,this.sort_col);
		}
		this.sortStored[this.order + this.sort_col] = this.arrayClone(this.origSortData).sort(compareIndex);
	}
	this.sortedData = this.sortStored[this.order + this.sort_col];
	this.page=1;
	this.makeTable();
};

SortableTable.prototype.arrayClone = function(obj){
	return Array.apply(null,obj)
};
SortableTable.prototype.curry = function(f) {
	if (f.length == 0) return f;
	function iterate(args) {
		if (args.length >= f.length)
			return f.apply(null, args);
		return function () {
			return iterate(args.concat(Array.prototype.slice.call(arguments)));
		};
	}
	return iterate([]);
};
