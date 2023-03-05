var count = 0;
var tagArr = [];

function Onload() {  //ページ読み込み時に呼ばれる関数
    
    
    
    var transaction = db.transaction(["tagstore"], "readwrite");  
    var store = transaction.objectStore("tagstore");
    var n=0;
    var request = store.openCursor();
    
    request.onsuccess = function (event) {
        
        if (event.target.result == null) { //指定したキーが存在していない場合
            count--;
            return;
        }else {  //保存されている分だけタグを増やす
            var cursor = event.target.result;
            var data = cursor.value;
            var newElement = document.createElement("a"); //a要素の作成
            var newContent = document.createTextNode("#" + data.tagvalue);  //タグの内容
            tagArr[count] = data.tagvalue;

            newElement.appendChild(newContent);  //a要素にテキスト追加
            newElement.setAttribute("herf","#");  //a要素にherfを設定
            newElement.setAttribute("class","nav-link");  //a要素にclassの設定
            newElement.setAttribute("id","listId"+count);  //a要素にIdの設定
            var addTaget = document.getElementById("addTag");  //親要素の参照
            var MainTag = document.getElementById("Tag");
            addTaget.insertBefore(newElement, MainTag.nextSibling);
            count++;  //既存の数をカウント
            cursor.continue();
        }
    }
}


function addTage() {

    count++;
    
    var newTag = document.getElementById("tag").value;  //新しいタグを格納
    if(newTag == "") {
        return;
    }
    
    let confValue = 0;
    while(1) {
        if(newTag.slice(confValue,confValue+1) == "") {
            break;
        }else if(newTag.slice(confValue,confValue+1) == "#") { //タグに＃が含まれていた場合
            window.alert("タグ名に＃を入力するのはやめてください");
            return;
        }
        confValue++;

    }

    tagArr[count] = newTag;  //配列に一時保存

    var transaction = db.transaction(["tagstore"], "readwrite");  //DBへ書き込み
	var store = transaction.objectStore("tagstore");  
    var request = store.put({ tagKey: String(count), tagvalue: newTag});  //０～のcountの値をKEYにTagを配列のように格納

    request.onsuccess = function (event) {
        document.getElementById("tag").value = "";
    }

    var newElement = document.createElement("a"); //a要素の作成
    var newContent = document.createTextNode("\#"+newTag);  //タグの内容
    //console.log(newContent);
    newElement.appendChild(newContent);  //a要素にテキスト追加
    newElement.setAttribute("herf","#");  //a要素にherfを設定
    newElement.setAttribute("class","nav-link");  //a要素にclassの設定
    newElement.setAttribute("id","listId"+count);  //a要素にIdの設定

    var addTaget = document.getElementById("addTag");  //親要素の参照
    var MainTag = document.getElementById("Tag");
    addTaget.insertBefore(newElement, MainTag.nextSibling);
}


function deleteTag() {
    let delcount = 0;  //消すリストがあった時のフラグ
    var delTag = document.getElementById("tag").value;  //入力されたタグ名を消す

    if(delTag == "") {  //文字無しの場合は
        return;
    }
    console.log(count);

    for(let n=0; n<=count; n++) {
        let target = document.getElementById("listId"+n);  //listのIDを取得

        if(delTag == tagArr[n]) {  //入力したものがタグにあった場合
            delcount = 1;
            target.remove();  //指定したIDの要素を削除
        }
        
        if(delcount == 1) { //リストを消した場合、配列をずらす必要がある。
            target.id = "listId" + (n-1);
            if(n != count) {  //最大値以外の場合は一つ上の配列を入れる。
                tagArr[n] = tagArr[n+1];

                //DBの置き換え
                var transaction = db.transaction(["tagstore"], "readwrite");  //DBへ書き込み
	            var store = transaction.objectStore("tagstore");  
                var request = store.put({ tagKey: String(n), tagvalue: tagArr[n]});  //０～のcountの値をKEYにTagを配列のように格納

                request.onsuccess = function () {
                    document.getElementById("tag").value = "";
                }
            }else {
                tagArr[n] = "";
                let transaction = db.transaction(["tagstore"], "readwrite");  //DBへ書き込み
	            let store = transaction.objectStore("tagstore");  

                var request = store.delete(String(n));  //一番最後の空いた場所を消す
                delcount = 0;
                count--;
                return;
            }
            
        }
    }
    window.alert("そのタグはありません。");
    
}

