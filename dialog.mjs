// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see
// https://www.gnu.org/licenses/.

/////////////////////// fetch.mjs //////////////////////////////////////
// Some functions can be used to create very simple UI dialog widgets //
////////////////////////////////////////////////////////////////////////

import fetch from './fetch.mjs';

// NOTE: this expects that Google's material symbol outline icons
// are available; it also assumes standard color names are defined
// as variables, e.g., var(--blue)

// initiate the "namespace"
const ogDialog = {};

// blurs all current points of possible focus so focus can
// be on new element
ogDialog.blurall = function() {
    const inputs = document.getElementsByTagName("input");
    for (let i=0; i < inputs.length; i++) {
        inputs[i].blur();
    }
    const as = document.getElementsByTagName("a");
    for (const i=0; i < as.length; i++) {
        as[i].blur();
    }
}

// generic function for creating DOM elements
ogDialog.newelem = function(
        tagType, parNode, styclasses = [], idToUse = "none"
) {
    const newNode = document.createElement(tagType);
    parNode.appendChild(newNode);
    if (idToUse != 'none') {
        newNode.id = idToUse;
    }
    for (let i = 0; i < styclasses.length; i++) {
        newNode.classList.add(styclasses[i]);
    }
    return newNode;
}

// generic function for alerts
ogDialog.alertdiag = function(s,
    iconname = "info",
    icondivcls = "alert",
    buttonText = "OK"
) {
    ogDialog.blurall();
    const bigDiv = ogDialog.newelem("div", document.body, ["alertbg"]);
    const smallDiv = ogDialog.newelem("div", bigDiv, ["alertbox"]);
    smallDiv.innerHTML = '<div class="og-diag-icon ' + icondivcls +
        '"><span class="material-symbols-outlined">' + iconname + '</span>' +
        '</div><div><span>' + s + '</span></div>';
    const alertButton =
        ogDialog.newelem("button", smallDiv, ["alertbutton"]);
    alertButton.type = "button";
    alertButton.myBDiv = bigDiv;
    alertButton.innerHTML = buttonText;
    alertButton.onclick = function() {
        this.myBDiv.parentNode.removeChild(this.myBDiv);
    }
}

// alert of the error variety
ogDialog.errdiag = function(s, buttonText = "OK" ) {
    ogDialog.alertdiag(s, 'warning', 'error', buttonText);
}

// yes/no prompt with two callbacks
ogDialog.yesno = function(
    prmpt,
    yesCallBack,
    noCallBack = function() {},
    yestext = "yes",
    notext = "no") {
	ogDialog.blurall();
    const bigDiv = ogDialog.newelem("div", document.body, ["alertbg"]);
    const smallDiv = ogDialog.newelem("div", bigDiv, ["alertbox"]);
    smallDiv.innerHTML= '<div class="og-diag-icon questionicon">' +
        '<span class="material-symbols-outlined">help</span></div>' +
        '<div><span>' + prmpt + '</span></div>';
	const yesButton = ogDialog.newelem("button", smallDiv, ["alertbutton"]);
    yesButton.type = "button";
    yesButton.myBDiv = bigDiv;
    yesButton.innerHTML = yestext;
    yesButton.onclick = function() {
        yesCallBack();
        this.myBDiv.parentNode.removeChild(this.myBDiv)
    };
	const noButton = ogDialog.newelem("button", smallDiv, ["alertbutton"]);
    noButton.type = "button";
    noButton.myBDiv = bigDiv;
    noButton.innerHTML = notext;
    noButton.onclick = function() {
        noCallBack();
        this.myBDiv.parentNode.removeChild(this.myBDiv)
    };
}

