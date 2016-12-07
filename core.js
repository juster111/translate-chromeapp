var _posX, _posY, _word = "";
function fn_init(event) {
  _word = fn_CoreGetWord(event);
  setTimeout(function () { fn_checkWord(event); }, 600);
}
function fn_selection(event){
    fn_checkWordBySelection(event,window.getSelection().toString());
} 
function fn_checkWordBySelection(event,pStr) { 
    if (pStr.trim().length > 1) {
      _posX = parseInt(event.pageX-10) + 'px';
      _posY = parseInt(event.pageY-10) + 'px';
      fn_frontendValidate(pStr);
    } 
}

function fn_checkWord(event) {
  if (_word == fn_CoreGetWord(event)) {
    if (_word.trim().length > 1) {
      fn_frontendValidate(_word);
    }
  }
}
function fn_CoreGetWord(event) {
  var i, begin, end, range, textNode, offset;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
    textNode = range.startContainer;
    offset = range.startOffset;
    _posX = parseInt(event.pageX-10) + 'px';
    _posY = parseInt(event.pageY-10) + 'px';
  }
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    return "";
  }

  var data = textNode.textContent;
  if (offset >= data.length) {
    offset = data.length - 1;
  }
  if (fn_isW(data[offset])) {
    $("#translateBox").remove();
    return "";
  }
  i = begin = end = offset;
  while (i > 0 && !fn_isW(data[i - 1])) {
    i--;
  }
  begin = i;
  i = offset;
  while (i < data.length - 1 && !fn_isW(data[i + 1])) {
    i++;
  }
  end = i;
  var word = data.substring(begin, end + 1);
  return word;
};
function fn_isW(s) {
  return /[ -!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]/.test(s);
}
function fn_GetDataByApi(pStr) {
  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: 'http://tooltip.dic.naver.com/tooltip.nhn?wordString=' + pStr.toLowerCase() + '&languageCode=4&nlp=false'
  }, function (responseText) {
    fn_appendDiv(responseText);
  });
}

