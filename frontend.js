window.addEventListener("mousemove", fn_init, true);
document.addEventListener("mouseup", fn_selection, true);

var _already = ""; 
var idxCount=1;

var db = openDatabase('myDictDb', '1.0', 'local WebSql DB', 3 * 1024 * 1024);
$(document).ready(function () { 
    var msg; 
    db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS sqlDict (id unique, eng, kor)');
//     tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "foobar")'); 
    });

    db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM sqlDict', [], function (tx, results) {
        var len = results.rows.length, i;
        msg = "<p>Found rows: " + len + "</p>";
        console.log(msg); 
            
        for (i = 0; i < len; i++){
            msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
            console.log(msg);
            }
        }, null);
    }); 
}); 
function fn_frontendValidate(pStr) {
    if (_already != pStr) {
        pStr = pStr.replace(/[^\w\s]/gi, '');  //한글은 영어로 해야하나?     
        if (pStr.length > 1) {
            $("#translateBox").remove();
            fn_GetDataByApi(pStr);
            _already = pStr;
        }
    }
}
function fn_appendDiv(pStr) {
    var retApi = JSON.parse(pStr);
    if (retApi.mean) {
        var appendStr = "<b>" + retApi.entryName + "</b> - " + retApi.mean.toString();
        $(document.body).append("<div id=\"translateBox\" style=\"left:" + _posX + "; top:" + _posY + ";  z-index:999;  position:absolute; display:none;\"><input type=\"button\" style=\"background-color:white; color:black; border:2px solid #4CAF50; font-size:10px; padding:12px;\" id=\"btn_Add\" value=\"Add\"  /><span style=\"font-size:12px; font-style:oblique;\"> " + appendStr + "&nbsp; </span></div> ");
        $("#translateBox").css({ "background-color": "lightblue" });
        $("#translateBox").fadeIn();
        $("#btn_Add").click(function () {  
            fn_addToStorage(retApi.entryName, retApi.mean.toString());
        });
    }
}
function fn_addToStorage(eng, kor) {  // 저장 방법 고민.
   
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO sqlDict (id, eng, kor) VALUES ('+idxCount+', "'+eng+'","'+kor+'")'); 
    });
    idxCount +=1;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM sqlDict', [], function (tx, results) {
        var len = results.rows.length, i;
        msg = "<p>Found rows: " + len + "</p>";
        console.log(msg); 
            
        for (i = 0; i < len; i++){
            msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
            console.log(msg);
            }
        }, null);
    }); 
}