// fills in the choices after receiving response from
// server about possible file choices
ogDialog.updatefilechooser = function(listData, dirname) {
   const chooseTable = document.getElementById("ogfilechooser");

    // give error if no access permitted to folder
    if (listData === 'notallowed') {
        chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
        ogErrAlert("You are not allowed to view that folder.");
        return;
    }

    // update name of directory
    if (chooseTable.fnpath) {
        let dirtoshow = dirname;
        if (chooseTable.origdirname == '') {
            chooseTable.origdirname = dirname;
        }
        // hide base folder name
        const origlen = chooseTable.origdirname.length;
        if ((dirname.length >= origlen) && (
            dirname.substring(0, origlen) == chooseTable.origdirname
        )) {
            dirtoshow = dirname.substring(origlen + 1);
        }
        chooseTable.fnpath.innerHTML = dirtoshow +
            ((dirtoshow != '' && dirtoshow != '/') ? '/' : '');
        chooseTable.dirname = dirname;
    }

    for (let i=0; i<listData.length; i++) {
        // don't let them choose a filename that already exists to save
        if (chooseTable.newfile && !listData[i].isFolder) {
            continue;
        }
        const tr = ogDialog.newelem("tr", chooseTable);
        const td = ogDialog.newelem("td", tr);
        td.myBDiv = chooseTable.myBDiv;
        td.myCallback = chooseTable.myCallback;
        td.basename = listData[i].name;
        td.dirname = listData[i].dirName;
        td.myName = listData[i].dirName + '/' + listData[i].name;
        td.newPrompt = chooseTable.myPrompt;
        if (listData[i].name.charAt(0) == ".") {
            td.classList.add("hiddenfile");
        }
        if (listData[i].isFolder) {
            td.innerHTML = '<span class="material-symbols-outlined">' +
                'folder</span>' + listData[i].name;
            td.onclick = function() {
                this.myBDiv.parentNode.removeChild(this.myBDiv);
                ogDialog.filechoose(
                    this.myCallback,
                    this.myName,
                    this.newPrompt,
                    chooseTable.newfile,
                    chooseTable.gflLocation,
                    chooseTable.origdirname
                );
            }
        } else {
            td.innerHTML = '<span class="material-symbols-outlined">' +
                'description</span>' + listData[i].name;
            td.onclick = function() {
                this.myBDiv.parentNode.removeChild(this.myBDiv);
                this.myCallback(this.dirname, this.basename);
            }
        }
    }
}

// creates a dialogue from choosing server-side files
ogDialog.filechoose =  async function (
    callback = function(dn,bn){},
    startdir = "",
    prmpt = "Choose a file:",
    newfile = false,
    gflLocation = 'open-guide-misc/get-file-list.php',
    origstartdir = ''
) {
    ogDialog.blurall();
    const bigDiv = ogDialog.newelem("div", document.body, ["alertbg"]);
    const smallDiv = ogDialog.newelem("div", bigDiv, ["alertbox"]);
    smallDiv.innerHTML = '<div class="og-diag-icon filechooseicon">' +
        '<span class="material-symbols-outlined">' +
        'folder_open</span></div><div><span>' + prmpt + '</span></div>';
    let fninput = {}; let fnpath = {};
    if (newfile) {
        let fncontainer = ogDialog.newelem('div', smallDiv, ["filenamecontainer"]);
        fnpath = ogDialog.newelem('span', fncontainer, ["filenamepath"]);
        fninput = ogDialog.newelem('input', fncontainer, ["filenameinput"]);
        fninput.type = 'text';
        fninput.value = '';
        fninput.onchange = function() {
            if (!this?.myTable?.verifyAndSelect) { return; }
            this.myTable.verifyAndSelect();
        }
        fninput.onkeydown = function() {
            this.classList.remove("invalid");
        }
    }
    const cTW = ogDialog.newelem("div", smallDiv, ["choosetablewrapper"]);
    const chooseTable = ogDialog.newelem("table", cTW, ["choosetable"]);
    chooseTable.id = 'ogfilechooser';
    chooseTable.myCallback = callback;
    chooseTable.myBDiv = bigDiv;
    chooseTable.myPrompt = prmpt;
    chooseTable.dirname = startdir;
    if (origstartdir == '') {
        chooseTable.origdirname = startdir;
    } else {
        chooseTable.origdirname = origstartdir;
    }
    chooseTable.gflLocation = gflLocation;
    chooseTable.newfile = newfile;
    if (newfile) {
        chooseTable.fninput = fninput;
        fninput.myTable = chooseTable;
        chooseTable.fnpath = fnpath;
        chooseTable.startdir = startdir;
    }
    chooseTable.verifyAndSelect = function() {
        if (!this?.fninput) { return; }
        let fn = this.fninput.value;
        if (fn == '.' || fn == '..' || fn == '') {
            this.fninput.classList.add("invalid");
            return;
        }
        chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
        chooseTable.myCallback(this.dirname , fn);
    }
    let submitButton = {};
    if (newfile) {
        submitButton = ogDialog.newelem(
            "button", smallDiv, ["submitbutton"]
        );
        submitButton.type = "button";
        submitButton.myBDiv = bigDiv;
        submitButton.innerHTML = 'save';
        submitButton.myTable = chooseTable;
        submitButton.onclick = function() {
            if (!this?.myTable?.verifyAndSelect) { return; }
            this.myTable.verifyAndSelect();
        }
    }
    const alertButton = ogDialog.newelem(
        "button", smallDiv, ["alertbutton"]
    );
    alertButton.type = "button";
    alertButton.myBDiv = bigDiv;
    alertButton.innerHTML = 'cancel';
    alertButton.onclick = function() {
        this.myBDiv.parentNode.removeChild(this.myBDiv);
        callback('---','---');
    }
    const fetchResult = await fetch(
        gflLocation, { folder: startdir }
    );
    if ((!"error" in fetchResult) || (fetchResult.error)) {
        chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
        ogDialog.errdiag('ERROR: ' + (fetchResult?.errMsg
            ?? 'Unknown error.'));
        return;
    }
    if ((!"respObj" in fetchResult) ||
        (!"listData" in fetchResult?.respObj)) {
        chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
        ogDialog.errdiag('ERROR: Invalid response from server.');
        return;
    }
    if (("error" in fetchResult.respObj) && (fetchResult.respObj.error)) {
        chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
        ogDialog.errdiag('ERROR: ' + (fetchResult?.respObj?.errMsg ??
            'Unknown error.'));
    }
    if (!"dir" in fetchResult?.respObj) {
        chooseTable.myBDiv.parentNode.removeChild(chooseTable.myBDiv);
        ogDialog.errdiag('ERROR: Server did not specify directory.');
        return;
    }
    ogDialog.updatefilechooser(
        fetchResult.respObj.listData,
        fetchResult.respObj.dir
    );
}

