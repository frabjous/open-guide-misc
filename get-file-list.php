<?php

session_start();
$dir = $_POST["folder"];

$poweruser = (
    (
        (isset($_SESSION["poweruser"])) && 
        ($_SESSION["poweruser"])
    ) || 
    (
        (isset($_SESSION["_ke_poweruser"])) && 
        ($_SESSION["_ke_poweruser"])
    )
);

if (!$poweruser) {
    if (!isset($_SESSION["_ke_allowed_folders"])) {
        echo "notallowed";
        exit(1);
    }
    $allowed = false;
    $dirrp = realpath($dir);
    foreach ($_SESSION["_ke_allowed_folders"] as $afolder) {
        if (substr($dirrp, 0, strlen($afolder)) == $afolder) {
            $allowed = true;
            break;
        }
    }
    if (!$allowed) {
        echo "notallowed";
        exit(1);
    }
}

chdir($dir);

$files = scandir($dir);

$retobj = array();

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
        array_push($retobj, $x);
    }
}

echo json_encode($retobj);

?>