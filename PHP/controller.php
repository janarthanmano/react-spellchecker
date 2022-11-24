<?php
require '../vendor/autoload.php';
use Curl\Curl;
header('Access-Control-Allow-Origin: http://localhost:3000');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spell_checker";


if(isset($_POST['word'])) {

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Insert word into dictionary table, with right flag.
    $sql = "INSERT INTO `dictionary` (`word`, `flag`) VALUES ('".$_POST['word']."', '".$_POST['flag']."')";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}

if(isset($_POST['html'])){
    $curl = new Curl();

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $html = strip_tags($_POST['html']);
    $lang = $_POST['lang'];

    //send request to API to get suggestions for spelling.
    $curl->post('http://35.197.120.214:5000/api/v1/spell', [
        'text' => $html,
        'lang' => $lang
    ]);

    $toolTip = '';

    if ($curl->isSuccess()) {
        $suggestions = json_decode($curl->response);
        if(!empty($suggestions)){
            foreach($suggestions as $key1=>$suggestion){
                $sql = "SELECT * FROM `dictionary` WHERE `word`='".$suggestion->original."'";

                $result = $conn->query($sql);

                $row = $result -> fetch_array(MYSQLI_NUM);


                if ($row != null) {
                    continue;
                }

                $suggestion_list = '';
                foreach($suggestion->suggestions as $key2=>$suggestion_text){
                    $suggestion_list .= '<li data-element="'.$suggestion->original.'">'.$suggestion_text.'</li>';
                }
                $toolTip .= '<div class="tool_tip d-none" id="'.$suggestion->original.'"><ul class="suggestions">'.$suggestion_list.'</ul><ul class="actions"><li class="addDictionary" data-element="'.$suggestion->original.'"><i class="fa-regular fa-clipboard"></i>Add to Dictionary</li><li class="ignore" data-element="'.$suggestion->original.'"><i class="fa-regular fa-circle-xmark"></i>Ignore</li></ul></div>';
                $html = str_replace( $suggestion->original, '<u>'.$suggestion->original.'</u>', $html);
            }
        }else{
            echo $html; $curl->close(); exit;
        }
    }else{
        $html = $html.'<u class="test" style="test">test</u>';
    }
    $conn->close();
// ensure to close the curl connection
    $curl->close();

    echo json_encode(array('html' => $html, 'tool_tip' => $toolTip));
    exit;
}