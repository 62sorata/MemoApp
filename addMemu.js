var count = 0;
var tagArr = [];

function Onload(event) {  //ページ読み込み時に呼ばれる関数
    
    
    
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

    tagArr[count] = newTag;  //配列に一時保存

    var transaction = db.transaction(["tagstore"], "readwrite");  //DBへ書き込み
	var store = transaction.objectStore("tagstore");  
    var request = store.put({ tagKey: String(count), tagvalue: newTag});  //０～のcountの値をKEYにTagを配列のように格納

    request.onsuccess = function (event) {
        document.getElementById("tag").value = "";
    }

    var newElement = document.createElement("a"); //a要素の作成
    var newContent = document.createTextNode("#"+newTag);  //タグの内容
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