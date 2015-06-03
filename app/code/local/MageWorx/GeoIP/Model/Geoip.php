<?php
/**
 * MageWorx
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the MageWorx EULA that is bundled with
 * this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.mageworx.com/LICENSE-1.0.html
 *
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@mageworx.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade the extension
 * to newer versions in the future. If you wish to customize the extension
 * for your needs please refer to http://www.mageworx.com/ for more information
 * or send an email to sales@mageworx.com
 *
 * @category   MageWorx
 * @package    MageWorx_GeoIP
 * @copyright  Copyright (c) 2009 MageWorx (http://www.mageworx.com/)
 * @license    http://www.mageworx.com/LICENSE-1.0.html
 */

/**
 * GeoIP extension
 *
 * @category   MageWorx
 * @package    MageWorx_GeoIP
 * @author     MageWorx Dev Team <dev@mageworx.com>
 */

class MageWorx_GeoIP_Model_Geoip extends Mage_Core_Model_Abstract
{
    protected $_geoip;

    /**
     * Opens GeoIP database
     *
     * @return array
     */
    private function _openGeoIP()
    {
        return geoip_open(Mage::helper('mwgeoip')->getDatabasePath(), GEOIP_STANDARD);
    }

    /**
     * Loads location data by ip
     *
     * @param string $ip
     * @param string|bool $field
     * @return MageWorx_GeoIP_Model_Geoip
     */
    public function load($ip, $field=null)
    {
        if (Mage::helper('mwgeoip')->isCityDbType()) {
            include_once Mage::getBaseDir() . DS . 'lib' . DS . 'GeoIP' . DS . 'geoipcity.inc';
            include_once Mage::getBaseDir() . DS . 'lib' . DS . 'GeoIP' . DS . 'geoipregionvars.php';
        } else {
            include_once Mage::getBaseDir() . DS . 'lib' . DS . 'GeoIP' . DS . 'geoip.inc';
        }

        $geoip = $this->_openGeoIP();
        $data = array('ip' => $ip);

        if (Mage::helper('mwgeoip')->isCityDbType()) {
            $record = geoip_record_by_addr($geoip, $ip);

            if ($record) {
                $data['code']        = $record->country_code;
                $data['country']     = $record->country_name;
                $data['region']      = (isset($GEOIP_REGION_NAME[$record->country_code][$record->region]) ? $GEOIP_REGION_NAME[$record->country_code][$record->region] : $record->region);
                $data['city']        = $record->city;
                $data['postal_code'] = $record->postal_code;
            }
        } else {
            $data['code']    = geoip_country_code_by_addr($geoip, $ip);
            $data['country'] = geoip_country_name_by_addr($geoip, $ip);
        }

        if (isset($data['code'])) {
            $data['flag'] = Mage::helper('mwgeoip')->getFlagPath($data['code']);
        }

        $this->setData($data);
        geoip_close($geoip);

        return $this;
    }

    /**
     * Gets location by ip address
     *
     * @param string $ip
     * @return array
     */
    public function getLocation($ip = null)
    {
        if(is_null($ip)){
            return $this->getCurrentLocation();
        }

        $this->load($ip);

        return $this;
    }

    /**
     * Return current customer loaction
     *
     * @return mixed
     */
    public function getCurrentLocation()
    {
        $session = Mage::getSingleton('customer/session');

        if(!$session->getCustomerLocation() || !$session->getCustomerLocation()->getCode()){
            $ip = Mage::helper('mwgeoip')->getCustomerIp();
            $this->load($ip);
            $session->setCustomerLocation($this);
        }

        return $session->getCustomerLocation();
    }

    /**
     * Downloads file from remote server
     *
     * @param strung $source
     * @param string $destination
     * @return bool
     */
    public function downloadFile($source, $destination)
    {
        $errors = array();

        $sourceFile = curl_init($source);
        $newFile = @fopen($destination, "wb");

        if (!$sourceFile) {
            $errors[] = Mage::helper('mwgeoip')->__('DataBase source is temporary unavailable');
        }

        if (!$newFile) {
            $errors[] = Mage::helper('mwgeoip')->__("Can't create new file. Check that folder /lib/GeoIP has write permissions (777)");
        }

        if(!empty($errors)){
            return $errors;
        }

        curl_setopt($sourceFile, CURLOPT_FILE, $newFile);
        $data = curl_exec($sourceFile);

        curl_close($sourceFile);
        fclose($newFile);

        return $errors;
    }

    /**
     * Unpacks .gz archive
     *
     * @param string $source
     * @param string $destination
     * @return bool
     */
    public function uncompressFile($source, $destination)
    {
        $sourceFile = @gzopen($source, "rb");
        $newFile = @fopen($destination, "wb");

        if (!$sourceFile || !$newFile) {
            return false;
        }

        while ($string = gzread($sourceFile, 4096)) {
            fwrite($newFile, $string, strlen($string));
        }

        gzclose($sourceFile);
        fclose($newFile);

        return true;
    }
}