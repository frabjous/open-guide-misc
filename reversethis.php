<?php

header('Content-type: text/plain');

if (!isset($_GET["s"])) {
    echo 'ERROR: no string provided.';
    exit(0);
}

$s = $_GET["s"];

echo strrev($s);
exit(0);
