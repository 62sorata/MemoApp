function addTage() {
    var newElement = document.createElement("a"); //a要素の作成
    var newContent = document.createTextNode("#");  //タグの内容
    newElement.appendChild(newContent);  //a要素にテキスト追加
    newElement.setAttribute("herf","#");  //a要素にherfを設定
    newElement.setAttribute("class","nav-link");  //a要素にclassの設定

    var addTaget = document.getElementById("addTag");  //親要素の参照
    var MainTag = document.getElementById("Tag");
    addTaget.insertBefore(newElement, MainTag.nextSibling);
}