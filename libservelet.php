<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see
// https://www.gnu.org/licenses/.

///////////////////////// libservelet.php ////////////////////////////////
// library functions for sending files, or outcome of commands from php //
//////////////////////////////////////////////////////////////////////////

// sends a file
// the opts should be an associative array with the following
// "attachmentname" => "nameoffilefordownload.txt", [optional],
// "command" => "command to output result of", [optional],
// "download" => <boolean>, [whether to send as download; optional],
// "filename" => "nameoffile.ext", [to send or use],
// "mimetype" => "something/mimetype", [optional if sending file],
function servelet_send($opts) {
    // cannot send without a filename
    if (!isset($opts["filename"])) {
        return false;
    }
    $filename = $opts["filename"];

    // read or set other variables

    // download defaults to false
    $download = false;
    if (isset($opts["download"])) {
        $download = $opts["download"];
    }
    // attachment name defaults to base of filename
    $attachmentname = basename($filename);
    if (isset($opts["attachmentname"])) {
        $attachmentname = $opts["attachmentname"];
    }
    // don't use a command by default
    $command = false;
    if (isset($opts["command"])) {
        $command = $opts["command"];
    }
    // read mimetype from filename or use what was specified
    $mimetype = '';
    if (file_exists($filename)) {
        $mimetype = mime_content_type($filename);
    }
    if (isset($opts["mimetype"])) {
        $mimetype = $opts["mimetype"];
    }

    // ensure file exists if sending file
    if (!$command && !file_exists($filename)) {
        header('Location: meinongian-file.html');
        exit(0);
    }

    // disable caching
    header('Expires: 0');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    // set content type based on mimetype
    if ($mimetype != '') {
        header('Content-Type: ' . $mimetype);
    }

    // if downloading, make the disposition an attachment
    if ($download) {
        //Use Content-Disposition: attachment to specify the filename
        header('Content-Disposition: attachment; filename='$attachmentname);
    }

    // if not using a command, just send the file
    if (!$command) {
        header('Content-Length: ' . filesize($filename));
        readfile($filename);
        exit(0);
    }

    // output the result of the command
    passthru($command);
}
