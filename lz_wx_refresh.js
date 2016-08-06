(function(){
	var elem = document.createElement("div");
	var elemCss = {
		'position' : 'fixed',
		'right' : '10px',
		'bottom' : '10px',
		'width' : '35px',
		'height' : '35px',
		'line-height' :'35px',
		'text-align' : 'center',
		'background' : 'rgba(0,0,0,0.6)',
		'color' : 'white',
		'z-index' : '99999'
	}
	
	for (var i in elemCss) {
		elem.style[i] = elemCss[i];
	}
	
	elem.addEventListener("click",function(){
		location.reload(true);
	},false);
	
	elem.textContent = "刷新";
	document.body.appendChild(elem);
})();
