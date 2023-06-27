<?php
// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see 
// https://www.gnu.org/licenses/.

function pipe_to_command($cmd, $pipe_text) {

   $rv = new StdClass();

   $descriptorspec = array(
      0 => array("pipe", "r"), // stdin
      1 => array("pipe", "w"), // stdout
      2 => array("pipe", "w")  // stderr
   );

   $process = proc_open($cmd, $descriptorspec, $pipes);

   if (is_resource($process)) {
      fwrite($pipes[0], $pipe_text);
      fclose($pipes[0]);

      $rv->stdout = stream_get_contents($pipes[1]);
      $rv->stderr = stream_get_contents($pipes[2]);
      fclose($pipes[1]);
      fclose($pipes[2]);

      $rv->returnvalue = proc_close($process);
   }

   return $rv;
}
