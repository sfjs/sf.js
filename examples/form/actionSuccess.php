<?
header('Content-type: application/json');
$response = [
    'status' => 200,
    'message' => 'common answer goes here',
];

echo json_encode($response);

?>

