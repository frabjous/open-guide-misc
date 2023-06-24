function blurAll() {
    var inputs=document.getElementsByTagName("input");
    for (var i=0; i<inputs.length; i++) {
        inputs[i].blur();
    }
    var as=document.getElementsByTagName("a");
    for (var i=0; i < as.length; i++) {
        as[i].blur();
    }
}

function creAdd(tagType, parNode, styclasses, idToUse) {
    if (typeof styclasses === "undefined") styclasses = [];
    if (typeof idToUse === "undefined") idToUse = "none";
    var newNode = document.createElement(tagType);
    parNode.appendChild(newNode);
    if (idToUse != 'none') {
        newNode.id = idToUse;
    }
    for (var i = 0; i < styclasses.length; i++) {
        newNode.classList.add(styclasses[i]);
    }
    return newNode;
}

function kckAlert(s, iconname, icondivcls, buttonText ) {
    if (typeof iconname === "undefined") iconname = "info.svg";
    if (typeof icondivcls === "undefined") icondivcls = "alerticon";
    if (typeof buttonText === "undefined") buttonText = "OK";
	blurAll();
    var bigDiv = creAdd("div", document.body, ["alertbg"]);
    var smallDiv = creAdd("div", bigDiv, ["alertbox"]);
    smallDiv.innerHTML = '<div class="kckdiagicon ' + icondivcls + '"><img src="/icons/mono/' + iconname + '" alt="icon" /></div><div><span>' + s + '</span></div>';
    var alertButton = creAdd("button", smallDiv, ["alertbutton"]);
    alertButton.type = "button";
    alertButton.myBDiv = bigDiv;
    alertButton.innerHTML = buttonText;
    alertButton.onclick = function() {
        this.myBDiv.parentNode.removeChild(this.myBDiv);
    }
}

function kckErrAlert(s, buttonText ) {
    if (typeof buttonText === "undefined") buttonText = "OK";    
    kckAlert(s, 'alert.svg', 'erroricon', buttonText);
}

function kckYesNoBox(prmpt, yesCallBack, noCallBack, yestext, notext ) {
    if (typeof noCallBack === "undefined") noCallBack = function(){};
    if (typeof yestext === "undefined") yestext = "yes";
    if (typeof notext === "undefined") notext = "no";
	blurAll();
    var bigDiv = creAdd("div", document.body, ["alertbg"]);
    var smallDiv = creAdd("div", bigDiv, ["alertbox"]);                                         
    smallDiv.innerHTML = '<div class="kckdiagicon questionicon"><img src="/icons/mono/question.svg" alt="?" /></div><div><span>' + prmpt + '</span></div>';
	var yesButton = creAdd("button", smallDiv, ["alertbutton"]);
    yesButton.type = "button";
    yesButton.myBDiv = bigDiv;
    yesButton.innerHTML = yestext;
    yesButton.onclick = function() { yesCallBack(); this.myBDiv.parentNode.removeChild(this.myBDiv) };
	var noButton = creAdd("button", smallDiv, ["alertbutton"]);       
    noButton.type = "button";
    noButton.myBDiv = bigDiv;
    noButton.innerHTML = notext;
    noButton.onclick = function() { noCallBack(); this.myBDiv.parentNode.removeChild(this.myBDiv) };                                         
}

function updateFileChooser(text) {
   var chooseTable = document.getElementById("kckfilechooser");
   if (text.trim() == "notallowed") {
       chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
       kckErrAlert("You are not allowed to view that folder.");
       return;
   }
    
   var listData = JSON.parse(text);
   for (var i=0; i<listData.length; i++) {
      var tr = creAdd("tr", chooseTable);
      var td = creAdd("td", tr);
      td.myBDiv = chooseTable.myBDiv;
      td.myCallback = chooseTable.myCallback;
      td.myName = listData[i].dirName + '/' + listData[i].name;
      td.newPrompt = chooseTable.myPrompt;
      if (listData[i].name.charAt(0) == ".") {
          td.classList.add("hiddenfile");
      }
      if (listData[i].isFolder) {
            td.innerHTML = '<img src="/icons/mono/folder.svg" alt="file" /> ' + listData[i].name;
            td.onclick = function() {
               this.myBDiv.parentNode.removeChild(this.myBDiv);
               kckFileChoose(this.myCallback, this.myName, this.newPrompt);
            }
      } else {
            td.innerHTML = '<img src="/icons/mono/file.svg" alt="[FOLDER]" />' + listData[i].name;
            td.onclick = function() {
               this.myBDiv.parentNode.removeChild(this.myBDiv);  
               this.myCallback(this.myName);
            }
      }      
   }
}

