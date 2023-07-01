<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see 
// https://www.gnu.org/licenses/.

////////////////////// send-as-json.php /////////////////////////////////
// Simple and straightforward functions for relay json back to browser //
/////////////////////////////////////////////////////////////////////////

// defines a few standard http reponses
const HTTP_STATUSES = [
    200 => 'OK',
    400 => 'Bad Request',
    404 => 'Not Found',
    405 => 'Method Not Allowed'
];

// create an error in the response and send it
function rage_quit($obj, $error = 'Unknown error', $status = 400) {
    if (!$obj instanceof StdClass) {
        $obj = new StdClass();
    }
    $obj->error = true;
    $obj->errMsg = $error;
    send_as_json($obj, $status);
    exit;
}

// outputs an object as json
function send_as_json($obj, $status = 200) {
    header('HTTP/1.1 ' . strval($status) . ' ' . HTTP_STATUSES[$status]);
    header('Content-Type: application/json');
    echo json_encode($obj);
}
