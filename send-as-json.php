<?php

const HTTP_STATUSES = [
    200 => 'OK',
    400 => 'Bad Request',
    404 => 'Not Found',
    405 => 'Method Not Allowed'
];

function rage_quit_json_send($obj, $error = 'Unknown error', $status = 400) {
    if (($obj instanceof StdClass) && (isset($obj->error)) && ($obj->error == false)) {
        $obj->error = true;
    }
    if (($obj instanceof StdClass) && (isset($obj->reason))) {
        $obj->reason = $error;
    }
    send_as_json($obj, $status);
}

function send_as_json($obj, $status = 200) {
    header('HTTP/1.1 ' . strval($status) . ' ' . HTTP_STATUSES[$status]);
    header('Content-Type: application/json');
    echo json_encode($obj);
    exit;
}