function kckFileChoose(callback, startdir, prmpt) {
   if (typeof callback === "undefined") callback = function(fn){};
   if (typeof startdir === "undefined") startdir = "/home";
   if (typeof prmpt === "undefined") prmpt = "Choose a file:";
   blurAll();
   var bigDiv = creAdd("div", document.body, ["alertbg"]);
   var smallDiv = creAdd("div", bigDiv, ["alertbox"]);
   smallDiv.innerHTML = '<div class="kckdiagicon filechooseicon"><img src="/icons/mono/folder_open.svg" alt="Open" /></div><div><span>' + prmpt + '</span></div>';
   var cTW = creAdd("div", smallDiv, ["choosetablewrapper"]);
   var chooseTable = creAdd("table", cTW, ["choosetable"]);
   chooseTable.id = 'kckfilechooser';
   chooseTable.myCallback = callback;
   chooseTable.myBDiv = bigDiv;
   chooseTable.myPrompt = prmpt;
   var alertButton = creAdd("button", smallDiv, ["alertbutton"]);
   alertButton.type = "button";
   alertButton.myBDiv = bigDiv;
   alertButton.innerHTML = 'cancel';
   alertButton.onclick = function() {
      this.myBDiv.parentNode.removeChild(this.myBDiv);
   }   
   var fD = new FormData();
   fD.append('folder', startdir);
   AJAXPostRequest('/kcklib/getFileList.php',fD,function(text) {
      updateFileChooser(text);
   });
}

function kckGenericListSelection(optionList, prmpt, callback) {
	blurAll();
    if (typeof optionList === "undefined") optionList = [];
    if (typeof prmpt === "undefined") prmpt = "Choose an option:";
    if (typeof callback === "undefined") callback = function(o){};
    var bigDiv = creAdd("div", document.body, ["alertbg"]);
    var smallDiv = creAdd("div", bigDiv, ["alertbox"]);                                         
    smallDiv.innerHTML = '<div class="kckdiagicon questionicon"><img src="/icons/mono/question.svg" alt="?" /></div><div><span>' + prmpt + '</span></div>';
    var cTW = creAdd("div", smallDiv, ["choosetablewrapper"]);
    var chooseTable = creAdd("table", cTW, ["choosetable"]);
    for (var i=0; i<optionList.length; i++) {
      var tr = creAdd("tr", chooseTable);
      var td = creAdd("td", tr);
      td.myBDiv = bigDiv;
      td.myCallback = callback;
      td.innerHTML = optionList[i];
      td.myVal = optionList[i];
      td.onclick = function() {
         this.myBDiv.parentNode.removeChild(this.myBDiv);  
         this.myCallback(this.myVal);
      }
    }
    var alertButton = creAdd("button", smallDiv, ["alertbutton"]);
    alertButton.type = "button";
    alertButton.myBDiv = bigDiv;
    alertButton.innerHTML = 'cancel';
    alertButton.onclick = function() {
      this.myBDiv.parentNode.removeChild(this.myBDiv);
    }   
   
}

function kckWaitScreen() {
	blurAll();
    var bigDiv = creAdd("div", document.body, ["alertbg"], "kckWaitScreen");
    var smallDiv = creAdd("div", bigDiv, ["alertbox"]);
    var waitmsg = creAdd("div", smallDiv);
    waitmsg.innerHTML = "Please wait &hellip;<br /><img src=\"/icons/bigwait.gif\" alt=\"wait\" />";
}

function kckRemoveWait() {
   if (document.getElementById("kckWaitScreen")) {
      document.getElementById("kckWaitScreen").parentNode.removeChild(document.getElementById("kckWaitScreen"));
   }
}

function kckPopupForm(formhtml, allowClose, closeText) {
    if (typeof formhtml === "undefined") formhtml = '<strong>There should be a form here. ☹</strong>';
    if (typeof allowClose === "undefined") allowClose = true;
    if (typeof closeText === "undefined") closeText = 'close ✖';
    blurAll();
    var bigDiv = creAdd("div", document.body, ["alertbg"]);
    bigDiv.closeMe = function() {
        this.parentNode.removeChild(this);
    }
    var smallDiv = creAdd("div", bigDiv, ["alertbox"]);
    var formHolder = creAdd("div",smallDiv,["popupformholder"]);
    formHolder.innerHTML = formhtml;
    if (allowClose) {
        var closeClicky = creAdd("div",smallDiv,["popupformcloser"]);
        closeClicky.myBDiv = bigDiv;
        closeClicky.formHolder = formHolder;
        closeClicky.innerHTML = closeText;
        closeClicky.onclick = function() {
            this.formHolder.innerHTML = '';
            this.myBDiv.closeMe();
        }
        closeClicky.parentNode.insertBefore(closeClicky,formHolder);
    }
    return bigDiv;
}
