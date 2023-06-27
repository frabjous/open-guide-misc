<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see 
// https://www.gnu.org/licenses/.

session_start();
require 'send-as-json.php';

$json = file_get_contents('php://input') ?? false;
if ($json === false) {
    rage_quit(new StdClass(), 'JSON not posted.',400);
}
$data = json_decode($json) ?? false;
if ($data === false) {
    rage_quit(new StdClass(), 'Could not parse posted JSON.', 400);
}
if (!isset($data->folder)) {
    
}

$dir = $data->folder;
if ($dir == '') {
    $dir = getenv('HOME') ?? '';
}
if ($dir == '') {
    $dir = '/home';
}

if (file_exists("../php/libauthentication.php")) {
    require "../php/libauthentication.php";
    if (!has_authentication("$dir")) {
        rage_quit(new StdClass(), "no authority to see files");
    }
}

chdir($dir);
$files = scandir($dir);
$realdir = getcwd();
$listData = array();

function mycmp($a, $b) {
    if ($a == '..') {
        return -1;
    }
    if ($b == '..') {
        return 1;
    }
    if ((substr($a,0,1) == '.') and (substr($b,0,1) != '.')) {
        return 1;
    }
    if ((substr($b,0,1) == '.') and (substr($a,0,1) != '.')) {
        return -1;
    }
    if ((is_dir($a)) and (!(is_dir($b)))) {
        return -1;
    }
    if ((is_dir($b)) and (!(is_dir($a)))) {
        return 1;
    }
    return strcasecmp($a, $b);
}

usort($files, "mycmp");

for ($i=0; $i<count($files); $i++) {
    if ($files[$i] != '.') {
        $x = new stdClass();
        $x->dirName = $dir;
        $x->name = $files[$i];
        $x->isFolder = (is_dir($files[$i]));
        array_push($listData, $x);
    }
}

$rv = new StdClass();
$rv->listData = $listData;
$rv->dir = $realdir;
$rv->error = false;
send_as_json($rv, 200);
exit(0);
