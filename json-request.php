<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see
// https://www.gnu.org/licenses/.

////////////////// json-request.php /////////////////////////////////////////
// parses json sent as input and destructures the data and makes it global //
/////////////////////////////////////////////////////////////////////////////

require_once(dirname(__FILE__) . '/send-as-json.php');

$sentjson = file_get_contents('php://input');
if ($sentjson === '' || $sentjson === false) {
    jquit('No data sent.');
}

$data = json_decode($sentjson);

if ($data === null) {
    jquit('Could not parse json sent.');
}

if (is_object($data)) {
    foreach ($data as $k => $v) {
        $GLOBALS[$k] = $v;
    }
}

