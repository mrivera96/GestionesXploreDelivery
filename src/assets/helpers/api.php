<?php
date_default_timezone_set("America/Tegucigalpa");
setlocale(LC_TIME, 'es_HN');

//$environment = 'XploreDeliveryAPIDesa';
$environment = 'XploreDeliveryAPI';

if (isset($_GET['function'])) {
    $func = $_GET['function'];
    if ($func == 'getCategories') {
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/categories/list";
        $url = "http://190.4.56.14/".$environment."/api/shared/categories/showAll";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($func == 'getTarifas') {
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/getTarifas";
        $url = "http://190.4.56.14/".$environment."/api/shared/rates/get";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($func == 'getRecargos') {
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/getTarifas";
        $url = "http://190.4.56.14/".$environment."/api/shared/surcharges/get";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);

        curl_close($handle);
    }else if ($func == 'listStates')
    {

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/shared/states/list";


        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    }else if ($func == 'getSchedule') {

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/shared/schedule/get";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json'));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }
} else if (file_get_contents('php://input')) {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    if ($_POST['function'] == 'insertDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/new";
        $url = "http://190.4.56.14/".$environment."/api/deliveries/new";

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
        //$url = "http://190.4.56.14:8069/".$environment."/public/api/deliveries/new";


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

        //$url = "http://190.4.56.14/".$environment."/api/auth/login";
        $url = "http://190.4.56.14/".$environment."/api/auth/login";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function'] == 'assignDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/auth/login";
        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/assign";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];
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

        //$url = "http://190.4.56.14/".$environment."/api/auth/login";
        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/finish";

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

        //$url = "http://190.4.56.14/".$environment."/api/auth/login";
        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/changeState";
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);


        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function']  == 'logout') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/auth/logout";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];


        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getTodayCustomerDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/customers/deliveries/getToday";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    }  else if ($_POST['function'] == 'getAllCustomerDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/customers/deliveries/getAll";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getCustomerBranchOffices') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);
        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/customers/address/get";
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

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/customers/deliveries/new";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        /* set the content type json */

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    } else if ($_POST['function'] == 'getTodayDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/getToday";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getTomorrowDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/getTomorrow";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getAllDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/getAll";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getDeliveryById') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/deliveries/list";
        $url = "http://190.4.56.14/".$environment."/api/shared/deliveries/getById";
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

        //$url = "http://190.4.56.14/".$environment."/api/categories/showAll";
        $url = "http://190.4.56.14/".$environment."/api/shared/categories/showAll";
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

        //$url = "http://190.4.56.14/".$environment."/api/categories/update";
        $url = "http://190.4.56.14/".$environment."/api/admins/categories/update";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'editRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/rates/update";
        $url = "http://190.4.56.14/".$environment."/api/admins/rates/update";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getTodayCustomerOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/getCustomerOrders";
        $url = "http://190.4.56.14/".$environment."/api/customers/orders/getToday";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getAllCustomerOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/getCustomerOrders";
        $url = "http://190.4.56.14/".$environment."/api/customers/orders/getAll";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getCustomers') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/getCustomerOrders";
        $url = "http://190.4.56.14/".$environment."/api/admins/customers/get";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'newCustomer') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/getCustomerOrders";
        $url = "http://190.4.56.14/".$environment."/api/admins/customers/new";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'newBranch') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/getCustomerOrders";
        $url = "http://190.4.56.14/".$environment."/api/customers/address/new";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'changeCustomerPassword') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/changePassword";
        $url = "http://190.4.56.14/".$environment."/api/admins/customers/changePassword";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'updateBranch') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/changePassword";
        $url = "http://190.4.56.14/".$environment."/api/customers/address/update";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'deleteBranch') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/changePassword";
        $url = "http://190.4.56.14/".$environment."/api/customers/address/delete";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getTodayOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/changePassword";
        $url = "http://190.4.56.14/".$environment."/api/admins/orders/getToday";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getAllOrders') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/customers/changePassword";
        $url = "http://190.4.56.14/".$environment."/api/admins/orders/getAll";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'createCategory') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/categories/create";
        $url = "http://190.4.56.14/".$environment."/api/admins/categories/create";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'createRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/rates/create";
        $url = "http://190.4.56.14/".$environment."/api/admins/rates/create";
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

        $url = "http://190.4.56.14/".$environment."/api/customers/rates/get";

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

        $url = "http://190.4.56.14/".$environment."/api/customers/surcharges/get";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'createSurcharge') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/rates/create";
        $url = "http://190.4.56.14/".$environment."/api/admins/surcharges/create";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'editSurcharge') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        //$url = "http://190.4.56.14/".$environment."/api/rates/create";
        $url = "http://190.4.56.14/".$environment."/api/admins/surcharges/update";
        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getMyCategories') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/customers/categories/get";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getDrivers') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/drivers/get";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'createDriver') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/drivers/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'editDriver') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/drivers/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'editCustomer') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/customers/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getPendingDeliveries') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/deliveries/getPending";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getCities') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/cities/get";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getAgencies') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/agencies/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'changeHour') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/customers/deliveries/changeHour";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'reportOrdersByDriver') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/reports/ordersByDriver";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'createPayment') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/payments/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getPayments') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/shared/payments/list";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getPaymentTypes') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/payments/listTypes";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'removeCustomerFromRate') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/rates/removeCustomer";

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

        $url = "http://190.4.56.14/".$environment."/api/admins/rates/getCustomers";

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

        $url = "http://190.4.56.14/".$environment."/api/admins/rates/addCustomer";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'changeOrderState') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/orders/changeState";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'editSchedule') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/schedule/update";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'reportOrdersByCustomer') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/reports/ordersByCustomer";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getCustomerOrdersFAdmin') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/orders/getOrdersByCustomer";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'getExtraCharges') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/extraCharges/get";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'createExtraCharge') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/extraCharges/create";

        $authorization = 'Authorization: Bearer ' . $_POST['tkn'];

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept:application/json', $authorization));
        /* set return type json */

        $output = curl_exec($handle);
        curl_close($handle);
    }else if ($_POST['function'] == 'updateExtraCharge') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/".$environment."/api/admins/extraCharges/update";

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