// data -> summary, detail, tabNum
function showMemo(data) {  //メモを表示する関数
    let parentDiv = document.getElementById("addDetails");
    let addDetailes = document.createElement("details");
    addDetailes.setAttribute("id",data.summary);
    let addSummary = document.createElement("summary");
    let addDetail = document.createElement("p");

    let MailText = "";
    let mailSubject = "";  //件名を保持する変数
    let showMemoFlag = 0;  //フラグ管理
    let tagConf = "";  //書かれているタグを保持する
    let showFlag = 0;

    

    for(let i=0; i< 100; i++) {  //件名の上限100文字まで繰り返す
        if(data.summary.slice(i,i+1) == "") {  //件名を読み切ったらループから外れる
            break;
        }
        //エスケープ処理
        if(data.summary.slice(i,i+1) == "<"){
            mailSubject = mailSubject + "&lt";
        }else if(data.summary.slice(i,i+1) === ">"){
            mailSubject = mailSubject + "&gt";
        }else if(data.summary.slice(i,i+1) === "&"){
            mailSubject = mailSubject + "&amp";
        }else if(data.summary.slice(i,i+1) === "\""){
            mailSubject = mailSubject + "&quot";
        }else if(data.summary.slice(i,i+1) === "'"){
            mailSubject = mailSubject + "&prime;";
        }else if(data.summary.slice(i,i+1) === "\\"){
            mailSubject = mailSubject + "&#47;";
        }else{
			mailSubject = mailSubject + data.summary.slice(i,i+1);
		}
    }

	for (let i = 0; i < 1000; i++) {  //本文の上限の1000文字まで繰り返す
        //console.log(data.detail.slice(i,i+1));
		if(data.detail.slice(i,i+1) == "") {
			//本文を読み込みきった場合はループから出る。
			break;
		}
        //エスケープ処理
		if(data.detail.slice(i,i+1) === "\n") {
			//改行があった場合
			MailText = MailText + "<br/>";
            if(showMemoFlag == 1) {
                showMemoFlag = 2;
            }
		}else if(data.detail.slice(i,i+1) === "<"){
            MailText = MailText + "&lt";
        }else if(data.detail.slice(i,i+1) === ">"){
            MailText = MailText + "&gt";
        }else if(data.detail.slice(i,i+1) === "&"){
            MailText = MailText + "&amp";
        }else if(data.detail.slice(i,i+1) === "\""){
            MailText = MailText + "&quot";
        }else if(data.detail.slice(i,i+1) === "'"){
            MailText = MailText + "&prime;";
        }else if(data.detail.slice(i,i+1) === "\\"){
            MailText = MailText + "&#47;";
        }else{
			MailText = MailText + data.detail.slice(i,i+1);
		}

        if(data.tabNum != null) {
            if(showMemoFlag == 0) {  //#があればタグを読むようにフラグを立てる
                if(data.detail.slice(i,i+1) === "\#"){
                    showMemoFlag = 1;
                }
            }else if(showMemoFlag == 1) {  //フラグが立っていればタグを読む
                tagConf = tagConf + data.detail.slice(i,i+1);
                if(data.detail.slice(i+1,i+2) == "") {
                    if(tagConf == tagArr[data.tabNum]) {
                        showFlag = 1;
                        tagConf = "";
                        showMemoFlag = 0;
                    }
                }
            }else if(showMemoFlag == 2) {
                if(tagConf == tagArr[data.tabNum]) {
                    showFlag = 1;
                    tagConf = "";
                    showMemoFlag = 0;
                }else{
                    tagConf = "";
                    showMemoFlag = 0;
                }
            }
        }
        
	}

    if(data.tabNum != null){
        if(showFlag != 1) {
            return;
        }
    }
    

    addSummary.innerHTML = mailSubject;
    addDetail.innerHTML = MailText;

    addDetailes.appendChild(addSummary);
    addDetailes.appendChild(addDetail);

    parentDiv.appendChild(addDetailes);

}


