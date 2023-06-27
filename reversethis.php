<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see 
// https://www.gnu.org/licenses/.

header('Content-type: text/plain');

if (!isset($_GET["s"])) {
    echo 'ERROR: no string provided.';
    exit(0);
}

$s = $_GET["s"];

echo strrev($s);
exit(0);
