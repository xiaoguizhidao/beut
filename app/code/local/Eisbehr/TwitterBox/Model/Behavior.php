<?PHP
class Eisbehr_TwitterBox_Model_Behavior
{
    public function toOptionArray()
    {
        return array(
			array('value' => 'all', 	'label' => 'Load all tweets'),
            array('value' => 'default', 'label' => 'Timed Interval'),
        );
    }
}
