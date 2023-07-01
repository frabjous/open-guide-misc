<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see 
// https://www.gnu.org/licenses/.

/////////////// reversethis.php /////////////////////////////////////////
// a fairly useless script that returns one of its url parameters      //
// reversed; used for periodically testing the server is still working //
/////////////////////////////////////////////////////////////////////////

header('Content-type: text/plain');

if (!isset($_GET["s"])) {
    echo 'ERROR: no string provided.';
    exit(0);
}

$s = $_GET["s"];

echo strrev($s);
exit(0);