ogDialog.listselect = function(optionList = [],
    prmpt = "undefined", callback = function(){}) {
    ogDialog.blurall();
    var bigDiv = ogDialog.newelem("div", document.body, ["alertbg"]);
    var smallDiv = ogDialog.newelem("div", bigDiv, ["alertbox"]);
    smallDiv.innerHTML = '<div class="og-diag-icon questionicon">' +
        '<span class="material-symbols-outlined">help</span></div>' +
        '<div><span>' + prmpt + '</span></div>';
    var cTW = ogDialog.newelem("div", smallDiv, ["choosetablewrapper"]);
    var chooseTable = ogDialog.newelem("table", cTW, ["choosetable"]);
    for (var i=0; i<optionList.length; i++) {
        var tr = ogDialog.newelem("tr", chooseTable);
        var td = ogDialog.newelem("td", tr);
        td.myBDiv = bigDiv;
        td.myCallback = callback;
        td.innerHTML = optionList[i];
        td.myVal = optionList[i];
        td.onclick = function() {
            this.myBDiv.parentNode.removeChild(this.myBDiv);
            this.myCallback(this.myVal);
        }
    }
    var alertButton = ogDialog.newelem("button", smallDiv, ["alertbutton"]);
    alertButton.type = "button";
    alertButton.myBDiv = bigDiv;
    alertButton.innerHTML = 'cancel';
    alertButton.onclick = function() {
        this.myBDiv.parentNode.removeChild(this.myBDiv);
    }
}

ogDialog.waitscreen = function() {
	ogDialog.blurall();
    var bigDiv = ogDialog.newelem(
        "div", document.body, ["alertbg"], "ogdialogwaitscreen"
    );
    var smallDiv = ogDialog.newelem("div", bigDiv, ["alertbox"]);
    var waitmsg  = ogDialog.newelem("div", smallDiv);
    waitmsg.innerHTML = 'Please wait &hellip;<br>' +
        '<span class="material-symbols-outlined spinning">settings</span>';
}

ogDialog.removewait = function() {
   if (document.getElementById("ogdialogwaitscreen")) {
      document.getElementById("ogdialogwaitscreen")
        .parentNode.removeChild(document.getElementById("ogdialogwaitscreen"));
   }
}

ogDialog.popupform = function(
    formhtml,
    allowClose = true,
    closeText = 'close <span class="material-symbols-outlined">close</span>')
{
    ogDialog.blurall();
    var bigDiv = ogDialog.newelem("div", document.body, ["alertbg"]);
    bigDiv.closeMe = function() {
        this.parentNode.removeChild(this);
    }
    var smallDiv = ogDialog.newelem("div", bigDiv, ["alertbox"]);
    var formHolder = ogDialog.newelem("div",smallDiv,["popupformholder"]);
    formHolder.innerHTML = formhtml;
    if (allowClose) {
        var closeClicky = ogDialog.newelem("div",smallDiv,["popupformcloser"]);
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

window.ogDialog = ogDialog;
export default ogDialog;
