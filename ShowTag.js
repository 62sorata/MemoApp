//let mainTag = document.getElementById("mainTag");  //のID取得
let tagIdName = "";



function showTag() {
    let parentDiv = document.getElementById("addDetails");

    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
    let mainId = document.getElementById("main");
    //let mainTag = document.getElementById("mainTag");  //のID取得
    //mainTag.classList.add("d-none");

    mainId.addEventListener("click", (event) => {
        tagIdName = String(event.target.id);  //クリックしたタグのIDを取得
    } )

    let tagIdNum = tagIdName.slice(6);  //タブの番号を取得

    console.log(tagIdName);

    var transaction = db.transaction(["mystore"], "readwrite");
	var store = transaction.objectStore("mystore");
	var request = store.openCursor();
	
	request.onsuccess = function (event) {
	
		if(event.target.result == null) {
			return;
		}
		
		var cursor = event.target.result;
        var data = cursor.value;
		showMemo({summary:cursor.key, detail:data.myvalue, tabNum:tagIdNum});
		
		cursor.continue();
	}
}


function showMainTag() {
    //mainTag.classList.remove("d-none");
    let parentDiv = document.getElementById("addDetails");

    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }

    var transaction = db.transaction(["mystore"], "readwrite");
	var store = transaction.objectStore("mystore");
	var request = store.openCursor();
	
	request.onsuccess = function (event) {
	
		if(event.target.result == null) {
			return;
		}
		
		var cursor = event.target.result;
        var data = cursor.value;
		showMemo({summary:cursor.key, detail:data.myvalue, tabNum:null});
		
		cursor.continue();
	}
}