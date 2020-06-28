<?php
date_default_timezone_set("America/Tegucigalpa");
setlocale(LC_TIME, 'es_HN');

$environment = 'XploreDeliveryAPIDesa';
//$environment = 'XploreDeliveryAPI';

if (isset($_GET['function'])) {
    $func = $_GET['function'];
    if ($func == 'getCategories') {
        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/categories/list";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    } else if ($func == 'getTarifas') {
        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/getTarifas";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    } else if ($func == 'getRecargos') {
        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/getRecargos";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    } else if ($func == 'listVehicles') {

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/vehicles/list";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        /* set the content type json */

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    } else if ($func == 'listStates') {

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/states/list";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        /* set the content type json */

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    }
} else if (file_get_contents('php://input')) {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    if ($_POST['function'] == 'insertDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/new";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function'] == 'searchPlace') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "https://calculadoradelivery.xplorerentacar.com/mod.ajax/places.php";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $array);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:multipart/form-data'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    } else if ($_POST['function'] == 'calculateDistance') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "https://calculadoradelivery.xplorerentacar.com/mod.ajax/distance.php";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $array);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:multipart/form-data'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    } else if ($_POST['function'] == 'login') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/auth/login";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function'] == 'assignDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/assign";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function'] == 'finishDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/finish";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function'] == 'changeState') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/changeState";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function']  == 'logout') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/auth/logout";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];


        /* set the content type json */
        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getCustomerDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/getMyDeliveries";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getCustomerBranchOffices') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/getMyBranchOffices";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'insertCustomerDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/newCustomerDelivery";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getDeliveryById') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/getById";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'showAllCategories') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/categories/showAll";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'editCategory') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/categories/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'editRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/rates/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getCustomerOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/getCustomerOrders";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getCustomers') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'newCustomer') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/new";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'newBranch') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/newBranch";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'changeCustomerPassword') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/changePassword";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'updateBranch') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/updateBranch";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'deleteBranch') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/deleteBranch";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getTodayOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/todayOrders";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/getOrders";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'createCategory') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/categories/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'createRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/rates/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getMyRates') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/getMyRates";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getMySurcharges') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/getMySurcharges";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'createSurcharge') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/surcharges/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'editSurcharge') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/surcharges/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getMyCategories') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/getMyCategories";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getDrivers') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/drivers/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'createDriver') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/drivers/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'editDriver') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/drivers/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'editCustomer') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/customers/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getPendingDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/getPendingDeliveries";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getCities') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/cities/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getAgencies') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/agencies/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'changeHour') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/deliveries/changeHour";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'reportOrdersByDriver') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/reports/ordersByDriver";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'createPayment') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/payments/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getPayments') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/payments/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getPaymentTypes') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/payments/listTypes";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'removeCustomerFromRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/rates/removeCustomer";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getRateCustomers') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/" . $environment . "/api/rates/getCustomer";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'addCustomerToRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        "http://190.4.56.14/" . $environment . "/api/rates/addCustomer";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }
}
}
